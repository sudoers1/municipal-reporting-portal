// app/api/complaints/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db/complaints-admin-table"

export async function GET() {
  try {
    // Fetch all records from the 'complaints' table in Neon
    const complaints = await db.complaints.findMany({
      orderBy: {
        complaintid: 'desc' // Newest first
      }
    })

    return NextResponse.json(complaints)
  } catch (error) {
    console.error("[COMPLAINTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}