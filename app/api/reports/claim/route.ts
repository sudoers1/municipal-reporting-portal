import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const POST = withAuth(["Worker"], async (req: Request, session: any) => {
  try {
    const workerId = session?.user?.id;

    if (!workerId) {
      return NextResponse.json(
        { message: "Missing authenticated user" },
        { status: 401 }
      );
    }

    const { complaintid } = await req.json();

    if (!complaintid) {
      return NextResponse.json(
        { message: "Missing complaintid" },
        { status: 400 }
      );
    }

    const complaintResult = await sql`
      SELECT userid
      FROM complaints
      WHERE complaintid = ${complaintid}
      LIMIT 1
    `;

    if (complaintResult.length === 0) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const complaintOwnerId = complaintResult[0].userid;

    if (String(complaintOwnerId) === String(workerId)) {
      return NextResponse.json(
        { message: "You cannot claim a complaint you created" },
        { status: 403 }
      );
    }

    await sql`
      INSERT INTO assignments (complaintid, workerid, status)
      VALUES (${complaintid}, ${workerId}, 'Acknowledged')
    `;

    await sql`
      UPDATE complaints
      SET status = 'Acknowledged'
      WHERE complaintid = ${complaintid}
    `;

    return NextResponse.json(
      {
        message: "Report claimed successfully",
        complaintid,
        workerid: workerId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json(
        { message: "Complaint already assigned" },
        { status: 409 }
      );
    }

    console.error("Claim report error:", err);

    return NextResponse.json(
      { message: "Failed to claim report" },
      { status: 500 }
    );
  }
});