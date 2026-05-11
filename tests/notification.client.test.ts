import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/lib/notifications/client';
import type { Notification } from '@/lib/notifications/types';

const mockMarkAllRead = jest.fn().mockImplementation(() => Promise.resolve(undefined));
const mockMarkOneRead = jest.fn().mockImplementation(() => Promise.resolve(undefined));

const mockActions = {
  markAllRead: mockMarkAllRead,
  markOneRead: mockMarkOneRead,
};

const mockNotification: Notification = {
  id: '1',
  type: 'general',
  title: 'Test',
  body: 'Hello',
  read: false,
  created_at: new Date().toISOString(),
};

const mockEventSource = {
  onmessage: null as any,
  onerror: null as any,
  close: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (global as any).EventSource = jest.fn(() => mockEventSource);
});

describe('useNotifications', () => {
  it('initialises with provided notifications', () => {
    const { result } = renderHook(() =>
      useNotifications([mockNotification], mockActions)
    );
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('1');
  });

  it('initialises with empty array when none provided', () => {
    const { result } = renderHook(() =>
      useNotifications([], mockActions)
    );
    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.unreadCount).toBe(0);
  });

  it('calculates initial unread count correctly', () => {
    const notifications = [
      { ...mockNotification, read: false },
      { ...mockNotification, id: '2', read: true },
    ];
    const { result } = renderHook(() =>
      useNotifications(notifications, mockActions)
    );
    expect(result.current.unreadCount).toBe(1);
  });

  it('adds incoming SSE notification to the top of the list', () => {
    const { result } = renderHook(() =>
      useNotifications([], mockActions)
    );

    act(() => {
      mockEventSource.onmessage({ data: JSON.stringify(mockNotification) });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('1');
    expect(result.current.unreadCount).toBe(1);
  });

  it('prepends new SSE notifications before existing ones', () => {
    const existing = { ...mockNotification, id: 'existing' };
    const { result } = renderHook(() =>
      useNotifications([existing], mockActions)
    );

    act(() => {
      mockEventSource.onmessage({
        data: JSON.stringify({ ...mockNotification, id: 'new' }),
      });
    });

    expect(result.current.notifications[0].id).toBe('new');
    expect(result.current.notifications[1].id).toBe('existing');
  });

  it('markAllRead sets unread count to 0 and marks all notifications read', async () => {
    const { result } = renderHook(() =>
      useNotifications([mockNotification], mockActions)
    );

    await act(async () => {
      await result.current.markAllRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every((n) => n.read)).toBe(true);
    expect(mockMarkAllRead).toHaveBeenCalled();
  });

  it('markOneRead marks a single notification read and decrements unread count', async () => {
    const { result } = renderHook(() =>
      useNotifications([mockNotification], mockActions)
    );

    await act(async () => {
      await result.current.markOneRead('1');
    });

    expect(result.current.notifications[0].read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(mockMarkOneRead).toHaveBeenCalledWith('1');
  });

  it('markOneRead does not go below 0 for unread count', async () => {
    const readNotification = { ...mockNotification, read: true };
    const { result } = renderHook(() =>
      useNotifications([readNotification], mockActions)
    );

    await act(async () => {
      await result.current.markOneRead('1');
    });

    expect(result.current.unreadCount).toBe(0);
  });

  it('closes EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useNotifications([], mockActions)
    );
    unmount();
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it('closes EventSource on error', () => {
    renderHook(() => useNotifications([], mockActions));
    act(() => {
      mockEventSource.onerror(new Event('error'));
    });
    expect(mockEventSource.close).toHaveBeenCalled();
  });
});