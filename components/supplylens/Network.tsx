"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type SupplyState } from "@/lib/supplylens-data";
import { traverse } from "@/lib/supplylens-logic";
export default function Network({
  state,
  ids,
  onSelect,
}: {
  state: SupplyState;
  ids: string[];
  onSelect: (id: string) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const svg = d3.select(element);
    svg.selectAll("*").remove();
    const root = svg.append("g");
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on("zoom", (e) => root.attr("transform", e.transform));
    svg.call(zoom);
    const suppliers = state.suppliers.filter((s) => ids.includes(s.id));
    const nodes = [
      {
        id: "BAS",
        name: "Bharat Automotive Systems",
        tier: "Manufacturer",
        verification: "Verified",
        x: 90,
        y: 350,
      },
      ...suppliers.map((s) => ({
        ...s,
        x: 310 + (Number(s.tier.slice(-1)) - 1) * 245,
        y:
          55 +
          state.suppliers
            .filter((n) => n.tier === s.tier)
            .findIndex((n) => n.id === s.id) *
            61,
      })),
    ];
    const connected = new Set([
      state.selectedSupplier,
      ...traverse(state, state.selectedSupplier, "upstream"),
      ...traverse(state, state.selectedSupplier, "downstream"),
    ]);
    const edges = state.relationships.filter(
      (e) =>
        nodes.some((n) => n.id === e.from) && nodes.some((n) => n.id === e.to),
    );
    const lines = root
      .selectAll("path")
      .data(edges)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (e) =>
        connected.has(e.from) && connected.has(e.to)
          ? state.scenarioActive
            ? "#e57464"
            : "#259dba"
          : "#cfdae6",
      )
      .attr("stroke-width", (e) =>
        connected.has(e.from) && connected.has(e.to) ? 2.5 : 1,
      )
      .attr("stroke-dasharray", (e) =>
        e.confidence === "Inferred"
          ? "3 5"
          : e.confidence !== "Verified"
            ? "8 4"
            : "",
      );
    lines
      .append("title")
      .text(
        (e) =>
          `${e.from} → ${e.to} · ${e.confidence} · ${e.material} · ${e.updated}`,
      );
    function redraw() {
      lines.attr("d", (e) => {
        const a = nodes.find((n) => n.id === e.from)!;
        const b = nodes.find((n) => n.id === e.to)!;
        return `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`;
      });
    }
    const groups = root
      .selectAll<SVGGElement, (typeof nodes)[number]>("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", (n) => `translate(${n.x},${n.y})`)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (n) => n.name)
      .on("click", (_, n) => {
        if (n.id !== "BAS") onSelect(n.id);
      })
      .on("keydown", (e, n) => {
        if (e.key === "Enter" && n.id !== "BAS") onSelect(n.id);
      });
    groups
      .append("rect")
      .attr("x", -90)
      .attr("y", -22)
      .attr("width", 180)
      .attr("height", 44)
      .attr("rx", 7)
      .attr("fill", (n) =>
        n.id === state.selectedSupplier ? "#e9f5fa" : "white",
      )
      .attr("stroke", (n) =>
        n.id === state.selectedSupplier && state.scenarioActive
          ? "#e35d56"
          : n.tier === "Tier 1"
            ? "#4b85d7"
            : n.tier === "Tier 2"
              ? "#299b98"
              : n.tier === "Tier 3"
                ? "#9980c9"
                : "#344c69",
      )
      .attr("stroke-width", (n) => (n.id === state.selectedSupplier ? 3 : 1.5))
      .attr("stroke-dasharray", (n) =>
        n.verification !== "Verified" ? "5 3" : "",
      );
    groups
      .append("text")
      .attr("x", -80)
      .attr("y", -3)
      .attr("font-size", 9)
      .attr("fill", "#203650")
      .text((n) => (n.name.length > 29 ? n.name.slice(0, 27) + "…" : n.name));
    groups
      .append("text")
      .attr("x", -80)
      .attr("y", 12)
      .attr("font-size", 8)
      .attr("fill", "#718298")
      .text((n) => `${n.id} · ${n.tier}`);
    groups
      .filter(
        (n) => "risk" in n && (n.risk === "High" || n.risk === "Critical"),
      )
      .append("circle")
      .attr("cx", 80)
      .attr("cy", 12)
      .attr("r", 3)
      .attr("fill", "#e56358");
    groups.call(
      d3
        .drag<SVGGElement, (typeof nodes)[number]>()
        .on("start", (e) => e.sourceEvent.stopPropagation())
        .on("drag", function (e, n) {
          n.x = e.x;
          n.y = e.y;
          d3.select(this).attr("transform", `translate(${n.x},${n.y})`);
          redraw();
        }),
    );
    redraw();
    const controls = svg.append("g").attr("transform", "translate(22,20)");
    [1.25, 0.8, 0].forEach((factor, i) => {
      const b = controls
        .append("g")
        .attr("transform", `translate(${i * 40},0)`)
        .attr("role", "button")
        .attr("tabindex", 0)
        .attr("aria-label", ["Zoom in", "Zoom out", "Reset view"][i]);
      b.append("rect")
        .attr("width", 32)
        .attr("height", 28)
        .attr("rx", 5)
        .attr("fill", "white")
        .attr("stroke", "#dce5ed");
      b.append("text")
        .attr("x", 16)
        .attr("y", 19)
        .attr("text-anchor", "middle")
        .attr("fill", "#33506b")
        .text(["+", "−", "↺"][i]);
      const action = () =>
        factor
          ? svg.call(zoom.scaleBy, factor)
          : svg.call(zoom.transform, d3.zoomIdentity);
      b.on("click", action).on("keydown", (e) => {
        if (e.key === "Enter") action();
      });
    });
    return () => {
      svg.on(".zoom", null);
    };
  }, [state, ids, onSelect]);
  return (
    <div className="sl-network">
      <svg
        ref={ref}
        viewBox="0 0 1040 800"
        aria-label="Interactive supplier dependency network"
      />
      <div className="sl-network-legend">
        Blue: Tier 1 · Teal: Tier 2 · Purple: Tier 3 · Red dot: high risk
        <br />
        Solid: verified · Long dash: declared / pending / outdated · Dotted:
        inferred
        <br />
        Drag nodes · Scroll to zoom · Drag background to pan
      </div>
    </div>
  );
}
