import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

export const GET = withAuth(["Worker", "Admin"], async () => {
  try {
    const rows = await sql`
      SELECT
        pd.id,
        pd.original_complaint_id,
        pd.duplicate_complaint_id,
        pd.distance_meters,
        pd.review_status,

        original.complaintid AS original_id,
        original.userid AS original_userid,
        original.ward_id AS original_ward_id,
        original.municipality AS original_municipality,
        original.status AS original_status,
        original.image AS original_image,
        original.issuetype AS original_issuetype,
        original.details AS original_details,
        original.creationtime AS original_creationtime,
        original.latitude AS original_latitude,
        original.longitude AS original_longitude,
        original.address AS original_address,
        original.coords AS original_coords,
        original.priority AS original_priority,
        original.linked_complaint_id AS original_linked_complaint_id,

        duplicate.complaintid AS duplicate_id,
        duplicate.userid AS duplicate_userid,
        duplicate.ward_id AS duplicate_ward_id,
        duplicate.municipality AS duplicate_municipality,
        duplicate.status AS duplicate_status,
        duplicate.image AS duplicate_image,
        duplicate.issuetype AS duplicate_issuetype,
        duplicate.details AS duplicate_details,
        duplicate.creationtime AS duplicate_creationtime,
        duplicate.latitude AS duplicate_latitude,
        duplicate.longitude AS duplicate_longitude,
        duplicate.address AS duplicate_address,
        duplicate.coords AS duplicate_coords,
        duplicate.priority AS duplicate_priority,
        duplicate.linked_complaint_id AS duplicate_linked_complaint_id

      FROM possible_duplicates pd
      JOIN complaints original
        ON original.complaintid = pd.original_complaint_id
      JOIN complaints duplicate
        ON duplicate.complaintid = pd.duplicate_complaint_id
      WHERE pd.review_status = 'Pending'
      ORDER BY pd.id DESC
    `;

    const duplicates = rows.map((row: any) => ({
      ...row,

      distance_meters:
        row.distance_meters === null ? null : Number(row.distance_meters),

      original_report: {
        complaintid: row.original_id,
        userid: row.original_userid,
        ward_id: row.original_ward_id,
        municipality: row.original_municipality,
        status: row.original_status,
        image: row.original_image,
        issuetype: row.original_issuetype,
        details: row.original_details,
        creationtime: row.original_creationtime,
        latitude: row.original_latitude,
        longitude: row.original_longitude,
        address: row.original_address,
        coords: row.original_coords,
        priority: row.original_priority,
        linked_complaint_id: row.original_linked_complaint_id,
      },

      duplicate_report: {
        complaintid: row.duplicate_id,
        userid: row.duplicate_userid,
        ward_id: row.duplicate_ward_id,
        municipality: row.duplicate_municipality,
        status: row.duplicate_status,
        image: row.duplicate_image,
        issuetype: row.duplicate_issuetype,
        details: row.duplicate_details,
        creationtime: row.duplicate_creationtime,
        latitude: row.duplicate_latitude,
        longitude: row.duplicate_longitude,
        address: row.duplicate_address,
        coords: row.duplicate_coords,
        priority: row.duplicate_priority,
        linked_complaint_id: row.duplicate_linked_complaint_id,
      },
    }));

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