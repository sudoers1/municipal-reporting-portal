import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

// GET /api/assignments/stats/status
// Returns complaint counts grouped by assignment status for the logged-in worker
export const GET = withAuth(["Worker"], async (_req: Request, session: any) => {
  try {
    const workerId = session.user.id;

    const rows = await sql`
      SELECT
        a.status,
        COUNT(*)::int                                          AS count,
        ROUND(AVG(
          EXTRACT(EPOCH FROM (a.resolved_at - a.assigned_at)) / 3600
        )::numeric, 1)                                        AS avg_hours_to_resolve
      FROM assignments a
      WHERE a.workerid = ${workerId}
      GROUP BY a.status
      ORDER BY count DESC
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("Status stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch status stats"},
      { status: 500 }
    );
  }
});