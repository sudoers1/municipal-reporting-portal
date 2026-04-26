"use server"

import { sql } from "@/lib/db/neon";


export async function insertFeedbackwIMG(userid:string,complaintid: string,details: string,image:string) {
  const result = await sql ` INSERT INTO feedback ("userId","complaintId", details,image)
    VALUES (${userid},${complaintid},${details},${image}
    ) 
  `;
  return result;
}
