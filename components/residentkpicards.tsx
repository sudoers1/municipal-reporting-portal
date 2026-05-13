import { CheckCircle, Clock, Hammer } from "lucide-react";
import type { Complaint } from "@/components/wardmap";

export default function ResidentKPICards({ complaints = [] }: { complaints: Complaint[] }) {
  // Filter complaints by status
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const inProgress = complaints.filter(c => c.status === "In progress").length;
  const acknowledged = complaints.filter(c => c.status === "Acknowledged").length;

  const stats = [
      {
      label: "Acknowledged",
      value: acknowledged,
      icon: Hammer,
      color: "text-orange-600",
      bg: "bg-orange-100/30",
      border: "border-orange-200/50",
      shadow: "shadow-orange-200/50"
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100/30",
      border: "border-amber-200/50",
      shadow: "shadow-amber-200/50"
    },
      {
      label: "Resolved Cases",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100/30",
      border: "border-green-200/50",
      shadow: "shadow-green-200/50"
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {stats.map((stat, i) => (
        <article
          key={i}
          className={`bg-white/30 backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] ${stat.border} ${stat.shadow}`}
        >
          <header className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {stat.label}
            </span>
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </header>
          <section>
            <p className="text-2xl font-extrabold text-slate-900 leading-none drop-shadow-sm">
              {stat.value}
            </p>
            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tighter">
              Ward Metrics
            </p>
          </section>
        </article>
      ))}
    </section>
  );
}
