"use server"

import { sql } from "@/lib/db/neon";

export async function insertComplaint(
  userid: string,
  issuetype: string,
  details: string,
  latitude: number,
  longitude: number
) {
  // I added storage of latitude and longitude here
  const result = await sql`
    INSERT INTO complaints (
      userid,
      municipality,
      creationtime,
      issuetype,
      details,
      latitude,
      longitude
    )
    VALUES (
      ${userid},
      ${"testmunicipality"},
      ${new Date()},
      ${issuetype},
      ${details},
      ${latitude},
      ${longitude}
    )
    RETURNING *
  `;

  return result;
}

export async function insertComplaintwIMG(
  userid: string,
  issuetype: string,
  details: string,
  image: string,
  latitude: number,
  longitude: number
) {
  // I added storage of latitude and longitude here
  const result = await sql`
    INSERT INTO complaints (
      userid,
      municipality,
      creationtime,
      issuetype,
      details,
      image,
      latitude,
      longitude
    )
    VALUES (
      ${userid},
      ${"testmunicipality"},
      ${new Date()},
      ${issuetype},
      ${details},
      ${image},
      ${latitude},
      ${longitude}
    )
    RETURNING *
  `;

  return result;
}

export async function readComplaints() {
  
  const result = await sql`
    SELECT * FROM complaints
  `;

  return result;
}
export async function readMyComplaints(userid:string|undefined) {
  
  const result = await sql`
    SELECT * FROM complaints WHERE userid=${userid}
  `;

  return result;
}
export async function readoneComplaint(complaintid: string) {
  const result = await sql`
    SELECT * FROM complaints
    WHERE complaintid = ${complaintid}
  `;

  return result[0] || null;
}

// added the two below for worker dashboard
export async function claimComplaint(complaintid: string, workerid: string) {
  await sql`
    UPDATE complaints
    SET workerid = ${workerid}, status = 'in_progress'
    WHERE complaintid = ${complaintid}
  `;
}
export async function updateComplaintStatus(complaintid: string, status: string) {
  await sql`
    UPDATE complaints
    SET status = ${status}
    WHERE complaintid = ${complaintid}
  `;
}
// end here