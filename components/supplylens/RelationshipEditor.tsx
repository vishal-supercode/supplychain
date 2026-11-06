"use client";
import { useState } from "react";
import {
  materialCatalog,
  type SupplyState,
  type Verification,
} from "@/lib/supplylens-data";
import { logAction } from "@/lib/supplylens-logic";
export default function RelationshipEditor({
  state,
  setState,
}: {
  state: SupplyState;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [from, setFrom] = useState("S2-01");
  const [to, setTo] = useState("S1-03");
  const [material, setMaterial] = useState("MAT-SOC");
  const [confidence, setConfidence] =
    useState<Verification>("Supplier Declared");
  const [source, setSource] = useState("");
  const [notice, setNotice] = useState("");
  const supplier = state.suppliers.find((s) => s.id === from)!;
  const tier = Number(supplier.tier.slice(-1));
  const customers = state.suppliers.filter(
    (s) => Number(s.tier.slice(-1)) === tier - 1,
  );
  return (
    <details className="sl-card sl-relationship-editor">
      <summary>
        Manage supplier relationships · {state.relationships.length} mapped
        links
      </summary>
      <p>
        Upstream supplier → direct customer. Only adjacent tiers can be linked.
        Confirmed links require a demo evidence reference.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            (to !== "BAS" && !customers.some((c) => c.id === to)) ||
            (to === "BAS" && tier !== 1)
          ) {
            setNotice(
              "Choose a valid direct customer in the next downstream tier.",
            );
            return;
          }
          if (!supplier.materialIds.includes(material)) {
            setNotice("Material must be supplied by the upstream supplier.");
            return;
          }
          if (
            state.relationships.some(
              (r) =>
                r.id !== editId &&
                r.from === from &&
                r.to === to &&
                r.material === material,
            )
          ) {
            setNotice(
              "This material relationship already exists. Edit it below.",
            );
            return;
          }
          if (!source.trim()) return;
          const date = new Date().toISOString().slice(0, 10);
          setState((s) =>
            logAction(
              {
                ...s,
                relationships: editId
                  ? s.relationships.map((r) =>
                      r.id === editId
                        ? {
                            ...r,
                            from,
                            to,
                            material,
                            confidence,
                            source: source.trim(),
                            updated: date,
                          }
                        : r,
                    )
                  : [
                      ...s.relationships,
                      {
                        id: `REL-DEMO-${Date.now()}`,
                        from,
                        to,
                        material,
                        confidence,
                        source: source.trim(),
                        updated: date,
                      },
                    ],
                evidence:
                  confidence === "Verified"
                    ? [
                        {
                          id: `EVD-REL-${Date.now()}`,
                          supplierId: from,
                          title: `Relationship ${from} → ${to}`,
                          kind: "Relationship verification",
                          reference: source.trim(),
                          date,
                        },
                        ...s.evidence,
                      ]
                    : s.evidence,
              },
              "Relationship updated",
              `${from} → ${to} · ${confidence} · ${source.trim()}`,
            ),
          );
          setEditId(null);
          setSource("");
          setNotice(
            "Relationship saved. Network and dependency analysis have been updated.",
          );
        }}
      >
        <div className="sl-form-grid">
          <label>
            Upstream supplier
            <select
              value={from}
              onChange={(e) => {
                const s = state.suppliers.find((x) => x.id === e.target.value)!;
                setFrom(s.id);
                setMaterial(s.materialIds[0]);
                setTo(
                  s.tier === "Tier 1"
                    ? "BAS"
                    : state.suppliers.find(
                        (x) =>
                          Number(x.tier.slice(-1)) ===
                          Number(s.tier.slice(-1)) - 1,
                      )!.id,
                );
              }}
            >
              {state.suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Downstream customer
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {tier === 1 ? (
                <option value="BAS">Bharat Automotive Systems</option>
              ) : (
                customers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} · {s.name}
                  </option>
                ))
              )}
            </select>
          </label>
          <label>
            Relationship material
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {supplier.materialIds.map((id) => (
                <option key={id} value={id}>
                  {materialCatalog.find((m) => m.id === id)?.name || id}
                </option>
              ))}
            </select>
          </label>
          <label>
            Relationship confidence
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as Verification)}
            >
              {[
                "Verified",
                "Supplier Declared",
                "Inferred",
                "Pending Verification",
                "Outdated Information",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Source or demo evidence reference
            <input
              required
              maxLength={250}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. DEMO declaration reviewed by procurement"
            />
          </label>
        </div>
        <div className="sl-form-footer">
          <button type="submit" className="sl-primary">
            {editId ? "Save relationship" : "Add relationship"}
          </button>
          {editId && (
            <button
              type="button"
              className="sl-secondary"
              onClick={() => {
                setEditId(null);
                setSource("");
              }}
            >
              Cancel edit
            </button>
          )}
          {notice && <span role="status">{notice}</span>}
        </div>
      </form>
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Relationship</th>
              <th>Material</th>
              <th>Confidence / source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.relationships.map((r) => (
              <tr key={r.id}>
                <td>
                  <b>
                    {r.from} → {r.to}
                  </b>
                  <small>
                    {r.id} · {r.updated}
                  </small>
                </td>
                <td>{r.material}</td>
                <td>
                  {r.confidence}
                  <small>{r.source || "Seeded fictional relationship"}</small>
                </td>
                <td>
                  <button
                    className="sl-mini-action"
                    onClick={() => {
                      setEditId(r.id);
                      setFrom(r.from);
                      setTo(r.to);
                      setMaterial(r.material);
                      setConfidence(r.confidence);
                      setSource(r.source || "");
                      setNotice("Editing " + r.id);
                    }}
                  >
                    Edit relationship
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
