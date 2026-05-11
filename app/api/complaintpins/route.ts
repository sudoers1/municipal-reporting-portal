// app/api/complaintpins/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";
import * as turf from "@turf/turf";

export async function POST(req: Request) {
  try {
    const { ward } = await req.json();
    if (!ward) {
      return NextResponse.json({ error: "Ward polygon required" }, { status: 400 });
    }

    // Fetch all complaints from DB
    const complaints = await sql`
      SELECT complaintid, status, issuetype, details, image, coords, address
      FROM complaints
    `;

    // Filter server-side
    const filtered = complaints.filter((c: any) => {
      if (!c.coords) return false;
      const [latStr, lngStr] = c.coords.split(",").map((s: string) => s.trim());
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) return false;

      const point = turf.point([lng, lat]);
      return turf.booleanPointInPolygon(point, ward);
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching complaint pins:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint pins" },
      { status: 500 }
    );
  }
}
