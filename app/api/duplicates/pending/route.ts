import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const GET = withAuth(["Worker", "Admin"], async () => {
  try {
    const duplicates = await sql`
      SELECT
        pd.id,
        pd.original_complaint_id,
        pd.duplicate_complaint_id,
        pd.distance_meters,
        pd.review_status,

        original.complaintid AS original_id,
        original.issuetype AS original_issuetype,
        original.details AS original_details,
        original.address AS original_address,
        original.status AS original_status,
        original.priority AS original_priority,
        original.creationtime AS original_creationtime,
        original.latitude AS original_latitude,
        original.longitude AS original_longitude,

        duplicate.complaintid AS duplicate_id,
        duplicate.issuetype AS duplicate_issuetype,
        duplicate.details AS duplicate_details,
        duplicate.address AS duplicate_address,
        duplicate.status AS duplicate_status,
        duplicate.priority AS duplicate_priority,
        duplicate.creationtime AS duplicate_creationtime,
        duplicate.latitude AS duplicate_latitude,
        duplicate.longitude AS duplicate_longitude

      FROM possible_duplicates pd
      JOIN complaints original
        ON original.complaintid = pd.original_complaint_id
      JOIN complaints duplicate
        ON duplicate.complaintid = pd.duplicate_complaint_id
      WHERE pd.review_status = 'Pending'
      ORDER BY pd.id DESC
    `;

    return NextResponse.json({
      message: "Pending duplicates fetched successfully",
      data: duplicates,
    });
  } catch (err) {
    console.error("Fetch pending duplicates error:", err);

    return NextResponse.json(
      { message: "Failed to fetch pending duplicates" },
      { status: 500 }
    );
  }
});