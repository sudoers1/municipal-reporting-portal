import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { UserRole } from './types';



let test: string = process.env.DATABASE_URL!;
const sql = neon(test);

export async function getUserRole(id: string): Promise<UserRole> {
  const result = await sql`
    SELECT user_types_id FROM roles WHERE user_id = ${id}
  `;

  if (!result.length) return "Resident";

  const role = await sql`
    SELECT type_name FROM user_types WHERE id = ${result[0].user_types_id}
  `;

  return (role[0]?.type_name ?? "Resident") as UserRole;
}

export async function setUserRole(id: string, role: string): Promise<void> {
    const result = await sql`SELECT id from user_types WHERE type_name = ${role}`;
    if (!result[0]?.id) throw new Error(`Role '${role}' not found`);
    await sql.transaction([
        sql`DELETE FROM roles WHERE user_id = ${id}`,
        sql`INSERT INTO roles (user_id, user_types_id) VALUES (${id}, ${result[0].id})`,
    ]);
}

export async function setResident(userId: string): Promise<void> {
  const defaultRole = await sql`
    SELECT id FROM user_types WHERE type_name = 'Resident' LIMIT 1
  `;

  await sql`
    INSERT INTO roles (user_id, user_types_id)
    VALUES (${userId}, ${defaultRole[0].id})
    ON CONFLICT (user_id, user_types_id) DO NOTHING
  `;
}


