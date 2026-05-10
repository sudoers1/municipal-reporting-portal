"use server"

import { sql } from "@/lib/db/neon";

export async function readAssignments() {
  const result = await sql`
    SELECT 
      a.*, 
      u.name AS worker_name 
    FROM assignments a
    LEFT JOIN "user" u ON a.workerid = u.id
  `;

  return result;
}

export async function readWorkerAssignments(workerid: string) {
  const result = await sql`
    SELECT * FROM assignments 
    WHERE workerid = ${workerid}
  `;
  return result;
}

export async function updateAssignmentStatus(id: number, status: string) {
  const result = await sql`
    UPDATE assignments
    SET status = ${status}, updated_at = ${new Date()}
    WHERE id = ${id}
    RETURNING *
  `;
  return result;
}