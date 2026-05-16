import {
  CheckCircle2,
  Timer,
  ClipboardList,
  TrendingUp,
  Hammer,
  CopyCheck,
} from "lucide-react";

type WorkerStatusAnalyticsProps = {
  assignments?: any[];
  duplicates?: any[];
};

export default function WorkerStatusAnalytics({
  assignments = [],
  duplicates = [],
}: WorkerStatusAnalyticsProps) {
  const statusCounts = assignments.reduce((acc, curr) => {
    const status = curr.status || "Unassigned";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = assignments.length;

  const resolved = statusCounts["Resolved"] || 0;
  const inProgress = statusCounts["In progress"] || 0;
  const acknowledged = statusCounts["Acknowledged"] || 0;
  const duplicateCount = duplicates.length;

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

        <section className="grid grid-cols-2 gap-4">
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
            Your Completed Tasks
          </p>

          <p className="text-lg font-semibold text-slate-800">
            {resolved} resolved reports
          </p>

          <p className="text-xs text-slate-500 mt-1">
            You have completed {resolutionPercentage}% of the reports shown on
            your dashboard. There are also {duplicateCount} duplicate reports
            waiting for review.
          </p>
        </section>
      </section>
    </section>
  );
}