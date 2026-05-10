"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { insertUserMunicipality } from "@/lib/db/usersneon";



export default function MunicipalityAssignModal({ onClose,onSuccess, uid="" }: { uid:string; onSuccess: () => void; onClose: () => void; }) {
  const [form, setForm] = useState({
    userid: uid,
    municipality: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!form.municipality) {
      toast.error("Please enter a municipality");
      return;
    }
   await insertUserMunicipality(form.userid,form.municipality);
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
            <label className="block font-semibold mb-2 text-black">
                Municipality
            </label>

            <input
                type="text"
                value={form.municipality}
                onChange={(e) =>
                setForm({ ...form, municipality: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
                required
            />
         </fieldset>

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