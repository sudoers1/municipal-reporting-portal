import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import {sql} from "@/lib/db/neon";


export const GET = withAuth(["Worker"], async (req: Request, session: any) => {
  // fetch assigned reports here

  const assignedReports = await sql`
  select * from assignments
  `;

  return NextResponse.json({
    message: "Assigned reports fetched",
    reports: assignedReports
  });
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