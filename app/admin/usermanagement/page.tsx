"use client"

import { readUsers } from "@/lib/db/usersneon";
import UsersTable from "@/components/UserManagement/userTable";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserViewer from "@/components/UserManagement/userView";


type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  user_types_id: number;
  municipality: string;
};

export default function UserManagement() {

  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    

  if(isPending||loading){return (
        <main className="w-screen min-h-screen bg-linear-to-br from-white via-teal-100 to-teal-300">
            <section className="p-8 bg-black/15  min-h-screen flex items-center justify-center">
                <Spinner splash="Users" />
            </section>
        </main>
      );}
  else{
  return (
    <main
      className="w-screen min-h-[120vh] overflow-y-auto bg-cover bg-center bg-linear-to-br from-white via-teal-100 to-teal-300 bg-no-repeat"
    >
      <section className="p-8 space-y-10  min-h-[120vh] flex flex-col">
<header>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 z-10 text-center drop-shadow-md">
            Manage Users
          </h1>
        </header>



        <article className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5">
          <UsersTable users={users} setSelectedUser={(user:User)=>setSelectedUser(user)} />
        </article>
      </section>

            {selectedUser && (
        <UserViewer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={reload}
        />
      )}
    </main>
  );}
}