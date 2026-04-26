"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { insertComplaint, insertComplaintwIMG } from "@/lib/db/complaints";
import { Report } from "@/lib/report"; // adjust path as needed
import { Status } from "@/lib/status"; // adjust path as needed

async function uploadHandler(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bloobase4");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dncfvewe2/image/upload",
      { method: "POST", body: formData }
    );
    const data = await response.json();
    console.log("Image uploaded:", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export default function ComplaintsModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    photo: null as File | null,
    created_by: "",
  });

  useEffect(() => {
    async function loadSession() {
      const session = await authClient.getSession();
      if (session?.data?.user?.id) {
        setForm((prev) => ({ ...prev, created_by: session.data!.user.id }));
      }
    }
    loadSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!form.created_by) {
      toast.error("Session not loaded yet, please try again.");
      return;
    }
    if (form.photo &&form.photo.size > 5_000_000) {
      
      toast("ERROR:File too large (max 5MB)");
      return;
    }

    if (form.photo && !allowedTypes.includes(form.photo.type)) {
      toast("ERROR: Only JPG, PNG, or WEBP images allowed");
      return;
    }

    try {
      if (form.photo) {
        const uploaded = await uploadHandler(form.photo);

        const report = new Report(
          "testmunicipality",
          Status.Acknowledged,
          form.category,
          new Date(),
          form.created_by,
          uploaded.url,
          form.description
        );

        await insertComplaintwIMG(
          report.getUserID(),
          report.getIssueType(),
          report.getDetails(),
          report.getImage()
        );
      } else {
        const report = new Report(
          "testmunicipality",
          Status.Acknowledged,
          form.category,
          new Date(),
          form.created_by,
          undefined,
          form.description
        );

        await insertComplaint(
          report.getUserID(),
          report.getIssueType(),
          report.getDetails()
        );
      }

      toast.success("Complaint submitted successfully.");
      setForm({ category: "", description: "", photo: null, created_by: form.created_by });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit complaint. Please try again.");
    }
  }

  return (
    <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <section className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header>
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Log a Complaint
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <label className="block font-semibold mb-2 text-black">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              required
            >
              <option value="">Select category</option>
              <optgroup label="Water">
                <option value="No Water Supply">No Water Supply</option>
                <option value="Water Leaks">Water Leaks</option>
                <option value="Low Water Pressure">Low Water Pressure</option>
                <option value="Contaminated/Dirty Water">Contaminated/Dirty Water</option>
              </optgroup>
              <optgroup label="Electricity">
                <option value="Power Outages">Power Outages</option>
                <option value="Downed Power Lines">Downed Power Lines</option>
                <option value="Electricity Meter Issues">Electricity Meter Issues</option>
              </optgroup>
              <optgroup label="Waste Management">
                <option value="Missed Garbage Collection">Missed Garbage Collection</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
                <option value="Overflowing Bins">Overflowing Bins</option>
                <option value="Broken Refuse Bins">Broken Refuse Bins</option>
              </optgroup>
              <optgroup label="Roads & Transport">
                <option value="Potholes">Potholes</option>
                <option value="Damaged or Collapsed Roads">Damaged or Collapsed Roads</option>
                <option value="Missing Road Signs">Missing Road Signs</option>
                <option value="Faulty Traffic Lights">Faulty Traffic Lights</option>
                <option value="Poor Stormwater Drainage">Poor Stormwater Drainage</option>
              </optgroup>
              <optgroup label="Environmental & Sanitation Issues">
                <option value="Sewage Spills">Sewage Spills</option>
                <option value="Blocked Drains">Blocked Drains</option>
                <option value="Flooding">Flooding</option>
              </optgroup>
            </select>
          </fieldset>

          <fieldset>
            <label className="block font-semibold mb-2 text-black">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              rows={4}
              required
            />
          </fieldset>

          <fieldset>
            <label className="block font-semibold mb-2 text-black">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </fieldset>

          <input type="hidden" value={form.created_by} />

          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
          >
            Submit Complaint
          </button>
        </form>
      </section>
    </main>
  );
}