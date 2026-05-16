"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

import WorkerInfoCard from "@/components/Worker/workerinfo";
import UnassignedTasksCard from "@/components/Worker/unassignedtask";
import AssignedTasksCard from "@/components/Worker/assignedtask";
import CompletedTasksCard from "@/components/Worker/completedtask";
import UpdateStatusCard from "@/components/Worker/updatestatus";
import ReportDetailsCard from "@/components/Worker/reportdetails";
import PossibleDuplicatesCard from "@/components/Worker/possibleduplicates";
import DuplicateReviewDetails from "@/components/Worker/duplicatereviewdetails";
import ResolvedChartCard from "@/components/Worker/ResolvedChartCard";
import StatusChartCard from "@/components/Worker/StatusChartCard";

export default function WorkerDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [assigned, setAssigned] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedDuplicateReview, setSelectedDuplicateReview] =
    useState<any>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  async function fetchData() {
    try {
      const [assignedRes, unassignedRes, completedRes, duplicatesRes] =
        await Promise.all([
          fetch("/api/reports/assigned"),
          fetch("/api/reports/unassigned"),
          fetch("/api/reports/completed"),
          fetch("/api/duplicates/pending"),
        ]);

      if (
        !assignedRes.ok ||
        !unassignedRes.ok ||
        !completedRes.ok ||
        !duplicatesRes.ok
      ) {
        throw new Error("Failed to fetch dashboard data");
      }

      const assignedData = await assignedRes.json();
      const unassignedData = await unassignedRes.json();
      const completedData = await completedRes.json();
      const duplicatesData = await duplicatesRes.json();

      setAssigned(assignedData.data ?? []);
      setUnassigned(unassignedData.data ?? []);
      setCompleted(completedData.data ?? []);
      setDuplicates(duplicatesData.data ?? []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const [statsKey, setStatsKey] = useState(0);
  async function handleClaim(id: string) {
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
        throw new Error("Failed to claim report");
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

  if (isPending) {
    return (
      <main
        className="w-screen min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/municipality.png')" }}
      >
        <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
          <Spinner splash="Worker Dashboard" />
        </section>
      </main>
    );
  }

  return (
    <main
      className="w-screen min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-6 bg-black/50 min-h-screen space-y-8">
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            Worker Dashboard
          </h1>
        </header>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <WorkerInfoCard worker={session?.user} />

          <UnassignedTasksCard tasks={unassigned} onClaim={handleClaim} />

          <PossibleDuplicatesCard
            duplicates={duplicates}
            onConfirm={handleConfirmDuplicate}
            onReject={handleRejectDuplicate}
            onViewReview={handleViewDuplicateReview}
          />

          <AssignedTasksCard tasks={assigned} onSelect={handleSelectReport} />

          <CompletedTasksCard tasks={completed} />

          {selectedDuplicateReview && (
            <DuplicateReviewDetails
              review={selectedDuplicateReview}
              onClose={() => setSelectedDuplicateReview(null)}
              onConfirm={handleConfirmDuplicate}
              onReject={handleRejectDuplicate}
            />
          )}

          {selectedReport && (
            <>
              <UpdateStatusCard report={selectedReport} onUpdate={handleStatus} />

              <ReportDetailsCard
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
              />
            </>
          )}
          <StatusChartCard refreshKey={statsKey} />
          <ResolvedChartCard refreshKey={statsKey} />
        </section>
      </section>
    </main>
  );
}