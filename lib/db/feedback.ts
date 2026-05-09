"use server"

import { sql } from "@/lib/db/neon";


export async function insertFeedbackwIMG(userid:string,complaintid: string,details: string,image:string) {
  const result = await sql ` INSERT INTO feedback ("userId","complaintId", details,image,creationtime)
    VALUES (${userid},${complaintid},${details},${image},${ new Date()}
    ) 
  `;
  return result;
}


export async function readFeedback(complaintid: string) {
  const result = await sql`
    SELECT
      "user".name,
      feedback."feedbackId",
      feedback."complaintId",
      feedback."userId",
      feedback.details,
      feedback.image,
      feedback.creationtime

    FROM feedback INNER JOIN "user" ON "user".id = feedback."userId"

    WHERE feedback."complaintId" = ${complaintid}
  `;

  return result;
}