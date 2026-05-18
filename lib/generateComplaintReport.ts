"use client";

import jsPDF from "jspdf";

export type ComplaintReportData = {
  complaintid: number;
  municipality: string;
  status: string;
  issuetype: string;
  details: string;
  creationtime: string;
  address?: string;
  image?: string;
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  Acknowledged: [96, 165, 250],
  "In Progress": [251, 191, 36],
  Resolved: [74, 222, 128],
  Rejected: [248, 113, 113],
  Pending: [167, 139, 250],
  Duplicate: [203, 213, 225],
};
const FALLBACK_COLOR: [number, number, number] = [156, 163, 175];

/* istanbul ignore next */
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

export async function generateComplaintReport(complaint: ComplaintReportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 16;
  const contentW = pageW - margin * 2;
  const col1 = margin + 6;
  const col2 = margin + contentW / 2 + 3;
  const colW = contentW / 2 - 12; // max width per column for wrapping
  let cursor = margin;

  const generatedAt = new Date();
  const dateStr = generatedAt.toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = generatedAt.toLocaleTimeString("en-ZA", {
    hour: "2-digit", minute: "2-digit",
  });

  // ── Logo ──────────────────────────────────────────────────────────────────
  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64("/favicon.png");
  } catch {
    // skip if unavailable
  }

  // ── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(0, 128, 128);
  doc.rect(0, 0, pageW, 28, "F");

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", pageW - margin - 14, 5, 14, 14);
  }

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Complaint Report", margin, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated ${dateStr} at ${timeStr}`, margin, 20);

  cursor = 38;

  // ── Status badge ──────────────────────────────────────────────────────────
  const [sr, sg, sb] = STATUS_COLORS[complaint.status] ?? FALLBACK_COLOR;
  doc.setFillColor(sr, sg, sb);
  doc.roundedRect(margin, cursor, 44, 8, 2, 2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(complaint.status.toUpperCase(), margin + 22, cursor + 5.5, { align: "center" });

  cursor += 14;

  // ── Info card helper ──────────────────────────────────────────────────────
  // Draws a label + wrapped value, returns the height used
  const infoField = (
    label: string,
    value: string,
    x: number,
    y: number,
    maxW: number
  ): number => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x, y);

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    const lines = doc.splitTextToSize(value || "—", maxW);
    doc.text(lines, x, y + 5.5);
    return 5.5 + lines.length * 5;
  };

  // ── Info card ─────────────────────────────────────────────────────────────
  // Measure address height first to size the card dynamically
  doc.setFontSize(9.5);
  const addressLines = doc.splitTextToSize(complaint.address || "—", colW);
  const cardH = Math.max(52, 14 + addressLines.length * 5 + 22);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, cursor, contentW, cardH, 2, 2, "FD");

  // Row 1: Municipality | Issue type
  infoField("Municipality", complaint.municipality, col1, cursor + 8, colW);
  infoField("Issue type", complaint.issuetype, col2, cursor + 8, colW);

  // Row 2: Address | Reported at
  infoField("Address", complaint.address || "—",
    col1, cursor + 24, colW);
  infoField("Reported at",
    new Date(complaint.creationtime).toLocaleString("en-ZA"),
    col2, cursor + 24, colW);

  // Row 3: Complaint ID
  infoField("Complaint ID", `#${complaint.complaintid}`, col1, cursor + cardH - 14, colW);

  cursor += cardH + 8;

  // ── Section heading helper ────────────────────────────────────────────────
  const sectionHeading = (label: string) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(label, margin, cursor);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(
      margin + doc.getTextWidth(label) + 3,
      cursor - 2,
      margin + contentW,
      cursor - 2,
    );
    cursor += 6;
  };

  // ── Details section ───────────────────────────────────────────────────────
  sectionHeading("DETAILS");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const detailLines = doc.splitTextToSize(
    complaint.details || "No details provided.",
    contentW - 8,
  );
  const detailBoxH = Math.max(20, detailLines.length * 5 + 10);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursor, contentW, detailBoxH, 2, 2, "FD");
  doc.text(detailLines, margin + 4, cursor + 7);

  cursor += detailBoxH + 10;

  if (complaint.image) {
    try {
      const imgBase64 = await loadImageAsBase64(complaint.image);

      sectionHeading("IMAGE");

      // Measure natural dimensions via Image element
      const imgDims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ w: 1, h: 1 });
        img.src = imgBase64;
      });

      const maxW = contentW;
      const maxH = 120;
      const ratio = imgDims.w / imgDims.h;

      let drawW = maxW;
      let drawH = drawW / ratio;

      // If too tall, constrain by height instead
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * ratio;
      }

      // Centre horizontally
      const offsetX = margin + (contentW - drawW) / 2;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, cursor, contentW, drawH + 4, 2, 2, "FD");
      doc.addImage(imgBase64, "JPEG", offsetX, cursor + 2, drawW, drawH);

      cursor += drawH + 12;
    } catch {
      // skip image if it fails to load
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageH - 10, pageW, 10, "F");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.text("https://github.com/sudoers1 — © sudoers1. All rights reserved.", margin, pageH - 3.5);
  doc.text("Page 1 of 1", pageW - margin, pageH - 3.5, { align: "right" });

  const fileName = `complaint-${complaint.complaintid}-${generatedAt.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}