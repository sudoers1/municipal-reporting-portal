import { CheckCircle2, Timer, ClipboardList, TrendingUp } from "lucide-react";

export default function StatusAnalytics({ assignments = [] }: { assignments: any[] }) {
    // 1. Calculate Status Totals
    const statusCounts = assignments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Identify Top Worker Name (Efficiency)
    // We group by worker_name which we now have from the SQL Join
    const workerStats = assignments.reduce((acc, curr) => {
        if (curr.status === "Resolved" && curr.worker_name) {
            acc[curr.worker_name] = (acc[curr.worker_name] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topWorkerName = Object.keys(workerStats).reduce((a, b) => 
        workerStats[a] > workerStats[b] ? a : b, "No resolved tasks"
    );

    const total = assignments.length || 1; // Prevent sectionision by zero

    return (
        <section className="h-full p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <section className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={24} />
                    Operational Insights
                </h2>
            </section>

            <section className="grid grid-cols-1 gap-6">
                {/* Progress Visualizer */}
                <section className="space-y-3">
                    <section className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Resolution Progress</span>
                        <span className="text-slate-900">
                            {Math.round(((statusCounts["Resolved"] || 0) / total) * 100)}%
                        </span>
                    </section>
                    <section className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
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
                    <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <section className="flex items-center gap-2 text-slate-500 mb-1">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-semibold uppercase tracking-tight">Resolved</span>
                        </section>
                        <p className="text-2xl font-bold text-slate-800">{statusCounts["Resolved"] || 0}</p>
                    </section>

                    <section className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <section className="flex items-center gap-2 text-slate-500 mb-1">
                            <Timer size={16} />
                            <span className="text-xs font-semibold uppercase tracking-tight">Active</span>
                        </section>
                        <p className="text-2xl font-bold text-slate-800">{statusCounts["In progress"] || 0}</p>
                    </section>
                </section>

                {/* Most Efficient Worker (Using Joined Name) */}
                <section className="mt-2 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
                        <ClipboardList size={14} />
                        Highest Resolution Rate
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                        {topWorkerName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Completed {workerStats[topWorkerName] || 0} tasks this period
                    </p>
                </section>
            </section>
        </section>
    );
}