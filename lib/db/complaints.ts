"use server";

import { sql } from "@/lib/db/neon";

// Insert complaint WITHOUT image
export async function insertComplaint(
  userid: string,
  ward_id: string,
  municipality: string,
  issuetype: string,
  details: string,
  address: string,
  coords: string
) {
  const result = await sql`
    INSERT INTO complaints (
      userid, ward_id, municipality, creationtime,
      issuetype, details, address, coords
    )
    VALUES (
      ${userid}, ${ward_id}, ${municipality}, ${new Date()},
      ${issuetype}, ${details}, ${address}, ${coords}
    )
    RETURNING *
  `;
  return result;
}

// Insert complaint WITH image
export async function insertComplaintwIMG(
  userid: string,
  ward_id: string,
  municipality: string,
  issuetype: string,
  details: string,
  image: string,
  address: string,
  coords: string
) {
  const result = await sql`
    INSERT INTO complaints (
      userid, ward_id, municipality, creationtime,
      issuetype, details, image, address, coords
    )
    VALUES (
      ${userid}, ${ward_id}, ${municipality}, ${new Date()},
      ${issuetype}, ${details}, ${image}, ${address}, ${coords}
    )
    RETURNING *
  `;
  return result;
}

// Read all complaints
export async function readComplaints() {
  const result = await sql`
    SELECT * FROM complaints
  `;
  return result;
}

export async function readUnassignedComplaints() {
  const result = await sql`
    SELECT * FROM complaints c
    WHERE NOT EXISTS (
      SELECT 1 FROM assignments a 
      WHERE a.complaintid = c.complaintid
    )
  `;
  return result;
}


// Read complaints by user
export async function readMyComplaints(userid: string | undefined) {
  const result = await sql`
    SELECT * FROM complaints WHERE userid = ${userid}
  `;
  return result;
}

// Read single complaint
export async function readoneComplaint(complaintid: string) {
  const result = await sql`
    SELECT * FROM complaints WHERE complaintid = ${complaintid}
  `;
  return result[0] || null;
}

// Worker dashboard functions
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
export async function getCompDate(cid: string | undefined) {
  if (!cid) return null;
  
  const result = await sql`
    SELECT resolved_at FROM assignments WHERE complaintid = ${cid}
  `;
  
  if (result.length === 0 || !result[0].resolved_at) {
    return null;
  }
  
  return new Date(result[0].resolved_at);
}
//end here