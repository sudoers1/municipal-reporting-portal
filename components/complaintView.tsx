import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/spinner";
import FeedbackModal from "@/components/feedback/feedbackform";
import Link from "next/link";

export default function ComplaintViewer({
  onClose,
  complaint,
}: {
  onClose: () => void;
  complaint: Record<string, any>;
}) {
  const [loading, setLoading] = useState(true);
  const [idloading, setIdLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [uid, setUid] = useState<string>("");

  if(idloading){return (
    <section
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
          <Spinner splash="Report"/>
    </section>
    );}
    else{
  return (
    <section
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
     <article
        onClick={(e) => e.stopPropagation()}
        className={`bg-brand-accent rounded-2xl h-[95%] md:h-[85%] overflow-y-auto p-8 relative
          ${complaint.image ? "min-w-[60%] md:max-w-5xl" : "md:max-w-lg"}
        `}
      >
        <Spinner splash="Report" />
      </section>
    );
  } else {
    return (
      <section
        className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <article
          className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden relative p-8
            ${complaint.image ? "min-w-[60%] md:max-w-4xl" : "md:max-w-lg"}
          `}
        >
          <header>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl font-bold"
              aria-label="Close dialog"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-black mb-6">
              Complaint Details
            </h2>
          </header>

          <section className="flex flex-col md:flex-row md:gap-6 text-black">
            <section className="flex flex-col min-w-[48%] gap-4 flex-1">
              <section className="border-[2px] rounded-xl border-brand-secondary p-4 bg-white/40 shadow-sm">
                <p><strong>Municipality:</strong> {complaint.municipality}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <p><strong>Issue:</strong> {complaint.issuetype}</p>
                <p>
                  <strong>Time of report:</strong>{" "}
                  <time dateTime={complaint.creationtime}>
                    {new Date(complaint.creationtime).toLocaleString()}
                  </time>
                </p>
              </section>

              <section className="border-[2px] rounded-xl border-brand-primary p-4 bg-white/30 shadow-inner">
                <p>{complaint.details}</p>
              </section>
            </section>

            {complaint.image && (
              <section className="min-w-[48%] flex items-center justify-center">
                <figure className="relative w-full h-full flex items-center justify-center bg-white/30 rounded-xl overflow-hidden border-[2px] border-brand-secondary">
                  {loading && <Spinner />}
                  <Image
                    src={complaint.image}
                    alt="Complaint evidence"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain transition-opacity duration-300 p-2 ${
                      loading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setLoading(false)}
                  />
                </figure>
              </section>
            )}
          </section>

          <section className="flex flex-col sm:flex-row gap-3 py-4 w-full mt-6">
            {uid !== "" && complaint.status === "Resolved" && (
              <button
                onClick={() => setShowFeedback(true)}
                className="flex-1 bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-secondary hover:text-black transition-colors duration-300"
              >
                Submit Feedback
              </button>
            )}
            <Link
              href={`/reportfull/${complaint.complaintid}`}
              className="flex-1 bg-brand-secondary text-black font-semibold py-3 rounded-xl shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center"
            >
              View Full Report
            </Link>
          </section>
        </article>

        {showFeedback && (
          <FeedbackModal
            onClose={() => setShowFeedback(false)}
            uid={uid}
            cid={complaint.complaintid}
          />
        )}
      </section>
    );
  }
}
