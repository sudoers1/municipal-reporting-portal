import { sql } from '@/lib/db/neon';

export type NotificationType = 'general' | 'alert' | 'update';

export async function createNotification(
  userId: string,
  title: string,
  body?: string,
  type: NotificationType = 'general'
) {
  await sql`INSERT INTO notifications (user_id, type, title, body, created_at) VALUES (${userId}, ${type}, ${title}, ${body}, ${new Date()})`;

}

export async function getNotifications(userId: string) {
  const rows  = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 50`;
  return rows;
}

export async function markNotificationsRead(userId: string) {
  await sql`UPDATE notifications SET read = true WHERE user_id = ${userId} AND read = false`;
}

export async function markOneRead(notificationId: string, userId: string) {
  await sql`UPDATE notifications SET read = true WHERE id = ${notificationId} AND user_id = ${userId}`;
}

export async function getUnreadCount(userId: string) {
  const rows = await sql`SELECT COUNT(*) as count FROM notifications WHERE user_id ${userId} AND read = false`;
  return parseInt(rows[0].count);
}