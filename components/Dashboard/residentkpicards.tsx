import { CheckCircle, Clock, Hammer } from "lucide-react";
import type { Complaint } from "@/components/wardmap/wardmap";

export default function ResidentKPICards({
  complaints = [],
  activeFilter = null,
  onToggleFilter,
}: {
  complaints: Complaint[];
  activeFilter?: string | null;
  onToggleFilter?: (status: string | null) => void;
}) {
  // Filter complaints by status
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const inProgress = complaints.filter((c) => c.status === "In progress").length;
  const acknowledged = complaints.filter((c) => c.status === "Acknowledged").length;

  const stats = [
    {
      label: "Acknowledged",
      value: acknowledged,
      icon: Hammer,
      color: "text-yellow-600",
      bg: "bg-yellow-100/30",
      border: "border-yellow-200/50",
      shadow: "shadow-yellow-200/50",
    },
    {
      label: "In progress",
      value: inProgress,
      icon: Clock,
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
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {stats.map((stat, i) => {
        const isActive = activeFilter === stat.label;
        return (
          <article
            role="button"
            tabIndex={0}
            key={i}
            onClick={() => onToggleFilter?.(isActive ? null : stat.label)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onToggleFilter?.(isActive ? null : stat.label);
            }}
            className={`backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between transition-all transform ${
              isActive
                ? "bg-teal-100/40 border-teal-400 shadow-teal-200/60 scale-[1.02]"
                : "bg-white/30 hover:scale-[1.02]"
            } ${isActive ? "" : `${stat.border} ${stat.shadow}`}`}
            aria-pressed={isActive}
          >
            <header className="flex justify-between items-start">
              <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-teal-900" : "text-slate-700"}`}>
                {stat.label}
              </span>
              <section className={`p-1.5 rounded-lg ${isActive ? "bg-teal-200/70 text-teal-700" : `${stat.bg} ${stat.color}`}`}>
                <stat.icon size={18} />
              </section>
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
        );
      })}
    </section>
  );
}
