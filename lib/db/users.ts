import { Pool } from "pg";
import { UserRole } from './types';

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION_STRING,
});

export async function getUserRole(id: string): Promise<UserRole> {
  const result = await pool.query(`
    SELECT ut.type_name 
    FROM roles r
    JOIN user_types ut ON ut.id = r.user_types_id
    WHERE r.user_id = $1
    LIMIT 1
  `, [id]);

  return (result.rows[0]?.type_name ?? "Resident") as UserRole;
}

export async function setUserRole(id: string, role: string): Promise<void> {
  const client = await pool.connect();
  try {
    const roleResult = await client.query(`SELECT id FROM user_types WHERE type_name = $1`, [role]);
    if (!roleResult.rows[0]?.id) throw new Error(`Role '${role}' not found`);
    await client.query('BEGIN');
    await client.query(`DELETE FROM roles WHERE user_id = $1`, [id]);
    await client.query(`INSERT INTO roles (user_id, user_types_id) VALUES ($1, $2)`, [id, roleResult.rows[0].id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function setResident(userId: string): Promise<void> {
  const defaultRole = await pool.query(`SELECT id FROM user_types WHERE type_name = 'Resident' LIMIT 1`);
  await pool.query(`
    INSERT INTO roles (user_id, user_types_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, user_types_id) DO NOTHING
  `, [userId, defaultRole.rows[0].id]);
}

export async function setAdmin(userId: string): Promise<void> {
  const client = await pool.connect();
  try {
    // 1. Get the Admin role ID dynamically
    const roleResult = await client.query(
      `SELECT id FROM user_types WHERE type_name = 'Admin' LIMIT 1`
    );
    
    if (!roleResult.rows[0]?.id) {
      throw new Error("Admin role not found in user_types table");
    }

    const adminRoleId = roleResult.rows[0].id;

    await client.query('BEGIN');
    
    // 2. Clear existing roles (if a user should only have one role at a time)
    await client.query(`DELETE FROM roles WHERE user_id = $1`, [userId]);
    
    // 3. Insert the Admin role
    await client.query(
      `INSERT INTO roles (user_id, user_types_id) VALUES ($1, $2)`,
      [userId, adminRoleId]
    );
    
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

}  
export async function getName(userId: string): Promise<string> {
  const result = await pool.query(`SELECT name FROM user WHERE id = $1`, [userId]);
  return result.rows[0]?.name ?? "Unknown";
}

export async function getEmail(userId: string): Promise<string> {
  const result = await pool.query(`SELECT email FROM user WHERE id = $1`, [userId]);
  return result.rows[0]?.email ?? "Unknown";
}

export async function getImage(userId: string): Promise<string> {
  const result = await pool.query(`SELECT image FROM user WHERE id = $1`, [userId]);
  return result.rows[0]?.image ?? "";
}