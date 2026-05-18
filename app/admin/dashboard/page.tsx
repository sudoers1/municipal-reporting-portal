"use client"
import KPICards from "@/components/Dashboard/KPIcard";
import { readComplaints } from "../../../lib/db/complaints";
import StatusAnalytics from "@/components/Dashboard/StatusLegend";
import { readAssignments } from "@/lib/db/assignments";
import Spinner from "@/components/generalcomps/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState,useEffect } from "react";


export default function AdminDashboard(){

    const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
    const [assignmentData, setAssignments] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState(true);
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
            
              async function getComplaints() {
                const data= await readComplaints();
                setComplaints(data);
                const data2= await readAssignments();
                setAssignments(data2);

                setLoading(false);
              }
              getComplaints();
          }
        }, [session, isPending, router]);
    
      if(isPending||loading){return (
              <main className="w-screen min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
                <section className="p-8 min-h-screen bg-black/15 flex items-center justify-center">
                  <Spinner splash="Analytics" />
                </section>
              </main>
            );}


    return(
            <main className="text-center text-gray-900 p-4 flex bg-linear-to-br from-white via-teal-100 to-teal-300 flex-col gap-4">
                <h1 className="text-5xl font-semibold p-4">Administrative Dashboard</h1>
                <h2 className="text-3xl font-medium">Report Analytics</h2>
                <p className="text-xl">Overview of all submitted complaints categorized by their current status to ensure timely response and resolution.</p>
                <section className="py-4">
                    <KPICards data={assignmentData}/>
                </section>
                <h2 className="text-3xl font-medium">Task & Worker Analytics</h2>
                <p className="text-xl">Assess team productivity and resolution progress to optimize the dispatching of workers to active maintenance sites.</p>
                <section className="py-4">
                    {/* <MapView/> */}
                    <StatusAnalytics assignments={assignmentData}/>
                </section>
            </main>
    )
}