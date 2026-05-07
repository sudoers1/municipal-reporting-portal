import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import {sql} from "@/lib/db/neon";


export const GET = withAuth(["Worker"], async (req: Request, session: any) => {
  try {
    const workerId = session.user.id;

    const assignedReports = await sql`
      SELECT
        a.id AS assignment_id,
        a.workerid,
        a.status AS assignment_status,
        a.assigned_at,
        a.updated_at,
        c.complaintid,
        c.issuetype,
        c.details,
        c.creationtime,
        c.userid,
        c.municipality,
        c.status AS complaint_status
      FROM assignments a
      JOIN complaints c ON c.complaintid = a.complaintid
      WHERE a.workerid = ${workerId}
        AND a.status != 'Resolved'
      ORDER BY a.assigned_at DESC
    `;

    return NextResponse.json({
      message: "Assigned reports fetched",
      data: assignedReports,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch assigned reports" },
      { status: 500 }
    );
  }
});

export const POST = withAuth(["Admin"], async (req: Request) => {
  try {
    const { complaintid, workerid } = await req.json();

    // Basic validation
    if (!complaintid || !workerid) {
      return NextResponse.json(
        { message: "Missing complaintid or workerid" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO assignments (complaintid, workerid, status)
      VALUES (${complaintid}, ${workerid}, 'Acknowledged')
    `;

    return NextResponse.json(
      { message: "Report assigned successfully" },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Assignment error:", err);

    // Unique constraint → already assigned
    if (err.code === "23505") {
      return NextResponse.json(
        { message: "Complaint already assigned" },
        { status: 409 }
      );
    }

    // Foreign key issues (invalid complaintid or workerid)
    if (err.code === "23503") {
      return NextResponse.json(
        { message: "Invalid complaint or worker ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to assign report" },
      { status: 500 }
    );
  }
});