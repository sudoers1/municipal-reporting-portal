"use client";

import DashboardItems from "@/components/dashboarditems";
import Complaints from '@/components/complaintform'
import ComplaintButton from "@/components/complaintbutton";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function DashboardPage() {
  const [showComplaints,setShowComplaints]=useState(false);
  const { data: session } = authClient.useSession();
  const role = session?.user.role;

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      {/* Overlay so text is readable */}
      <section className="p-8 space-y-10 bg-black/50 min-h-screen">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
          Hello, {role}!
        </h1>

        <p className="text-lg text-white max-w-3xl mx-auto text-center">
          Welcome to the Municipal Portal Dashboard. You have successfully logged
          in and can now access your personalized dashboard and information
          regarding your municipality. From here, you can log a complaint or
          report an issue directly to the municipal authorities. Explore the
          various sections to stay informed and engaged with your community.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
          Dashboard
        </h2>
        {/* Dashboard items */}
        <DashboardItems />

        {/* Complaint button */}
        <ComplaintButton
          onClick={() => setShowComplaints(!showComplaints)}
          showComplaints={showComplaints}
        />

        {/* Complaints form modal */}
        {showComplaints && <Complaints onClose={() => setShowComplaints(false)} />}
      </section>
    </main>
  );
}
