"use client";

import { useState, useEffect } from "react";
import DashboardItems from "@/components/dashboarditems";
import ComplaintButton from "@/components/complaintbutton";
import ComplaintsModal from "@/components/complaintform";
import dynamic from "next/dynamic";
import Spinner from "@/components/spinner";

import { authClient } from "@/lib/auth-client"; // bring in session for name

const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });

export default function DashboardPage() {
  const [showComplaints, setShowComplaints] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [clickedMunicipality, setClickedMunicipality] = useState<{ municipality:string,ward:string } | null>(null);

  const getMunicipality = (municipality: string,ward:string) => {
  setClickedMunicipality({municipality,ward});
};

  const { data: session, isPending } = authClient.useSession();
  const name = session?.user?.name;

  // Disable page scroll when modal is open
  useEffect(() => {
    if (showComplaints) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showComplaints]);

  if (isPending){ return (
    <main
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
          <Spinner splash="your dashboard"/>
      </section>
    </main>
  );}

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 space-y-10 bg-black/50 min-h-screen">
        {/* Greeting */}
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            Hello, {name}!
          </h1>
          <p className="text-lg text-white max-w-3xl mx-auto text-center mt-4">
            Welcome to the Municipal Portal Dashboard. You have successfully logged
            in and can now access your personalized dashboard and information
            regarding your municipality. From here, you can log a complaint or
            report an issue directly to the municipal authorities. Explore the
            various sections to stay informed and engaged with your community.
          </p>
        </header>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
          Dashboard
        </h2>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column with two stacked tiles */}
          <section className="flex flex-col gap-6">
            <article className="bg-white/90 rounded-xl shadow-lg p-6">
              <DashboardItems />
            </article>
            <article className="bg-white/90 rounded-xl shadow-lg p-6">
              <ComplaintButton
                onClick={() => setShowComplaints(!showComplaints)}
                showComplaints={showComplaints}
              />
            </article>
          </section>

          {/* Right column with map */}
          <aside className="bg-white/90 rounded-xl shadow-lg p-6">
            <WardMap
              complaintMode={showComplaints}
              onLocationSelect={(coords) => setClickedLocation(coords)}
              onMunicipalSelect={getMunicipality}
            />
          </aside>
        </section>

        {/* Complaints form modal */}
        {showComplaints && (
          <ComplaintsModal
            onClose={() => setShowComplaints(false)}
            selectedLocation={clickedLocation}
            clickedMunicipality={clickedMunicipality}
          />
        )}
      </section>
    </main>
  );
}
