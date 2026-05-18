"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { insertUserMunicipality } from "@/lib/db/usersneon";
import dynamic from "next/dynamic";

const WardMap = dynamic(() => import("@/components/wardmap/wardmap"), { ssr: false });


export default function MunicipalityAssignModal({ onClose,onSuccess, uid="" }: { uid:string; onSuccess: () => void; onClose: () => void; }) {
const [form, setForm] = useState({
  userid: uid,
  municipality: "Not Assigned",
  ward: "Not Assigned",
});
const [isSubmitting, setIsSubmitting] = useState(false);

const getMunicipality = (coords: any) => {
  console.log("MAP COORDS:", coords);

  setForm((prev) => ({
    ...prev,
    municipality: coords.municipality || "Not Assigned",
    ward: coords.ward_id || "Not Assigned",
  }));
};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);


    if (form.municipality=="Not Assigned") {
      toast.error("Please choose a municipality");
      setIsSubmitting(false);
      return;
    }

   await insertUserMunicipality(form.userid,form.municipality);
  toast.success("Municipality assigned successfully.");
  setIsSubmitting(false);
   onSuccess?.();
   onClose();


  }

  return (
    <section className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-60"
        role="dialog"
        aria-modal="true"
         onClick={onClose}>

      <section className="bg-white/30 backdrop-blur-lg shadow-2xl border border-white/30 relative rounded-2xl w-full max-w-lg p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header>
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Assign Worker to Municipality
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
            

        <fieldset>
          <section className="w-full border border-brand-secondary border-2 bg-white rounded-xl text-center px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none">
              <p >
                <strong>Municipality:</strong>{form.municipality}
              </p>
              <p >
                <strong>Ward:</strong>{form.ward}
              </p>
          </section>
         </fieldset>
          <section className="border border-brand-secondary border-2 rounded-xl overflow-hidden">
            <section className="h-[300px] w-full">
              <WardMap complaintMode={true} onLocationSelect={(coords) => getMunicipality(coords)}/>
            </section>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
          >
            Assign
          </button>
        </form>
      </section>

      
    </section>
  );
}