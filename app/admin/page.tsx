"use client";

import Spinner from "@/components/generalcomps/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import Tiles from "@/components/Dashboard/AdminTiles";

export default function AdminPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Handle redirect for invalid roles
  useEffect(() => {
    if (!isPending) {
      if (session?.user.role !== "Admin") {
        router.push("/"); // Redirect to public
      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <main className="w-screen min-h-screen bg-gradient-to-br from-white via-teal-100 to-teal-300">
        <section className="p-8 min-h-screen flex items-center justify-center">
          <Spinner splash="Dashboard" />
        </section>
      </main>
    );
  }

  return (
    <main className="w-screen min-h-screen overflow-y-auto bg-gradient-to-br from-white via-teal-100 to-teal-300">
      {/* Header */}
      <section className="mx-4 mt-6 py-8 rounded-3xl backdrop-blur-md bg-white/40 border border-slate-200 shadow-xl">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-slate-900 drop-shadow-sm">
          Administrative Control Center
        </h1>
      </section>

      {/* Tiles Section */}
      <section className="flex flex-col justify-center items-center mt-8">
        <Tiles />
      </section>
    </main>
  );
}
