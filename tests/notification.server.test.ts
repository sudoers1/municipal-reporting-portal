jest.mock('@/lib/db/neon', () => ({
  sql: jest.fn().mockImplementation((strings: TemplateStringsArray, ...values: any[]) =>
    Promise.resolve([])
  ),
}));

import {
  getNotifications,
  markNotificationsRead,
  markOneRead,
  getUnreadCount,
  createNotification,
} from '@/lib/notifications/server';
import { sql } from '@/lib/db/neon';

const mockSql = sql as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockSql.mockImplementation(() => Promise.resolve([]));
});

describe('getNotifications', () => {
  it('queries for the correct user and returns rows', async () => {
    const mockRows = [
      {
        id: '1',
        type: 'general',
        title: 'Hello',
        read: false,
        created_at: new Date().toISOString(),
      },
    ];
    mockSql.mockImplementationOnce(() => Promise.resolve(mockRows));
    const result = await getNotifications('user-123');
    expect(mockSql).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });

  it('returns empty array when no notifications exist', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    const result = await getNotifications('user-123');
    expect(result).toEqual([]);
  });
});

describe('markNotificationsRead', () => {
  it('calls sql to mark all notifications read', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    await markNotificationsRead('user-123');
    expect(mockSql).toHaveBeenCalled();
  });
});

describe('markOneRead', () => {
  it('calls sql to mark a single notification read', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    await markOneRead('notif-1', 'user-123');
    expect(mockSql).toHaveBeenCalled();
  });
});

describe('getUnreadCount', () => {
  it('returns unread count as a number', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([{ count: '5' }]));
    const count = await getUnreadCount('user-123');
    expect(count).toBe(5);
  });

  it('returns 0 when no unread notifications', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([{ count: '0' }]));
    const count = await getUnreadCount('user-123');
    expect(count).toBe(0);
  });
});

describe('createNotification', () => {
  it('calls sql with correct values', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    await createNotification('user-123', 'Title', 'Body', 'alert');
    expect(mockSql).toHaveBeenCalled();
  });

  it('defaults type to general', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    await createNotification('user-123', 'Title');
    expect(mockSql).toHaveBeenCalled();
  });

  it('works without a body', async () => {
    mockSql.mockImplementationOnce(() => Promise.resolve([]));
    await createNotification('user-123', 'Title', undefined, 'update');
    expect(mockSql).toHaveBeenCalled();
  });
});