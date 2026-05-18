"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  statusData: { status: string; count: number }[];
  refreshKey: number;
};

const STATUS_COLORS: Record<string, string> = {
  Acknowledged: "#60a5fa",
  "In progress": "#fbbf24",
  Resolved: "#4ade80",
};
const FALLBACK = "#9ca3af";

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <output className="block bg-black/80 border border-white/20 rounded-lg p-2 text-sm text-white">
      <strong>{name}</strong>: {value}
    </output>
  );
};

export default function StatusChartCard({ statusData }: Props) {
  const total = statusData.reduce((s, r) => s + r.count, 0);

  return (
    <article className="bg-black/50 border border-white/20 backdrop-blur-md rounded-xl p-5 text-white">
      <h2 className="font-semibold text-lg mb-4">Complaints by status</h2>

      {statusData.length === 0 ? (
        <p className="text-white/70 text-sm">No assignment data yet.</p>
      ) : (
        <section aria-label="Status breakdown">
          <figure
            aria-label="Donut chart of complaint statuses"
            className="relative w-full h-[200px] mb-4"
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

            <figcaption className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <strong className="text-2xl leading-none">{total}</strong>
              <small className="text-white/70">total</small>
            </figcaption>
          </figure>

          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {statusData.map((row) => {
              const color = STATUS_COLORS[row.status] ?? FALLBACK;
              const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
              return (
                <li
                  key={row.status}
                  className="flex items-center justify-between text-sm"
                >
                  <p className="flex items-center gap-2 m-0">
                    <svg width="10" height="10" aria-hidden="true">
                      <rect width="10" height="10" rx="2" fill={color} />
                    </svg>
                    {row.status}
                  </p>
                  <p className="m-0 text-white/70 font-mono">
                    {row.count} <small className="text-white/50">({pct}%)</small>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
