"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ComplaintsTable from "@/components/complaintsTable";
import { readMyComplaints } from "@/lib/db/complaints";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, isPending  } = authClient.useSession();

  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);

  const router = useRouter();

  // Handle redirect for unauthenticated users and gets from neon
  useEffect(() => {
    if (!isPending) 
    {
      if(!session)
      {
        router.push('/'); // Redirect to public
      }
      async function getComplaints() {
        const data= await readMyComplaints(session?.user?.id);
        setComplaints(data);
        setLoading(false);
      }
      getComplaints();
    }
  }, [session, isPending, router]);
  
 

    if (isPending||loading){ return (
    <main
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
        <section className="flex flex-col items-center gap-4">
          <section className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-semibold">Loading your profile...</p>
        </section>
      </section>
    </main>
  );}

  return (
  <main
    id="dashboard"
    className="w-screen min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/municipality.png')" }}
  >
    <section className="p-4 md:p-8 lg:p-12 bg-black/50 min-h-screen">
      
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 md:mb-12">
        My Profile
      </h1>
      
      <section className="max-w-4xl mx-auto bg-brand-primary rounded-2xl p-6 md:p-8 shadow-2xl ">
        {/*add stuff here when we have more user info. for example, if i wasnt lazy i would get provider from accounts table*/ }
        <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          <figure className="flex-shrink-0">
            <img 
              src={session?.user?.image ?? "/default-avatar.png"} 
              alt={`${session?.user?.name}'s avatar`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-brand-secondary"
            />
          </figure>
          
          <section className="flex-1 text-center md:text-left space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Name: {session?.user?.name}
            </h2>
            <p className="text-gray-200 text-base md:text-lg">
              Email: {session?.user?.email}
            </p>
            <p className="text-gray-200 text-base md:text-lg">
              First Used Site on: {session?.user?.createdAt.toDateString()}
            </p>
            <strong className="inline-block px-4 py-1.5 bg-brand-accent text-white text-sm font-semibold rounded-full shadow-md">
              {session?.user?.role || "Resident"}
            </strong>
            
            
          </section>
        </section>
      </section>
      
      <h2 className="mt-12 md:mt-16 mb-6 text-3xl md:text-5xl font-bold text-white text-center">
        My Reports
      </h2>
      <figure className="flex justify-center">
            <ComplaintsTable complaints={complaints} />
      </figure>
      
    </section>
  </main>
);}