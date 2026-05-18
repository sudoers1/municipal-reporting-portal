import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { complaintid, workerid, priority} = body;

    if (!complaintid || !workerid||priority === null) {
      return NextResponse.json(
        { error: "Missing complaintid or workerid or priority" },
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
    await sql`
      UPDATE complaints
      SET 
        priority = ${priority},
        status = 'Acknowledged'
      WHERE complaintid = ${complaintid}
`;

    return NextResponse.json(result[0],{ status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}