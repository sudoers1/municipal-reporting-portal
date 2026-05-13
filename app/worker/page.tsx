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

export default function WorkerDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [assigned, setAssigned] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !session) router.push("/");
  }, [session, isPending, router]);

  const fetchData = async () => {
    const [assignedRes, unassignedRes, completedRes, duplicatesRes] =
      await Promise.all([
        fetch("/api/reports/assigned"),
        fetch("/api/reports/unassigned"),
        fetch("/api/reports/completed"),
        fetch("/api/duplicates/pending"),
      ]);

    const assignedData = await assignedRes.json();
    const unassignedData = await unassignedRes.json();
    const completedData = await completedRes.json();
    const duplicatesData = await duplicatesRes.json();

    setAssigned(assignedData.data ?? []);
    setUnassigned(unassignedData.data ?? []);
    setCompleted(completedData.data ?? []);
    setDuplicates(duplicatesData.data ?? []);
  };

  async function handleConfirmDuplicate(id: number) {
    await fetch(`/api/duplicates/${id}/confirm`, {
      method: "POST",
    });

    await fetchData();
  }

  async function handleRejectDuplicate(id: number) {
    await fetch(`/api/duplicates/${id}/reject`, {
      method: "POST",
    });

    await fetchData();
  }

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  async function handleClaim(id: string) {
    await fetch(`/api/reports/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complaintid: id,
      }),
    });

    await fetchData();
  }

  async function handleStatus(complaintid: string, status: string) {
    await fetch(`/api/reports/id`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complaintid,
        status,
      }),
    });

    await fetchData();
  }

  if (isPending) {
    return (
      <main className="w-screen min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/municipality.png')" }}>
        <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
          <Spinner splash="Worker Dashboard" />
        </section>
      </main>
    );
  }

  return (
    <main className="w-screen min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/municipality.png')" }}>
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
            onSelectReport={setSelected}
          />

          <AssignedTasksCard
            tasks={assigned}
            onSelect={setSelected}
          />

          <CompletedTasksCard tasks={completed} />

          {selected && (
  <>
              <UpdateStatusCard
                report={selected}
                onUpdate={handleStatus}
              />

              <ReportDetailsCard
                report={selected}
                onClose={() => setSelected(null)}
              />
            </>
          )}
        </section>
      </section>
    </main>
  );
}