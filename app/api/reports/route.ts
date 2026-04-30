import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

const handler = async (req: Request, session?: any) => {
  try {
    const complaints = await sql`
      SELECT 
        issuetype,
        details,
        creationtime,
        userid,
        municipality,
        complaintid
      FROM complaints
      ORDER BY creationtime DESC
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
};

// toggle here
const DISABLE_AUTH = process.env.NODE_ENV === "development";

export const GET = DISABLE_AUTH
  ? (req: Request) => handler(req) // no auth
  : withAuth(["Admin"], handler);  // with auth