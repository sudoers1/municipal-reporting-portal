"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import FeedbackTable from "@/components/feedback/feedbackTable";
import FeedbackViewer from "@/components/feedback/feedbackView";
import { Feedback } from "@/lib/structures/feedback";
import { readFeedback } from "@/lib/db/feedback";
import { readoneComplaint } from "@/lib/db/complaints";
import Spinner from "@/components/spinner";

type FeedbackRow = ReturnType<Feedback["toPlainObject"]>;

export default function ReportFull({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = use(params);

  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);

  const { data: session, isPending } = authClient.useSession();

  const [complaint, setComplaint] = useState<Record<string, any> | null>(null);
  const [feedback, setFeedback] = useState<Record<string, any>[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null);

  useEffect(() => {
    if (isPending) return;

    async function loadData() {
      const [complaintData, feedbackData] = await Promise.all([
        readoneComplaint(complaintId),
        readFeedback(complaintId),
      ]);

      setComplaint(complaintData);
      setFeedback(feedbackData);
      setLoading(false);
    }

    loadData();
  }, [session, isPending, complaintId]);

  if (isPending || loading) {
    return (
      <main className="w-screen min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
        <section className="flex flex-col bg-black/15 items-center gap-4 min-h-screen justify-center">
          <Spinner splash="Report Feedback" />
        </section>
      </main>
    );
  }

  if (!complaint) return null;

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300"
    >
      <section className="p-6 md:p-10 lg:p-14 backdrop-blur-sm min-h-screen rounded-xl">
        <h1 className="text-3xl md:text-5xl font-bold text-black text-center mb-10 drop-shadow-lg">
          Report Feedback
        </h1>

        <section className="w-[90%] mx-auto flex flex-col md:flex-row gap-8 text-black">
          {/* Complaint details */}
          <section className="flex flex-col gap-6 flex-1">
            <section className="border-[3px] rounded-xl border-brand-primary p-6 space-y-2 bg-white/30 backdrop-blur-md shadow-lg">
              <p><strong>Municipality:</strong> {complaint.municipality}</p>
              <p><strong>Status:</strong> {complaint.status === "Resolved" ? "Completed" : "Pending"}</p>
              <p><strong>Issue:</strong> {complaint.issuetype}</p>
              <p>
                <strong>Time of report:</strong>{" "}
                <time dateTime={complaint.creationtime}>
                  {new Date(complaint.creationtime).toLocaleString()}
                </time>
              </p>
            </section>

            <section className="border-[3px] rounded-xl border-brand-primary p-6 bg-white/20 backdrop-blur-md shadow-inner min-h-[200px]">
              <h3 className="font-bold mb-3 text-lg">Details</h3>
              <p className="whitespace-pre-wrap">{complaint.details}</p>
            </section>
          </section>

          {/* Complaint image */}
          {complaint.image && (
            <section className="flex-1 flex">
              <figure className="relative w-full min-h-[300px] lg:min-h-full bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border-[3px] border-brand-secondary flex items-center justify-center shadow-lg">
                {imgLoading && <Spinner />}
                <Image
                  src={complaint.image}
                  alt="Complaint evidence"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain transition-opacity duration-300 p-3 ${
                    imgLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImgLoading(false)}
                />
              </figure>
            </section>
          )}
        </section>

        {/* Feedback table */}
        {complaint.status === "Resolved" && (
          <section className="mt-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center text-black mb-6">Feedback</h2>
            <FeedbackTable
              feedbacks={feedback}
              onSelectFeedback={setSelectedFeedback}
            />
          </section>
        )}
        
      </section>

      {selectedFeedback && (
        <FeedbackViewer
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}

      
    </main>
  );
}
