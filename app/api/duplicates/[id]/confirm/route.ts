import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const POST = withAuth(
  ["Worker", "Admin"],
  async (req: Request, session: any) => {
    try {
      const url = new URL(req.url);

      const parts = url.pathname.split("/");
      const id = parts[parts.length - 2];

      const duplicateReviewId = Number(id);
      const workerId = session.user.id;

      if (!Number.isInteger(duplicateReviewId)) {
        return NextResponse.json(
          { message: "Invalid duplicate review id" },
          { status: 400 }
        );
      }

      const result = await sql`
        WITH selected_duplicate AS (
          UPDATE possible_duplicates
          SET
            review_status = 'Confirmed',
            verified_by = ${workerId},
            verified_at = NOW()
          WHERE id = ${duplicateReviewId}
            AND review_status = 'Pending'
          RETURNING
            id,
            original_complaint_id,
            duplicate_complaint_id,
            review_status,
            verified_by,
            verified_at
        ),

        mark_duplicate_complaint AS (
          UPDATE complaints c
          SET
            status = 'Duplicate',
            linked_complaint_id = sd.original_complaint_id
          FROM selected_duplicate sd
          WHERE c.complaintid = sd.duplicate_complaint_id
          RETURNING
            c.complaintid,
            c.status,
            c.linked_complaint_id
        ),

        bump_original_priority AS (
          UPDATE complaints c
          SET priority = LEAST(COALESCE(c.priority, 0) + 1, 3)
          FROM selected_duplicate sd
          WHERE c.complaintid = sd.original_complaint_id
          RETURNING
            c.complaintid,
            c.priority
        )

        SELECT
          sd.id AS duplicate_review_id,
          sd.original_complaint_id,
          sd.duplicate_complaint_id,
          sd.review_status,
          sd.verified_by,
          sd.verified_at,
          mdc.status AS duplicate_status,
          mdc.linked_complaint_id,
          bop.priority AS original_priority
        FROM selected_duplicate sd
        JOIN mark_duplicate_complaint mdc ON true
        JOIN bump_original_priority bop ON true
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
        message: "Duplicate confirmed successfully",
        duplicate: result[0],
      });
    } catch (err) {
      console.error("Confirm duplicate error:", err);

      return NextResponse.json(
        { message: "Failed to confirm duplicate" },
        { status: 500 }
      );
    }
  }
);