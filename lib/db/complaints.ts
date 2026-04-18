"use server"

import { sql } from "@/lib/db/neon";


export async function insertComplaint(userid:string,issuetype: string,details: string) {
  const result =sql ` INSERT INTO complaints (userid,municipality, creationtime, issuetype, details)
    VALUES (${userid},${"testmunicipality"},${new Date()},${issuetype},${details}
    )
    RETURNING *
  `;

  console.log("backend result", result);
  return result;
}
export async function insertComplaintwIMG(userid:string,issuetype: string,details: string,image:string) {
  const result =sql ` INSERT INTO complaints (userid,municipality, creationtime, issuetype, details,image)
    VALUES (${userid},${"testmunicipality"},${new Date()},${issuetype},${details},${image}
    ) 
  `;
  return result;
}