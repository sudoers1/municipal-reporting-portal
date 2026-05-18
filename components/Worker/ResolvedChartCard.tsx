"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  resolvedData: { week: string; resolved: number; avg_hours?: number | null }[];
  refreshKey: number;
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
    <output className="block bg-black/80 border border-white/20 rounded-lg p-2 text-sm text-white">
      <small className="block mb-1 text-white/70">Week of {label}</small>
      {resolved && (
        <p className="m-0">
          Resolved: <strong className="text-green-400">{resolved.value}</strong>
        </p>
      )}
      {avgHours && avgHours.value != null && (
        <p className="m-0">
          Avg resolution: <strong className="text-blue-400">{avgHours.value}h</strong>
        </p>
      )}
    </output>
  );
};

export default function ResolvedChartCard({ resolvedData }: Props) {
  const totalResolved = resolvedData.reduce((s, r) => s + r.resolved, 0);
  const overallAvgHours =
    resolvedData.length > 0
      ? Math.round(resolvedData.reduce((s, r) => s + (r.avg_hours ?? 0), 0) / resolvedData.length)
      : null;

  return (
    <article className="bg-black/50 border border-white/20 backdrop-blur-md rounded-xl p-5 text-white">
      <header className="flex items-start justify-between mb-4 gap-4">
        <h2 className="font-semibold text-lg">Resolved over time</h2>
        {resolvedData.length > 0 && (
          <aside aria-label="All-time resolved count" className="text-right">
            <strong className="block text-2xl leading-none">{totalResolved}</strong>
            <small className="text-white/70">all time</small>
          </aside>
        )}
      </header>

      {resolvedData.length === 0 ? (
        <p className="text-white/70 text-sm">No resolved complaints yet.</p>
      ) : (
        <figure aria-label="Line chart of weekly resolved complaints" className="m-0">
          <figcaption className="sr-only">
            Weekly resolved complaints over time. Total resolved: {totalResolved}.
            {overallAvgHours !== null && ` Average resolution time: ${overallAvgHours} hours.`}
          </figcaption>
          <section className="relative w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolvedData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
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
          <footer className="flex gap-5 mt-3 text-xs text-white/70">
            <p className="flex items-center gap-1 m-0">
              <svg width="20" height="4" aria-hidden="true">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#4ade80" strokeWidth="2" />
              </svg>
              Resolved per week
            </p>
            <p className="flex items-center gap-1 m-0">
              <svg width="20" height="4" aria-hidden="true">
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
