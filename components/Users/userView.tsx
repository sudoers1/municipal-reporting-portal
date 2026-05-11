"use client";

import Image from "next/image";
import { useState } from "react";
import MunicipalityAssignModal from "@/components/Users/municipalityassignmodal";
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
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
      <article
        className={`bg-brand-accent rounded-2xl  overflow-y-auto p-8 relative ${
          user.image ? "min-w-[40%] lg:max-w-3xl" : "md:max-w-lg"
        }`}
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header className="text-center mb-6 text-black">
          <h2 className="text-2xl font-bold">User Details</h2>
        </header>

        <section className="flex flex-col lg:flex-row md:gap-4 text-black h-[80%]">

          <section className="flex flex-col min-w-[48%] gap-4 flex-1 h-full">

            <section className="border-[3px] rounded-xl space-y-2 border-brand-primary p-3 flex-shrink-0 bg-white/80">
              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Role:</strong> {getRoleName(user.user_types_id)}
              </p>

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
             <section className="min-w-[48%] py-4 md:py-0 flex items-start mb-4 sm:mb-0">
              <figure className="w-full bg-brand-primary rounded-xl overflow-hidden border-[3px] border-brand-secondary flex justify-center">

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

        <section className="flex flex-col sm:flex-row gap-3 md:mt-3 w-full">
          {((user.user_types_id ?? 0) === 1 && user.municipality==="Not assigned") && (
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