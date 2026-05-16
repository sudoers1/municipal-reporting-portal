import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const complaintid = searchParams.get("complaintid");

    if (!complaintid) {
      return NextResponse.json(
        { message: "Missing complaintid" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT 
        c.complaintid,
        c.issuetype,
        c.details,
        c.creationtime,
        c.userid,
        c.municipality,

        a.workerid,
        a.status AS assignment_status,
        a.assigned_at,

        u.name AS worker_name
      FROM complaints c
      LEFT JOIN assignments a
        ON c.complaintid = a.complaintid
      LEFT JOIN users u
        ON a.workerid = u.id
      WHERE c.complaintid = ${complaintid}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Report fetched",
      data: result[0],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch report" },
      { status: 500 }
    );
  }
});

// Note: Remember to notify resident and admin when report status changes
export const PATCH = withAuth(["Worker"], async (req: Request, session: any) => {
  try {
    const workerId = session.user.id;
    const { complaintid, status } = await req.json();

    if (!complaintid || !status) {
      return NextResponse.json(
        { message: "Missing complaintid or status" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["Acknowledged", "In progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT
        a.status AS previous_status,
        c.userid AS resident_id,
        c.issuetype
      FROM assignments a
      JOIN complaints c
        ON c.complaintid = a.complaintid
      WHERE a.complaintid = ${complaintid}
        AND a.workerid = ${workerId}
      LIMIT 1
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { message: "Assignment not found or not authorized" },
        { status: 404 }
      );
    }

    const previousStatus = existing[0].previous_status;
    const residentId = existing[0].resident_id;
    const issueType = existing[0].issuetype;

    const result = await sql`
      UPDATE assignments
      SET 
        status = ${status},
        updated_at = NOW(),
        started_at = CASE
          WHEN ${status} = 'In progress' AND started_at IS NULL THEN NOW()
          ELSE started_at
        END,
        resolved_at = CASE
          WHEN ${status} = 'Resolved' THEN NOW()
          ELSE NULL
        END
      WHERE complaintid = ${complaintid}
        AND workerid = ${workerId}
      RETURNING *
    `;

    await sql`
      UPDATE complaints
      SET status = ${status}
      WHERE complaintid = ${complaintid}
    `;

    if (status === "In progress" && previousStatus !== "In progress") {
      await sql`
        INSERT INTO notifications (
          user_id,
          type,
          title,
          body
        )
        VALUES (
          ${residentId},
          'complaint_in_progress',
          'Complaint in progress',
          ${`Your ${issueType} complaint is now being worked on.`}
        )
      `;
    }

    if (status === "Resolved" && previousStatus !== "Resolved") {
      await sql`
        INSERT INTO notifications (
          user_id,
          type,
          title,
          body
        )
        VALUES (
          ${residentId},
          'complaint_resolved',
          'Complaint resolved',
          ${`Your ${issueType} complaint has been marked as resolved.`}
        )
      `;
    }

    return NextResponse.json({
      message: "Status updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Failed to update status:", error);

    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
});