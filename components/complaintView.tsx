"use client";

import { useState, useEffect } from "react";
import { readoneComplaint } from "@/lib/db/complaints";

function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );
}

export default function ComplaintViewer({
  onClose,
  cid,
}: {
  onClose: () => void;
  cid: string;
}) {
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await readoneComplaint(cid);
      setComplaint(data);
      setLoading(false);
    }

    fetchData();
  }, [cid]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
      role="dialog"
      aria-modal="true"
      
    >
      <article className="bg-brand-accent rounded-2xl shadow-lg w-full max-w-lg min-w-[50vw] min-h-[55vh] max-h-[85vh] overflow-hidden p-8 relative">

        {/* Header */}
        <header>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
            aria-label="Close dialog"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Complaint Details
          </h2>
        </header>

        {/* Body */}
        {loading ? (
          <Spinner />
        ) : complaint ? (
          <section className="flex flex-col md:flex-row px-10 gap-5 text-black">
            <section className="flex flex-col min-w-[20vw]">
                <p>
                <strong>Municipality:</strong> {complaint.municipality}
                </p>

                <p>
                <strong>Status:</strong>{" "}
                {complaint.status ? "Completed" : "Pending"}
                </p>

                <p>
                <strong>Issue:</strong> {complaint.issuetype}
                </p>
                <p>
                <strong>Time of report:</strong>{" "}
                <time dateTime={complaint.creationtime}>
                    {new Date(complaint.creationtime).toLocaleString()}
                </time>
                </p>

                <p className="border border-brand-primary border-3 bg-brand-secondary">
                <strong>Description:</strong> {complaint.details}
                </p>

                
            </section>
            {complaint.image && (
                <figure className="flex-shrink-0">
                <img
                    src={complaint.image}
                    alt="Complaint evidence"
                    className="w-full max-w-[320px] aspect-[4/3] object-cover rounded-lg"
                />
                </figure>
            )}

          </section>
        ) : (
          <section>
            <p>No complaint found</p>
          </section>
        )}
      </article>
    </div>
  );
}