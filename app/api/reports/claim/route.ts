import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const POST = withAuth(["Worker"], async (req: Request, session: any) => {
  try {
    const workerId = session.user.id;
    const { complaintid } = await req.json();

    if (!complaintid) {
      return NextResponse.json(
        { message: "Missing complaintid" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO assignments (complaintid, workerid, status)
      VALUES (${complaintid}, ${workerId}, 'In progress')
    `;

    return NextResponse.json({
      message: "Report claimed successfully",
      complaintid,
    });

  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json(
        { message: "Complaint already assigned" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { message: "Failed to claim report" },
      { status: 500 }
    );
  }
});