"use client";

import { useState } from "react";
import { generateAnalyticsReport, ReportData } from "@/lib/generateAnalyticsReport";

type Props = {
  worker: {
    name: string;
    email?: string;
    municipality?: string;
  };
  statusData: { status: string; count: number }[];
  resolvedData: { week: string; resolved: number; avg_hours?: number | null }[];
  statusChartRef: React.RefObject<HTMLElement | null>;
  resolvedChartRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function ExportReportButton({
  worker,
  statusData,
  resolvedData,
  statusChartRef,
  resolvedChartRef,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const data: ReportData = {
        worker,
        statusData,
        resolvedData,
        generatedAt: new Date(),
      };
      await generateAnalyticsReport(
        data,
        statusChartRef.current ?? null,
        resolvedChartRef.current ?? null
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg border border-black/20 px-4 py-2 text-sm font-medium text-black transition 
        ${loading ? "bg-black/10 cursor-not-allowed" : "bg-black/20 hover:bg-black/30"} 
        ${className ?? ""}`}
      aria-label="Export analytics report as PDF"
    >
      {loading ? (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className="animate-spin"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 15V3m0 12-4-4m4 4 4-4" />
            <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
          </svg>
          Export PDF report
        </>
      )}
    </button>
  );
}
