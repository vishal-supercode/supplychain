import {
  createSupplyState,
  type Supplier,
  type SupplyState,
  type Severity,
  type Alternative,
} from "./supplylens-data";
export function traverse(
  state: SupplyState,
  id: string,
  direction: "upstream" | "downstream",
) {
  const seen = new Set<string>();
  const queue = [id];
  while (queue.length) {
    const current = queue.shift()!;
    for (const edge of state.relationships) {
      const from = direction === "downstream" ? edge.from : edge.to;
      const to = direction === "downstream" ? edge.to : edge.from;
      if (from === current && !seen.has(to) && to !== id) {
        seen.add(to);
        queue.push(to);
      }
    }
  }
  return [...seen];
}
export function impactFor(state: SupplyState, id: string) {
  const descendants = traverse(state, id, "downstream");
  const affectedIds = new Set([id, ...descendants]);
  const sources = state.suppliers
    .filter(
      (s) =>
        (affectedIds.has(s.id) ||
          (state.suppliers.find((x) => x.id === id)?.tier === "Tier 1" &&
            traverse(state, id, "upstream").includes(s.id))) &&
        s.tier === "Tier 2",
    )
    .map((s) => s.id);
  const components = state.components.filter((c) =>
    c.tier2Suppliers.some((s) => sources.includes(s)),
  );
  const products = state.products.filter((p) =>
    p.components.some((c) => components.some((x) => x.id === c)),
  );
  const orders = state.orders.filter(
    (o) => products.some((p) => p.id === o.productId) && o.status === "Open",
  );
  const coverage = components.length
    ? Math.min(
        ...components.map((c) => Math.floor(c.inventory / c.dailyDemand)),
      )
    : 0;
  const purchaseOrders = (state.purchaseOrders || []).filter(
    (po) =>
      components.some((c) => c.id === po.componentId) &&
      po.status !== "Received",
  );
  return {
    supplierIds: [...affectedIds].filter((s) => s !== "BAS"),
    tier1: state.suppliers.filter(
      (s) => s.tier === "Tier 1" && affectedIds.has(s.id),
    ),
    upstream: traverse(state, id, "upstream"),
    components,
    products,
    orders,
    purchaseOrders,
    sites: state.sites.filter((s) => components.some((c) => c.site === s.id)),
    lines: [...new Set(components.map((c) => c.line))],
    coverage,
  };
}
export function scoreFor(state: SupplyState, supplier: Supplier) {
  const weights: Record<Severity, number> = {
    Critical: 35,
    High: 25,
    Medium: 14,
    Low: 5,
  };
  const incidents = state.incidents.filter(
    (i) => i.supplierId === supplier.id && i.status !== "Resolved",
  );
  const factors = [
    {
      label: "Operational signals",
      value: incidents.length
        ? Math.max(...incidents.map((i) => weights[i.severity]))
        : 0,
      max: 35,
    },
    {
      label: "Geographic concentration",
      value: ["China", "South Korea", "Taiwan"].includes(supplier.country)
        ? 12
        : 6,
      max: 15,
    },
    {
      label: "Dependency concentration",
      value:
        state.relationships.filter((e) => e.from === supplier.id).length > 1
          ? 15
          : 8,
      max: 15,
    },
    {
      label: "Verification completeness",
      value:
        supplier.verification === "Verified"
          ? 0
          : supplier.verification === "Supplier Declared"
            ? 7
            : 15,
      max: 15,
    },
    {
      label: "Material criticality",
      value: Math.round(supplier.criticality / 10),
      max: 10,
    },
    {
      label: "Qualified alternatives gap",
      value: state.alternatives.some(
        (a) =>
          a.qualification === "Approved" &&
          a.materials.some((m) =>
            impactFor(state, supplier.id).components.some((c) => c.id === m),
          ),
      )
        ? 0
        : 10,
      max: 10,
    },
  ];
  const total = Math.min(
    100,
    factors.reduce((sum, f) => sum + f.value, 0),
  );
  const severity: Severity =
    total >= 75
      ? "Critical"
      : total >= 50
        ? "High"
        : total >= 30
          ? "Medium"
          : "Low";
  return { total, severity, factors };
}
export function alternativeFit(
  state: SupplyState,
  sourceId: string,
  alternative: Alternative,
) {
  const impact = impactFor(state, sourceId);
  const compatible =
    impact.components.length > 0 &&
    impact.components.every((c) => alternative.materials.includes(c.id));
  const demand = impact.components.reduce(
    (sum, c) => sum + c.dailyDemand * 7,
    0,
  );
  return {
    compatible,
    demand,
    capacitySufficient: alternative.capacity >= demand,
    eligible:
      compatible &&
      alternative.capacity >= demand &&
      alternative.qualification === "Approved",
  };
}
export function logAction(
  state: SupplyState,
  title: string,
  detail: string,
): SupplyState {
  return {
    ...state,
    audit: [
      {
        id: `AUD-${Date.now()}-${state.audit.length}`,
        title,
        detail,
        time: new Date().toLocaleString("en-IN"),
      },
      ...state.audit,
    ],
  };
}
export function simulateDisruption(
  state: SupplyState,
  id: string,
): SupplyState {
  const incidentId = `INC-DEMO-${id}`;
  if (state.incidents.some((i) => i.id === incidentId)) return {...state, selectedSupplier:id, scenarioActive:true, scenarioStep:1};
  const supplier = state.suppliers.find((s) => s.id === id);
  if (!supplier) return state;
  const updated = {
    ...state,
    selectedSupplier: id,
    scenarioActive: true,
    scenarioStep: 1,
    suppliers: state.suppliers.map((s) =>
      s.id === id ? { ...s, risk: "Critical" as Severity } : s,
    ),
    incidents: [
      {
        id: incidentId,
        supplierId: id,
        category: "Operational" as const,
        event: "Hypothetical factory shutdown",
        severity: "Critical" as const,
        date: "2026-11-05",
        evidence:
          "User-triggered simulation. No actual factory shutdown or external risk intelligence.",
        confidence: 100,
        status: "New",
        owner: "Unassigned",
        materials: supplier.materialIds,
        notes: [
          "Demo shutdown triggered; impact is potential exposure requiring confirmation.",
        ],
      },
      ...state.incidents,
    ],
  };
  return logAction(
    updated,
    "Simulated disruption triggered",
    `${supplier.name} · Hypothetical factory shutdown · connected dependencies only`,
  );
}
export function resetSupply() {
  return createSupplyState();
}
