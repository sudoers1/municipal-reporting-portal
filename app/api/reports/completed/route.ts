import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  try {
    const workerId = session.user.id;
    const role = session.user.role;

    const complaints =
      role === "Admin"
        ? await sql`
            SELECT 
              a.id AS assignment_id,
              a.workerid,
              a.status AS assignment_status,
              a.status AS status,
              a.assigned_at,
              a.started_at,
              a.updated_at,
              a.resolved_at,

              c.complaintid,
              c.issuetype,
              c.details,
              c.creationtime,
              c.userid,
              c.municipality,
              c.status AS complaint_status
            FROM complaints c
            JOIN assignments a ON c.complaintid = a.complaintid
            WHERE a.status = 'Resolved'
            ORDER BY a.resolved_at DESC
          `
        : await sql`
            SELECT 
              a.id AS assignment_id,
              a.workerid,
              a.status AS assignment_status,
              a.status AS status,
              a.assigned_at,
              a.started_at,
              a.updated_at,
              a.resolved_at,

              c.complaintid,
              c.issuetype,
              c.details,
              c.creationtime,
              c.userid,
              c.municipality,
              c.status AS complaint_status
            FROM complaints c
            JOIN assignments a ON c.complaintid = a.complaintid
            WHERE a.status = 'Resolved'
              AND a.workerid = ${workerId}
            ORDER BY a.resolved_at DESC
          `;

    return NextResponse.json({
      message: "Resolved complaints fetched successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching resolved complaints:", error);

    return NextResponse.json(
      { message: "Failed to fetch resolved complaints" },
      { status: 500 }
    );
  }
});