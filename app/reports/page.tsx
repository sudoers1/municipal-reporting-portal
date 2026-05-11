"use client"

import { readComplaints } from "@/lib/db/complaints";
import ComplaintsTable from "@/components/complaintsTable";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";


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
        <Spinner splash="Reports"/>
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