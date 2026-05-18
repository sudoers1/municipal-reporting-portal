"use client"

import { readUnassignedComplaints } from "../../lib/db/complaints";
import { useState, useEffect } from "react";
import AdminComplaintsTable from "../AdminComplaints/AdminComplaintsTable";
import { Report } from "@/lib/structures/report";

type ComplaintRow = ReturnType<Report["toPlainObject"]>;

export default function CTable({  setSelectedComplaint,refreshKey
}: {
  setSelectedComplaint: (c: ComplaintRow) => void; refreshKey:number;
}) {

  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function getComplaints() {
      const data= await readUnassignedComplaints();
      setComplaints(data);
      setLoading(false);
    }

    getComplaints();
    
  }, [refreshKey]);

  
  return (
    <article className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5">
            <AdminComplaintsTable complaints={complaints} setSelectedComplaint={(comp:ComplaintRow)=>{setSelectedComplaint(comp)}} />
    </article>
    
        
    
  )
}