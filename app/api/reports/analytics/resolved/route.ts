import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

// GET /api/assignments/stats/resolved
// Returns weekly resolved complaint counts for the logged-in worker,
// plus avg resolution time (hours) per week.
// Uses resolved_at (set when status → Resolved) not updated_at.
export const GET = withAuth(["Worker"], async (_req: Request, session: any) => {
  try {
    const workerId = session.user.id;

    const rows = await sql`
      SELECT
        DATE_TRUNC('week', a.resolved_at)::date              AS week,
        COUNT(*)::int                                         AS resolved,
        ROUND(AVG(
          EXTRACT(EPOCH FROM (a.resolved_at - a.assigned_at)) / 3600
        )::numeric, 1)                                       AS avg_hours
      FROM assignments a
      WHERE a.workerid    = ${workerId}
        AND a.status      = 'Resolved'
        AND a.resolved_at IS NOT NULL
      GROUP BY week
      ORDER BY week ASC
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("Resolved stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch resolved stats" },
      { status: 500 }
    );
  }
});