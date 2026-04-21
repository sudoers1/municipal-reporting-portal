"use client"

import { readComplaints } from "@/lib/db/complaints";
import ComplaintsTable from "@/components/complaintsTable";
import { useState, useEffect } from "react";

export default function Reports() {

  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getComplaints() {
      const data= await readComplaints();
      setComplaints(data);
      setLoading(false);
    }

    getComplaints();
    
  }, []);

  if(loading){return (
    <main
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-semibold">Loading Reports...</p>
        </div>
      </section>
    </main>
  );}
  else{
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
  );}
}