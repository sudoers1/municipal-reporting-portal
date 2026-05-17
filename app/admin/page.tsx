"use client"

import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState,useEffect } from "react";
import Tiles from "@/components/Dashboard/AdminTiles";

export default function AdminPage() {

  const { data: session, isPending  } = authClient.useSession();
  const router = useRouter();
        
  // Handle redirect for invalid roles
  useEffect(() => {
    if (!isPending) 
    {
              
      if (session?.user.role!="Admin")
      {
        router.push('/'); // Redirect to public
      }
    }
  }, [session, isPending, router]);
          
  
      
        if(isPending){return (
              <main className="w-screen min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
                <section className="p-8 min-h-screen bg-black/15 flex items-center justify-center">
                  <Spinner splash="Dashboard" />
                </section>
              </main>
            );;}


  else{
  return (
    <main className="w-screen min-h-screen  overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300">
      <section className=" text-gray-800 bg-linear-to-br from-white to-teal-100 mx-4 mt-5 py-6 rounded-3xl shadow-2xl">
          <h1 className="text-2xl md:text-5xl font-bold text-center drop-shadow-lg">
            Administrative Control Center
          </h1>
          <p className="text-md md:text-xl text-center max-w-3xl mx-auto mt-4">
            Manage your municipality's operations by tracking service metrics, resolving citizen complaints, and coordinating your workforce from a single centralized hub.
          </p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <Tiles/>
      </section>
    </main>
  );}
}