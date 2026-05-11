"use server"

import { sql } from "@/lib/db/neon";



export async function readUsers() {
  
  const result = await sql`
SELECT
    "user".id,
    "user".name,
    "user".email,
    "user".image,
    "user"."createdAt",
    "user"."updatedAt",
    roles.user_types_id,
    user_municipality.municipality
FROM "user"

LEFT JOIN roles
    ON roles.user_id = "user".id

LEFT JOIN user_municipality
    ON user_municipality.userid = "user".id`;

  return result;
}

export async function readoneUser(userid: string) {
  const result = await sql`
    SELECT
        "user".id,
        "user".name,
        "user".email,
        "user".image,
        "user"."createdAt",
        "user"."updatedAt",
        roles.user_types_id,
        user_municipality.municipality
    FROM "user"

    LEFT JOIN roles
        ON roles.user_id = "user".id

    LEFT JOIN user_municipality
        ON user_municipality.userid = "user".id

    WHERE "user".id = ${userid}
  `;

  return result[0] || null;
}

export async function insertUserMunicipality(userid: string,municipality: string) 
{
  const result = await sql`
    INSERT INTO user_municipality (userid, municipality)
    VALUES (${userid}, ${municipality})
    RETURNING *
  `;
  return result[0] || null;
}