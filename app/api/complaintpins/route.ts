// app/api/complaintpins/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const { ward } = await req.json();
    if (!ward) {
      return NextResponse.json({ error: "Ward object required" }, { status: 400 });
    }

    // Extract WardID from the selected ward's properties
    const wardId = ward.properties?.WardID;
    if (!wardId) {
      return NextResponse.json({ error: "WardID missing in ward properties" }, { status: 400 });
    }

    // Fetch complaints that match this ward_id, exclude pending pins, and restrict resolved complaints to the last month
    const complaints = await sql`
      SELECT c.complaintid, c.status, c.issuetype, c.details, c.image, c.coords, c.address, c.ward_id, c.municipality
      FROM complaints c
      LEFT JOIN assignments a ON c.complaintid = a.complaintid
      WHERE c.ward_id = ${wardId}
        AND LOWER(c.status) != 'pending'
        AND (
          LOWER(c.status) != 'resolved'
          OR a.resolved_at >= NOW() - INTERVAL '1 month'
        )
    `;

    return NextResponse.json(complaints);
  } catch (error) {
    console.error("Error fetching complaint pins:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint pins" },
      { status: 500 }
    );
  }
}
