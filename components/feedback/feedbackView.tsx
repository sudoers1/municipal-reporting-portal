"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/generalcomps/spinner";
import { Feedback } from "@/lib/structures/feedback";

export default function FeedbackViewer({
  onClose,
  feedback,
}: {
  onClose: () => void;
  feedback: Record<string, any>;
}) {
  const [loading, setLoading] = useState(true);
  const [idloading, setIdLoading] = useState(true);

  const feedbackInstance = Feedback.fromRecord(feedback);

  useEffect(() => {
    async function loadSession() {
      await authClient.getSession();
      setIdLoading(false);
    }
    loadSession();
  }, []);

  if (idloading) {
    return (
      <section
        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <Spinner splash="Feedback" />
      </section>
    );
  }

  return (
    <section className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      
      <article
        className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl relative p-8
          ${feedback.image ? "min-w-[60%] md:max-w-4xl" : "md:max-w-lg"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl font-bold"
          aria-label="Close dialog"
        >
          ×
        </button>

        {/* Header */}
        <header className="text-center mb-6 text-black">
          <h2 className="text-2xl font-bold text-center text-black h-[15%] mb-6">
            Feedback Details for Complaint #{feedbackInstance.getComplaintId()}
         

          </h2>

        </header>

        <section className="flex flex-col md:flex-row md:gap-4 text-black h-[80%]">

          <section className="flex flex-col min-w-[48%] gap-4 flex-1 h-full">

            <section className="border-[2px] rounded-xl space-y-3 border-brand-primary p-4 bg-white/40 shadow-sm flex-shrink-0">
              <p>
                <strong>Respondent:</strong> {feedbackInstance.getName()}
              </p>

              <p>
                <strong>Rating:</strong> 
                <span className="text-white text-xl ml-2">
                  {feedbackInstance.getRatingStars()}
                </span>
                <span className="text-md text-black ml-2">
                  ({feedbackInstance.getRating()}/5)
                </span>
              </p>

              <p>
                <strong>Time of Feedback:</strong>{" "}
                <time dateTime={feedbackInstance.getCreationTime().toISOString()}>
                  {feedbackInstance.getFormattedDate()}
                </time>
              </p>


            </section>

            <section className="border-[2px] rounded-xl border-brand-primary p-4 bg-white/20 backdrop-blur-md shadow-inner flex-1">
              <h3 className="font-bold mb-2">Feedback Details:</h3>
              <p className="whitespace-pre-wrap">{feedbackInstance.getDetails()}</p>
            </section>
          </section>

          {/* Right column (image) */}
          {feedbackInstance.getImage() && (
            <section className="min-w-[48%] flex items-center justify-center">
              <figure className="relative w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-md rounded-xl overflow-hidden border-[2px] border-brand-secondary shadow-lg">
                {loading && <Spinner />}
                <Image
                  src={feedbackInstance.getImage()!}
                  alt="Feedback image"
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
      </article>
    </section>
  );
}
