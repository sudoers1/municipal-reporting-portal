"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type ReportData = {
  worker: {
    name: string;
    email?: string;
    municipality?: string;
  };
  statusData: { status: string; count: number }[];
  resolvedData: { week: string; resolved: number; avg_hours?: number | null }[];
  generatedAt?: Date;
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  Acknowledged: [96,  165, 250],
  "In Progress": [251, 191,  36],
  Resolved:      [74,  222, 128],
  Rejected:      [248, 113, 113],
  Pending:       [167, 139, 250],
};
const FALLBACK_COLOR: [number, number, number] = [156, 163, 175];


async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateAnalyticsReport(
  data: ReportData,
  statusChartEl: HTMLElement | null,
  resolvedChartEl: HTMLElement | null
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 16;
  const contentW = pageW - margin * 2;
  let cursor = margin;

  const generatedAt = data.generatedAt ?? new Date();
  const dateStr = generatedAt.toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = generatedAt.toLocaleTimeString("en-ZA", {
    hour: "2-digit", minute: "2-digit",
  });
  const logoBase64 = await loadImageAsBase64("/favicon.png");
  const logoH = 14;
  const logoW = 14;


  // ── Header bar ──────────────────────────────────────────────────────────
  doc.setFillColor(0, 128, 128);
  doc.rect(0, 0, pageW, 28, "F");
  doc.addImage(logoBase64, "PNG", pageW - margin - logoW, 5, logoW, logoH);
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Worker Analytics Report", margin, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated ${dateStr} at ${timeStr}`, margin, 20);

  cursor = 38;

  // ── Worker info ──────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursor, contentW, 22, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, cursor, contentW, 22, 2, 2, "S");

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("WORKER", margin + 6, cursor + 7);
  doc.text("MUNICIPALITY", margin + contentW / 2, cursor + 7);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(data.worker.name || "—", margin + 6, cursor + 14);
  doc.text(data.worker.municipality || "—", margin + contentW / 2, cursor + 14);

  if (data.worker.email) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(data.worker.email, margin + 6, cursor + 18);
  }

  cursor += 30;

  // ── Summary metrics ──────────────────────────────────────────────────────
  const total   = data.statusData.reduce((s, r) => s + r.count, 0);
  const resolved = data.statusData.find((r) => r.status === "Resolved")?.count ?? 0;
  const inProg  = data.statusData.find((r) => r.status === "In Progress")?.count ?? 0;
  const resolvePct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const metrics = [
    { label: "Total assigned", value: String(total) },
    { label: "Resolved",       value: String(resolved) },
    { label: "In progress",    value: String(inProg) },
    { label: "Resolution rate", value: `${resolvePct}%` },
  ];

  const cardW = (contentW - 9) / 4;
  metrics.forEach((m, i) => {
    const cx = margin + i * (cardW + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, cursor, cardW, 18, 2, 2, "FD");

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(m.label.toUpperCase(), cx + cardW / 2, cursor + 6, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(m.value, cx + cardW / 2, cursor + 14, { align: "center" });
  });

  cursor += 26;

  // ── Section heading helper ───────────────────────────────────────────────
  const sectionHeading = (label: string) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(label.toUpperCase(), margin, cursor + 4);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin + doc.getTextWidth(label.toUpperCase()) + 3, cursor + 2, margin + contentW, cursor + 2);
    cursor += 10;
  };

  // ── Pie chart snapshot ───────────────────────────────────────────────────
  sectionHeading("Complaints by status");

  if (statusChartEl) {
    try {
      const canvas = await html2canvas(statusChartEl, {
        scale: 2, backgroundColor: null, useCORS: true, logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgH = 55;
      const imgW = (canvas.width / canvas.height) * imgH;
      const clampedW = Math.min(imgW, contentW * 0.55);
      doc.addImage(imgData, "PNG", margin, cursor, clampedW, imgH);

      // Legend beside the chart
      const legendX = margin + clampedW + 6;
      let legendY = cursor + 6;
      data.statusData.forEach((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        const [r, g, b] = STATUS_COLORS[row.status] ?? FALLBACK_COLOR;
        doc.setFillColor(r, g, b);
        doc.roundedRect(legendX, legendY - 2.5, 3.5, 3.5, 0.5, 0.5, "F");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(row.status, legendX + 5.5, legendY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`${row.count} complaints  (${pct}%)`, legendX + 5.5, legendY + 5);

        legendY += 14;
      });

      cursor += imgH + 8;
    } catch {
      // Fallback: draw table only
    }
  }


  const colWidths = [60, 30, 30, 30];
  const headers   = ["Status", "Count", "% of total", ""];
  const rowH      = 8;
  let colX = margin + 3;
  cursor += 10;

  // ── Resolved over time ───────────────────────────────────────────────────
  if (cursor > pageH - 70) { doc.addPage(); cursor = margin; }

  sectionHeading("Resolved over time (weekly)");

  if (resolvedChartEl) {
    try {
      const canvas = await html2canvas(resolvedChartEl, {
        scale: 2, backgroundColor: null, useCORS: true, logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgH    = 55;
      const imgW    = Math.min((canvas.width / canvas.height) * imgH, contentW);
      doc.addImage(imgData, "PNG", margin, cursor, imgW, imgH);
      cursor += imgH + 8;
    } catch {
      // fallback below
    }
  }

  // Resolved table
  const rHeaders  = ["Week of", "Resolved", "Avg hours to resolve"];
  const rColW     = [60, 30, 60];

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, cursor, contentW, rowH, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  colX = margin + 3;
  rHeaders.forEach((h, i) => {
    doc.text(h, colX, cursor + 5.5);
    colX += rColW[i];
  });
  cursor += rowH;

  data.resolvedData.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...(bg as [number, number, number]));
    doc.rect(margin, cursor, contentW, rowH, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, cursor + rowH, margin + contentW, cursor + rowH);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(row.week, margin + 3, cursor + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 222, 128);
    doc.text(String(row.resolved), margin + rColW[0] + 3, cursor + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    const avgH = row.avg_hours != null ? `${row.avg_hours}h` : "—";
    doc.text(avgH, margin + rColW[0] + rColW[1] + 3, cursor + 5.5);

    cursor += rowH;
  });

  // ── Footer ───────────────────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("https://github.com/sudoers1 — © sudoers1. All rights reserved.", margin, pageH - 3.5);
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, pageH - 3.5, { align: "right" });
  }

  const fileName = `analytics-report-${data.worker.name?.toLowerCase().replace(/\s+/g, "-") ?? "worker"}-${generatedAt.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}