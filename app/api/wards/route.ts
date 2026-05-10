// app/api/wards/route.ts (Next.js App Router)
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  // Loop through province files like before
  const provinces = [
    "Eastern Cape","Free State","Gauteng","KwaZulu-Natal",
    "Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"
  ];

  const point = turf.point([parseFloat(lng), parseFloat(lat)]);

  for (const prov of provinces) {
    const safeName = prov.replace(/\s+/g, "_");
    const filePath = path.join(process.cwd(), "public", "data", `wards_${safeName}.json`);

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const geojson = JSON.parse(data);

      const foundWard = geojson.features.find((ward: any) =>
        turf.booleanPointInPolygon(point, ward)
      );

      if (foundWard) {
        return NextResponse.json(foundWard); // only return the single polygon
      }
    } catch {
      // skip missing province files
    }
  }

  return NextResponse.json({ error: "Ward not found" }, { status: 404 });
}
