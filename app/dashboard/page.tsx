"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import DashboardItems from "@/components/dashboarditems";
import Complaints from "@/components/complaintform";
import ComplaintButton from "@/components/complaintbutton";
import { authClient } from "@/lib/auth-client";

const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [showComplaints, setShowComplaints] = useState(false);

  if (isPending) return (
    <main
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </section>
    </main>
  );

  const role = (session as any)?.user?.role;

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
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

        <Swiper
          modules={[Keyboard, Navigation]}
          keyboard={{ enabled: true, onlyInViewport: false }}
          navigation={true}
          spaceBetween={50}
          slidesPerView={1}
        >
          <SwiperSlide>
            <DashboardItems />
          </SwiperSlide>
          <SwiperSlide>
            <WardMap />
          </SwiperSlide>
        </Swiper>

        <ComplaintButton
          onClick={() => setShowComplaints(!showComplaints)}
          showComplaints={showComplaints}
        />

        {showComplaints && <Complaints onClose={() => setShowComplaints(false)} />}
      </section>
    </main>
  );
}