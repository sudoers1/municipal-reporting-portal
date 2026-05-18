import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/generalcomps/spinner";
import FeedbackModal from "@/components/feedback/feedbackform";
import Link from "next/link";
import { Status } from "@/lib/status";
import { generateComplaintReport } from "@/lib/generateComplaintReport";

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
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const session = await authClient.getSession();
      if (session?.data?.user?.id) {
        setUid(session?.data?.user?.id);
      }
      setIdLoading(false);
    }
    loadSession();
  }, []);
  console.log(complaint);

  async function handleExport() {
    setExporting(true);
    try {
      await generateComplaintReport({
        complaintid:  complaint.complaintid,
        municipality: complaint.municipality,
        status:       complaint.status,
        issuetype:    complaint.issuetype,
        details:      complaint.details,
        creationtime: complaint.creationtime,
        address:      complaint.address,
        image:        complaint.image,
      });
    } finally {
      setExporting(false);
    }
  }


  if (idloading) {
    return (
      <section
        className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <Spinner splash="Report" />
      </section>
    );
  } else {
    return (
      <section
        className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-60"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <article
          className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden relative p-8
            ${complaint.image ? "min-w-[60%] md:max-w-4xl" : "md:max-w-lg"}
          `} onClick={(e) => e.stopPropagation()}
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
                <section>
                  <strong>Status:</strong>
                  <p className=" inline-block px-2 py-1.5 bg-teal-500/80 text-white text-sm font-semibold rounded-full shadow-md"> {complaint.status}</p>
                </section>
                <p><strong>Issue:</strong> {complaint.issuetype}</p>
                <p>
                  <strong>Time of report:</strong>{" "}
                  <time dateTime={complaint.creationtime}>
                    {new Date(complaint.creationtime).toLocaleString()}
                  </time>
                </p>
                <p className="border-[2px] rounded-xl mt-2 border-brand-secondary p-1 bg-white/80 shadow-sm"><strong>Address:</strong> {complaint.address}</p>
              </section>

              <section className="border-[2px] rounded-xl border-brand-primary p-4 bg-white/30 shadow-inner">
                <p>{complaint.details}</p>
              </section>
            </section>

            {complaint.image && (
              <section className="min-w-[48%] flex items-center justify-center">
                <figure className="relative w-full h-full flex items-center justify-center bg-white/80 rounded-xl overflow-hidden border-[2px] border-brand-secondary">
                  {loading && <Spinner />}
                  <Image
                    src={complaint.image}
                    alt="Complaint evidence"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain transition-opacity duration-300 p-2 ${loading ? "opacity-0" : "opacity-100"
                      }`}
                    onLoad={() => setLoading(false)}
                  />
                </figure>
              </section>
            )}
          </section>

          <section className="flex flex-col sm:flex-row gap-3 py-4 w-full mt-6">
            {uid == complaint.userid && complaint.status === "Resolved" && (
              <button
                onClick={() => setShowFeedback(true)}
                className="flex-1 bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-secondary hover:text-black transition-colors duration-300"
              >
                Submit Feedback
              </button>
            )}

            {uid === complaint.userid && (
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 bg-white/30 border border-white/40 text-black font-semibold py-3 rounded-xl shadow-md hover:bg-white/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Export complaint as PDF"
              >
                {exporting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 15V3m0 12-4-4m4 4 4-4" />
                      <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                    </svg>
                    Export PDF
                  </>
                )}
              </button>
            )}

            {complaint.status === Status.Duplicate ? (
              <Link
                href={`/reportfull/${complaint.linked_complaint_id}`}
                className="flex-1 bg-brand-secondary text-black font-semibold py-3 rounded-xl shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center"
              >
                View Original Report
              </Link>
            ) : (
              <Link
                href={`/reportfull/${complaint.complaintid}`}
                className="flex-1 bg-brand-secondary text-black font-semibold py-3 rounded-xl shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center"
              >
                View Full Report
              </Link>)}
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
