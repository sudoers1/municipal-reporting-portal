"use client";

import { useState, useEffect } from "react";
import ComplaintButton from "@/components/complaintbutton";
import ComplaintsModal from "@/components/complaintform";
import dynamic from "next/dynamic";
import Spinner from "@/components/spinner";
import { authClient } from "@/lib/auth-client";
import type { Complaint } from "@/components/wardmap";
import ResidentKPICards from "@/components/residentkpicards";
import ComplaintsList from "@/components/complaintslist";

const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });

export default function DashboardPage() {
  const [showComplaints, setShowComplaints] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const toggleFilter = (status: string | null) => {
    setStatusFilter((current) => (current === status ? null : status));
    setSelectedComplaint(null);
  };

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => c.status === statusFilter)
    : complaints;

  const { data: session, isPending } = authClient.useSession();
  const name = session?.user?.name;

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", showComplaints);
  }, [showComplaints]);

  if (isPending) {
    return (
      <main className="w-screen min-h-screen bg-gray-200 flex items-center justify-center bg-gradient-to-br from-white via-teal-100 to-teal-300">
        <Spinner splash="your dashboard" />
      </main>
    );
  }

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-gradient-to-br from-white via-teal-100 to-teal-300"
    >
      <section className="p-6 space-y-8 min-h-screen">
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-mlg">
            {name}&apos;s Dashboard
          </h1>
        </header>


        {/* KPI Cards */}
        <ResidentKPICards
          complaints={complaints}
          activeFilter={statusFilter}
          onToggleFilter={toggleFilter}
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left tile: complaints list */}
          <aside className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5 min-h-[200px] max-h-[500px] overflow-y-auto scrollbar-hide">
  <ComplaintsList
    complaints={filteredComplaints}
    selectedComplaint={selectedComplaint}
    onSelectComplaint={setSelectedComplaint}
  />
</aside>

          {/* Right tile: map */}
          <aside className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl z-40 shadow-lg p-5 min-h-[200px] max-h-[500px]">
            <WardMap
              complaintMode={showComplaints}
              selectedComplaint={selectedComplaint}
              statusFilter={statusFilter}
              onLocationSelect={(coords) => setClickedLocation(coords)}
              onComplaintsLoad={(list) => setComplaints(list)}
              onComplaintSelect={(complaint) => setSelectedComplaint(complaint)}
            />
          </aside>
        </section>

        {session?.user.role=="Resident"&&(
        <section className="flex justify-center">
          <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-1 w-fit">
            <ComplaintButton
              onClick={() => setShowComplaints(!showComplaints)}
              showComplaints={showComplaints}
            />
          </article>
        </section>)}

        {/* Modal */}
        {showComplaints && (
          <ComplaintsModal
            onClose={() => setShowComplaints(false)}
            selectedLocation={clickedLocation}
          />
        )}
      </section>
    </main>
  );
}
