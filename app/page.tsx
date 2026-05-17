"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Complaint } from "@/components/wardmap";
import ResidentKPICards from "@/components/residentkpicards";
import ComplaintsList from "@/components/complaintslist";

const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });

export default function Home() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const toggleFilter = (status: string | null) => {
    setStatusFilter((current) => (current === status ? null : status));
    // clear selection when filter toggled off
    setSelectedComplaint(null);
  };

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => c.status === statusFilter)
    : complaints;

  return (
    <main
      className="w-screen min-h-screen overflow-y-auto bg-gradient-to-br from-white via-teal-100 to-teal-300"
    >
      <section className="p-8 space-y-10 min-h-screen">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-md">
          General Dashboard
        </h1>


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
          <aside className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5 min-h-[220px]">
            <WardMap
              selectedComplaint={selectedComplaint}
              onComplaintsLoad={(list) => setComplaints(list)}
              onComplaintSelect={(complaint) => setSelectedComplaint(complaint)}
              statusFilter={statusFilter}
            />
          </aside>
        </section>
      </section>
    </main>
  );
}

