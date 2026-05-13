"use client";

import { readComplaints } from "@/lib/db/complaints";
import ComplaintsTable from "@/components/complaintsTable";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";

export default function Reports() {
  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getComplaints() {
      const data = await readComplaints();
      setComplaints(data);
      setLoading(false);
    }
    getComplaints();
  }, []);

  if (loading) {
    return (
      <main className="w-screen min-h-screen bg-linear-to-br from-teal-200 via-white to-teal-300">
        <section className="p-8 min-h-screen flex items-center justify-center">
          <Spinner splash="Reports" />
        </section>
      </main>
    );
  }

  return (
    <main className="w-screen min-h-screen overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300">
      <section className="p-8 space-y-10 min-h-screen">
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-md">
            Reports
          </h1>
        </header>

        <article className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5">
          <ComplaintsTable complaints={complaints} />
        </article>
      </section>
    </main>
  );
}
