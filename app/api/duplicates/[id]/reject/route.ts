import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const POST = withAuth(
  ["Worker", "Admin"],
  async (
    req: Request,
    session: any,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await context.params;
      const duplicateReviewId = Number(id);
      const workerId = session.user.id;

      if (!Number.isInteger(duplicateReviewId)) {
        return NextResponse.json(
          { message: "Invalid duplicate review id" },
          { status: 400 }
        );
      }

      const result = await sql`
        UPDATE possible_duplicates
        SET
          review_status = 'Rejected',
          verified_by = ${workerId},
          verified_at = NOW()
        WHERE id = ${duplicateReviewId}
          AND review_status = 'Pending'
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json(
          {
            message:
              "Duplicate review not found, or it has already been reviewed",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Duplicate rejected successfully",
        duplicate: result[0],
      });
    } catch (err) {
      console.error("Reject duplicate error:", err);

      return NextResponse.json(
        { message: "Failed to reject duplicate" },
        { status: 500 }
      );
    }
  }
);