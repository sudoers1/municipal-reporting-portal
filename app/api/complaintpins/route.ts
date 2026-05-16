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

    // Fetch complaints that match this ward_id directly
    const complaints = await sql`
      SELECT complaintid, status, issuetype, details, image, coords, address, ward_id, municipality
      FROM complaints
      WHERE ward_id = ${wardId}
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
