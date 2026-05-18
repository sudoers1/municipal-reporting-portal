import {
  CheckCircle2,
  Timer,
  ClipboardList,
  TrendingUp,
  Hammer,
  CopyCheck,
  Gauge,
  ListTodo,
} from "lucide-react";

type WorkerStatusAnalyticsProps = {
  assignments?: any[];
  duplicates?: any[];
  availableTasks?: any[];
};

function getStatus(item: any) {
  return item.assignment_status || item.status || "Unassigned";
}

function getMinutesBetween(start?: string | Date | null, end?: string | Date | null) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) return null;
  return Math.round(diffMs / 60000);
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
}

export default function WorkerStatusAnalytics({
  assignments = [],
  duplicates = [],
  availableTasks = [],
}: WorkerStatusAnalyticsProps) {
  const statusCounts = assignments.reduce((acc, curr) => {
    const status = getStatus(curr);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = assignments.length;
  const resolved = statusCounts["Resolved"] || 0;
  const inProgress = statusCounts["In progress"] || 0;
  const acknowledged = statusCounts["Acknowledged"] || 0;
  const duplicateCount = duplicates.length;
  const availableTaskCount = availableTasks.length;

  const resolvedAssignments = assignments.filter(
    (item) => getStatus(item) === "Resolved" && item.assigned_at && item.resolved_at
  );

  const resolutionTimes = resolvedAssignments
    .map((item) => getMinutesBetween(item.assigned_at, item.resolved_at))
    .filter((minutes): minutes is number => minutes !== null);

  const averageResolveMinutes =
    resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((sum, minutes) => sum + minutes, 0) / resolutionTimes.length)
      : null;

  const fastestResolveMinutes = resolutionTimes.length > 0 ? Math.min(...resolutionTimes) : null;
  const resolutionPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const activePercentage = total > 0 ? (inProgress / total) * 100 : 0;
  const resolvedPercentage = total > 0 ? (resolved / total) * 100 : 0;

  

  return (
    <article className="dashboard-card text-slate-900">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          Your Progress
        </h2>
      </header>

      <section className="grid grid-cols-1 gap-6">
        {/* Progress Visualizer */}
        <section className="space-y-3">
          <header className="flex justify-between text-sm font-medium">
            <p className="text-slate-600">Resolution Progress</p>
            <p className="text-slate-900">{resolutionPercentage}%</p>
          </header>

          <section className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
            <section
              className="bg-green-500 h-full transition-all"
              style={{ width: `${resolvedPercentage}%` }}
            />
            <section
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${activePercentage}%` }}
            />
          </section>
        </section>

        {/* Status Tiles */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <CheckCircle2 size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Resolved</p>
            </header>
            <p className="text-2xl font-bold">{resolved}</p>
          </article>

          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <Timer size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Active</p>
            </header>
            <p className="text-2xl font-bold">{inProgress}</p>
          </article>

          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <Hammer size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Acknowledged</p>
            </header>
            <p className="text-2xl font-bold">{acknowledged}</p>
          </article>

          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <Gauge size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Avg Resolve</p>
            </header>
            <p className="text-2xl font-bold">{formatDuration(averageResolveMinutes)}</p>
          </article>

          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <Timer size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Fastest</p>
            </header>
            <p className="text-2xl font-bold">{formatDuration(fastestResolveMinutes)}</p>
          </article>

          <article className="p-4 rounded-lg bg-white/40 border border-slate-200 backdrop-blur-sm">
            <header className="flex items-center gap-2 text-slate-600 mb-1">
              <CopyCheck size={16} />
              <p className="text-xs font-semibold uppercase tracking-tight">Duplicates</p>
            </header>
            <p className="text-2xl font-bold">{duplicateCount}</p>
          </article>
        </section>

        {/* Summary */}
        <footer className="mt-2 p-4 bg-blue-100/50 rounded-lg border border-blue-200 backdrop-blur-sm">
          <p className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
            <ClipboardList size={14} />
            Worker Summary
          </p>
          <p className="text-lg font-semibold">{resolved} resolved reports</p>
          <p className="text-xs text-slate-600 mt-1">
            You have resolved {resolutionPercentage}% of your assigned reports.
            Average resolution time is {formatDuration(averageResolveMinutes)}.
          </p>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <ListTodo size={12} />
            {availableTaskCount} unassigned reports and {duplicateCount} duplicate reviews are currently available.
          </p>
        </footer>
      </section>
    </article>
  );
}
