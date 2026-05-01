import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  // fetch unassigned reports here
  try {
      const complaints = await sql`
        SELECT 
          c.complaintid,
          c.issuetype,
          c.details,
          c.creationtime,
          c.userid,
          c.municipality
        FROM complaints c
        LEFT JOIN assignments a
          ON c.complaintid = a.complaintid
        WHERE a.complaintid IS NULL
        ORDER BY c.creationtime DESC
      `;
  
      console.log("Fetched complaints:", {
        count: complaints.length,
        sample: complaints[0] || null
      });
  
      return NextResponse.json({
        message: "Reports fetched successfully",
        data: complaints
      });
  
    } catch (error) {
      console.error("Error fetching complaints:", error);
  
      return NextResponse.json(
        { message: "Failed to fetch reports" },
        { status: 500 }
      );
    }
});