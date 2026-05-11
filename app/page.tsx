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

  return (
    <main
      className="w-screen min-h-screen overflow-y-auto bg-gradient-to-br from-white via-teal-100 to-teal-300"
    >
      <section className="p-8 space-y-10 min-h-screen">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-md">
          Municipal Portal Landing Page
        </h1>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mt-4">
          Welcome to the Municipal Portal. Explore general information about your municipality,
          track ward statistics, and stay informed about community updates.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 drop-shadow-sm">
          General Dashboard
        </h2>

        {/* KPI Cards */}
        <ResidentKPICards complaints={complaints} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left tile: complaints list */}
          <ComplaintsList
            complaints={complaints}
            selectedComplaint={selectedComplaint}
            onSelectComplaint={setSelectedComplaint}
          />

          {/* Right tile: map */}
          <aside className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5 min-h-[220px]">
            <WardMap
              onComplaintsLoad={(list) => setComplaints(list)}
              onComplaintSelect={(complaint) => setSelectedComplaint(complaint)}
            />
          </aside>
        </section>
      </section>
    </main>
  );
}

