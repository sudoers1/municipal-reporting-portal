import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/spinner";
import FeedbackModal from "@/components/feedbackform";

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
    >
     <article
        className={`bg-brand-accent rounded-2xl h-[85%] md:h-[70%] overflow-y-auto p-8 relative
          ${complaint.image ? "min-w-[60%] md:max-w-5xl" : "md:max-w-lg"}
        `}
      >
        
        <header>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
            aria-label="Close dialog"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold text-center text-black h-[15%] mb-6">
            Complaint Details
          </h2>
        </header>

        <section className="flex flex-col md:flex-row md:gap-4 text-black py-2 h-[80%]">
          

          <section className="flex flex-col min-w-[48%] gap-4 flex-1 h-full">

            <section className="border-[3px] rounded-xl space-y-1 border-brand-secondary p-3 flex-shrink-0">
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
            </section>

            {/* DETAILS BOX (fills remaining space) */}
            <section className="flex-1 border rounded-xl border-brand-primary border-[3px] overflow-y-auto p-3 pr-2 bg-brand-secondary">
              <p>{complaint.details}</p>
            </section>

          </section>

          {complaint.image && (
            <section className="min-w-[48%] min-h-[100%] py-4 md:py-0">
              <figure className="relative w-full h-full flex items-center justify-center bg-brand-primary rounded-xl overflow-hidden border-[3px] border-brand-secondary">

                {/* Spinner */}
                {loading && (
                  <Spinner/>
                )}

                <Image
                  src={complaint.image}
                  alt="Complaint evidence"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain transition-opacity duration-300 ${
                    loading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setLoading(false)}
                />
              </figure>
            </section>
          )}

          

        </section>

        {
          (uid!="" && complaint.status) &&
          (
            <button onClick={()=>setShowFeedback(true)}  className="w-full  bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-secondary hover:text-black transition-colors duration-300">
              Submit Feedback
            </button>
          )
        }


      </article>
      {showFeedback &&(<FeedbackModal onClose={() => setShowFeedback(false) } uid={uid} cid={complaint.complaintid} />)}
    </section>
  );}
}