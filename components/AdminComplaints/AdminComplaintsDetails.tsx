"use client";

import { useState, useEffect } from "react";
import { readoneComplaint } from "../../lib/db/complaints";
import TaskAllocationForm from "../Forms/TaskAllocationForm";
import React from "react";

function Spinner() {
  return (
    <section className="flex justify-center items-center py-10">
      <section className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </section>
  );
}

export default function AdminComplaintsDetails({
  onClose,
  cid,
}: {
  onClose: () => void;
  cid: string;
}) {
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = React.useState(false);

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
    <section
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
      role="dialog"
      aria-modal="true"
      
    >
      <article className=" bg-brand-accent bg-white  max-w-lg min-w-[50vw] min-h-[55vh] max-h-[85vh] px-8 py-4 rounded-2xl shadow-lg  overflow-hidden relative">

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
          <section className="flex flex-col md:flex-row gap-5 text-black">
            <section className="min-w-[20vw] flex flex-col justify-between">
                <section className="">
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

                  <p className="">
                  <strong>Description:</strong> {complaint.details}
                  </p>
                </section>

                <section className="flex justify-center">
                    <button onClick={() => setShowModal(true)}  className=" bg-brand-secondary text-white px-4 py-2 my-4 rounded-md">Allocate Work</button>
                </section>
                {showModal && 
                <TaskAllocationForm 
                  complaint={complaint}
                  onClose={() => setShowModal(false)}
                />}

                
            </section>
            {complaint.image && (
                <figure className="flex-shrink-0">
                <img
                    src={complaint.image}
                    alt="Complaint evidence"
                    className="w-60 aspect-[4/3] object-cover rounded-lg"
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
    </section>
  );
}