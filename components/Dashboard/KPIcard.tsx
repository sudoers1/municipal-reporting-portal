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

export default function KPICards({ data }: { data: any[] }) {
    // Logic derived from the complaints table columns
    const total = data.length;
    const resolved = data.filter(c => c.status === "Resolved").length;
    const pending = data.filter(c => c.status === "In Progress").length;
    const acknowledged = data.filter(c => c.status === "Acknowledged").length;
    const unassigned = data.filter(c => c.status === "false").length;

    const stats = [
        { label: 'Total Reports', value: total, icon: AlertCircle, color: 'text-blue-500' },
        { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-green-500' },
        { label: 'In Progress', value: pending, icon: Clock, color: 'text-amber-500' },
        { label: 'Acknowledged', value: acknowledged, icon: Hammer, color: 'text-orange-500' },
        { label: 'Unassigned', value: unassigned, icon: Droplets, color: 'text-cyan-500' },
    ];

    return (
        <section className="grid grid-cols-5 gap-4">
            
            {stats.map((stat, i) => (
                <section 
                    key={i} 
                    className="bg-white border border-slate-400 h-32 rounded-md p-4 flex flex-col justify-between shadow-sm"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-xl font-medium">{stat.label}</span>
                        <stat.icon size={16} className={stat.color} />
                    </div>
                    <div className="text-2xl font-bold text-slate-700">{stat.value}</div>
                </section>
            ))}
        </section>
    );
}