"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { insertComplaint, insertComplaintwIMG } from "@/lib/db/complaints";
import { Report } from "@/lib/report";
import { Status } from "@/lib/status";
import { Priority } from "@/lib/priority";

async function uploadHandler(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bloobase4");

  const response = await fetch("https://api.cloudinary.com/v1_1/dncfvewe2/image/upload", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export default function ComplaintsModal({
  onClose,
  selectedLocation,
}: {
  onClose: () => void;
  selectedLocation?: {
    lat: number;
    lng: number;
    address?: string;
    ward_id?: string;
    municipality?: string;
  } | null;
}) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    photo: null as File | null,
    created_by: "",
    address: "",
    ward_id: "",
    municipality: "",
    coords: "", // ✅ keep coords in state silently
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

  useEffect(() => {
    if (selectedLocation) {
      setForm((prev) => ({
        ...prev,
        address: selectedLocation.address || "",
        ward_id: selectedLocation.ward_id || "",
        municipality: selectedLocation.municipality || "",
        coords: `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`, // ✅ silently set
      }));
    }
  }, [selectedLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.photo) {
        const uploaded = await uploadHandler(form.photo);
        const report = new Report(
          form.municipality,
          Status.Acknowledged,
          form.category,
          new Date(),
          form.created_by,
          Priority.Low,
          uploaded.url,
          form.description
        );

        await insertComplaintwIMG(
          report.getUserID(),
          form.ward_id,
          report.getMunicipality(),
          report.getIssueType(),
          report.getDetails(),
          report.getImage(),
          form.address,
          form.coords
        );
      } else {
        const report = new Report(
          form.municipality,
          Status.Acknowledged,
          form.category,
          new Date(),
          form.created_by,
          Priority.Low,
          undefined,
          form.description
        );

        await insertComplaint(
          report.getUserID(),
          form.ward_id,
          report.getMunicipality(),
          report.getIssueType(),
          report.getDetails(),
          form.address,
          form.coords
        );
      }

      toast.success("Complaint submitted successfully.");
      setForm({
        category: "",
        description: "",
        photo: null,
        created_by: form.created_by,
        address: "",
        ward_id: "",
        municipality: "",
        coords: "", // reset silently
      });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit complaint. Please try again.");
    }
  }

  return (
    <section className="fixed inset-0 pl-20 z-30 flex items-center justify-left backdrop-blur-md">
      <article className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Log a Complaint</h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <section>
            <label className="block font-semibold mb-2 text-gray-900">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white/70 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
          </section>

          {/* Description */}
          <section>
            <label className="block font-semibold mb-2 text-gray-900">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white/70 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              rows={3}
              required
            />
          </section>

          {/* Photo Upload */}
          <section>
            <label className="block font-semibold mb-2 text-gray-900">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white/70 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </section>

          {/* Address */}
          <section>
            <label className="block font-semibold mb-2 text-gray-900">Address</label>
            <input
              type="text"
              value={form.address}
              readOnly
              placeholder="Click on the map to select location"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 bg-gray-100 cursor-not-allowed"
            />
          </section>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-teal-400 hover:text-black transition-colors duration-300"
          >
            Submit Complaint
          </button>
        </form>
      </article>
    </section>
  );
}
