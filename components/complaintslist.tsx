"use client";

import type { Complaint } from "@/components/wardmap";

interface ComplaintsListProps {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  onSelectComplaint: (complaint: Complaint | null) => void;
}

export default function ComplaintsList({
  complaints,
  selectedComplaint,
  onSelectComplaint,
}: ComplaintsListProps) {
  return (
    <article className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5 min-h-55 flex flex-col">
      <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
        Complaints in this ward
      </h3>

      {selectedComplaint ? (
        <section className="flex-1 text-center">
          <p className="mb-2 font-semibold text-black">{selectedComplaint.issuetype}</p>
          <p className="mb-2 text-gray-700">{selectedComplaint.details}</p>
          <p className="mb-2 text-gray-700">
            <strong>Status:</strong> {selectedComplaint.status}
          </p>
          {selectedComplaint.address && (
            <p className="text-gray-700 mb-2">{selectedComplaint.address}</p>
          )}
          {selectedComplaint.image && (
            <figure className="mt-4 flex justify-center">
              <img
                src={selectedComplaint.image}
                alt="Complaint evidence"
                className="rounded-md w-48"
              />
            </figure>
          )}
          <button
            className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-gray-900 font-semibold rounded-md hover:bg-white/30 transition"
            onClick={() => onSelectComplaint(null)}
          >
            Back to list
          </button>
        </section>
      ) : complaints.length > 0 ? (
        <ul className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-hide">
          {complaints.map((c) => {
            const isSelected = selectedComplaint === c;
            return (
              <li
                key={c.complaintid}
                className={`rounded-2xl border p-4 text-center cursor-pointer transition duration-200 ease-out ${
                  isSelected
                    ? "bg-slate-100 border-slate-300 shadow-inner ring-1 ring-teal-200"
                    : "border-transparent hover:-translate-y-0.5 hover:bg-white hover:border-slate-300 hover:shadow-xl"
                }`}
                onClick={() => onSelectComplaint(c)}
              >
                <p className="font-semibold text-black">{c.issuetype}</p>
                <p className="text-sm text-gray-700">{c.details}</p>
                <p className="text-sm text-gray-700">Status: {c.status}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">
          There are no open or recently closed cases in the current ward.
        </p>
      )}
    </article>
  );
}
