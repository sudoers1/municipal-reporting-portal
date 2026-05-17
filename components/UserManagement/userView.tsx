"use client";

import Image from "next/image";
import { useState } from "react";
import MunicipalityAssignModal from "@/components/UserManagement/municipalityassignmodal";
import Spinner from "@/components/spinner";

export default function UserViewer({
  onSuccess,
  onClose,
  user,
}: {
  onClose: () => void;
  onSuccess: () => void;
  user: Record<string, any>;
}) {
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const getRoleName = (role: number | null | undefined) => {
    switch (role ?? 0) {
      case 1:
        return "Worker";
      case 2:
        return "Admin";
      default:
        return "User";
    }
  };


  return (
      <section
        className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-60"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <article
          className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-y-auto p-8 relative
            max-h-[90vh] md:max-h-[85vh] w-[95vw] md:w-auto
            ${user.image ? "min-w-[90vw] md:min-w-[40%] lg:max-w-3xl" : "md:max-w-lg"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <header>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl font-bold"
              aria-label="Close dialog"
            >
              ×
            </button>
          <h2 className="text-2xl font-bold text-center text-black mb-6">User Details</h2>
        </header>

        <section className="flex flex-col md:flex-row md:gap-6 text-black">
          <section className="flex flex-col min-w-[48%] gap-4 flex-1">
            <section className="border-[2px] rounded-xl border-brand-secondary p-3 bg-white/40 shadow-sm">
              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>
              
              <section><strong>Role:</strong>
              <p className=" px-4 inline-block w-fit py-1.5 bg-teal-500/80 text-white text-sm font-semibold rounded-full shadow-md">
                 {getRoleName(user.user_types_id)}
              </p>
              </section>

              <p>
                <strong>Municipality:</strong> {user.municipality}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                <time dateTime={user.createdAt}>
                  {new Date(user.createdAt).toLocaleString()}
                </time>
              </p>

              <p>
                <strong>Updated:</strong>{" "}
                <time dateTime={user.updatedAt}>
                  {new Date(user.updatedAt).toLocaleString()}
                </time>
              </p>
            </section>

            

          </section>

          {user.image && (
            <section className="min-w-[48%] py-4 md:py-0 flex items-start mb-4 sm:mb-0 justify-center">
              <figure className="relative w-full h-full flex items-center justify-center bg-white/80 rounded-xl overflow-hidden border-[2px] border-brand-secondary">
                {loading && <Spinner />}
                <Image
                  src={user.image}
                  alt="user image"
                  width={800}
                  height={800}
                  className={`w-full h-auto object-contain transition-opacity duration-300 p-2 ${
                    loading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setLoading(false)}
                />

              </figure>
            </section>
          )}
          
        </section>

        <section className="flex flex-col sm:flex-row gap-3  w-full md:mt-3">
            {((user.user_types_id ?? 0) === 1) && (
              <button onClick={() => setShowAssignForm(true)} className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-secondary hover:text-black transition-colors duration-300">
                Assign Municipality
              </button>
            )}
        </section>
        
      </article>
      
      {showAssignForm && (
        <MunicipalityAssignModal 
          onSuccess={() => {
            onSuccess();
            onClose();
          }} 
          onClose={() => setShowAssignForm(false)} 
          uid={user.id}
        />
      )}

    </section>
  );
}