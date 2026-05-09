import { NextResponse } from "next/server";
import {sql} from "@/lib/db/neon";

export async function GET(req: Request) {
  const analyticsData = await sql`
  Select
  issuetype,
  status,
  municipality,
  creationtime
  from complaints`;

  console.log("Fetched analytics data:", {
    count: analyticsData.length,
    sample: analyticsData[0] || null
  });

  return NextResponse.json({
    message: "Public analytics data",
    data: analyticsData
  });
}