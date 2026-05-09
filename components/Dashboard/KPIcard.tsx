// export default function KPICards(){
//     return(
//         <section className="m-4 grid grid-cols-5 gap-4">
//             <section className="bg-slate-300 h-30 rounded-md"></section>
//             <section className="bg-slate-300 h-30 rounded-md"></section>
//             <section className="bg-slate-300 h-30 rounded-md"></section>
//             <section className="bg-slate-300 h-30 rounded-md"></section>
//             <section className="bg-slate-300 h-30 rounded-md"></section>
//         </section>
//     )
// }

import { AlertCircle, CheckCircle, Clock, Droplets, Hammer } from 'lucide-react';

export default function KPICards({ data = [] }: { data: any[] }) {
    // Logic derived from the complaints table columns
    const total = data.length;
    const resolved = data.filter(c => c.status === "Resolved").length;
    const pending = data.filter(c => c.status === "In progress").length;
    const acknowledged = data.filter(c => c.status === "Acknowledged").length;
    const unassigned = data.filter(c => c.status === "false" || !c.workerid).length;

    const stats = [
        { label: 'Total Reports', value: total, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
        { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50/50', border: 'border-green-100' },
        { label: 'In Progress', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
        { label: 'Acknowledged', value: acknowledged, icon: Hammer, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100' },
        { label: 'Unassigned', value: unassigned, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50/50', border: 'border-cyan-100' },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            {stats.map((stat, i) => (
                <section 
                    key={i} 
                    className="bg-white border border-slate-200 h-32 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {stat.label}
                        </span>
                        {/* Status icon with matching background pill */}
                        <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold text-slate-900 leading-none">
                            {stat.value}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                            Live Metrics
                        </p>
                    </div>
                </section>
            ))}
        </section>
    );
}