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