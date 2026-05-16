"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type StatusRow = { status: string; count: number };

type Props = {
  statusData: { status: string; count: number }[];
  refreshKey: number;
};

const STATUS_COLORS: Record<string, string> = {
  Acknowledged: "#60a5fa",
  "In progress": "#fbbf24",
  Resolved:     "#4ade80",
};
const FALLBACK = "#9ca3af";

const cardStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "1rem",
  padding: "1.25rem",
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <output
      style={{
        display: "block",
        background: "rgba(0,0,0,0.75)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "0.5rem",
        padding: "0.375rem 0.75rem",
        fontSize: "0.875rem",
        color: "#fff",
      }}
    >
      <strong>{name}</strong>: {value}
    </output>
  );
};

export default function StatusChartCard({statusData, refreshKey}: Props) {

  const total = statusData.reduce((s, r) => s + r.count, 0);

    return (
    <article style={cardStyle}>
      <h2 style={{ color: "#fff", fontWeight: 600, fontSize: "1.125rem", margin: "0 0 1rem" }}>
        Complaints by status
      </h2>

      {statusData.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", margin: 0 }}>
          No assignment data yet.
        </p>
      ) : (
        <section aria-label="Status breakdown">
          <figure
            aria-label="Donut chart of complaint statuses"
            style={{ position: "relative", width: "100%", height: 200, margin: "0 0 1rem" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={44}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {statusData.map((row) => (
                    <Cell key={row.status} fill={STATUS_COLORS[row.status] ?? FALLBACK} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <figcaption
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <strong style={{ fontSize: "1.5rem", color: "#fff", display: "block" }}>{total}</strong>
              <small style={{ color: "rgba(255,255,255,0.5)" }}>total</small>
            </figcaption>
          </figure>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {statusData.map((row) => {
              const color = STATUS_COLORS[row.status] ?? FALLBACK;
              const pct   = total > 0 ? Math.round((row.count / total) * 100) : 0;
              return (
                <li
                  key={row.status}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                  }}
                >
                  <mark
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <svg width="10" height="10" aria-hidden="true" focusable="false">
                      <rect width="10" height="10" rx="2" fill={color} />
                    </svg>
                    {row.status}
                  </mark>
                  <data
                    value={row.count}
                    style={{ color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.count} <small style={{ color: "rgba(255,255,255,0.3)" }}>({pct}%)</small>
                  </data>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
