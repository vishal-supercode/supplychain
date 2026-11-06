"use client";
import { X } from "lucide-react";
import type { Supplier, SupplyState } from "@/lib/supplylens-data";
import { scoreFor, impactFor } from "@/lib/supplylens-logic";
export default function SupplierProfile({
  supplier,
  state,
  onClose,
  onEdit,
}: {
  supplier?: Supplier;
  state: SupplyState;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  if (!supplier) return null;
  const score = scoreFor(state, supplier);
  const impact = impactFor(state, supplier.id);
  const relationships = state.relationships.filter(
    (r) => r.from === supplier.id || r.to === supplier.id,
  );
  return (
    <div className="sl-modal-backdrop">
      <section
        className="sl-modal sl-incident-dialog"
        role="dialog"
        aria-label="Supplier profile"
      >
        <button
          aria-label="Close supplier profile"
          className="sl-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <span className="sl-eyebrow">
          {supplier.id} · {supplier.tier}
        </span>
        <h2>{supplier.name}</h2>
        <p>
          {supplier.city}, {supplier.country} · {supplier.verification}
        </p>
        <div className="sl-trace-list">
          <div>
            <span>Active incidents</span>
            <b>
              {
                state.incidents.filter(
                  (i) =>
                    i.supplierId === supplier.id && i.status !== "Resolved",
                ).length
              }
            </b>
          </div>
          <div>
            <span>Dependent suppliers / components</span>
            <b>
              {impact.supplierIds.length - 1} / {impact.components.length}
            </b>
          </div>
          <div>
            <span>Direct customers</span>
            <b>
              {relationships
                .filter((r) => r.from === supplier.id)
                .map((r) =>
                  r.to === "BAS"
                    ? "Bharat Automotive Systems"
                    : state.suppliers.find((s) => s.id === r.to)?.name || r.to,
                )
                .join(", ") || "None mapped"}
            </b>
          </div>
          <div>
            <span>Upstream suppliers</span>
            <b>
              {relationships
                .filter((r) => r.to === supplier.id)
                .map(
                  (r) =>
                    state.suppliers.find((s) => s.id === r.from)?.name ||
                    r.from,
                )
                .join(", ") || "None mapped"}
            </b>
          </div>
          <div>
            <span>Materials</span>
            <b>{supplier.materials.join(", ")}</b>
          </div>
          <div>
            <span>Site</span>
            <b>{supplier.site}</b>
          </div>
          <div>
            <span>Last assessment</span>
            <b>{supplier.lastAssessment}</b>
          </div>
          <div>
            <span>Risk score</span>
            <b>
              {score.total}/100 · {score.severity}
            </b>
          </div>
          {score.factors.map((f) => (
            <div key={f.label}>
              <span>{f.label}</span>
              <b>
                {f.value}/{f.max}
              </b>
            </div>
          ))}
        </div>
        <p>
          Illustrative rule-based score, not failure probability. Geography is a
          sample concentration factor, not an assessed country risk.
        </p>
        <h3>Mapped relationships</h3>
        {relationships.map((r) => (
          <p key={r.id}>
            {r.from} → {r.to} · {r.confidence} · {r.material}
          </p>
        ))}
        <button
          className="sl-primary"
          onClick={() => {
            onClose();
            onEdit(supplier.id);
          }}
        >
          Edit supplier
        </button>
      </section>
    </div>
  );
}
