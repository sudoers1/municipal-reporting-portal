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
      <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header className="text-center mb-6 text-black">
          <h2 className="text-2xl font-bold text-center text-black h-[15%] mb-6">
            Details
          </h2>
        </header>

        <section className="flex flex-col md:flex-row md:gap-4 text-black h-[80%]">

          <section className="flex flex-col min-w-[48%] gap-4 flex-1 h-full">

            <section className="border-[3px] rounded-xl space-y-1 border-brand-primary p-3 flex-shrink-0">
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

            
            <section className="flex-1 border rounded-xl border-brand-primary border-[3px] overflow-y-auto p-3 pr-2 bg-brand-secondary">
              <p>{feedback.details}</p>
            </section>

          </section>

          {feedback.image && (
            <section className="min-w-[48%]  min-h-[100%] py-4 md:py-0">
              <figure className="relative w-full h-full flex items-center justify-center bg-brand-primary rounded-xl overflow-hidden border-[3px] border-brand-secondary">

                {loading && <Spinner />}

                <Image
                  src={feedback.image}
                  alt="feedback image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain transition-opacity duration-300 p-2${
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