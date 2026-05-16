"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ComplaintsTable from "@/components/complaintsTable";
import ComplaintViewer from "@/components/complaintView";
import { readMyComplaints } from "@/lib/db/complaints";
import Spinner from "@/components/spinner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Record<string, any> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/"); // Redirect to public
      }
      async function getComplaints() {
        const data = await readMyComplaints(session?.user?.id);
        setComplaints(data);
        setLoading(false);
      }
      getComplaints();
    }
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <main className="w-screen min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
        <section className="flex flex-col bg-black/15 items-center justify-center min-h-screen gap-4">
          <Spinner splash="Profile" />
        </section>
      </main>
    );
  }

  return (
    <main
      id="profile"
      className="w-screen min-h-screen overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300"
    >
      <section className="p-6 md:p-10 lg:p-14 min-h-screen space-y-12">
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-md">
            My Profile
          </h1>
        </header>

        {/* Profile Card */}
        <article className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 md:p-8 shadow-2xl">
          <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            {/* Avatar */}
            <figure className="flex-shrink-0">
              <img
                src={session?.user?.image ?? "/default-avatar.png"}
                alt={`${session?.user?.name}'s avatar`}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-400 shadow-lg"
              />
            </figure>

            {/* User Info */}
            <section className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {session?.user?.name}
              </h2>
              <p className="text-gray-700 text-base md:text-lg">
                Email: {session?.user?.email}
              </p>
              <p className="text-gray-700 text-base md:text-lg">
                First Used Site on:{" "}
                {session?.user?.createdAt?.toDateString?.() ?? "Unknown"}
              </p>
              <span className="inline-block px-4 py-1.5 bg-teal-500/80 text-white text-sm font-semibold rounded-full shadow-md">
                {session?.user?.role || "Resident"}
              </span>
            </section>
          </section>
        </article>

        {/* Reports Section */}
        <section>
          <h2 className="mb-6 text-3xl md:text-5xl font-bold text-gray-900 text-center drop-shadow-md">
            My Reports
          </h2>
          <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-4">
            <ComplaintsTable complaints={complaints} onSelectComplaint={setSelectedComplaint} />
          </article>
        </section>
      </section>
      {selectedComplaint && (
                    <ComplaintViewer
                      complaint={selectedComplaint}
                      onClose={() => setSelectedComplaint(null)}
                    />
              )}
    </main>
  );
}
