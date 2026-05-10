'use client';

import { useState, useEffect, useCallback } from 'react';

export type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
};

type NotificationActions = {
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
};

export function useNotifications(
  initialNotifications: Notification[] = [],
  actions: NotificationActions
) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(
    initialNotifications.filter((n) => !n.read).length
  );

  useEffect(() => {
    const es = new EventSource('/api/notifications/stream');
    es.onmessage = (e) => {
      const notif: Notification = JSON.parse(e.data);
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await actions.markAllRead();
  }, [actions]);

  const handleMarkOneRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    await actions.markOneRead(id);
  }, [actions]);

  return { notifications, unreadCount, markAllRead: handleMarkAllRead, markOneRead: handleMarkOneRead };
}