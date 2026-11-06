"use client";
import { useState } from "react";
import type { SupplyState } from "@/lib/supplylens-data";
import { logAction } from "@/lib/supplylens-logic";
export default function DemoSettings({
  state,
  setState,
}: {
  state: SupplyState;
  setState: (fn: (s: SupplyState) => SupplyState) => void;
}) {
  const [draft, setDraft] = useState(state.settings);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <div className="sl-heading">
        <div>
          <span className="sl-eyebrow">WORKSPACE CONFIGURATION</span>
          <h1>Settings</h1>
          <p>
            Saved in this browser only. Demo roles do not enforce permissions;
            notifications are not delivered.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.companyName.trim() || !draft.location.trim()) return;
          setState((s) =>
            logAction(
              {
                ...s,
                settings: {
                  ...draft,
                  companyName: draft.companyName.trim(),
                  location: draft.location.trim(),
                },
              },
              "Settings saved",
              "Company profile and demo preferences updated locally",
            ),
          );
          setSaved(true);
        }}
      >
        <div className="sl-settings-grid">
          <div className="sl-card">
            <h3>Company profile</h3>
            <label>
              Company name
              <input
                required
                maxLength={100}
                value={draft.companyName}
                onChange={(e) => {
                  setDraft({ ...draft, companyName: e.target.value });
                  setSaved(false);
                }}
              />
            </label>
            <label>
              Primary location
              <input
                required
                maxLength={100}
                value={draft.location}
                onChange={(e) => {
                  setDraft({ ...draft, location: e.target.value });
                  setSaved(false);
                }}
              />
            </label>
            <label>
              Demo role
              <select
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              >
                {[
                  "Procurement manager",
                  "Risk analyst",
                  "Production planner",
                  "Supplier reviewer",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="sl-card">
            <h3>Review & notification preferences</h3>
            <label>
              Verification review interval (days)
              <input
                type="number"
                required
                min={1}
                max={365}
                value={draft.verificationDays}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    verificationDays: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="sl-check">
              <input
                type="checkbox"
                checked={draft.criticalOnly}
                onChange={(e) =>
                  setDraft({ ...draft, criticalOnly: e.target.checked })
                }
              />
              Start incident view with critical severity only
            </label>
            {Object.entries(draft.notifications).map(([name, enabled]) => (
              <label className="sl-check" key={name}>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      notifications: {
                        ...draft.notifications,
                        [name]: e.target.checked,
                      },
                    })
                  }
                />
                {name}
              </label>
            ))}
            <p>
              Material categories are maintained in the shared demo catalog.
            </p>
          </div>
        </div>
        <div className="sl-form-footer">
          <button className="sl-primary" type="submit">
            Save settings
          </button>
          {saved && <span role="status">Settings saved in this browser.</span>}
        </div>
      </form>
    </>
  );
}
