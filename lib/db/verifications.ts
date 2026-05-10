"use server"

import { sql } from "@/lib/db/neon";
import { setUserRole } from "./users";

export async function insertVerification(userid:string) {
    const result = await sql ` INSERT INTO verif_requests (user_id)
        VALUES (${userid})
    `;
}


export async function readApprovedVerifications() {
    const result = await sql`
        SELECT v.user_id, v.approved, u.name, u.email, u.image
        FROM verif_requests v
        LEFT JOIN "user" u ON u.id = v.user_id
        WHERE v.approved = true
    `;
    return result;
}

export async function readDeniedVerifications() {
    const result = await sql`
        SELECT v.user_id, v.approved, u.name, u.email, u.image
        FROM verif_requests v
        LEFT JOIN "user" u ON u.id = v.user_id
        WHERE v.approved = false
    `;
    return result;
}

export async function readPendingVerifications() {
    const result = await sql`
        SELECT v.user_id, v.approved, u.name, u.email, u.image
        FROM verif_requests v
        LEFT JOIN "user" u ON u.id = v.user_id
        WHERE v.approved IS NULL
    `;
    return result;
}

export async function approveVerification(userid:string) {
    const result = await sql`
        UPDATE verif_requests
        SET approved = true
        WHERE user_id = ${userid}
    `;
    setUserRole(userid, "Worker");
}

export async function rejectVerification(userid:string) {
    const result = await sql`
        UPDATE verif_requests
        SET approved = false
        WHERE user_id = ${userid}
    `;
}


