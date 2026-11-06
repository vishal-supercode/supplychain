"use client";
import { useEffect, useRef } from "react";
import type { Supplier } from "@/lib/supplylens-data";
import "leaflet/dist/leaflet.css";
export default function RiskMap({
  suppliers,
  onSelect,
}: {
  suppliers: Supplier[];
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;
    import("leaflet").then((L) => {
      if (disposed || !ref.current) return;
      map = L.map(ref.current).setView([25, 95], 3);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      const markers = L.featureGroup();
      suppliers.forEach((s) => {
        const marker = L.circleMarker([s.latitude, s.longitude], {
          radius: 8,
          color: "white",
          weight: 2,
          fillColor: {
            Critical: "#d84f56",
            High: "#e5943d",
            Medium: "#d3b448",
            Low: "#289982",
          }[s.risk],
          fillOpacity: 0.9,
        }).addTo(markers);
        const content = document.createElement("div");
        content.textContent = `${s.name} · ${s.tier} · ${s.city} · ${s.risk} (demo)`;
        marker.bindTooltip(content);
        marker.on("click", () => onSelect(s.id));
      });
      markers.addTo(map!);
      if (suppliers.length > 0)
        map.fitBounds(markers.getBounds().pad(0.12), { maxZoom: 5 });
    });
    return () => {
      disposed = true;
      map?.remove();
    };
  }, [suppliers, onSelect]);
  return (
    <div ref={ref} className="sl-map" aria-label="Supplier locations map" />
  );
}
