import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Resident"], async (req: Request, session: any) => {
  // fetch resident reports here
  const userId = session.user.id;

  const complaints = await sql`
    SELECT 
      complaintid,
      issuetype,
      details,
      creationtime,
      municipality
    FROM complaints
    WHERE userid = ${userId}
    ORDER BY creationtime DESC
  `;

  return NextResponse.json({
    message: "Resident reports fetched",
    reports: complaints
  });
});


export const POST = withAuth(["Resident"], async (req: Request, session: any) => {
  try {
    const userId = session.user.id;
    const { issuetype, details, municipality } = await req.json();

    if (!issuetype || !details || !municipality) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedTypes = ["Water", "Electricity", "Roads", "Sanitation"];

    if (!allowedTypes.includes(issuetype)) {
      return NextResponse.json(
        { message: "Invalid issue type" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO complaints (userid, issuetype, details, municipality)
      VALUES (${userId}, ${issuetype}, ${details}, ${municipality})
      RETURNING *
    `;

    return NextResponse.json({
      message: "Report submitted successfully",
      data: result[0]
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to submit report" },
      { status: 500 }
    );
  }
});