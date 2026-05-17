"use client"

import { readComplaints } from "../../lib/db/complaints";
import { useState, useEffect } from "react";
import ComplaintsTable from "../complaint/complaintsTable";
import AdminComplaintsTable from "../AdminComplaints/AdminComplaintsTable";

export default function CTable() {

  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getComplaints() {
      const data= await readComplaints();
      setComplaints(data);
      setLoading(false);
    }

    getComplaints();
    
  }, []);

  
  return (
    <section className="text-black">
        <figure className="flex md:justify-center">
            <AdminComplaintsTable complaints={complaints} />
        </figure>
    
    </section>
        
    
  )
}