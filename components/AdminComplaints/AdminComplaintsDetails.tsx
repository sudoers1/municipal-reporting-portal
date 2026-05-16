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

import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Spinner from "@/components/spinner";
import FeedbackModal from "@/components/feedback/feedbackform";
import Link from "next/link";
import TaskAllocationForm from "../Forms/TaskAllocationForm";

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
  const [showModal, setShowModal] = useState(false);
  
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 "
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
     <article
        className={`bg-white  w-fit p-8 rounded-2xl  relative
          ${complaint.image ? "min-w-[60%] md:max-w-5xl" : "md:max-w-lg"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
       {/* h-[95%] md:h-[85%]  */}
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


        <section className="grid grid-cols-2 overflow-y-auto max-sm:flex max-sm:flex-col ">
          {/* flex flex-col gap-4 text-black  h-[80%] */}
          

          <section className="flex flex-col gap-2">
            {/* flex flex-col min-w-[48%] gap-4 flex-1 h-full */}

            <section className="p-3">
              {/* border-[3px] rounded-xl space-y-1 border-brand-secondary p-3 shrink-0 */}
              <p>
                <strong>Complaint ID:</strong> {complaint.complaintid}
              </p>

              <p>
                <strong>Municipality:</strong> {complaint.municipality}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {complaint.status}
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

              <p><strong>Description:</strong> {complaint.details}</p>
            </section>

            
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
            <section className="flex justify-center">                     
                  <button onClick={() => setShowModal(true)}  className="bg-brand-secondary text-black font-semibold py-2 px-4 rounded-md shadow-md hover:bg-brand-primary hover:text-white transition-colors duration-300 text-center">
                    Allocate Work</button>
            </section>

          </section>

          {complaint.image && (
            <section className="min-w-[48%] min-h-full py-4 md:py-0">
              <figure className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden">

                {/* Spinner */}
                {loading && (
                  <Spinner/>
                )}

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

        
      
      </article>
      {showFeedback &&(<FeedbackModal onClose={() => setShowFeedback(false) } uid={uid} cid={complaint.complaintid} />)}
      {showModal && 
      <TaskAllocationForm 
        complaint={complaint}
        onClose={() => setShowModal(false)}
      />}
    </section>
  );}
}