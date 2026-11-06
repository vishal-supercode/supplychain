"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Network,
  Play,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import NetworkGraph from "@/components/supplylens/Network";
import RiskMap from "@/components/supplylens/RiskMap";
import SupplierEditor from "@/components/supplylens/SupplierEditor";
import SupplierProfile from "@/components/supplylens/SupplierProfile";
import RiskCharts from "@/components/supplylens/RiskCharts";
import VerificationWorkspace from "@/components/supplylens/VerificationWorkspace";
import DemoSettings from "@/components/supplylens/DemoSettings";
import RelationshipEditor from "@/components/supplylens/RelationshipEditor";
import {
  exportSupplyReport,
  reportTypes,
  reportRows,
} from "@/lib/supplylens-reports";
import {
  createSupplyState,
  materialCatalog,
  type Severity,
  type SupplyState,
  type Supplier,
  type Tier,
  type Verification,
} from "@/lib/supplylens-data";
import {
  alternativeFit,
  impactFor,
  logAction,
  resetSupply,
  scoreFor,
  simulateDisruption,
} from "@/lib/supplylens-logic";

const nav = [
  ["Overview", Gauge],
  ["Supplier network", Network],
  ["Suppliers", Users],
  ["Risk monitoring", AlertTriangle],
  ["Impact analysis", Target],
  ["Risk map", Globe2],
  ["Verification", ShieldCheck],
  ["Incidents", AlertTriangle],
  ["Mitigation", CheckCircle2],
  ["Analytics", BarChart3],
  ["Reports & audit", FileText],
  ["Settings", SlidersHorizontal],
] as const;
const sevColor: Record<string, string> = {
  Critical: "#c94c52",
  High: "#da8c38",
  Medium: "#b49a35",
  Low: "#258f7b",
};
function Pill({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="sl-pill"
      style={color ? { color, background: `${color}14` } : undefined}
    >
      {children}
    </span>
  );
}
function Stat({
  label,
  value,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: string | number;
  icon: any;
  accent?: string;
}) {
  return (
    <div className="sl-stat">
      <div className={`sl-stat-icon ${accent}`}>
        <Icon size={16} />
      </div>
      <span>{label}</span>
      <b>{value}</b>
      <small>Illustrative demo</small>
    </div>
  );
}
function exportCsv(state: SupplyState) {
  exportSupplyReport(state);
}
export default function SupplyLens() {
  const [state, setState] = useState<SupplyState>(() => createSupplyState());
  const [hydrated, setHydrated] = useState(false);
  const [section, setSection] = useState("Overview");
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("supplylens-demo-v2");
    if (raw)
      try {
        const saved = JSON.parse(raw);
        const defaults = createSupplyState();
        if (
          Array.isArray(saved.suppliers) &&
          saved.suppliers.length &&
          Array.isArray(saved.relationships)
        ) {
          setState({
            ...defaults,
            ...saved,
            evidence: saved.evidence || defaults.evidence,
            settings: { ...defaults.settings, ...saved.settings },
            selectedSupplier: saved.suppliers.some(
              (s: Supplier) => s.id === saved.selectedSupplier,
            )
              ? saved.selectedSupplier
              : saved.suppliers[0].id,
          });
        }
      } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated)
      localStorage.setItem("supplylens-demo-v2", JSON.stringify(state));
  }, [state, hydrated]);
  const selected = state.suppliers.find(
    (s) => s.id === state.selectedSupplier,
  )!;
  const impact = impactFor(state, state.selectedSupplier);
  const score = scoreFor(state, selected);
  const filtered = state.suppliers.filter(
    (s) =>
      (tier === "All" || s.tier === tier) &&
      (!query ||
        `${s.name} ${s.city} ${s.industry}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const announce = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3200);
  };
  const setSupplier = (id: string) =>
    setState((s) => ({ ...s, selectedSupplier: id }));
  const runDemo = () => {
    setState((s) => simulateDisruption(s, "S2-01"));
    setSection("Impact analysis");
    announce(
      "Hypothetical shutdown simulated. Review potential exposure and mitigation actions.",
    );
  };
  const reset = () => {
    setState(resetSupply());
    announce("Demo network reset.");
  };
  const acknowledge = (id: string) =>
    setState((s) =>
      logAction(
        {
          ...s,
          incidents: s.incidents.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "Under Investigation",
                  owner: i.owner === "Unassigned" ? "Priya Sharma" : i.owner,
                }
              : i,
          ),
        },
        "Incident acknowledged",
        `${id} assigned for human review`,
      ),
    );
  const saveSupplier = (draft: {
    name: string;
    tier: Tier;
    country: string;
    city: string;
    industry: string;
    materialId: string;
    verification: Verification;
  }) => {
    if (editor && editor !== "new") {
      setState((x) =>
        logAction(
          {
            ...x,
            suppliers: x.suppliers.map((s) =>
              s.id === editor
                ? {
                    ...s,
                    ...draft,
                    materialIds: [
                      ...new Set([draft.materialId, ...s.materialIds.slice(1)]),
                    ],
                    materials: [
                      ...new Set([draft.materialId, ...s.materialIds.slice(1)]),
                    ].map(
                      (id) =>
                        materialCatalog.find((m) => m.id === id)?.name || id,
                    ),
                  }
                : s,
            ),
          },
          "Supplier profile updated",
          `${editor} · details saved`,
        ),
      );
      setEditor(null);
      announce("Supplier profile updated.");
      return;
    }
    const id = `S-DEMO-${Date.now()}`,
      loc = state.suppliers.find((s) => s.city === draft.city),
      mat = materialCatalog.find((m) => m.id === draft.materialId);
    const supplier: Supplier = {
      id,
      ...draft,
      materials: [mat?.name || draft.materialId],
      materialIds: [draft.materialId],
      risk: "Low",
      lastAssessment: "Not assessed",
      criticality: 35,
      latitude: loc?.latitude || 12.9716,
      longitude: loc?.longitude || 77.5946,
      site: `${draft.city} Demo Site`,
      alternatives: [],
    };
    const customer =
      draft.tier === "Tier 1"
        ? "BAS"
        : draft.tier === "Tier 2"
          ? "S1-01"
          : "S2-01";
    setState((x) =>
      logAction(
        {
          ...x,
          suppliers: [supplier, ...x.suppliers],
          relationships: [
            {
              id: `REL-DEMO-${Date.now()}`,
              from: id,
              to: customer,
              material: draft.materialId,
              confidence: "Pending Verification",
              updated: "2026-11-05",
            },
            ...x.relationships,
          ],
        },
        "Supplier added",
        `${id} · relationship pending verification`,
      ),
    );
    setEditor(null);
    announce("Supplier and pending relationship added.");
  };
  return (
    <div className="sl-shell">
      <aside className="sl-sidebar">
        <div className="sl-logo">
          <span>SL</span>
          <div>
            <b>SupplyLens</b>
            <small>Risk intelligence</small>
          </div>
        </div>
        <div className="sl-workspace">
          <b>{state.settings.companyName}</b>
          <small>Manufacturing workspace · DEMO</small>
        </div>
        <div className="sl-side-label">CONTROL TOWER</div>
        <nav>
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={section === name ? "active" : ""}
              onClick={() => setSection(name)}
            >
              <Icon size={15} />
              {name}
              {name === "Incidents" && (
                <em>
                  {
                    state.incidents.filter((i) => i.status !== "Resolved")
                      .length
                  }
                </em>
              )}
            </button>
          ))}
        </nav>
        <div className="sl-sidebar-foot">
          <span className="sl-live-dot" /> Frontend prototype · local demo data
          <button onClick={reset}>
            <RefreshCcw size={13} />
            Reset demo data
          </button>
        </div>
      </aside>
      <main className="sl-main">
        <header className="sl-topbar">
          <div>
            <span className="sl-crumb">SUPPLYLENS /</span>
            <b>{section}</b>
          </div>
          <div className="sl-top-actions">
            <label className="sl-search">
              <Search size={14} />
              <input
                placeholder="Search suppliers…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span className="sl-demo-tag">SIMULATED DATA</span>
            <button
              className="sl-icon-btn"
              title="Notifications"
              onClick={() => setSection("Incidents")}
            >
              <AlertTriangle size={17} />
            </button>
            <span className="sl-user">PS</span>
          </div>
        </header>
        <div className="sl-content">
          <div className="sl-demo-banner">
            <ShieldCheck size={17} />
            <div>
              <b>SupplyLens demonstration workspace</b>
              <span>
                Fictional suppliers, relationships, risk events and impact
                calculations. No live feeds or production decisions.
              </span>
            </div>
            <button onClick={runDemo}>
              <Play size={13} /> Run SupplyLens Demo
            </button>
          </div>
          {section === "Overview" && (
            <Overview
              state={state}
              score={score}
              onRun={runDemo}
              onSelect={setSupplier}
            />
          )}{" "}
          {section === "Supplier network" && (
            <NetworkSection
              state={state}
              setSupplier={setSupplier}
              setSection={setSection}
              setState={setState}
            />
          )}{" "}
          {section === "Suppliers" && (
            <SupplierSection
              suppliers={filtered}
              state={state}
              query={query}
              setQuery={setQuery}
              tier={tier}
              setTier={setTier}
              onSelect={(id) => {
                setSupplier(id);
                setProfileId(id);
              }}
              onAdd={() => setEditor("new")}
              onExport={() => exportCsv(state)}
            />
          )}{" "}
          {section === "Risk monitoring" && (
            <RiskSection
              state={state}
              onAcknowledge={acknowledge}
              setState={setState}
            />
          )}{" "}
          {section === "Impact analysis" && (
            <ImpactSection
              state={state}
              impact={impact}
              selected={selected}
              onRun={runDemo}
              onSelect={setSupplier}
              setState={setState}
              setSection={setSection}
            />
          )}{" "}
          {section === "Risk map" && (
            <MapSection
              state={state}
              onSelect={(id) => {
                setSupplier(id);
                setProfileId(id);
              }}
            />
          )}{" "}
          {section === "Verification" && (
            <VerificationWorkspace state={state} setState={setState} />
          )}{" "}
          {section === "Incidents" && (
            <RiskSection
              state={state}
              onAcknowledge={acknowledge}
              setState={setState}
            />
          )}{" "}
          {section === "Mitigation" && (
            <>
              <MitigationSection
                state={state}
                impact={impact}
                setState={setState}
                announce={announce}
              />
              <ActionTracker state={state} setState={setState} />
            </>
          )}{" "}
          {(section === "Analytics" ||
            section === "Reports & audit" ||
            section === "Settings") && (
            <UtilitySection
              section={section}
              state={state}
              onExport={() => exportCsv(state)}
              setState={setState}
            />
          )}
        </div>
        {notice && (
          <div className="sl-toast">
            <CheckCircle2 size={15} />
            {notice}
          </div>
        )}
      </main>
      {editor && (
        <SupplierEditor
          supplier={
            editor === "new"
              ? undefined
              : state.suppliers.find((s) => s.id === editor)
          }
          onClose={() => setEditor(null)}
          onSave={saveSupplier}
        />
      )}
      {profileId && (
        <SupplierProfile
          supplier={state.suppliers.find((s) => s.id === profileId)}
          state={state}
          onClose={() => setProfileId(null)}
          onEdit={(s) => setEditor(s)}
        />
      )}
    </div>
  );
}

function Overview({
  state,
  score,
  onRun,
  onSelect,
}: {
  state: SupplyState;
  score: any;
  onRun: () => void;
  onSelect: (id: string) => void;
}) {
  const tiers = ["Tier 1", "Tier 2", "Tier 3"];
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">EXECUTIVE CONTROL TOWER · DEMO</span>
          <h1>See beyond your suppliers.</h1>
          <p>
            Translate upstream signals into product, production-line and action
            exposure.
          </p>
        </div>
        <button className="sl-primary" onClick={onRun}>
          <Play size={14} />
          Run SupplyLens Demo
        </button>
      </div>
      <div className="sl-stats-grid">
        <Stat
          label="Total suppliers"
          value={state.suppliers.length}
          icon={Users}
          accent="blue"
        />
        <Stat label="Tier 1 / 2 / 3" value="12 / 12 / 12" icon={Network} />
        <Stat
          label="Mapped relationships"
          value={state.relationships.length}
          icon={Network}
          accent="violet"
        />
        <Stat
          label="High-risk suppliers"
          value={
            state.suppliers.filter(
              (s) => s.risk === "High" || s.risk === "Critical",
            ).length
          }
          icon={AlertTriangle}
          accent="rose"
        />
        <Stat
          label="Active incidents"
          value={state.incidents.filter((i) => i.status !== "Resolved").length}
          icon={AlertTriangle}
          accent="orange"
        />
        <Stat
          label="Single-source dependencies"
          value={
            state.components.filter((c) => c.tier2Suppliers.length === 1).length
          }
          icon={Target}
          accent="amber"
        />
      </div>
      <div className="sl-grid-2">
        <div className="sl-card">
          <div className="sl-card-head">
            <div>
              <h3>Network health</h3>
              <p>Coverage by supplier tier · illustrative</p>
            </div>
            <Pill color="#298f7d">
              {
                state.suppliers.filter((s) => s.verification === "Verified")
                  .length
              }
              /{state.suppliers.length} verified records
            </Pill>
          </div>
          <div className="sl-bars">
            {tiers.map((t) => (
              <div key={t}>
                <span>{t}</span>
                <div>
                  <i
                    style={{
                      width: `${t === "Tier 1" ? 95 : t === "Tier 2" ? 72 : 38}%`,
                    }}
                  />
                </div>
                <b>{t === "Tier 1" ? 95 : t === "Tier 2" ? 72 : 38}%</b>
              </div>
            ))}
          </div>
          <div className="sl-card-note">
            Visibility is confidence-aware: Supplier Declared and Inferred
            relationships are not treated as confirmed.
          </div>
        </div>
        <div className="sl-card">
          <div className="sl-card-head">
            <div>
              <h3>Priority exposure</h3>
              <p>Rule-based score for selected supplier</p>
            </div>
            <Pill color={sevColor[score.severity]}>
              {score.severity} · {score.total}/100
            </Pill>
          </div>
          <div className="sl-score">
            <strong>{score.total}</strong>
            <span>/100</span>
            <div>
              {score.factors.slice(0, 4).map((f: any) => (
                <div key={f.label}>
                  <span>{f.label}</span>
                  <b>
                    {f.value}/{f.max}
                  </b>
                </div>
              ))}
            </div>
          </div>
          <button
            className="sl-text-link"
            onClick={() => onSelect(state.selectedSupplier)}
          >
            Review{" "}
            {state.suppliers.find((s) => s.id === state.selectedSupplier)?.name}{" "}
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <RiskCharts state={state} />
      <div className="sl-card sl-activity">
        <div className="sl-card-head">
          <div>
            <h3>Recent activity</h3>
            <p>Audit trail retained locally in this browser</p>
          </div>
        </div>
        {state.audit.slice(0, 5).map((a) => (
          <div className="sl-activity-row" key={a.id}>
            <CheckCircle2 size={14} />
            <div>
              <b>{a.title}</b>
              <small>{a.detail}</small>
            </div>
            <time>{a.time}</time>
          </div>
        ))}
      </div>
    </>
  );
}

function NetworkSection({
  state,
  setSupplier,
  setSection,
  setState,
}: {
  state: SupplyState;
  setSupplier: (id: string) => void;
  setSection: (s: string) => void;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const [localTier, setLocalTier] = useState("All");
  const [risk, setRisk] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const categories = [
    "All",
    ...new Set(materialCatalog.map((m) => m.category)),
  ];
  const ids = state.suppliers
    .filter(
      (s) =>
        (localTier === "All" || s.tier === localTier) &&
        (risk === "All" || s.risk === risk) &&
        (category === "All" ||
          s.materialIds.some(
            (id) =>
              materialCatalog.find((m) => m.id === id)?.category === category,
          )) &&
        (!search || s.name.toLowerCase().includes(search.toLowerCase())),
    )
    .map((s) => s.id);
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">DEPENDENCY GRAPH</span>
          <h1>Multi-tier supplier network</h1>
          <p>
            Confirmed, supplier-declared and inferred relationships remain
            distinguishable.
          </p>
        </div>
        {state.scenarioActive && state.scenarioStep === 2 ? (
          <button
            className="sl-primary"
            onClick={() => {
              setState((s) => ({ ...s, scenarioStep: 3 }));
              setSection("Impact analysis");
            }}
          >
            Continue demo: trace impact <ChevronRight size={14} />
          </button>
        ) : (
          <Pill color={state.scenarioActive ? "#c94c52" : "#298f7d"}>
            {state.scenarioActive ? "Scenario active" : "Healthy demo network"}
          </Pill>
        )}
      </div>
      <div className="sl-network-filters">
        <label>
          <Search size={13} />
          <input
            placeholder="Find supplier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter graph by tier"
          value={localTier}
          onChange={(e) => setLocalTier(e.target.value)}
        >
          {["All", "Tier 1", "Tier 2", "Tier 3"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filter graph by risk"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          {["All", "Critical", "High", "Medium", "Low"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filter graph by material"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span>{ids.length} suppliers displayed</span>
      </div>
      <div className="sl-card sl-network-card">
        <NetworkGraph state={state} ids={ids} onSelect={setSupplier} />
      </div>
      <div className="sl-detail-strip">
        <b>Selected supplier:</b>{" "}
        {state.suppliers.find((s) => s.id === state.selectedSupplier)?.name}{" "}
        <span>·</span>{" "}
        <b>{impactFor(state, state.selectedSupplier).tier1.length}</b> connected
        Tier 1 <span>·</span>{" "}
        <b>{impactFor(state, state.selectedSupplier).components.length}</b>{" "}
        mapped components{" "}
        <button
          className="sl-mini-action"
          onClick={() => setSection("Impact analysis")}
        >
          View impact →
        </button>
      </div>
      <RelationshipEditor state={state} setState={setState} />
    </>
  );
}

function SupplierSection({
  suppliers,
  state,
  query,
  setQuery,
  tier,
  setTier,
  onSelect,
  onAdd,
  onExport,
}: {
  suppliers: any[];
  state: SupplyState;
  query: string;
  setQuery: (v: string) => void;
  tier: string;
  setTier: (v: string) => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onExport: () => void;
}) {
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">SUPPLIER MASTER</span>
          <h1>Supplier management</h1>
          <p>Search, inspect and update the upstream records behind the map.</p>
        </div>
        <div className="sl-heading-actions">
          <button className="sl-secondary" onClick={onExport}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="sl-primary" onClick={onAdd}>
            <Plus size={14} />
            Add supplier
          </button>
        </div>
      </div>
      <div className="sl-filterbar">
        <label>
          <Search size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, city or industry"
          />
        </label>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option>All</option>
          <option>Tier 1</option>
          <option>Tier 2</option>
          <option>Tier 3</option>
        </select>
        <Filter size={15} />
        <span>{suppliers.length} records</span>
      </div>
      <div className="sl-card sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Tier</th>
              <th>Location</th>
              <th>Industry</th>
              <th>Risk</th>
              <th>Verification</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => {
              const sc = scoreFor(state, s);
              return (
                <tr
                  key={s.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${s.name} profile`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(s.id);
                  }}
                  onClick={() => onSelect(s.id)}
                >
                  <td>
                    <b>{s.name}</b>
                    <small>
                      {s.id} · {s.site}
                    </small>
                  </td>
                  <td>
                    <Pill>{s.tier}</Pill>
                  </td>
                  <td>
                    {s.city}, {s.country}
                  </td>
                  <td>{s.industry}</td>
                  <td>
                    <Pill color={sevColor[s.risk]}>{s.risk}</Pill>
                  </td>
                  <td>
                    <span
                      className={`sl-verification ${s.verification === "Verified" ? "verified" : ""}`}
                    >
                      {s.verification}
                    </span>
                  </td>
                  <td>
                    <b>{sc.total}</b>
                    <small>/100 illustrative</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RiskSection({
  state,
  onAcknowledge,
  setState,
}: {
  state: SupplyState;
  onAcknowledge: (id: string) => void;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const [severity, setSeverity] = useState(
    state.settings.criticalOnly ? "Critical" : "All",
  );
  const [openIncident, setOpenIncident] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const update = (
    id: string,
    field: "status" | "owner" | "severity",
    value: string,
  ) =>
    setState((s) =>
      logAction(
        {
          ...s,
          incidents: s.incidents.map((i) =>
            i.id === id ? { ...i, [field]: value } : i,
          ),
        },
        "Incident updated",
        `${id} · ${field}: ${value}`,
      ),
    );
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">RISK INTELLIGENCE</span>
          <h1>Monitor signals, assign response.</h1>
          <p>Every event below is synthetic and requires human validation.</p>
        </div>
        <div className="sl-heading-actions">
          <select
            aria-label="Filter incidents by severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            {["All", "Critical", "High", "Medium", "Low"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Pill color="#c47e38">
            {state.incidents.filter((i) => i.status !== "Resolved").length} open
            events
          </Pill>
        </div>
      </div>
      <div className="sl-card sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Incident</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Evidence / confidence</th>
              <th>Owner</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.incidents
              .filter((i) => severity === "All" || i.severity === severity)
              .map((i) => (
                <tr key={i.id}>
                  <td>
                    <b>{i.id}</b>
                    <small>
                      {i.event} · {i.date}
                    </small>
                  </td>
                  <td>
                    {state.suppliers.find((s) => s.id === i.supplierId)?.name}
                    <small>
                      {state.suppliers.find((s) => s.id === i.supplierId)?.tier}
                    </small>
                  </td>
                  <td>{i.category}</td>
                  <td>
                    <select
                      aria-label={`Severity ${i.id}`}
                      value={i.severity}
                      onChange={(e) => update(i.id, "severity", e.target.value)}
                    >
                      {["Critical", "High", "Medium", "Low"].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {i.confidence}% confidence
                    <small>{i.evidence.slice(0, 58)}…</small>
                  </td>
                  <td>
                    <select
                      aria-label={`Owner ${i.id}`}
                      value={i.owner}
                      onChange={(e) => update(i.id, "owner", e.target.value)}
                    >
                      {[
                        "Unassigned",
                        "Priya Sharma",
                        "Arjun Mehta",
                        "Sneha Rao",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      aria-label={`Status ${i.id}`}
                      value={i.status}
                      onChange={(e) => update(i.id, "status", e.target.value)}
                    >
                      {[
                        "New",
                        "Under Investigation",
                        "Mitigation in Progress",
                        "Monitoring",
                        "Resolved",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {i.status === "New" && (
                      <button
                        className="sl-mini-action"
                        onClick={() => onAcknowledge(i.id)}
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      className="sl-mini-action"
                      onClick={() => {
                        setOpenIncident(i.id);
                        setNote("");
                      }}
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {openIncident &&
        (() => {
          const incident = state.incidents.find((i) => i.id === openIncident);
          if (!incident) return null;
          return (
            <div className="sl-modal-backdrop">
              <section
                className="sl-modal sl-incident-dialog"
                role="dialog"
                aria-label={`Investigate ${incident.id}`}
              >
                <button
                  className="sl-close"
                  aria-label="Close investigation"
                  onClick={() => setOpenIncident(null)}
                >
                  <X size={18} />
                </button>
                <span className="sl-eyebrow">
                  SIMULATED INCIDENT · {incident.id}
                </span>
                <h2>{incident.event}</h2>
                <p>{incident.evidence}</p>
                <p>
                  Confidence: {incident.confidence}% · {incident.category} ·{" "}
                  {incident.date}
                </p>
                <h3>Investigation history</h3>
                {incident.notes.map((entry, index) => (
                  <p key={index} className="sl-note">
                    {entry}
                  </p>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!note.trim()) return;
                    setState((s) =>
                      logAction(
                        {
                          ...s,
                          incidents: s.incidents.map((i) =>
                            i.id === incident.id
                              ? { ...i, notes: [...i.notes, note.trim()] }
                              : i,
                          ),
                        },
                        "Investigation note added",
                        `${incident.id} · ${note.trim()}`,
                      ),
                    );
                    setNote("");
                  }}
                >
                  <label htmlFor="sl-note-entry">Add investigation note</label>
                  <textarea
                    id="sl-note-entry"
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Record what was checked and who must confirm it"
                  />
                  <button className="sl-primary" type="submit">
                    Save note
                  </button>
                </form>
              </section>
            </div>
          );
        })()}
    </>
  );
}

function ImpactSection({
  state,
  impact,
  selected,
  onRun,
  onSelect,
  setState,
  setSection,
}: {
  state: SupplyState;
  impact: any;
  selected: any;
  onRun: () => void;
  onSelect: (id: string) => void;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
  setSection: (s: string) => void;
}) {
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">OPERATIONAL EXPOSURE</span>
          <h1>Dependency & impact analysis</h1>
          <p>
            Potential exposure is calculated from the selected supplier&apos;s
            explicit relationships and BOM data.
          </p>
        </div>
        <div className="sl-heading-actions">
          <select
            value={state.selectedSupplier}
            onChange={(e) => onSelect(e.target.value)}
          >
            {state.suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button className="sl-primary" onClick={onRun}>
            <Play size={14} />
            Simulate Tier 2 shutdown
          </button>
        </div>
      </div>
      <div className="sl-impact-callout">
        <AlertTriangle size={19} />
        <div>
          <b>
            {state.scenarioActive
              ? "Hypothetical shutdown active"
              : "Choose a supplier to trace exposure"}
          </b>
          <span>
            {state.scenarioActive
              ? "Potential impact requiring validation — not a production-loss prediction."
              : "Run the demo to propagate a connected disruption through suppliers, components, lines and orders."}
          </span>
        </div>
        {state.scenarioActive && (
          <>
            <Pill color="#c94c52">Scenario step {state.scenarioStep}/4</Pill>
            {state.scenarioStep === 1 ? (
              <button
                className="sl-secondary"
                onClick={() => {
                  setState((s) => ({ ...s, scenarioStep: 2 }));
                  setSection("Supplier network");
                }}
              >
                Continue: network <ChevronRight size={13} />
              </button>
            ) : state.scenarioStep === 3 ? (
              <button
                className="sl-primary"
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    scenarioStep: 4,
                    incidents: s.incidents.map((i) =>
                      i.id === `INC-DEMO-${s.selectedSupplier}`
                        ? { ...i, status: "Mitigation in Progress" }
                        : i,
                    ),
                  }));
                  setSection("Mitigation");
                }}
              >
                Continue: mitigation <ChevronRight size={13} />
              </button>
            ) : null}
          </>
        )}
      </div>
      <div className="sl-impact-grid">
        <Stat
          label="Affected suppliers"
          value={impact.supplierIds.length}
          icon={Users}
          accent="rose"
        />
        <Stat
          label="Connected Tier 1"
          value={impact.tier1.length}
          icon={Network}
        />
        <Stat
          label="Affected components"
          value={impact.components.length}
          icon={Target}
          accent="violet"
        />
        <Stat
          label="Exposed lines"
          value={impact.lines.length}
          icon={Gauge}
          accent="orange"
        />
        <Stat
          label="Open orders"
          value={impact.orders.length}
          icon={FileText}
          accent="amber"
        />
        <Stat
          label="Inventory cover"
          value={`${impact.coverage} days`}
          icon={BarChart3}
          accent="green"
        />
      </div>
      <div className="sl-grid-2">
        <div className="sl-card">
          <div className="sl-card-head">
            <div>
              <h3>Trace: {selected.name}</h3>
              <p>
                {selected.tier} · {selected.city}, {selected.country} ·{" "}
                {selected.verification}
              </p>
            </div>
          </div>
          <div className="sl-trace-list">
            <div>
              <span>Upstream dependencies</span>
              <b>{impact.upstream.length}</b>
            </div>
            <div>
              <span>Connected Tier 1 suppliers</span>
              <b>{impact.tier1.map((s: any) => s.name).join(", ") || "None"}</b>
            </div>
            <div>
              <span>Components</span>
              <b>
                {impact.components.map((c: any) => c.name).join(", ") || "None"}
              </b>
            </div>
            <div>
              <span>Products / lines</span>
              <b>
                {impact.products.map((p: any) => p.name).join(", ") || "None"} ·{" "}
                {impact.lines.join(", ") || "None"}
              </b>
            </div>
            <div>
              <span>Potentially affected orders</span>
              <b>{impact.orders.map((o: any) => o.id).join(", ") || "None"}</b>
            </div>
          </div>
        </div>
        <div className="sl-card">
          <div className="sl-card-head">
            <div>
              <h3>Inventory and evidence</h3>
              <p>Material cover is minimum component stock ÷ daily demand.</p>
            </div>
          </div>
          {impact.components.slice(0, 6).map((c: any) => (
            <div className="sl-material-row" key={c.id}>
              <div>
                <b>{c.name}</b>
                <small>
                  {c.id} · {c.inventory.toLocaleString()} units available
                </small>
              </div>
              <strong>{Math.floor(c.inventory / c.dailyDemand)}d</strong>
            </div>
          ))}
          <div className="sl-card-note">
            Coverage is illustrative and excludes confirmed purchase-order
            receipts, safety stock and substitution validation.
          </div>
        </div>
      </div>
      <div className="sl-card sl-purchase-orders">
        <div className="sl-card-head">
          <div>
            <h3>Open purchase orders under review</h3>
            <p>
              Mapped component orders are shown for follow-up; expected receipts
              are not counted as stock.
            </p>
          </div>
          <Pill>{impact.purchaseOrders.length} records</Pill>
        </div>
        {impact.purchaseOrders.length ? (
          impact.purchaseOrders.map((po: any) => (
            <div className="sl-material-row" key={po.id}>
              <div>
                <b>
                  {po.id} ·{" "}
                  {state.components.find((c) => c.id === po.componentId)?.name}
                </b>
                <small>
                  {state.suppliers.find((s) => s.id === po.supplierId)?.name} ·{" "}
                  {po.quantity.toLocaleString()} units · expected {po.expected}
                </small>
              </div>
              <Pill color="#b17839">{po.status}</Pill>
            </div>
          ))
        ) : (
          <div className="sl-card-note">
            No open purchase orders mapped to the selected dependency.
          </div>
        )}
      </div>
    </>
  );
}

function MapSection({
  state,
  onSelect,
}: {
  state: SupplyState;
  onSelect: (id: string) => void;
}) {
  const [country, setCountry] = useState("All");
  const [tier, setTier] = useState("All");
  const [risk, setRisk] = useState("All");
  const [category, setCategory] = useState("All");
  const visible = state.suppliers.filter(
    (s) =>
      (country === "All" || s.country === country) &&
      (tier === "All" || s.tier === tier) &&
      (risk === "All" || s.risk === risk) &&
      (category === "All" ||
        s.materialIds.some(
          (id) =>
            materialCatalog.find((m) => m.id === id)?.category === category,
        )),
  );
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">GEOGRAPHIC VISIBILITY</span>
          <h1>Risk map & supplier footprint</h1>
          <p>
            Locations and severity are fictional demo records; no live hazard
            overlays are connected.
          </p>
        </div>
        <Pill color="#5b7da8">{visible.length} plotted sites</Pill>
      </div>
      <div className="sl-network-filters">
        <select
          aria-label="Map country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {["All", ...new Set(state.suppliers.map((s) => s.country))].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
        <select
          aria-label="Map tier"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        >
          {["All", "Tier 1", "Tier 2", "Tier 3"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Map risk"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          {["All", "Critical", "High", "Medium", "Low"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Map material category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All", ...new Set(materialCatalog.map((m) => m.category))].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
      </div>
      <div className="sl-card sl-map-card">
        <RiskMap suppliers={visible} onSelect={onSelect} />
      </div>
    </>
  );
}

function VerificationSection({
  state,
  setState,
}: {
  state: SupplyState;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const update = (id: string, value: Verification) =>
    setState((s) =>
      logAction(
        {
          ...s,
          suppliers: s.suppliers.map((x) =>
            x.id === id ? { ...x, verification: value } : x,
          ),
        },
        "Supplier verification updated",
        `${id} · ${value}`,
      ),
    );
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">DATA CONFIDENCE</span>
          <h1>Verification & data collection</h1>
          <p>
            Relationships retain their source confidence so inferred links are
            never shown as confirmed.
          </p>
        </div>
      </div>
      <div className="sl-verification-grid">
        {(["Tier 1", "Tier 2", "Tier 3"] as const).map((t) => (
          <div className="sl-card sl-coverage" key={t}>
            <span>{t} visibility</span>
            <strong>{t === "Tier 1" ? 95 : t === "Tier 2" ? 72 : 38}%</strong>
            <small>Illustrative coverage</small>
            <div>
              <i
                style={{
                  width: `${t === "Tier 1" ? 95 : t === "Tier 2" ? 72 : 38}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="sl-card sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Tier</th>
              <th>Relationship evidence</th>
              <th>Last updated</th>
              <th>Update status</th>
            </tr>
          </thead>
          <tbody>
            {state.suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.name}</b>
                  <small>{s.id}</small>
                </td>
                <td>{s.tier}</td>
                <td>
                  {state.relationships
                    .filter((r) => r.from === s.id || r.to === s.id)
                    .map((r) => r.confidence)
                    .join(", ") || "No mapped edge"}
                </td>
                <td>{s.lastAssessment}</td>
                <td>
                  <select
                    value={s.verification}
                    onChange={(e) =>
                      update(s.id, e.target.value as Verification)
                    }
                  >
                    {[
                      "Verified",
                      "Supplier Declared",
                      "Inferred",
                      "Pending Verification",
                      "Outdated Information",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MitigationSection({
  state,
  impact,
  setState,
  announce,
}: {
  state: SupplyState;
  impact: any;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
  announce: (m: string) => void;
}) {
  const source = state.selectedSupplier;
  const options = state.alternatives.filter(
    (a) =>
      impact.components.some((c: any) => a.materials.includes(c.id)) ||
      source === "S2-01",
  );
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">ACTION CENTER</span>
          <h1>Mitigation & alternatives</h1>
          <p>
            Compare compatibility and qualification before assigning procurement
            work.
          </p>
        </div>
        <Pill color="#298f7d">
          {state.actions.filter((a) => a.status === "Completed").length}/
          {state.actions.length} actions complete
        </Pill>
      </div>
      <div className="sl-card sl-action-banner">
        <div>
          <AlertTriangle size={18} />
          <b>
            {state.scenarioActive
              ? "Respond to the simulated shutdown"
              : "Mitigation playbook"}
          </b>
          <span>
            Selected: {state.suppliers.find((s) => s.id === source)?.name} ·
            potential exposure only
          </span>
        </div>
        <button
          className="sl-secondary"
          onClick={() => {
            setState((s) =>
              logAction(
                {
                  ...s,
                  evidence: [
                    {
                      id: `REQ-${Date.now()}-${s.evidence.length}`,
                      supplierId: source,
                      title: "Confirm disruption impact and available capacity",
                      kind: "Information request",
                      reference: "Local demo request — not sent externally",
                      date: new Date().toISOString().slice(0, 10),
                    },
                    ...s.evidence,
                  ],
                },
                "Supplier confirmation requested",
                `${source} · procurement follow-up required`,
              ),
            );
            announce(
              "Confirmation request recorded locally. No external message sent.",
            );
          }}
        >
          Request supplier confirmation
        </button>
      </div>
      <div className="sl-alt-grid">
        {options.map((a) => {
          const fit = alternativeFit(state, source, a);
          const supplier = state.suppliers.find((s) => s.id === a.supplierId);
          return (
            <div className="sl-card sl-alt-card" key={a.id}>
              <div className="sl-card-head">
                <div>
                  <h3>{supplier?.name}</h3>
                  <p>
                    {supplier?.city}, {supplier?.country} · {a.id}
                  </p>
                </div>
                <Pill
                  color={
                    fit.eligible
                      ? "#298f7d"
                      : a.qualification === "Pending qualification"
                        ? "#c28b38"
                        : "#9b6f76"
                  }
                >
                  {a.qualification}
                </Pill>
              </div>
              <div className="sl-alt-facts">
                <span>
                  Capacity <b>{a.capacity.toLocaleString()}/wk</b>
                </span>
                <span>
                  Lead time <b>{a.leadWeeks} weeks</b>
                </span>
                <span>
                  Compatibility <b>{fit.compatible ? "Mapped" : "Review"}</b>
                </span>
                <span>
                  Risk <b style={{ color: sevColor[a.risk] }}>{a.risk}</b>
                </span>
                <span>
                  Additional cost{" "}
                  <b>₹{a.additionalCost.toLocaleString("en-IN")}</b>
                </span>
                <span>
                  Weekly demand <b>{fit.demand.toLocaleString()} units</b>
                </span>
                <span>
                  Supported components <b>{a.materials.join(", ")}</b>
                </span>
              </div>
              <button
                disabled={!fit.eligible}
                className="sl-primary"
                onClick={() => {
                  const incident = state.incidents.find(
                    (i) => i.supplierId === source && i.status !== "Resolved",
                  );
                  if (!incident) {
                    announce(
                      "Simulate a disruption or select a supplier with an open incident first.",
                    );
                    return;
                  }
                  setState((s) =>
                    logAction(
                      {
                        ...s,
                        actions: [
                          {
                            id: `ACT-DEMO-${Date.now()}`,
                            incidentId: incident.id,
                            title: `Validate ${supplier?.name} capacity · preferred ${a.id}`,
                            owner: "Priya Sharma",
                            status: "In progress",
                            due: new Date(Date.now() + 3 * 86400000)
                              .toISOString()
                              .slice(0, 10),
                          },
                          ...s.actions,
                        ],
                        incidents: s.incidents.map((i) =>
                          i.id === incident.id
                            ? {
                                ...i,
                                status: "Mitigation in Progress",
                                owner:
                                  i.owner === "Unassigned"
                                    ? "Priya Sharma"
                                    : i.owner,
                                notes: [
                                  ...i.notes,
                                  `Preferred alternative ${a.id}: capacity and qualification require operational confirmation.`,
                                ],
                              }
                            : i,
                        ),
                      },
                      "Mitigation action assigned",
                      `${supplier?.name} · procurement capacity validation`,
                    ),
                  );
                  announce(
                    fit.eligible
                      ? "Procurement action assigned."
                      : "Alternative requires qualification.",
                  );
                }}
              >
                {fit.eligible
                  ? "Assign procurement action"
                  : "Qualification required"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
function ActionTracker({
  state,
  setState,
}: {
  state: SupplyState;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  return (
    <div className="sl-card sl-activity">
      <div className="sl-card-head">
        <div>
          <h3>Assigned mitigation actions</h3>
          <p>Named owners and status are retained in the local audit trail.</p>
        </div>
      </div>
      {state.actions.map((a) => (
        <div className="sl-activity-row" key={a.id}>
          <CheckCircle2 size={14} />
          <div>
            <b>{a.title}</b>
            <small>
              {a.owner} · due {a.due}
            </small>
          </div>
          <select
            aria-label={`Action status ${a.id}`}
            value={a.status}
            onChange={(e) =>
              setState((s) =>
                logAction(
                  {
                    ...s,
                    actions: s.actions.map((x) =>
                      x.id === a.id
                        ? { ...x, status: e.target.value as any }
                        : x,
                    ),
                  },
                  "Mitigation action updated",
                  `${a.id} · ${e.target.value}`,
                ),
              )
            }
          >
            <option>Not started</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>
          <select
            aria-label={`Action owner ${a.id}`}
            value={a.owner}
            onChange={(e) =>
              setState((s) =>
                logAction(
                  {
                    ...s,
                    actions: s.actions.map((x) =>
                      x.id === a.id ? { ...x, owner: e.target.value } : x,
                    ),
                  },
                  "Mitigation owner assigned",
                  `${a.id} · ${e.target.value}`,
                ),
              )
            }
          >
            {["Priya Sharma", "Arjun Mehta", "Sneha Rao", "Unassigned"].map(
              (owner) => (
                <option key={owner}>{owner}</option>
              ),
            )}
          </select>
        </div>
      ))}
    </div>
  );
}

function UtilitySection({
  section,
  state,
  onExport,
  setState,
}: {
  section: string;
  state: SupplyState;
  onExport: () => void;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  if (section === "Reports & audit")
    return (
      <>
        <div className="sl-heading">
          <div>
            <span className="sl-eyebrow">EVIDENCE & GOVERNANCE</span>
            <h1>Reports & audit history</h1>
            <p>
              Export a working snapshot for review; all records remain
              fictional.
            </p>
          </div>
          <button className="sl-primary" onClick={onExport}>
            <Download size={14} />
            Export supplier CSV
          </button>
        </div>
        <div className="sl-report-grid">
          {reportTypes.map(([id, r]) => (
            <div className="sl-card sl-report-card" key={r}>
              <FileText size={18} />
              <b>{r}</b>
              <small>{reportRows(state, id).length - 1} records · demo</small>
              <button
                aria-label={`Download ${r}`}
                onClick={() => exportSupplyReport(state, id)}
              >
                Download CSV <Download size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="sl-card sl-table-wrap">
          <div className="sl-card-head">
            <div>
              <h3>Audit history</h3>
              <p>Important changes are retained locally.</p>
            </div>
          </div>
          {state.audit.map((a) => (
            <div className="sl-activity-row" key={a.id}>
              <CheckCircle2 size={14} />
              <div>
                <b>{a.title}</b>
                <small>{a.detail}</small>
              </div>
              <time>{a.time}</time>
            </div>
          ))}
        </div>
      </>
    );
  if (section === "Analytics")
    return (
      <>
        <div className="sl-heading">
          <div>
            <span className="sl-eyebrow">PERFORMANCE</span>
            <h1>Risk analytics</h1>
            <p>Rule-based demo measurements to validate during a pilot.</p>
          </div>
        </div>
        <div className="sl-stats-grid">
          <Stat label="Tier 2+ visibility" value="55%" icon={Network} />
          <Stat
            label="Verification rate"
            value={`${Math.round((state.suppliers.filter((s) => s.verification === "Verified").length / state.suppliers.length) * 100)}%`}
            icon={ShieldCheck}
            accent="green"
          />
          <Stat
            label="High-risk share"
            value={`${Math.round((state.suppliers.filter((s) => s.risk === "High" || s.risk === "Critical").length / state.suppliers.length) * 100)}%`}
            icon={AlertTriangle}
            accent="rose"
          />
          <Stat
            label="Mitigation completion"
            value={`${Math.round((state.actions.filter((a) => a.status === "Completed").length / state.actions.length) * 100)}%`}
            icon={CheckCircle2}
            accent="blue"
          />
        </div>
        <div className="sl-grid-2">
          <div className="sl-card">
            <div className="sl-card-head">
              <div>
                <h3>Risk by tier</h3>
                <p>Supplier count · illustrative</p>
              </div>
            </div>
            <div className="sl-bars">
              {(["Tier 1", "Tier 2", "Tier 3"] as const).map((t) => (
                <div key={t}>
                  <span>{t}</span>
                  <div>
                    <i
                      style={{
                        width: `${Math.min(100, (state.suppliers.filter((s) => s.tier === t && (s.risk === "High" || s.risk === "Critical")).length / 12) * 100)}%`,
                        background: sevColor.High,
                      }}
                    />
                  </div>
                  <b>
                    {
                      state.suppliers.filter(
                        (s) =>
                          s.tier === t &&
                          (s.risk === "High" || s.risk === "Critical"),
                      ).length
                    }
                  </b>
                </div>
              ))}
            </div>
          </div>
          <div className="sl-card">
            <div className="sl-card-head">
              <div>
                <h3>Prototype KPI framework</h3>
                <p>Measurements to prove with a narrow paid pilot</p>
              </div>
            </div>
            <div className="sl-trace-list">
              <div>
                <span>Time to assess exposure</span>
                <b>Target: baseline first</b>
              </div>
              <div>
                <span>Alert-to-action time</span>
                <b>Target: name owner</b>
              </div>
              <div>
                <span>Relationship verification rate</span>
                <b>Target: validate denominator</b>
              </div>
              <div>
                <span>Single-source concentration</span>
                <b>Target: critical BOM</b>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  return <DemoSettings state={state} setState={setState} />;
}
