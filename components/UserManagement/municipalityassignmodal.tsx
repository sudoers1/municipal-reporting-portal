"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { insertUserMunicipality } from "@/lib/db/usersneon";
import dynamic from "next/dynamic";
const WardMap = dynamic(() => import("@/components/wardmap"), { ssr: false });


export default function MunicipalityAssignModal({ onClose,onSuccess, uid="" }: { uid:string; onSuccess: () => void; onClose: () => void; }) {
  const [form, setForm] = useState({
    userid: uid,
    municipality: "Not Assigned",
    ward:"Not Assigned"
  });
const getMunicipality = (municipality: string,ward:string) => {
  setForm(prev => ({ ...prev, municipality,ward }));
};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (form.municipality=="Not Assigned") {
      toast.error("Please choose a municipality");
      return;
    }
   await insertUserMunicipality(form.userid,form.municipality+":"+form.ward);
   toast.success("Municipality assigned successfully.");
   onSuccess?.();
   onClose();


  }

  return (
    <section className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">


      <section className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
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
          <section className="w-full border rounded-xl text-center px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none">
              <p >
                <strong>Municipality:</strong>{form.municipality}
              </p>
              <p >
                <strong>Ward:</strong>{form.ward}
              </p>
          </section>
         </fieldset>
          <section className="border rounded-xl overflow-hidden">
            <section className="h-[300px] w-full">
              <WardMap onMunicipalSelect={getMunicipality}/>
            </section>
          </section>

          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
          >
            Assign
          </button>
        </form>
      </section>

      
    </section>
  );
}