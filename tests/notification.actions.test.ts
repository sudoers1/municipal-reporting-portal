jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers()),
}));

jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@/lib/notifications/server', () => ({
  markNotificationsRead: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
  markOneRead: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
  createNotification: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
}));

import { markAllReadAction, markOneReadAction, createNotificationAction } from '@/lib/notifications/actions';
import { auth } from '@/lib/auth';
import { markNotificationsRead, markOneRead, createNotification } from '@/lib/notifications/server';

const mockGetSession = auth.api.getSession as unknown as jest.Mock;
const mockMarkNotificationsRead = markNotificationsRead as unknown as jest.Mock;
const mockMarkOneRead = markOneRead as unknown as jest.Mock;
const mockCreateNotification = createNotification as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('markAllReadAction', () => {
  it('calls markNotificationsRead with the current user id', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: { id: 'user-123' } })
    );
    await markAllReadAction();
    expect(mockMarkNotificationsRead).toHaveBeenCalledWith('user-123');
  });

  it('throws if session is null', async () => {
    mockGetSession.mockImplementationOnce(() => Promise.resolve(null));
    await expect(markAllReadAction()).rejects.toThrow('Unauthorized');
  });

  it('throws if user id is missing', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: {} })
    );
    await expect(markAllReadAction()).rejects.toThrow('Unauthorized');
  });
});

describe('markOneReadAction', () => {
  it('calls markOneRead with notification id and user id', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: { id: 'user-123' } })
    );
    await markOneReadAction('notif-1');
    expect(mockMarkOneRead).toHaveBeenCalledWith('notif-1', 'user-123');
  });

  it('throws if session is null', async () => {
    mockGetSession.mockImplementationOnce(() => Promise.resolve(null));
    await expect(markOneReadAction('notif-1')).rejects.toThrow('Unauthorized');
  });

  it('throws if user id is missing', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: {} })
    );
    await expect(markOneReadAction('notif-1')).rejects.toThrow('Unauthorized');
  });
});

describe('createNotificationAction', () => {
  it('calls createNotification with user id, title, body and type', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: { id: 'user-123' } })
    );
    await createNotificationAction('Title', 'Body', 'alert');
    expect(mockCreateNotification).toHaveBeenCalledWith('user-123', 'Title', 'Body', 'alert');
  });

  it('calls createNotification without optional fields', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: { id: 'user-123' } })
    );
    await createNotificationAction('Title');
    expect(mockCreateNotification).toHaveBeenCalledWith('user-123', 'Title', undefined, undefined);
  });

  it('throws if session is null', async () => {
    mockGetSession.mockImplementationOnce(() => Promise.resolve(null));
    await expect(createNotificationAction('Title')).rejects.toThrow('Unauthorized');
  });

  it('throws if user id is missing', async () => {
    mockGetSession.mockImplementationOnce(() =>
      Promise.resolve({ user: {} })
    );
    await expect(createNotificationAction('Title')).rejects.toThrow('Unauthorized');
  });
});