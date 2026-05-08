'use client';

import { useState } from 'react';
import { useNotifications, type Notification } from '@/lib/notifications/client';
import { markAllReadAction, markOneReadAction } from '@/lib/notifications/actions';

export function NotificationBell({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications(
    initialNotifications,
    {
      markAllRead: markAllReadAction,
      markOneRead: markOneReadAction,
    }
  );

  const toggle = () => {
    setOpen((v) => !v);
  };

  return (
    <figure className="relative m-0">
      <button
        onClick={toggle}
        aria-label="Notifications"
        className="relative p-1 hover:opacity-75 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <mark className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </mark>
        )}
      </button>

      {open && (
        <aside className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white text-gray-800 rounded-lg shadow-lg border border-gray-100 z-50">
          <header className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand-accent hover:underline"
              >
                Mark all as read
              </button>
            )}
          </header>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-center text-gray-400">
              No notifications yet
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.body && (
                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                  )}
                  <time className="text-xs text-gray-400 mt-1 block">
                    {new Date(n.created_at).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </figure>
  );
}