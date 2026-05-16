import { withAuth } from "@/lib/auth/server";
import { sql } from "@/lib/db/neon";
import { NextResponse } from "next/server";

const radiusByIssueType: Record<string, number> = {
  // Water
  "No Water Supply": 150,
  "Water Leaks": 150,
  "Low Water Pressure": 150,
  "Contaminated/Dirty Water": 150,

  // Electricity
  "Power Outages": 1000,
  "Downed Power Lines": 100,
  "Electricity Meter Issues": 100,

  // Waste Management
  "Missed Garbage Collection": 100,
  "Illegal Dumping": 100,
  "Overflowing Bins": 100,
  "Broken Refuse Bins": 100,

  // Roads & Transport
  "Potholes": 80,
  "Damaged or Collapsed Roads": 80,
  "Missing Road Signs": 80,
  "Faulty Traffic Lights": 100,
  "Poor Stormwater Drainage": 150,

  // Environmental & Sanitation
  "Sewage Spills": 150,
  "Blocked Drains": 150,
  "Flooding": 150,
};

const DEFAULT_RADIUS_METERS = 100;

export const POST = withAuth(["Resident", "Worker"], async (req: Request, session: any) => {
  try {
    const body = await req.json();

    const {
      ward_id,
      municipality,
      issuetype,
      details,
      image,
      address,
      coords,
      latitude,
      longitude,
    } = body;

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Missing authenticated user" },
        { status: 401 }
      );
    }

    if (!municipality || !issuetype || !details) {
      return NextResponse.json(
        { message: "Missing municipality, issuetype, or details" },
        { status: 400 }
      );
    }

    if (latitude === null || longitude === null || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Missing latitude or longitude" },
        { status: 400 }
      );
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { message: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { message: "Latitude or longitude is out of range" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO complaints (
        userid,
        ward_id,
        municipality,
        status,
        image,
        issuetype,
        details,
        creationtime,
        latitude,
        longitude,
        address,
        coords,
        priority
      )
      VALUES (
        ${userId},
        ${ward_id || null},
        ${municipality},
        'Pending',
        ${image || null},
        ${issuetype},
        ${details},
        ${new Date()},
        ${lat},
        ${lng},
        ${address || null},
        ${coords || null},
        0
      )
      RETURNING *
    `;

    const complaint = result[0];

    const radiusMeters = radiusByIssueType[complaint.issuetype] ?? DEFAULT_RADIUS_METERS;

    const possibleDuplicates = await sql`
    WITH nearby_complaints AS (
        SELECT
        complaintid,
        (
            6371000 * 2 * ASIN(
            SQRT(
                POWER(SIN(RADIANS((${lat} - latitude::float) / 2)), 2) +
                COS(RADIANS(${lat})) *
                COS(RADIANS(latitude::float)) *
                POWER(SIN(RADIANS((${lng} - longitude::float) / 2)), 2)
            )
            )
        ) AS distance_meters
        FROM complaints
        WHERE complaintid <> ${complaint.complaintid}
        AND issuetype = ${complaint.issuetype}
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        AND status <> 'Resolved'
        AND status <> 'Duplicate'
    )
    INSERT INTO possible_duplicates (
        original_complaint_id,
        duplicate_complaint_id,
        distance_meters,
        review_status
    )
    SELECT
        complaintid,
        ${complaint.complaintid},
        distance_meters,
        'Pending'
    FROM nearby_complaints
    WHERE distance_meters <= ${radiusMeters}
    RETURNING *
    `;

    return NextResponse.json(
        {
            message: "Complaint created successfully",
            complaint,
            possibleDuplicateCount: possibleDuplicates.length,
            possibleDuplicates,
        },
        { status: 201 }
        );
  } catch (err: any) {
    console.error("Create complaint error:", err);

    return NextResponse.json(
      { message: "Failed to create complaint" },
      { status: 500 }
    );
  }
});