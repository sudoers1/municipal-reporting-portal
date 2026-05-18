"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/generalcomps/spinner";
import ExportReportButton from "@/components/Worker/exportReportButton";
import WorkerInfoCard from "@/components/Worker/workerinfo";
import UnassignedTasksCard from "@/components/Worker/unassignedtask";
import AssignedTasksCard from "@/components/Worker/assignedtask";
import CompletedTasksCard from "@/components/Worker/completedtask";
import UpdateStatusCard from "@/components/Worker/updatestatus";
import ReportDetailsCard from "@/components/Worker/reportdetails";
import PossibleDuplicatesCard from "@/components/Worker/possibleduplicates";
import DuplicateReviewDetails from "@/components/Worker/duplicatereviewdetails";
import KPICards from "@/components/Dashboard/KPIcard";
import WorkerStatusAnalytics from "@/components/Worker/statuslegend";
import ResolvedChartCard from "@/components/Worker/ResolvedChartCard";
import StatusChartCard from "@/components/Worker/StatusChartCard";

export default function WorkerDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const statusChartRef = useRef<HTMLElement>(null);
  const resolvedChartRef = useRef<HTMLElement>(null);
  const duplicateReviewRef = useRef<HTMLDivElement | null>(null);

  const [municipality, setMunicipality] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<
    { status: string; count: number }[]
  >([]);
  const [resolvedData, setResolvedData] = useState<
    { week: string; resolved: number; avg_hours?: number | null }[]
  >([]);

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedDuplicateReview, setSelectedDuplicateReview] =
    useState<any>(null);
  const [statsKey, setStatsKey] = useState(0);

  const dashboardReports = [...assigned, ...unassigned, ...completed];
  const workerReports = [...assigned, ...completed];

  const fetchData = useCallback(async () => {
    try {
      const [
        assignedRes,
        unassignedRes,
        completedRes,
        duplicatesRes,
        statusRes,
        resolvedRes,
      ] = await Promise.all([
        fetch("/api/reports/assigned"),
        fetch("/api/reports/unassigned"),
        fetch("/api/reports/completed"),
        fetch("/api/duplicates/pending"),
        fetch("/api/reports/analytics/status"),
        fetch("/api/reports/analytics/resolved"),
      ]);

      if (
        !assignedRes.ok ||
        !unassignedRes.ok ||
        !completedRes.ok ||
        !duplicatesRes.ok ||
        !statusRes.ok ||
        !resolvedRes.ok
      ) {
        console.error("Dashboard fetch statuses:", {
          assigned: assignedRes.status,
          unassigned: unassignedRes.status,
          completed: completedRes.status,
          duplicates: duplicatesRes.status,
          status: statusRes.status,
          resolved: resolvedRes.status,
        });

        throw new Error("Failed to fetch dashboard data");
      }

      const assignedData = await assignedRes.json();
      const unassignedData = await unassignedRes.json();
      const completedData = await completedRes.json();
      const duplicatesData = await duplicatesRes.json();
      const statusJson = await statusRes.json();
      const resolvedJson = await resolvedRes.json();

      setAssigned(assignedData.data ?? []);
      setUnassigned(unassignedData.data ?? []);
      setCompleted(completedData.data ?? []);
      setDuplicates(duplicatesData.data ?? []);
      setStatusData(statusJson.data ?? []);
      setMunicipality(statusJson.municipality ?? null);
      setResolvedData(resolvedJson.data ?? []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  useEffect(() => {
    if (selectedDuplicateReview) {
      setTimeout(() => {
        duplicateReviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedDuplicateReview]);

    async function handleClaim(id: number) {
    try {
      const response = await fetch("/api/reports/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintid: id,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message ?? "Failed to claim report");
      }

      await fetchData();
      setStatsKey((k) => k + 1);
    } catch (error) {
      console.error("Claim report error:", error);
    }
  }

  async function handleStatus(complaintid: string, status: string) {
    try {
      const response = await fetch("/api/reports/id", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintid,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update report status");
      }

      await fetchData();
      setStatsKey((k) => k + 1);
    } catch (error) {
      console.error("Update status error:", error);
    }
  }

  async function handleConfirmDuplicate(id: number) {
    try {
      const response = await fetch(`/api/duplicates/${id}/confirm`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to confirm duplicate");
      }

      setSelectedDuplicateReview(null);
      await fetchData();
    } catch (error) {
      console.error("Confirm duplicate error:", error);
    }
  }

  async function handleRejectDuplicate(id: number) {
    try {
      const response = await fetch(`/api/duplicates/${id}/reject`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reject duplicate");
      }

      setSelectedDuplicateReview(null);
      await fetchData();
    } catch (error) {
      console.error("Reject duplicate error:", error);
    }
  }

  function handleSelectReport(report: any) {
    setSelectedDuplicateReview(null);
    setSelectedReport(report);
  }

  function handleViewDuplicateReview(review: any) {
    setSelectedReport(null);
    setSelectedDuplicateReview(review);
  }

if (isPending || !session) {
  return (
    <main className="w-screen min-h-screen bg-gradient-to-br from-white via-teal-100 to-teal-300">
      <section className="p-8 bg-black/40 min-h-screen flex items-center justify-center">
        <Spinner splash="Worker Dashboard" />
      </section>
    </main>
  );
}

return (
  <main className="w-screen min-h-screen bg-gradient-to-br from-white via-teal-100 to-teal-300">
    <section className="p-6 min-h-screen space-y-8">
      <header>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 text-center">
          Worker Dashboard
        </h1>
      </header>

      <KPICards data={dashboardReports} />

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <section className="md:col-span-2 xl:col-span-3 dashboard-card">
          <WorkerStatusAnalytics
            assignments={workerReports}
            duplicates={duplicates}
            availableTasks={unassigned}
          />
        </section>

        <WorkerInfoCard worker={session.user}  />

        <UnassignedTasksCard
          tasks={unassigned}
          onClaim={handleClaim}
          currentUserId={session.user.id}
          className="dashboard-card"
        />

        <PossibleDuplicatesCard
          duplicates={duplicates}
          onConfirm={handleConfirmDuplicate}
          onReject={handleRejectDuplicate}
          onViewReview={handleViewDuplicateReview}
        />

        <AssignedTasksCard tasks={assigned} onSelect={handleSelectReport}  />

        <CompletedTasksCard tasks={completed}  />

        {selectedDuplicateReview && (
          <section
            ref={duplicateReviewRef}
            className="md:col-span-2 xl:col-span-3 dashboard-card scroll-mt-6"
          >
            <DuplicateReviewDetails
              review={selectedDuplicateReview}
              onClose={() => setSelectedDuplicateReview(null)}
              onConfirm={handleConfirmDuplicate}
              onReject={handleRejectDuplicate}
            />
          </section>
        )}

        {selectedReport && (
          <>
            <UpdateStatusCard
              report={selectedReport}
              onUpdate={handleStatus}
            />

            <ReportDetailsCard
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
            />
          </>
        )}

        <article ref={statusChartRef} className="dashboard-card">
          <StatusChartCard statusData={statusData} refreshKey={statsKey} />
        </article>

        <article ref={resolvedChartRef} className="dashboard-card">
          <ResolvedChartCard resolvedData={resolvedData} refreshKey={statsKey} />
        </article>

        <ExportReportButton
          worker={{
            name: session?.user?.name ?? "",
            email: session?.user?.email,
            municipality: municipality ?? "Unknown Municipality",
          }}
          statusData={statusData}
          resolvedData={resolvedData}
          statusChartRef={statusChartRef}
          resolvedChartRef={resolvedChartRef}
          className="dashboard-card"
        />
      </section>
    </section>
  </main>
);
}