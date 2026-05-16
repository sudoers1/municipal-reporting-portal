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

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs < 0) return null;

  return Math.round(diffMs / 60000);
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return "N/A";

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
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

  const resolvedAssignments = assignments.filter((item) => {
    const status = getStatus(item);
    return status === "Resolved" && item.assigned_at && item.resolved_at;
  });

  const resolutionTimes = resolvedAssignments
    .map((item) => getMinutesBetween(item.assigned_at, item.resolved_at))
    .filter((minutes): minutes is number => minutes !== null);

  const averageResolveMinutes =
    resolutionTimes.length > 0
      ? Math.round(
          resolutionTimes.reduce((sum, minutes) => sum + minutes, 0) /
            resolutionTimes.length
        )
      : null;

  const fastestResolveMinutes =
    resolutionTimes.length > 0 ? Math.min(...resolutionTimes) : null;

  const resolutionPercentage =
    total > 0 ? Math.round((resolved / total) * 100) : 0;

  const activePercentage = total > 0 ? (inProgress / total) * 100 : 0;
  const resolvedPercentage = total > 0 ? (resolved / total) * 100 : 0;

  return (
    <section className="h-full p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <section className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          Your Progress
        </h2>
      </section>

      <section className="grid grid-cols-1 gap-6">
        <section className="space-y-3">
          <section className="flex justify-between text-sm font-medium">
            <span className="text-slate-500">Resolution Progress</span>
            <span className="text-slate-900">{resolutionPercentage}%</span>
          </section>

          <section className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
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

        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Resolved
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">{resolved}</p>
          </section>

          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <Timer size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Active
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">{inProgress}</p>
          </section>

          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <Hammer size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Acknowledged
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">{acknowledged}</p>
          </section>

          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <Gauge size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Avg Resolve
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">
              {formatDuration(averageResolveMinutes)}
            </p>
          </section>

          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <Timer size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Fastest
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">
              {formatDuration(fastestResolveMinutes)}
            </p>
          </section>

          <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <section className="flex items-center gap-2 text-slate-500 mb-1">
              <CopyCheck size={16} />
              <span className="text-xs font-semibold uppercase tracking-tight">
                Duplicates
              </span>
            </section>
            <p className="text-2xl font-bold text-slate-800">{duplicateCount}</p>
          </section>
        </section>

        <section className="mt-2 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
            <ClipboardList size={14} />
            Worker Summary
          </p>

          <p className="text-lg font-semibold text-slate-800">
            {resolved} resolved reports
          </p>

          <p className="text-xs text-slate-500 mt-1">
            You have resolved {resolutionPercentage}% of your assigned reports.
            Average resolution time is {formatDuration(averageResolveMinutes)}.
          </p>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <ListTodo size={12} />
            {availableTaskCount} unassigned reports and {duplicateCount} duplicate
            reviews are currently available.
          </p>
        </section>
      </section>
    </section>
  );
}