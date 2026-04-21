// app/api/wards/route.ts (Next.js App Router)
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = searchParams.get("province");

  if (!province) {
    return NextResponse.json({ error: "Province required" }, { status: 400 });
  }

  // 🔹 Replace spaces with underscores so "Northern Cape" -> "Northern_Cape"
  const safeName = province.replace(/\s+/g, "_");

  const filePath = path.join(process.cwd(), "public", "data", `wards_${safeName}.json`);

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const geojson = JSON.parse(data);
    return NextResponse.json(geojson);
  } catch (err) {
    return NextResponse.json({ error: `Province file not found for ${safeName}` }, { status: 404 });
  }
}
