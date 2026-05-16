"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ResolvedRow = {
  week: string;
  resolved: number;
  avg_hours: number | null;
};

type Props = {
  resolvedData: { week: string; resolved: number; avg_hours?: number | null }[];
  refreshKey: number;
};

const cardStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "1rem",
  padding: "1.25rem",
};

function formatWeek(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

const LineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const resolved = payload.find((p: any) => p.dataKey === "resolved");
  const avgHours = payload.find((p: any) => p.dataKey === "avg_hours");
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
      <small style={{ color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "0.25rem" }}>
        Week of {label}
      </small>
      {resolved && (
        <p style={{ margin: "0 0 0.125rem" }}>
          Resolved: <strong style={{ color: "#4ade80" }}>{resolved.value}</strong>
        </p>
      )}
      {avgHours && avgHours.value != null && (
        <p style={{ margin: 0 }}>
          Avg resolution: <strong style={{ color: "#60a5fa" }}>{avgHours.value}h</strong>
        </p>
      )}
    </output>
  );
};

export default function ResolvedChartCard({ resolvedData, refreshKey }: Props) {

  const totalResolved = resolvedData.reduce((s, r) => s + r.resolved, 0);
  const overallAvgHours =
  resolvedData.length > 0
    ? Math.round(resolvedData.reduce((s, r) => s + (r.avg_hours ?? 0), 0) / resolvedData.length)
    : null;
  return (
    <article style={cardStyle}>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "1rem",
        }}
      >
        <h2 style={{ color: "#fff", fontWeight: 600, fontSize: "1.125rem", margin: 0 }}>
          Resolved over time
        </h2>
        {resolvedData.length > 0 && (
          <aside aria-label="All-time resolved count" style={{ textAlign: "right" }}>
            <strong style={{ fontSize: "1.5rem", color: "#fff", display: "block", lineHeight: 1 }}>
              {totalResolved}
            </strong>
            <small style={{ color: "rgba(255,255,255,0.4)" }}>all time</small>
          </aside>
        )}
      </header>

      {resolvedData.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", margin: 0 }}>
          No resolved complaints yet.
        </p>
      ) : (
        <figure aria-label="Line chart of weekly resolved complaints" style={{ margin: 0 }}>
          <figcaption className="sr-only">
            Weekly resolved complaints over time. Total resolved: {totalResolved}.
            {overallAvgHours !== null && ` Average resolution time: ${overallAvgHours} hours.`}
          </figcaption>
          <section style={{ position: "relative", width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolvedData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.07)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4ade80", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#4ade80" }}
                />
                <Line
                  type="monotone"
                  dataKey="avg_hours"
                  name="Avg hours"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#60a5fa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
          <footer
            style={{
              display: "flex",
              gap: "1.25rem",
              marginTop: "0.75rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <p style={{ display: "flex", alignItems: "center", gap: "0.375rem", margin: 0 }}>
              <svg width="20" height="4" aria-hidden="true" focusable="false">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#4ade80" strokeWidth="2" />
              </svg>
              Resolved per week
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "0.375rem", margin: 0 }}>
              <svg width="20" height="4" aria-hidden="true" focusable="false">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 3" />
              </svg>
              Avg resolution (hours)
            </p>
          </footer>
        </figure>
      )}
    </article>
  );

}