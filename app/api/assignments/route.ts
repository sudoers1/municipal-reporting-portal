import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { complaintid, workerid } = body;

    if (!complaintid || !workerid) {
      return NextResponse.json(
        { error: "Missing complaintid or workerid" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO assignments (
        complaintid,
        workerid,
        status
      )
      VALUES (
        ${complaintid},
        ${workerid},
        'Acknowledged'
      )
      RETURNING *
    `;

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}