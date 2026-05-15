"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/spinner";

export default function FeedbackViewer({
  onClose,
  feedback,
}: {
  onClose: () => void;
  feedback: Record<string, any>;
}) {
  const [loading, setLoading] = useState(true);
  const [idloading, setIdLoading] = useState(true);

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
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
      onClick={onClose}>
      
      <article
        className={`bg-brand-accent rounded-2xl h-[95%] md:h-[85%] overflow-y-auto p-8 relative ${
          feedback.image ? "min-w-[60%] md:max-w-5xl" : "md:max-w-lg"
        }`}
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
          <h2 className="text-2xl font-bold mb-6">Feedback Details</h2>
        </header>

        {/* Content */}
        <section className="flex flex-col md:flex-row md:gap-6 text-black">
          {/* Left column */}
          <section className="flex flex-col min-w-[48%] gap-4 flex-1">
            <section className="border-[2px] rounded-xl border-brand-primary p-4 bg-white/40 shadow-sm">
              <p>
                <strong>Creator:</strong> {feedback.name}
              </p>
              <p>
                <strong>Time of Feedback:</strong>{" "}
                <time dateTime={feedback.creationtime}>
                  {new Date(feedback.creationtime).toLocaleString()}
                </time>
              </p>
            </section>

            <section className="border-[2px] rounded-xl border-brand-primary p-4 bg-white/20 backdrop-blur-md shadow-inner flex-1">
              <p className="whitespace-pre-wrap">{feedback.details}</p>
            </section>
          </section>

          {/* Right column (image) */}
          {feedback.image && (
            <section className="min-w-[48%] flex items-center justify-center">
              <figure className="relative w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-md rounded-xl overflow-hidden border-[2px] border-brand-secondary shadow-lg">
                {loading && <Spinner />}
                <Image
                  src={feedback.image}
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
