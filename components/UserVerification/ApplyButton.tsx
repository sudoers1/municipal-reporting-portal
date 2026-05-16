"use client";

import { useRef, useState, useTransition } from "react";
import { insertVerification } from "../../lib/db/verifications"; // Adjust path to verifications.ts
// import SelectWard from "./SelectWard";
import MunicipalityAssignModal from "../UserManagement/municipalityassignmodal";

interface ApplyButtonProps {
  userId: string;
  userName: string
}

export default function Apply({ userId, userName}: ApplyButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ name: "", municipality: "" });
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.municipality.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        await insertVerification(userId);
        
        closeModal();
        alert("Application submitted successfully!");
      } catch (err) {
        setError("Failed to submit request.");
      }
    });
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="inline-block px-4 py-1.5 bg-brand-accent text-white  font-semibold rounded-full shadow-md hover:bg-brand-accent/80 transition-all"
      >
        Become a Worker
      </button>

      {/* Pop-up Modal Backdrop & Window */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-auto backdrop:bg-black/60 p-6 rounded-2xl border border-black text-white w-full max-w-md shadow-2xl backdrop-blur-xs"
      >
        <section className="relative text-black">
            <section className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Worker Verification Application</h2>
            <button 
                type="button" 
                onClick={closeModal}
                className=" hover:text-white text-lg font-bold"
            >
                ✕
            </button>
            </section>
            <form onSubmit={handleSubmit} className="text-black flex flex-col gap-4">
                <section>
                    <label className="block  font-medium mb-1 ">Full Name</label>
                    <p className="bg-brand-accent/50 w-full p-2.5 rounded-lg text-black focus:outline-none focus:border-brand-accent">{userName}</p>
                </section>

                <section>
                    <label className="block  font-medium mb-1 ">Municipality</label>
                </section>

                {error && <p className="text-red-500 mt-1">{error}</p>}

                <section className="flex gap-3 justify-end mt-2">
                    <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2  text-gray-400 hover:text-black rounded-lg transition-colors"
                    disabled={isPending}
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2  font-semibold bg-brand-accent text-black rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
