"use client";

import { useRef, useState } from "react";
import { generateAnalyticsReport, ReportData } from "@/lib/generateAnalyticsReport";

type Props = {
  worker: {
    name: string;
    email?: string;
    municipality?: string;
  };
  statusData:  { status: string; count: number }[];
  resolvedData: { week: string; resolved: number; avg_hours?: number | null }[];
  statusChartRef:  React.RefObject<HTMLElement | null>;
  resolvedChartRef: React.RefObject<HTMLElement | null>;
};

export default function ExportReportButton({
  worker,
  statusData,
  resolvedData,
  statusChartRef,
  resolvedChartRef,
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: loading ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "0.5rem",
        color: "#fff",
        fontSize: "0.875rem",
        fontWeight: 500,
        padding: "0.5rem 1rem",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
      aria-label="Export analytics report as PDF"
    >
      {loading ? (
        <>
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            style={{ animation: "spin 0.8s linear infinite" }}
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg
            width="14" height="14"
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}