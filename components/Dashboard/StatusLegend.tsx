import { CheckCircle2, Timer, ClipboardList, TrendingUp } from "lucide-react";

export default function StatusAnalytics({ assignments = [] }: { assignments: any[] }) {
  const statusCounts = assignments.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workerStats = assignments.reduce((acc, curr) => {
    if (curr.status === "Resolved" && curr.worker_name) {
      acc[curr.worker_name] = (acc[curr.worker_name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topWorkerName = Object.keys(workerStats).reduce(
    (a, b) => (workerStats[a] > workerStats[b] ? a : b),
    "No resolved tasks"
  );

  const total = assignments.length || 1;

  return (
    <article className="dashboard-card text-white">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={24} />
          Operational Insights
        </h2>
      </header>

      <section className="grid grid-cols-1 gap-6">
        {/* Progress Visualizer */}
        <section className="space-y-3">
          <header className="flex justify-between text-sm font-medium">
            <p className="text-white/70">Resolution Progress</p>
            <p className="text-white">
              {Math.round(((statusCounts["Resolved"] || 0) / total) * 100)}%
            </p>
          </header>
          <section className="w-full bg-white/10 rounded-full h-3 overflow-hidden flex">
            <section
              className="bg-green-500 h-full transition-all"
              style={{ width: `${((statusCounts["Resolved"] || 0) / total) * 100}%` }}
            />
            <section
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${((statusCounts["In progress"] || 0) / total) * 100}%` }}
            />
          </section>
        </section>

        {/* Performance Highlights */}
        <section className="grid grid-cols-2 gap-4">
          <article className="p-4 rounded-lg bg-black/20 border border-white/10">
            <header className="flex items-center gap-2 text-white/70 mb-1">
              <CheckCircle2 size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Resolved</p>
            </header>
            <p className="text-2xl font-bold">{statusCounts["Resolved"] || 0}</p>
          </article>

          <article className="p-4 rounded-lg bg-black/20 border border-white/10">
            <header className="flex items-center gap-2 text-white/70 mb-1">
              <Timer size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Active</p>
            </header>
            <p className="text-2xl font-bold">{statusCounts["In progress"] || 0}</p>
          </article>
        </section>

        {/* Most Efficient Worker */}
        <footer className="mt-2 p-4 bg-blue-400/20 rounded-lg border border-blue-400/30">
          <p className="text-xs font-bold text-blue-300 uppercase mb-2 flex items-center gap-2">
            <ClipboardList size={14} />
            Highest Resolution Rate
          </p>
          <p className="text-lg font-semibold">{topWorkerName}</p>
          <p className="text-xs text-white/70 mt-1">
            Completed {workerStats[topWorkerName] || 0} tasks this period
          </p>
        </footer>
      </section>
    </article>
  );
}
