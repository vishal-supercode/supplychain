"use client";
import { useState } from "react";
import type { SupplyState, Verification } from "@/lib/supplylens-data";
import { logAction } from "@/lib/supplylens-logic";
export default function VerificationWorkspace({
  state,
  setState,
}: {
  state: SupplyState;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const [supplierId, setSupplierId] = useState(state.selectedSupplier);
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [notice, setNotice] = useState("");
  const update = (id: string, value: Verification) => {
    if (
      value === "Verified" &&
      !state.evidence.some(
        (e) => e.supplierId === id && e.kind !== "Information request",
      )
    ) {
      setNotice(
        "Attach a demo evidence reference before marking this supplier verified.",
      );
      return;
    }
    setState((s) =>
      logAction(
        {
          ...s,
          suppliers: s.suppliers.map((x) =>
            x.id === id
              ? {
                  ...x,
                  verification: value,
                  lastAssessment: new Date().toISOString().slice(0, 10),
                }
              : x,
          ),
        },
        "Supplier verification updated",
        `${id} · ${value}`,
      ),
    );
    setNotice(
      "Supplier status saved. Relationship confidence is reviewed separately in the network.",
    );
  };
  const request = (id: string) => {
    setState((s) =>
      logAction(
        {
          ...s,
          evidence: [
            {
              id: `REQ-${Date.now()}-${s.evidence.length}`,
              supplierId: id,
              title:
                "Confirm site, materials, capacity and sub-tier declarations",
              kind: "Information request",
              reference: "Local demo request — not sent externally",
              date: new Date().toISOString().slice(0, 10),
            },
            ...s.evidence,
          ],
        },
        "Supplier information requested",
        `${id} · pending local follow-up`,
      ),
    );
    setNotice(
      "Information request recorded locally. No external message was sent.",
    );
  };
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">DATA CONFIDENCE</span>
          <h1>Verification & data collection</h1>
          <p>
            Review interval: {state.settings.verificationDays} days. Supplier
            identity verification never automatically confirms inferred
            relationships.
          </p>
        </div>
      </div>
      {notice && (
        <p className="sl-inline-notice" role="status">
          {notice}
        </p>
      )}
      <div className="sl-verification-grid">
        {(["Tier 1", "Tier 2", "Tier 3"] as const).map((t) => {
          const members = state.suppliers.filter((s) => s.tier === t);
          const verified = members.filter(
            (s) => s.verification === "Verified",
          ).length;
          const percentage = Math.round(
            (verified / Math.max(1, members.length)) * 100,
          );
          return (
            <div className="sl-card sl-coverage" key={t}>
              <span>{t} verified records</span>
              <strong>{percentage}%</strong>
              <small>
                {verified} of {members.length} mapped suppliers · demo
              </small>
              <div>
                <i style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="sl-card sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Supplier / site</th>
              <th>Materials & declarations</th>
              <th>Last review</th>
              <th>Supplier status</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {state.suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.name}</b>
                  <small>
                    {s.id} · {s.tier} · {s.site}
                  </small>
                </td>
                <td>
                  {s.materials.join(", ")}
                  <small>
                    {state.relationships
                      .filter((r) => r.from === s.id || r.to === s.id)
                      .map((r) => `${r.id}: ${r.confidence}`)
                      .join(" · ")}
                  </small>
                  <small>
                    {
                      state.evidence.filter(
                        (e) =>
                          e.supplierId === s.id &&
                          e.kind !== "Information request",
                      ).length
                    }{" "}
                    supporting records
                  </small>
                </td>
                <td>{s.lastAssessment}</td>
                <td>
                  <select
                    aria-label={`Verification ${s.id}`}
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
                <td>
                  <button
                    className="sl-mini-action"
                    onClick={() => request(s.id)}
                  >
                    Request information
                  </button>
                  <button
                    className="sl-mini-action"
                    onClick={() => {
                      setSupplierId(s.id);
                      document
                        .getElementById("sl-evidence-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Attach evidence
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        id="sl-evidence-form"
        className="sl-card sl-evidence-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !reference.trim()) return;
          setState((s) =>
            logAction(
              {
                ...s,
                evidence: [
                  {
                    id: `EVD-${Date.now()}-${s.evidence.length}`,
                    supplierId,
                    title: title.trim(),
                    reference: reference.trim(),
                    kind: "Demo evidence reference",
                    date: new Date().toISOString().slice(0, 10),
                  },
                  ...s.evidence,
                ],
              },
              "Evidence attached",
              `${supplierId} · ${title.trim()}`,
            ),
          );
          setTitle("");
          setReference("");
          setNotice(
            "Evidence reference attached. Review it before changing verification status.",
          );
        }}
      >
        <h3>Attach a demo evidence record</h3>
        <p>
          References and optional filenames are saved locally, not file
          contents. Use fictional evidence only.
        </p>
        <div className="sl-form-grid">
          <label>
            Evidence supplier
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {state.suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Evidence title
            <input
              required
              maxLength={160}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Evidence reference or filename
            <input
              required
              maxLength={250}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </label>
          <label>
            Optional demo attachment
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setReference(e.target.files[0].name);
                  if (!title) setTitle("Demo supporting document");
                }
              }}
            />
          </label>
        </div>
        <button className="sl-primary" type="submit">
          Attach evidence record
        </button>
      </form>
      <div className="sl-card sl-table-wrap">
        <div className="sl-card-head">
          <h3>Evidence & request history</h3>
        </div>
        <table className="sl-table">
          <thead>
            <tr>
              <th>Record</th>
              <th>Supplier</th>
              <th>Reference</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {state.evidence.map((e) => (
              <tr key={e.id}>
                <td>
                  <b>{e.title}</b>
                  <small>
                    {e.id} · {e.kind}
                  </small>
                </td>
                <td>
                  {state.suppliers.find((s) => s.id === e.supplierId)?.name}
                </td>
                <td>{e.reference}</td>
                <td>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
