"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SupplyState } from "@/lib/supplylens-data";
export default function RiskCharts({ state }: { state: SupplyState }) {
  const severity = ["Critical", "High", "Medium", "Low"].map((name) => ({
    name,
    Suppliers: state.suppliers.filter((s) => s.risk === name).length,
  }));
  const countries = [...new Set(state.suppliers.map((s) => s.country))].map(
    (name) => ({
      name,
      Suppliers: state.suppliers.filter((s) => s.country === name).length,
    }),
  );
  return (
    <div className="sl-grid-2">
      {[
        { title: "Supplier risk distribution", data: severity },
        { title: "Geographic concentration", data: countries },
      ].map((chart) => (
        <div className="sl-card" key={chart.title}>
          <div className="sl-card-head">
            <div>
              <h3>{chart.title}</h3>
              <p>Calculated from the current fictional supplier dataset</p>
            </div>
          </div>
          <div style={{ height: 220, minWidth: 0, padding: "0 12px 12px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data}>
                <CartesianGrid vertical={false} stroke="#edf2f5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip />
                <Bar
                  dataKey="Suppliers"
                  fill="#369faa"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
