import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  try {

    const workerId = session.user.id;

    const complaints = await sql`
      SELECT 
        c.complaintid,
        c.issuetype,
        c.details,
        c.creationtime,
        c.userid,
        c.municipality,
        c.status,
        c.priority,
        c.address
      FROM complaints c
      JOIN user_municipality um
        ON TRIM(LOWER(um.municipality)) = TRIM(LOWER(c.municipality))
      WHERE um.userid = ${workerId}
        AND c.status = 'Pending'
        AND NOT EXISTS (
          SELECT 1
          FROM assignments a
          WHERE a.complaintid = c.complaintid
        )
      ORDER BY c.creationtime DESC
    `;

    return NextResponse.json({
      message: "Unassigned reports fetched successfully",
      data: complaints,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch unassigned reports" },
      { status: 500 }
    );
  }
});