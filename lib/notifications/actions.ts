'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { markNotificationsRead, markOneRead, createNotification } from '@/lib/notifications/server';
import type { NotificationType } from '@/lib/notifications/server';

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user;
}

export async function markAllReadAction() {
  const user = await getUser();
  await markNotificationsRead(user.id);
}

export async function markOneReadAction(notificationId: string) {
  const user = await getUser();
  await markOneRead(notificationId, user.id);
}

export async function createNotificationAction(
  title: string,
  body?: string,
  type?: NotificationType
) {
  const user = await getUser();
  await createNotification(user.id, title, body, type);
}