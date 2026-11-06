"use client";
import { useState } from "react";
import { X } from "lucide-react";
import {
  materialCatalog,
  type Supplier,
  type Tier,
  type Verification,
} from "@/lib/supplylens-data";
export default function SupplierEditor({
  supplier,
  onClose,
  onSave,
}: {
  supplier?: Supplier;
  onClose: () => void;
  onSave: (draft: {
    name: string;
    tier: Tier;
    country: string;
    city: string;
    industry: string;
    materialId: string;
    verification: Verification;
  }) => void;
}) {
  const [name, setName] = useState(supplier?.name || "");
  const [error, setError] = useState("");
  const [tier, setTier] = useState<Tier>(supplier?.tier || "Tier 1");
  const [country, setCountry] = useState(supplier?.country || "India");
  const [city, setCity] = useState(supplier?.city || "Bengaluru");
  const [industry, setIndustry] = useState(
    supplier?.industry || "Automotive electronics",
  );
  const [materialId, setMaterialId] = useState(
    supplier?.materialIds[0] || materialCatalog[0].id,
  );
  return (
    <div className="sl-modal-backdrop">
      <form
        className="sl-modal"
        onSubmit={(e) => {
          e.preventDefault();
          if (![name, country, city, industry].every(value => value.trim())) { setError('Complete all fields with non-blank values.'); return; }
          onSave({
            name: name.trim(),
            tier,
            country: country.trim(),
            city: city.trim(),
            industry: industry.trim(),
            materialId,
            verification: supplier?.verification || "Pending Verification",
          });
        }}
      >
        <button
          type="button"
          aria-label="Close supplier form"
          className="sl-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h2>{supplier ? "Edit supplier" : "Add supplier"}</h2>
        {error && <p role="alert">{error}</p>}
        <p>New records and relationships remain pending verification.</p>
        <label>
          Company name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deccan Power Systems"
          />
        </label>
        <label>
          Supplier tier
          <select
            value={tier}
            disabled={!!supplier}
            onChange={(e) => setTier(e.target.value as Tier)}
          >
            {["Tier 1", "Tier 2", "Tier 3"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Country
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          City
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          Industry
          <input
            required
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </label>
        <label>
          Material supplied
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          >
            {materialCatalog.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <p>
          New Tier 1 links to BAS, Tier 2 to S1-01, Tier 3 to S2-01. These
          provisional links require evidence review.
        </p>
        <button className="sl-primary" type="submit">
          {supplier ? "Save supplier" : "Add supplier"}
        </button>
      </form>
    </div>
  );
}
