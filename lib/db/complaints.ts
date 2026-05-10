"use server"

import { sql } from "@/lib/db/neon";

// Insert complaint WITHOUT image
export async function insertComplaint(
  userid: string,
  issuetype: string,
  details: string,
  address: string,
  coords: string
) {
  const result = await sql`
    INSERT INTO complaints (userid, municipality, creationtime, issuetype, details, address, coords)
    VALUES (${userid}, ${"testmunicipality"}, ${new Date()}, ${issuetype}, ${details}, ${address}, ${coords})
    RETURNING *
  `;
  return result;
}

// Insert complaint WITH image
export async function insertComplaintwIMG(
  userid: string,
  issuetype: string,
  details: string,
  image: string,
  address: string,
  coords: string
) {
  const result = await sql`
    INSERT INTO complaints (userid, municipality, creationtime, issuetype, details, image, address, coords)
    VALUES (${userid}, ${"testmunicipality"}, ${new Date()}, ${issuetype}, ${details}, ${image}, ${address}, ${coords})
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
