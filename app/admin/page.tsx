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
      <section>
        <h1 className="text-3xl md:text-5xl p-4 font-bold text-gray-900 text-center drop-shadow-md">
          Administrative Control Center
        </h1>
        <p className="text-xl font-bold p-4 text-gray-900 text-center drop-shadow-md">Manage your municipality's operations by tracking service metrics, resolving citizen complaints, and coordinating your workforce from a single centralized hub.</p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <Tiles/>
      </section>
    </main>
  );}
}