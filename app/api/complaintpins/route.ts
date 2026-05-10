import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        complaintid,
        municipality,
        status,
        image,
        issuetype,
        details,
        creationtime,
        userid,
        latitude,
        longitude,
        address,
        coords,
        priority
      FROM complaints
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching complaint pins:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint pins" },
      { status: 500 }
    );
  }
}
