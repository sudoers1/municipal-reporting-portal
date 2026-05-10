import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function GET() {
  try {
    const workers = await sql`
      SELECT u.id, u.name
      FROM "user" u
      INNER JOIN roles r
        ON u.id = r.user_id
      WHERE r.user_types_id = 1
      ORDER BY u.name ASC
    `;

    return NextResponse.json(workers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    );
  }
}