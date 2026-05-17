"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import ResidentKPICards from "@/components/Dashboard/residentkpicards";
import ComplaintsList from "@/components/Dashboard/complaintslist";
import type { Complaint } from "@/components/wardmap/wardmap";
import { X, ArrowRight, MousePointer } from "lucide-react";

const WardMap = dynamic(() => import("@/components/wardmap/wardmap"), { ssr: false });

const sampleComplaints: Complaint[] = [
  {
    complaintid: 1,
    status: "Acknowledged",
    issuetype: "Pothole",
    details: "Large pothole on the main road near the bus stop.",
    address: "10 Main St",
    coords: "-26.2041, 28.0473",
  },
  {
    complaintid: 2,
    status: "In progress",
    issuetype: "Streetlight",
    details: "Streetlight on the corner is out and needs repair.",
    address: "22 Market Lane",
    coords: "-26.2053, 28.0462",
  },
  {
    complaintid: 3,
    status: "Resolved",
    issuetype: "Trash pickup",
    details: "Overflowing waste bin by the park was cleared.",
    address: "5 Park Ave",
    coords: "-26.2031, 28.0484",
  },
];

const buildOverlaySections = (highlight: DOMRect | null) => {
  if (!highlight) return [];
  const fullWidth = window.innerWidth;
  const fullHeight = window.innerHeight;
  return [
    { left: 0, top: 0, width: fullWidth, height: highlight.top },
    { left: 0, top: highlight.top, width: highlight.left, height: highlight.height },
    { left: highlight.right, top: highlight.top, width: fullWidth - highlight.right, height: highlight.height },
    { left: 0, top: highlight.bottom, width: fullWidth, height: fullHeight - highlight.bottom },
  ];
};

export default function TutorialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") === "resident" ? "resident" : "guest";
  const [stepIndex, setStepIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [highlightRects, setHighlightRects] = useState<DOMRect[]>([]);
  const [overlayAreas, setOverlayAreas] = useState<Array<{ left: number; top: number; width: number; height: number }>>([]);
  const [pointerPosition, setPointerPosition] = useState<{ left: number; top: number } | null>(null);
  const [showMapClick, setShowMapClick] = useState(false);

  const cardsRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<HTMLElement | null>(null);
  const actionRef = useRef<HTMLElement | null>(null);

  const steps = useMemo(() => {
    const baseSteps = [
      {
        title: "Welcome",
        text: "Welcome to the Municipal Portal resident tutorial page. This walkthrough will show you how your dashboard works.",
        targets: [],
      },
      {
        title: "Navigation",
        text: "Use the navbar to move between pages like Dashboard, Reports, and Contact.",
        targets: ["nav"],
      },
      {
        title: "Your dashboard",
        text: "This is your interactive dashboard. It shows the status cards, complaint list, and map together.",
        targets: ["cards", "list", "map"],
      },
      {
        title: "Interactive map",
        text: "The map updates with complaints in your ward. You can click map pins to inspect one complaint.",
        targets: ["map"],
        pointer: { xRatio: 0.65, yRatio: 0.45 },
      },
      {
        title: "Filter by status",
        text: "Click a KPI card to filter the list and map by status, then click again to clear the filter.",
        targets: ["cards", "list"],
      },
    ];

    if (mode === "resident") {
      baseSteps.push({
        title: "Log a complaint",
        text: "This button opens the complaint form. You can report a new issue without leaving the dashboard.",
        targets: ["action"],
      });
    }

    baseSteps.push({
      title: "Finished",
      text: "That completes the resident tutorial.",
      targets: [],
    });

    return baseSteps;
  }, [mode]);

  const step = steps[stepIndex];

  const closeTutorial = () => {
    router.push(mode === "resident" ? "/dashboard" : "/");
  };

  const updateHighlight = useCallback(() => {
    const getTargetRect = (target: string): DOMRect | null => {
      if (target === "nav") {
        const nav = document.querySelector("nav");
        return nav?.getBoundingClientRect() ?? null;
      }
      if (target === "cards") return cardsRef.current?.getBoundingClientRect() ?? null;
      if (target === "list") return listRef.current?.getBoundingClientRect() ?? null;
      if (target === "map") return mapRef.current?.getBoundingClientRect() ?? null;
      if (target === "action") return actionRef.current?.getBoundingClientRect() ?? null;
      return null;
    };

    const rects = step.targets
      .map(getTargetRect)
      .filter((rect): rect is DOMRect => rect !== null)
      .filter((rect) => rect.width > 0 && rect.height > 0);

    if (!rects.length) {
      setHighlightRects([]);
      setOverlayAreas([]);
      setPointerPosition(null);
      setShowMapClick(false);
      return;
    }

    const combined = rects.reduce((acc, rect) => {
      const left = Math.min(acc.left, rect.left);
      const top = Math.min(acc.top, rect.top);
      const right = Math.max(acc.right, rect.right);
      const bottom = Math.max(acc.bottom, rect.bottom);
      return new DOMRect(left, top, right - left, bottom - top);
    }, rects[0]);

    setHighlightRects(rects);
    setOverlayAreas(buildOverlaySections(combined));

    if (step.pointer && mapRef.current) {
      const mapRect = mapRef.current.getBoundingClientRect();
      setPointerPosition({
        left: mapRect.left + mapRect.width * step.pointer.xRatio,
        top: mapRect.top + mapRect.height * step.pointer.yRatio,
      });
      setShowMapClick(true);
    } else {
      setPointerPosition(null);
      setShowMapClick(false);
    }
  }, [step]);

  useEffect(() => {
    const scheduleUpdate = () => window.requestAnimationFrame(updateHighlight);
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", updateHighlight);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [updateHighlight]);

  useEffect(() => {
    if (step.title !== "Filter by status" && step.title !== "Log a complaint") {
      return;
    }
    const handleStepEffects = () => {
      if (step.title === "Filter by status") {
        setStatusFilter("Acknowledged");
        setSelectedComplaint(null);
      } else if (step.title === "Log a complaint") {
        setStatusFilter(null);
        setSelectedComplaint(null);
      }
    };
    window.requestAnimationFrame(handleStepEffects);
  }, [step.title]);

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      const nextStep = steps[nextIndex];
      if (nextStep.title === "Filter by status") {
        setStatusFilter("Acknowledged");
        setSelectedComplaint(null);
      } else if (nextStep.title === "Log a complaint") {
        setStatusFilter(null);
        setSelectedComplaint(null);
      }
      setStepIndex(stepIndex + 1);
    } else {
      closeTutorial();
    }
  };

  return (
    <main className="relative min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      <div className="relative z-10">
        <section className="p-6 space-y-8 min-h-screen pt-6">
          <header className="relative">
            <div className="absolute right-0 top-0">
              <button
                onClick={closeTutorial}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg hover:bg-white"
                aria-label="Exit tutorial"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-teal-700">Tutorial mode</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900">
                {mode === "resident" ? "Resident Dashboard Tutorial" : "General Dashboard Tutorial"}
              </h1>
            </div>
          </header>

          <section className="flex justify-center">
            <article ref={cardsRef} className="w-full max-w-5xl bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl transition shadow-slate-900/10">
              <ResidentKPICards
                complaints={sampleComplaints}
                activeFilter={statusFilter}
                onToggleFilter={(status) => {
                  setStatusFilter((current) => (current === status ? null : status));
                  setSelectedComplaint(null);
                }}
              />
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article ref={listRef} className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl transition shadow-slate-900/10">
              <ComplaintsList
                complaints={statusFilter ? sampleComplaints.filter((complaint) => complaint.status === statusFilter) : sampleComplaints}
                selectedComplaint={selectedComplaint}
                onSelectComplaint={setSelectedComplaint}
              />
            </article>

            <aside ref={mapRef} className="relative rounded-3xl border border-white/50 bg-slate-100/90 p-6 shadow-xl shadow-slate-900/10">
              <figure className="h-80 overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
                <WardMap
                  selectedComplaint={selectedComplaint}
                  onComplaintsLoad={() => undefined}
                  onComplaintSelect={setSelectedComplaint}
                  statusFilter={statusFilter}
                />
              </figure>
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-md">
                Interactive map preview
              </div>
            </aside>
          </section>

        </section>
      </div>

      <div className="fixed bottom-28 right-6 z-50 px-4">
        <div className="relative w-full max-w-sm rounded-3xl border border-white/80 bg-white/95 px-5 py-4 text-left shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{step.text}</p>
          <div className="absolute -bottom-3 right-8 h-4 w-4 rotate-45 bg-white/95 border-l border-t border-white/80" />
        </div>
      </div>

      <button
        onClick={nextStep}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-blue-500/30 transition hover:bg-blue-400"
      >
        <span>{stepIndex < steps.length - 1 ? "Next" : "Finish"}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="fixed bottom-6 left-6 z-50 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-xl shadow-slate-900/10">
        Step {stepIndex + 1} of {steps.length}
      </div>

      <div className="fixed inset-0 z-40 pointer-events-none">
        {overlayAreas.map((area, index) => (
          <div
            key={index}
            style={{ left: area.left, top: area.top, width: area.width, height: area.height }}
            className="absolute pointer-events-none bg-black/60"
          />
        ))}
        {highlightRects.map((rect, index) => (
          <div
            key={index}
            style={{
              left: rect.left - 12,
              top: rect.top - 12,
              width: rect.width + 24,
              height: rect.height + 24,
            }}
            className="absolute pointer-events-none rounded-3xl border-2 border-orange-400 shadow-[0_0_0_3px_rgba(252,211,77,0.85)]"
          />
        ))}
        {pointerPosition ? (
          <>
            <div
              style={{ left: pointerPosition.left, top: pointerPosition.top }}
              className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-xl"
            >
              <MousePointer className="h-6 w-6 text-orange-500" />
            </div>
            {showMapClick ? (
              <div
                style={{ left: pointerPosition.left, top: pointerPosition.top }}
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/80 shadow-lg animate-ping"
              />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
