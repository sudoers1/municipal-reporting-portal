import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  try {
    const complaints = await sql`
      SELECT 
        c.complaintid,
        c.issuetype,
        c.details,
        c.creationtime,
        c.userid,
        c.municipality,
        a.status AS assignment_status
      FROM complaints c
      JOIN assignments a ON c.complaintid = a.complaintid
      WHERE a.status = 'Resolved'
      ORDER BY c.creationtime DESC
    `;

    console.log("Fetched resolved complaints:", {
      count: complaints.length,
      sample: complaints[0] || null
    });

    return NextResponse.json({
      message: "Resolved complaints fetched successfully",
      data: complaints
    });

  } catch (error) {
    console.error("Error fetching resolved complaints:", error);

    return NextResponse.json(
      { message: "Failed to fetch resolved complaints" },
      { status: 500 }
    );
  }
});