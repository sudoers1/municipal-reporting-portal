// "use client";

// import { useState, useEffect } from "react";
// import { readoneComplaint } from "../../lib/db/complaints";
// import TaskAllocationForm from "../Forms/TaskAllocationForm";
// import React from "react";

// function Spinner() {
//   return (
//     <section className="flex justify-center items-center py-10">
//       <section className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
//     </section>
//   );
// }

// export default function AdminComplaintsDetails({
//   onClose,
//   cid,
// }: {
//   onClose: () => void;
//   cid: string;
// }) {
//   const [complaint, setComplaint] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = React.useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       const data = await readoneComplaint(cid);
//       setComplaint(data);
//       setLoading(false);
//     }

//     fetchData();
//   }, [cid]);

//   return (
//     <section
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
//       role="dialog"
//       aria-modal="true"
      
//     >
//       <article className=" bg-brand-accent bg-white  max-w-lg min-w-[50vw] min-h-[55vh] max-h-[85vh] px-8 py-4 rounded-2xl shadow-lg  overflow-hidden relative">

//         {/* Header */}
//         <header>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
//             aria-label="Close dialog"
//           >
//             ×
//           </button>

//           <h2 className="text-2xl font-bold text-center text-black mb-6">
//             Complaint Details
//           </h2>
//         </header>

//         {/* Body */}
//         {loading ? (
//           <Spinner />
//         ) : complaint ? (
//           <section className="flex flex-col md:flex-row gap-5 text-black">
//             <section className="min-w-[20vw] flex flex-col justify-between">
//                 <section className="">
//                   <p><strong>Complaint ID:</strong> {complaint.complaintid}</p>
//                   <p>
//                   <strong>Municipality:</strong> {complaint.municipality}
//                   </p>
//                   <p>
//                   <strong>Status:</strong>{" "}
//                   {complaint.status}
//                   </p>

//                   <p>
//                   <strong>Issue:</strong> {complaint.issuetype}
//                   </p>
//                   <p>
//                   <strong>Time of report:</strong>{" "}
//                   <time dateTime={complaint.creationtime}>
//                       {new Date(complaint.creationtime).toLocaleString()}
//                   </time>
//                   </p>

//                   <p className="">
//                   <strong>Description:</strong> {complaint.details}
//                   </p>
//                 </section>

//                 <section className="flex justify-center">
//                     <button onClick={() => setShowModal(true)}  className=" bg-brand-secondary text-white px-4 py-2 my-4 rounded-md">Allocate Work</button>
//                 </section>
//                 {showModal && 
//                 <TaskAllocationForm 
//                   complaint={complaint}
//                   onClose={() => setShowModal(false)}
//                 />}

                
//             </section>
//             {complaint.image && (
//                 <figure className="flex-shrink-0">
//                 <img
//                     src={complaint.image}
//                     alt="Complaint evidence"
//                     className="w-60 aspect-[4/3] object-cover rounded-lg"
//                 />
//                 </figure>
//             )}

//           </section>
//         ) : (
//           <section>
//             <p>No complaint found</p>
//           </section>
//         )}
//       </article>
//     </section>
//   );
// }
"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/generalcomps/spinner";
import { Status } from "@/lib/status";

export default function AdminComplaintsDetails({
  onClose,
  complaint,
  setShowModal
}: {
  onClose: () => void;
  setShowModal: (showModal:Boolean) => void;
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
        className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-60"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <article
          className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden relative p-8
            ${complaint.image ? "min-w-[60%] md:max-w-4xl" : "md:max-w-lg" }
          `}  onClick={(e) => e.stopPropagation()}
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
              Complaint #{complaint.complaintid}
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
                  <button onClick={() => setShowModal(true)}  className="flex-1 bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-secondary hover:text-black transition-colors duration-300">
                    Allocate Work</button>
          </section>
        </article>
            
            {/* <section className="flex-1 border rounded-xl border-brand-primary h-fit p-3 pr-2 bg-brand-secondary">
              <p>{complaint.details}</p>
            </section>             */}

            {/* <section className="flex flex-col justify-center items-center sm:flex-row gap-3 py-3 w-full">
              {uid !== "" && complaint.status === "Resolved" && (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="bg-brand-secondary text-black font-semibold py-2 px-4 rounded-md shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center"
                >
                  Submit Feedback
                </button>
              )}

              <Link
                href={`/reportfull/${complaint.complaintid}`}
                className=" bg-brand-secondary text-black font-semibold py-2 px-4 rounded-md shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center"
              >
                View Full Report
              </Link>
            </section> */}
            
    </section>
  );}
}