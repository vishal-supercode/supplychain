export type Tier = "Tier 1" | "Tier 2" | "Tier 3";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Verification =
  | "Verified"
  | "Supplier Declared"
  | "Inferred"
  | "Pending Verification"
  | "Outdated Information";
export type RiskCategory =
  | "Operational"
  | "Geographic / Climate"
  | "Financial"
  | "Geopolitical / Trade"
  | "Cyber / Compliance";
export type Supplier = {
  id: string;
  name: string;
  tier: Tier;
  country: string;
  city: string;
  industry: string;
  materials: string[];
  materialIds: string[];
  risk: Severity;
  verification: Verification;
  lastAssessment: string;
  criticality: number;
  latitude: number;
  longitude: number;
  site: string;
  alternatives: string[];
};
export type Relationship = {
  id: string;
  from: string;
  to: string;
  material: string;
  confidence: Verification;
  updated: string;
  source?: string;
};
export type Incident = {
  id: string;
  supplierId: string;
  category: RiskCategory;
  event: string;
  severity: Severity;
  date: string;
  evidence: string;
  confidence: number;
  status: string;
  owner: string;
  materials: string[];
  notes: string[];
};
export type Component = {
  id: string;
  name: string;
  category: string;
  tier2Suppliers: string[];
  inventory: number;
  dailyDemand: number;
  site: string;
  line: string;
  productIds: string[];
};
export type Product = {
  id: string;
  name: string;
  components: string[];
  site: string;
  line: string;
};
export type Order = {
  id: string;
  customer: string;
  productId: string;
  quantity: number;
  due: string;
  status: string;
};
export type PurchaseOrder = {
  id: string;
  supplierId: string;
  componentId: string;
  quantity: number;
  expected: string;
  status: "Open" | "In transit" | "Received";
};
export type Site = {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  lines: string[];
};
export type Alternative = {
  id: string;
  supplierId: string;
  materials: string[];
  capacity: number;
  leadWeeks: number;
  qualification: "Approved" | "Pending qualification" | "Unqualified";
  risk: Severity;
  additionalCost: number;
};
export type Action = {
  id: string;
  incidentId: string;
  title: string;
  owner: string;
  status: "Not started" | "In progress" | "Completed";
  due: string;
};
export type Audit = { id: string; title: string; detail: string; time: string };
export type Evidence = {
  id: string;
  supplierId: string;
  title: string;
  kind: string;
  reference: string;
  date: string;
};
export type SupplyState = {
  suppliers: Supplier[];
  relationships: Relationship[];
  incidents: Incident[];
  components: Component[];
  products: Product[];
  orders: Order[];
  purchaseOrders: PurchaseOrder[];
  sites: Site[];
  alternatives: Alternative[];
  actions: Action[];
  audit: Audit[];
  evidence: Evidence[];
  settings: {
    companyName: string;
    location: string;
    role: string;
    criticalOnly: boolean;
    verificationDays: number;
    notifications: Record<string, boolean>;
  };
  scenarioStep: number;
  scenarioActive: boolean;
  selectedSupplier: string;
};

const materialList = [
  ["MAT-ECM", "Electronic control modules", "Electronics"],
  ["MAT-SOC", "Automotive system-on-chip", "Semiconductors"],
  ["MAT-DRV", "Gate driver ICs", "Semiconductors"],
  ["MAT-PWR", "Power management ICs", "Semiconductors"],
  ["MAT-PCB", "Automotive-grade PCB laminate", "Electronics"],
  ["MAT-SIL", "Semiconductor-grade silicon", "Advanced materials"],
  ["MAT-COP", "High-purity copper foil", "Metals"],
  ["MAT-RES", "Epoxy encapsulation resin", "Chemicals"],
  ["MAT-ALU", "Precision aluminium alloy", "Metals"],
  ["MAT-CAM", "ADAS camera modules", "Electronics"],
  ["MAT-SEN", "Automotive MEMS sensors", "Semiconductors"],
  ["MAT-BAT", "Lithium battery cells", "Batteries"],
  ["MAT-CON", "High-voltage connectors", "Electronics"],
  ["MAT-STE", "Automotive steel alloy", "Metals"],
  ["MAT-FIR", "Automotive wiring harnesses", "Electrical"],
];
const industries = [
  "Automotive electronics",
  "Semiconductor processing",
  "Advanced materials",
  "Electronic components",
  "Precision manufacturing",
  "Specialty chemicals",
];
const tier1Data = [
  ["Precision Electronics India", "Pune", "India", "Electronics", "0"],
  [
    "Global Mobility Systems",
    "Bengaluru",
    "India",
    "Automotive electronics",
    "1",
  ],
  [
    "Aster Automotive Components",
    "Chennai",
    "India",
    "Precision manufacturing",
    "2",
  ],
  [
    "Nova Vehicle Technologies",
    "Hyderabad",
    "India",
    "Automotive electronics",
    "3",
  ],
  [
    "Westline Mobility Parts",
    "Ahmedabad",
    "India",
    "Precision manufacturing",
    "4",
  ],
  ["Kaveri Electronic Assemblies", "Mysuru", "India", "Electronics", "5"],
  [
    "Sundaram Control Systems",
    "Chennai",
    "India",
    "Automotive electronics",
    "6",
  ],
  [
    "Meridian Auto Technologies",
    "Pune",
    "India",
    "Precision manufacturing",
    "7",
  ],
  ["Vega Power Components", "Noida", "India", "Electronics", "8"],
  ["Orion Drive Systems", "Gurugram", "India", "Automotive electronics", "9"],
  ["Deccan Sensor Works", "Bengaluru", "India", "Electronics", "10"],
  [
    "Eastern Circuit Industries",
    "Kolkata",
    "India",
    "Precision manufacturing",
    "11",
  ],
];
const tier2Data = [
  [
    "Global Semiconductor Processing",
    "Shenzhen",
    "China",
    "Semiconductor processing",
    "0",
  ],
  [
    "Pacific Micro Devices",
    "Shanghai",
    "China",
    "Semiconductor processing",
    "1",
  ],
  [
    "HanRiver Chip Foundry",
    "Seoul",
    "South Korea",
    "Semiconductor processing",
    "2",
  ],
  ["Kioxen Precision Wafer", "Tokyo", "Japan", "Semiconductor processing", "3"],
  [
    "SilicaCore Technologies",
    "Singapore",
    "Singapore",
    "Advanced materials",
    "4",
  ],
  ["JadeCircuit Manufacturing", "Shenzhen", "China", "Electronics", "5"],
  [
    "EastBridge Power Devices",
    "Osaka",
    "Japan",
    "Semiconductor processing",
    "6",
  ],
  ["Aurora Sensor Fabrication", "Busan", "South Korea", "Electronics", "7"],
  [
    "BluePeak Silicon Solutions",
    "Taipei",
    "Taiwan",
    "Semiconductor processing",
    "8",
  ],
  [
    "Apex Specialty Processors",
    "Munich",
    "Germany",
    "Precision manufacturing",
    "9",
  ],
  ["Vector Memory Works", "Shanghai", "China", "Electronics", "10"],
  ["Straits Components Group", "Singapore", "Singapore", "Electronics", "11"],
];
const tier3Data = [
  [
    "Advanced Materials Corporation",
    "Seoul",
    "South Korea",
    "Specialty materials",
    "0",
  ],
  ["Shinwa Silicon Materials", "Tokyo", "Japan", "Advanced materials", "1"],
  ["Formosa Wafer Supply", "Hsinchu", "Taiwan", "Advanced materials", "2"],
  ["Bavaria Substrate Group", "Munich", "Germany", "Advanced materials", "3"],
  ["SinoPure Quartz", "Shenzhen", "China", "Specialty chemicals", "4"],
  ["Korea Copper Refining", "Busan", "South Korea", "Metals", "5"],
  ["Tokai Resin Technologies", "Nagoya", "Japan", "Specialty chemicals", "6"],
  ["Merlion Rare Metals", "Singapore", "Singapore", "Metals", "7"],
  [
    "Alpine Ceramic Materials",
    "Zurich",
    "Switzerland",
    "Advanced materials",
    "8",
  ],
  ["Indus Specialty Minerals", "Ahmedabad", "India", "Advanced materials", "9"],
  ["Eastern Graphite Holdings", "Pune", "India", "Advanced materials", "10"],
  ["Pacific Alloy Resources", "Shanghai", "China", "Metals", "11"],
];
const tierMaterials = [
  [0, 1, 2, 3],
  [1, 2, 10, 14],
  [2, 8, 14],
  [0, 5, 10],
  [8, 13],
  [0, 4, 5],
  [2, 3, 9],
  [1, 8, 9],
  [3, 11, 12],
  [0, 2, 12],
  [9, 10],
  [4, 13, 14],
];
const coordinates: Record<string, [number, number]> = {
  Pune: [18.5204, 73.8567],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867],
  Ahmedabad: [23.0225, 72.5714],
  Mysuru: [12.2958, 76.6394],
  Noida: [28.5355, 77.391],
  Gurugram: [28.4595, 77.0266],
  Kolkata: [22.5726, 88.3639],
  Shenzhen: [22.5431, 114.0579],
  Shanghai: [31.2304, 121.4737],
  Seoul: [37.5665, 126.978],
  Tokyo: [35.6762, 139.6503],
  Singapore: [1.3521, 103.8198],
  Osaka: [34.6937, 135.5023],
  Busan: [35.1796, 129.0756],
  Taipei: [25.033, 121.5654],
  Munich: [48.1351, 11.582],
  Hsinchu: [24.8138, 120.9675],
  Zurich: [47.3769, 8.5417],
  Nagoya: [35.1815, 136.9066],
};
export const materialCatalog = materialList.map(([id, name, category]) => ({
  id,
  name,
  category,
}));
export const categories: RiskCategory[] = [
  "Operational",
  "Geographic / Climate",
  "Financial",
  "Geopolitical / Trade",
  "Cyber / Compliance",
];
export const severities: Severity[] = ["Critical", "High", "Medium", "Low"];
export const verificationOptions: Verification[] = [
  "Verified",
  "Supplier Declared",
  "Inferred",
  "Pending Verification",
  "Outdated Information",
];
export const incidentStatuses = [
  "New",
  "Under Investigation",
  "Mitigation in Progress",
  "Monitoring",
  "Resolved",
];
export function createSupplyState(): SupplyState {
  const suppliers: Supplier[] = [tier1Data, tier2Data, tier3Data].flatMap(
    (list, t) =>
      list.map(([name, city, country, industry], i) => {
        const ids = (
          t === 0
            ? tierMaterials[i]
            : t === 1
              ? [i === 0 ? 1 : (i + 3) % 15]
              : [i === 0 ? 5 : (i + 5) % 15]
        ).map((n) => materialCatalog[n].id);
        return {
          id: `S${t + 1}-${String(i + 1).padStart(2, "0")}`,
          name,
          tier: `Tier ${t + 1}` as Tier,
          country,
          city,
          industry,
          materialIds: ids,
          materials: ids.map(
            (id) => materialCatalog.find((m) => m.id === id)!.name,
          ),
          risk: severities[(i + t + 2) % 4],
          verification: verificationOptions[(i + t) % 5],
          lastAssessment: "2026-11-03",
          criticality: 40 + i * 4,
          latitude: coordinates[city][0],
          longitude: coordinates[city][1],
          site: `${city} ${t === 1 ? "Processing" : "Manufacturing"} Campus`,
          alternatives: [],
        };
      }),
  );
  suppliers.find((s) => s.id === "S2-01")!.risk = "Medium";
  const relationships: Relationship[] = [];
  const edge = (from: string, to: string, material: string, index: number) =>
    relationships.push({
      id: `REL-${relationships.length + 1}`,
      from,
      to,
      material,
      confidence: verificationOptions[index % 3],
      updated: "2026-11-03",
      source: "Fictional supplier disclosure / site review for prototype only",
    });
  // Dependency direction: supplying upstream site -> consuming downstream site.
  for (let i = 0; i < 12; i++) {
    const suffix = String(i + 1).padStart(2, "0");
    edge(`S1-${suffix}`, "BAS", suppliers[i].materialIds[0], i);
    edge(`S2-${suffix}`, `S1-${suffix}`, suppliers[12 + i].materialIds[0], i);
    edge(`S3-${suffix}`, `S2-${suffix}`, suppliers[24 + i].materialIds[0], i);
  }
  edge("S2-01", "S1-02", "MAT-SOC", 0);
  // Extra paths intentionally exclude the scenario branch: unrelated sites stay unaffected.
  for (let i = 3; i <= 10; i++)
    edge(
      `S2-${String(i).padStart(2, "0")}`,
      `S1-${String(i + 1).padStart(2, "0")}`,
      suppliers[11 + i].materialIds[0],
      i,
    );
  const sites: Site[] = Array.from({ length: 5 }, (_, i) => ({
    id: `SITE-${i + 1}`,
    name: [
      "Bengaluru Electronics Campus",
      "Pune Powertrain Plant",
      "Chennai Assembly Campus",
      "Hyderabad Sensor Plant",
      "Ahmedabad Components Plant",
    ][i],
    location: [
      "Peenya Industrial Area",
      "Chakan Industrial Area",
      "Sriperumbudur",
      "Electronic City, Hyderabad",
      "Sanand Industrial Estate",
    ][i],
    city: ["Bengaluru", "Pune", "Chennai", "Hyderabad", "Ahmedabad"][i],
    country: "India",
    lines:
      i === 0
        ? ["ECU Line A", "Control Module Line B"]
        : [`Assembly Line ${i + 1}`],
  }));
  const productNames = [
    "Vehicle Control Unit X1",
    "Powertrain Controller Z2",
    "ADAS Vision Hub",
    "Battery Management Unit",
    "HV Distribution Box",
    "Brake Control Module",
    "Telematics Gateway",
    "Cabin Sensor Assembly",
  ];
  const products: Product[] = productNames.map((name, i) => ({
    id: `PROD-${i + 1}`,
    name,
    components:
      i < 2 ? [`CMP-${i * 2 + 1}`, `CMP-${i * 2 + 2}`] : [`CMP-${i + 3}`],
    site: i < 2 ? "SITE-1" : `SITE-${1 + (i % 5)}`,
    line:
      i === 0
        ? "ECU Line A"
        : i === 1
          ? "Control Module Line B"
          : `Assembly Line ${1 + (i % 5)}`,
  }));
  const components: Component[] = Array.from({ length: 15 }, (_, i) => ({
    id: `CMP-${i + 1}`,
    name:
      i < 4
        ? [
            "ECU compute chip",
            "Sensor interface IC",
            "Power gate driver",
            "Control memory chip",
          ][i]
        : materialCatalog[i].name,
    category: i < 4 ? "Semiconductors" : materialCatalog[i].category,
    tier2Suppliers: [
      i < 4 ? "S2-01" : `S2-${String(2 + ((i - 4) % 11)).padStart(2, "0")}`,
    ],
    inventory: i < 4 ? [12000, 18000, 24000, 30000][i] : 8000 + i * 2000,
    dailyDemand: i < 4 ? [1000, 1500, 2000, 2500][i] : 600 + i * 100,
    site: i < 4 ? "SITE-1" : `SITE-${1 + (i % 5)}`,
    line:
      i < 2
        ? "ECU Line A"
        : i < 4
          ? "Control Module Line B"
          : `Assembly Line ${1 + (i % 5)}`,
    productIds: products
      .filter((p) => p.components.includes(`CMP-${i + 1}`))
      .map((p) => p.id),
  }));
  // Every component is consumed by an explicit product BOM, including lower-volume parts.
  components
    .filter((c) => c.productIds.length === 0)
    .forEach((c, i) => {
      const p = products[2 + (i % 6)];
      p.components.push(c.id);
      c.productIds.push(p.id);
    });
  const orders: Order[] = Array.from({ length: 10 }, (_, i) => ({
    id: `ORD-${7301 + i}`,
    customer: [
      "Southern Mobility Ltd.",
      "Indus Motors Assembly",
      "Eastline Commercial Vehicles",
      "Western EV Works",
    ][i % 4],
    productId: i < 3 ? `PROD-${1 + (i % 2)}` : `PROD-${3 + ((i - 3) % 6)}`,
    quantity: 150 + 100 * i,
    due: `2026-11-${String(15 + i).padStart(2, "0")}`,
    status: "Open",
  }));
  const purchaseOrders: PurchaseOrder[] = Array.from(
    { length: 12 },
    (_, i) => ({
      id: `PO-${8801 + i}`,
      supplierId: components[i % 15].tier2Suppliers[0],
      componentId: `CMP-${1 + (i % 15)}`,
      quantity: 1200 + 350 * i,
      expected: `2026-11-${String(8 + (i % 15)).padStart(2, "0")}`,
      status: i % 4 === 0 ? "In transit" : "Open",
    }),
  );
  const incidents: Incident[] = Array.from({ length: 12 }, (_, i) => ({
    id: `INC-${2401 + i}`,
    supplierId: suppliers[[14, 5, 19, 28, 7, 21, 31, 9, 22, 16, 34, 11][i]].id,
    category: categories[i % 5],
    event: [
      "Production capacity shortfall",
      "Simulated flood warning",
      "Credit review required",
      "Export-policy review",
      "Sample compliance questionnaire overdue",
    ][i % 5],
    severity: severities[i % 4],
    date: `2026-11-${String(1 + (i % 5)).padStart(2, "0")}`,
    evidence:
      "Synthetic scenario record created for demonstration. No external feed or actual company incident.",
    confidence: [85, 70, 65, 55][i % 4],
    status: incidentStatuses[i % 5],
    owner: ["Priya Sharma", "Arjun Mehta", "Unassigned"][i % 3],
    materials:
      suppliers[[14, 5, 19, 28, 7, 21, 31, 9, 22, 16, 34, 11][i]].materialIds,
    notes: ["Simulated signal received; supplier confirmation is required."],
  }));
  const alternatives: Alternative[] = Array.from({ length: 8 }, (_, i) => ({
    id: `ALT-${101 + i}`,
    supplierId: `S2-${String(i + 2).padStart(2, "0")}`,
    materials: i < 3 ? ["CMP-1", "CMP-2", "CMP-3", "CMP-4"] : [`CMP-${5 + i}`],
    capacity: [80000, 40000, 60000, 35000, 22000, 18000, 45000, 31000][i],
    leadWeeks: [1, 3, 2, 4, 2, 5, 3, 1][i],
    qualification:
      i % 3 === 0
        ? "Approved"
        : i % 3 === 1
          ? "Pending qualification"
          : "Unqualified",
    risk: severities[(i + 2) % 4],
    additionalCost: 120000 + i * 32000,
  }));
  const actions: Action[] = Array.from({ length: 10 }, (_, i) => ({
    id: `ACT-${501 + i}`,
    incidentId: incidents[i].id,
    title: [
      "Check inventory and open purchase orders",
      "Request supplier capacity confirmation",
      "Review alternate qualification",
      "Document site response",
    ][i % 4],
    owner: ["Priya Sharma", "Arjun Mehta", "Sneha Rao"][i % 3],
    status: ["Not started", "In progress", "Completed"][
      i % 3
    ] as Action["status"],
    due: "2026-11-10",
  }));
  const audit: Audit[] = suppliers
    .filter((s) => s.verification === "Verified")
    .map((s, i) => ({
      id: `AUD-SEED-${i}`,
      title: "Supplier verified",
      detail: `${s.id} · Sample verification record · Supplier declaration + site review reference DEMO-${i + 1}`,
      time: "2026-11-03 10:00",
    }));
  audit.unshift({
    id: "AUD-START",
    title: "Demo network initialized",
    detail:
      "36 fictional supplier records · 45 explicit relationships · automotive manufacturing scenario",
    time: "2026-11-05 09:00",
  });
  const evidence: Evidence[] = suppliers
    .filter((s) => s.verification === "Verified")
    .map((s, i) => ({
      id: `EVD-SEED-${i + 1}`,
      supplierId: s.id,
      title: "Supplier declaration and site review",
      kind: "Verification record",
      reference: `DEMO-${i + 1}`,
      date: "2026-11-03",
    }));
  return {
    suppliers,
    relationships,
    incidents,
    components,
    products,
    orders,
    purchaseOrders,
    sites,
    alternatives,
    actions,
    audit,
    evidence,
    settings: {
      companyName: "Bharat Automotive Systems",
      location: "Bengaluru, Karnataka",
      role: "Procurement manager",
      criticalOnly: false,
      verificationDays: 90,
      notifications: {
        "Critical incidents": true,
        "Verification requests": true,
        "Mitigation due dates": true,
      },
    },
    scenarioStep: 0,
    scenarioActive: false,
    selectedSupplier: "S2-01",
  };
}
