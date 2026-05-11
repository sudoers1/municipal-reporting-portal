"use client"

import { readUsers } from "@/lib/db/usersneon";
import UsersTable from "@/components/UserManagement/userTable";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function UserManagement() {

  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending  } = authClient.useSession();

  const [refreshKey, setRefreshKey] = useState(0);
  const reload = () => setRefreshKey((k) => k + 1);


  const router = useRouter();
  
    // Handle redirect for invalid roles
    useEffect(() => {
      if (!isPending) 
      {
        
          if (session?.user.role!="Admin")
          {
              router.push('/'); // Redirect to public
          }
        
          async function getUsers() {
            const data= await readUsers();
            setUsers(data);
            setLoading(false);
          }
          getUsers();
      }
    }, [session, isPending, router,refreshKey]);
    
   
    
  useEffect(() => {



    
  }, []);

  if(isPending||loading){return (
    <main
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 bg-black/50 min-h-screen flex items-center justify-center">
        <Spinner splash="Users"/>
      </section>
    </main>
  );}
  else{
  return (
    <main
      className="w-screen min-h-[120vh] overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 space-y-10 md:bg-black/50 min-h-[120vh] flex flex-col">

        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            Manage Users
          </h1>
        </header>



        <figure className="flex md:justify-center">
          <UsersTable users={users} onSuccess={reload} />
        </figure>


      </section>
    </main>
  );}
}