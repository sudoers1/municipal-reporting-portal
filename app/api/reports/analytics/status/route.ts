// app/api/assignments/stats/status/route.ts
import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const GET = withAuth(["Worker"], async (_req: Request, session: any) => {
  try {
    const workerId = session.user.id;

    const [statusRows, userRows] = await Promise.all([
      sql`
        SELECT
          a.status,
          COUNT(*)::int                                        AS count,
          ROUND(AVG(
            EXTRACT(EPOCH FROM (a.resolved_at - a.assigned_at)) / 3600
          )::numeric, 1)                                      AS avg_hours_to_resolve
        FROM assignments a
        WHERE a.workerid = ${workerId}
        GROUP BY a.status
        ORDER BY count DESC
      `,
      sql`
        SELECT um.municipality
        FROM user_municipality um
        WHERE um.userid = ${workerId}
        LIMIT 1
      `,
    ]);

    return NextResponse.json({
      data: statusRows,
      municipality: userRows[0]?.municipality ?? null,
    });
  } catch (error) {
    console.error("Status stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch status stats" },
      { status: 500 }
    );
  }
});