import type { SupplyState } from "./supplylens-data";
type Cell = string | number;
export const reportTypes = [
  ["suppliers", "Supplier risk summary"],
  ["critical", "Critical supplier report"],
  ["visibility", "Multi-tier visibility report"],
  ["geography", "High-risk geographical exposure"],
  ["incidents", "Open incident report"],
  ["mitigation", "Mitigation action report"],
  ["verification", "Supplier verification report"],
] as const;
export function reportRows(state: SupplyState, type: string): Cell[][] {
  if (type === "visibility")
    return [
      [
        "Relationship",
        "Upstream",
        "Downstream",
        "Material",
        "Confidence",
        "Last updated",
        "Source",
      ],
      ...state.relationships.map((r) => [
        r.id,
        r.from,
        r.to,
        r.material,
        r.confidence,
        r.updated,
        r.source || "Seeded fictional relationship",
      ]),
    ];
  if (type === "incidents")
    return [
      [
        "Incident",
        "Supplier",
        "Event",
        "Severity",
        "Status",
        "Owner",
        "Confidence",
        "Evidence",
        "Notes",
      ],
      ...state.incidents
        .filter((i) => i.status !== "Resolved")
        .map((i) => [
          i.id,
          i.supplierId,
          i.event,
          i.severity,
          i.status,
          i.owner,
          i.confidence,
          i.evidence,
          i.notes.join(" | "),
        ]),
    ];
  if (type === "mitigation")
    return [
      ["Action", "Incident", "Title", "Owner", "Status", "Due"],
      ...state.actions.map((a) => [
        a.id,
        a.incidentId,
        a.title,
        a.owner,
        a.status,
        a.due,
      ]),
    ];
  if (type === "verification")
    return [
      [
        "Supplier",
        "Company",
        "Status",
        "Last assessment",
        "Supporting records",
      ],
      ...state.suppliers.map((s) => [
        s.id,
        s.name,
        s.verification,
        s.lastAssessment,
        state.evidence.filter(
          (e) => e.supplierId === s.id && e.kind !== "Information request",
        ).length,
      ]),
    ];
  const suppliers = state.suppliers.filter((s) =>
    type === "critical"
      ? s.risk === "Critical"
      : type === "geography"
        ? ["Critical", "High"].includes(s.risk)
        : true,
  );
  return [
    [
      "Supplier ID",
      "Company",
      "Tier",
      "Country",
      "City",
      "Risk",
      "Verification",
    ],
    ...suppliers.map((s) => [
      s.id,
      s.name,
      s.tier,
      s.country,
      s.city,
      s.risk,
      s.verification,
    ]),
  ];
}
export function exportSupplyReport(state: SupplyState, type = "suppliers") {
  const rows = reportRows(state, type);
  const csv = rows
    .map((row) =>
      row
        .map((v) => {
          let value = String(v);
          if (/^[=+@\-\t\r]/.test(value)) value = `'${value}`;
          return `"${value.replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `supplylens-${type}-demo.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
