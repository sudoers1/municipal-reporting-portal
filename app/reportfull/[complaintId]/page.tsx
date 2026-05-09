"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import FeedbackTable from "@/components/feedback/feedbackTable";
import { readFeedback } from "@/lib/db/feedback";
import { readoneComplaint } from "@/lib/db/complaints";
import Spinner from "@/components/spinner";

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

  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/");
      return;
    }

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
  }, [session, isPending, router, complaintId]);

  if (isPending || loading) {
    return (
      <main
        className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/municipality.png')" }}
      >
        <section className="flex flex-col items-center gap-4">
          <Spinner splash="Report Feedback" />
        </section>
      </main>
    );
  }

  if (!complaint) return null;

  return (
    <main
      id="dashboard"
      className="w-screen min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-4 md:p-8 lg:p-12 bg-black/50 min-h-screen">

        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 md:mb-12">
          Report Feedback
        </h1>

        <section className="w-[85vw] mx-auto flex flex-col lg:flex-row gap-6 text-black">

          <section className="flex flex-col gap-6 flex-1">

            <section className="border-[3px] rounded-xl border-brand-secondary p-5 space-y-2 bg-brand-secondary">
              <p><strong>Municipality:</strong> {complaint.municipality}</p>
              <p><strong>Status:</strong> {complaint.status ? "Completed" : "Pending"}</p>
              <p><strong>Issue:</strong> {complaint.issuetype}</p>
              <p>
                <strong>Time of report:</strong>{" "}
                <time dateTime={complaint.creationtime}>
                  {new Date(complaint.creationtime).toLocaleString()}
                </time>
              </p>
            </section>

            <section className="border-[3px] rounded-xl border-brand-primary p-5 bg-brand-secondary min-h-[200px]">
              <h3 className="font-bold mb-2">Details</h3>
              <p className="whitespace-pre-wrap">{complaint.details}</p>
            </section>

          </section>

          {complaint.image && (
            <section className="flex-1 flex">
              <figure className="relative w-full min-h-[300px] lg:min-h-full bg-brand-primary rounded-xl overflow-hidden border-[3px] border-brand-secondary flex items-center justify-center">

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

        {complaint.status === "Resolved" && (
          <figure className="flex justify-center py-10">
            <FeedbackTable feedbacks={feedback} />
          </figure>
        )}

      </section>
    </main>
  );
}