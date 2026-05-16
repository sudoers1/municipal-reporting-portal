"use client";

import { useRef, useState, useTransition } from "react";
import { insertVerification } from "../../lib/db/verifications"; // Adjust path to verifications.ts
import { insertUserMunicipality } from "@/lib/db/usersneon"; // Adjust path to usersneon.ts
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically load the WardMap just like municipalityassignmodal.tsx
const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });

interface ApplyButtonProps {
  userId: string;
  userName: string;
}

export default function ApplyForVerification({ userId, userName }: ApplyButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Initialize form state using structure from municipalityassignmodal.tsx
  const [form, setForm] = useState({
    userid: userId,
    municipality: "Not Assigned",
    ward: "Not Assigned",
  });

  const openModal = () => {
    setError(null);
    setForm({
      userid: userId,
      municipality: "Not Assigned",
      ward: "Not Assigned",
    });
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  // Map location coordinate update callback handler
  const getMunicipality = (coords: any) => {
    console.log("MAP COORDS:", coords);
    setForm((prev) => ({
      ...prev,
      municipality: coords.municipality || "Not Assigned",
      ward: coords.ward_id || "Not Assigned",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.municipality === "Not Assigned") {
      toast.error("Please choose a municipality on the map");
      setError("Please choose a municipality on the map.");
      return;
    }

    startTransition(async () => {
      try {
        // 1. Persist chosen location details into user_municipality table
        await insertUserMunicipality(userId, form.municipality);
        
        // 2. Submit user application instance into verif_requests table
        await insertVerification(userId);
        
        toast.success("Application submitted successfully!");
        closeModal();
      } catch (err) {
        setError("Failed to submit request.");
        toast.error("Failed to submit request.");
      }
    });
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="inline-block px-4 py-1.5 bg-brand-accent text-white font-semibold rounded-full shadow-md hover:bg-brand-accent/80 transition-all"
      >
        Become a Worker
      </button>

      {/* Pop-up Modal Backdrop & Window centered using fixed inset-0 m-auto */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-auto backdrop:bg-black/60 p-6 rounded-2xl border border-black text-white w-[95vw] max-w-lg shadow-2xl backdrop-blur-xs bg-brand-primary"
      >
        <section className="relative text-black">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Worker Verification Application</h2>
            <button 
              type="button" 
              onClick={closeModal}
              className="text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </header>
          
          <form onSubmit={handleSubmit} className="text-black flex flex-col gap-4">
            {/* User Info View Segment */}
            <section>
              <label className="block text-white font-medium mb-1">Full Name</label>
              <p className="bg-brand-accent/30 w-full p-2.5 rounded-lg text-white font-semibold border border-brand-accent/40">
                {userName}
              </p>
            </section>

            {/* Selected Location View Card */}
            <fieldset>
              <section className="w-full border border-white/20 bg-black/20 rounded-xl text-center px-4 py-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none">
                <p>
                  <strong>Municipality: </strong>
                  <span className={form.municipality === "Not Assigned" ? "text-brand-accent animate-pulse" : "text-white"}>
                    {form.municipality}
                  </span>
                </p>
                <p>
                  <strong>Ward: </strong>
                  <span className={form.ward === "Not Assigned" ? "text-brand-accent animate-pulse" : "text-white"}>
                    {form.ward}
                  </span>
                </p>
              </section>
            </fieldset>

            {/* Embedded Live Map Location Selection Area */}
            <section className="border border-white/20 rounded-xl overflow-hidden">
              <section className="h-[250px] w-full">
                <WardMap 
                  complaintMode={true} 
                  onLocationSelect={(coords) => getMunicipality(coords)}
                />
              </section>
            </section>

            {error && <p className="text-red-500 font-medium text-sm mt-1">{error}</p>}

            {/* Action Controls Footer Group */}
            <section className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 font-semibold bg-brand-accent text-black rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? "Submitting..." : "Submit Application"}
              </button>
            </section>
          </form>
        </section>
      </dialog>
    </>
  );
}