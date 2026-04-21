"use client"

import { readComplaints } from "@/lib/db/complaints";
import ComplaintsTable from "@/components/complaintsTable";
import { useState, useEffect } from "react";

export default function Reports() {

  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    async function getComplaints() {
      return await readComplaints();
    }

    const c = getComplaints();
    setComplaints(prev => [...prev, c]);
  }, []);

  return (
    <main
      className="w-screen min-h-[120vh] overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 space-y-10 md:bg-black/50 min-h-[120vh] flex flex-col">

        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            View All Reports
          </h1>
        </header>



        <figure className="flex md:justify-center">
          <ComplaintsTable complaints={complaints} />
        </figure>


      </section>
    </main>
  );
}