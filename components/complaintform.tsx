"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function ComplaintsModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    photo: null as File | null,
    created_by: "",
  });

  const [message, setMessage] = useState("");

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

    // Build form data (kept for future backend integration)
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("created_by", form.created_by);
    if (form.photo) {
      formData.append("photo", form.photo);
    }

    // Placeholder backend call
    // TODO: Replace with actual POST to /api/issues when available
    console.log("Form submitted:", Object.fromEntries(formData.entries()));

    // Simulate success
    setMessage("Complaint submitted (backend integration pending).");
    setForm({
      category: "",
      description: "",
      photo: null,
      created_by: form.created_by,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-black mb-6">Log a Complaint</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
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
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 text-black">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              rows={4}
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block font-semibold mb-2 text-black">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="w-full border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          {/* Hidden Created By */}
          <input type="hidden" value={form.created_by} />

          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
          >
            Submit Complaint
          </button>
        </form>

        {message && <p className="mt-6 text-center text-green-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}
