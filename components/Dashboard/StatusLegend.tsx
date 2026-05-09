import { CheckCircle2, Timer, ClipboardList, TrendingUp } from "lucide-react";

export default function StatusAnalytics({ assignments = [] }: { assignments: any[] }) {
    // 1. Calculate Status Totals
    const statusCounts = assignments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Identify Top Worker (Efficiency)
    const workerStats = assignments.reduce((acc, curr) => {
        if (curr.status === "Resolved") {
            acc[curr.workerid] = (acc[curr.workerid] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topWorkerId = Object.keys(workerStats).reduce((a, b) => 
        workerStats[a] > workerStats[b] ? a : b, "N/A"
    );

    return (
        <section className="text-black h-full p-6 rounded-xl border border-slate-900 bg-white shadow-sm">
            <section className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={24} />
                    Worker Performance Insights
                </h2>
                <section className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Live Data
                </section>
            </section>

            <section className="grid grid-cols-1 gap-6">
                {/* Status Progress Bar */}
                <section className="space-y-3">
                    <section className="flex justify-between text-sm font-medium">
                        <section className="">Task Completion Rate</section>
                        <section className="">
                            {Math.round((statusCounts["Resolved"] / assignments.length) * 100) || 0}%
                        </section>
                    </section>
                    <section className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                        <section 
                            className="bg-green-500 h-full transition-all duration-500" 
                            style={{ width: `${(statusCounts["Resolved"] / assignments.length) * 100}%` }}
                        />
                        <section 
                            className="bg-amber-400 h-full transition-all duration-500" 
                            style={{ width: `${(statusCounts["In progress"] / assignments.length) * 100}%` }}
                        />
                    </section>
                </section>

                {/* Metric Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <section className="p-4 rounded-lg bg-slate-300/60 border border-slate-100">
                        <section className="flex items-center gap-2  mb-1">
                            <CheckCircle2 size={16} />
                            <section className="text-xs font-semibold uppercase">Resolved</section>
                        </section>
                        <p className="text-2xl font-bold ">{statusCounts["Resolved"] || 0}</p>
                    </section>

                    <section className="p-4 rounded-lg bg-slate-300/60 border border-slate-100">
                        <section className="flex items-center gap-2 mb-1">
                            <Timer size={16} />
                            <section className="text-xs font-semibold uppercase">In Progress</section>
                        </section>
                        <p className="text-2xl font-bold ">{statusCounts["In progress"] || 0}</p>
                    </section>
                </section>

                {/* Top Performer Tag */}
                <section className="mt-4 p-4 border-t border-slate-100 italic">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                        <ClipboardList size={16} className="text-blue-500" />
                        Most Efficient Worker: 
                        <section className="font-mono text-xs font-bold text-slate-900 truncate max-w-[150px]">
                            {topWorkerId}
                        </section>
                    </p>
                </section>
            </section>
        </section>
    );
}