import {
  AlertCircle,
  CheckCircle,
  Clock,
  Droplets,
  Hammer,
} from "lucide-react";

export default function KPICards({ data = [] }: { data: any[] }) {
  const total = data.length;
  const resolved = data.filter((c) => c.status === "Resolved").length;
  const pending = data.filter((c) => c.status === "In progress").length;
  const acknowledged = data.filter((c) => c.status === "Acknowledged").length;
  const unassigned = data.filter((c) => c.status === "false" || !c.workerid).length;

  const stats = [
    {
      label: "Total Reports",
      value: total,
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-100/30",
      border: "border-blue-200/50",
      shadow: "shadow-blue-200/50",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100/30",
      border: "border-green-200/50",
      shadow: "shadow-green-200/50",
    },
    {
      label: "In Progress",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100/30",
      border: "border-amber-200/50",
      shadow: "shadow-amber-200/50",
    },
    {
      label: "Acknowledged",
      value: acknowledged,
      icon: Hammer,
      color: "text-orange-600",
      bg: "bg-orange-100/30",
      border: "border-orange-200/50",
      shadow: "shadow-orange-200/50",
    },
    {
      label: "Unassigned",
      value: unassigned,
      icon: Droplets,
      color: "text-cyan-600",
      bg: "bg-cyan-100/30",
      border: "border-cyan-200/50",
      shadow: "shadow-cyan-200/50",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
      {stats.map((stat, i) => (
        <article
          key={i}
          className={`backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between transition-all transform bg-white/30 hover:scale-[1.02] ${stat.border} ${stat.shadow}`}
        >
          <header className="flex justify-between items-start">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {stat.label}
            </p>
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </header>
          <section>
            <p className="text-2xl font-extrabold text-slate-900 leading-none drop-shadow-sm">
              {stat.value}
            </p>
            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tighter">
              Live Metrics
            </p>
          </section>
        </article>
      ))}
    </section>
  );
}
