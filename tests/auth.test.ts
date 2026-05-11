import { getSession, requireSession, requireRole, withAuth } from "@/lib/auth/server";

// Mock the auth module
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";

const mockGetSession = auth.api.getSession as jest.MockedFunction<any>;

beforeEach(() => {
  jest.clearAllMocks();
});

const mockRequest = (headers = {}) =>
  ({ headers: new Headers(headers) } as Request);

// ─── getSession ───────────────────────────────────────────────────────────────

describe("getSession", () => {
  it("returns the session when auth resolves", async () => {
    const mockSession = { user: { id: "user-1", role: "Admin" } };
    mockGetSession.mockResolvedValueOnce(mockSession);

    const result = await getSession(mockRequest());
    expect(result).toEqual(mockSession);
  });

  it("returns null when no session exists", async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const result = await getSession(mockRequest());
    expect(result).toBeNull();
  });

  it("passes request headers to auth.api.getSession", async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const req = mockRequest({ authorization: "Bearer token-123" });

    await getSession(req);
    expect(mockGetSession).toHaveBeenCalledWith({ headers: req.headers });
  });

  it("throws when auth.api.getSession throws", async () => {
    mockGetSession.mockRejectedValueOnce(new Error("Auth error"));
    await expect(getSession(mockRequest())).rejects.toThrow("Auth error");
  });
});

// ─── requireSession ───────────────────────────────────────────────────────────

describe("requireSession", () => {
  it("returns the session when one exists", async () => {
    const mockSession = { user: { id: "user-1", role: "Admin" } };
    mockGetSession.mockResolvedValueOnce(mockSession);

    const result = await requireSession(mockRequest());
    expect(result).toEqual(mockSession);
  });

  it("throws Unauthorized when session is null", async () => {
    mockGetSession.mockResolvedValueOnce(null);
    await expect(requireSession(mockRequest())).rejects.toThrow("Unauthorized");
  });

  it("throws Unauthorized when session is undefined", async () => {
    mockGetSession.mockResolvedValueOnce(undefined);
    await expect(requireSession(mockRequest())).rejects.toThrow("Unauthorized");
  });
});

// ─── requireRole ─────────────────────────────────────────────────────────────

describe("requireRole", () => {
  const session = { user: { id: "user-1", role: "Admin" } };

  it("does not throw when the user role is in the allowed list", () => {
    expect(() => requireRole(session, ["Admin", "Worker"])).not.toThrow();
  });

  it("does not throw when the user role is the only allowed role", () => {
    expect(() => requireRole(session, ["Admin"])).not.toThrow();
  });

  it("throws Forbidden when the user role is not in the allowed list", () => {
    expect(() => requireRole(session, ["Worker"])).toThrow("Forbidden");
  });

  it("throws Forbidden when the allowed roles list is empty", () => {
    expect(() => requireRole(session, [])).toThrow("Forbidden");
  });

  it("is case-sensitive when matching roles", () => {
    expect(() => requireRole(session, ["admin"])).toThrow("Forbidden");
  });
});

// ─── withAuth ─────────────────────────────────────────────────────────────────

describe("withAuth", () => {
  const mockSession = { user: { id: "user-1", role: "Admin" } };
  const mockHandler = jest.fn();

  beforeEach(() => {
    mockHandler.mockReset();
  });

  it("calls the handler with req and session when auth passes", async () => {
    mockGetSession.mockResolvedValueOnce(mockSession);
    mockHandler.mockResolvedValueOnce(new Response("OK"));
    const req = mockRequest();

    await withAuth(["Admin"], mockHandler)(req);
    expect(mockHandler).toHaveBeenCalledWith(req, mockSession);
  });

  it("returns the handler's response", async () => {
    mockGetSession.mockResolvedValueOnce(mockSession);
    const mockResponse = new Response("OK", { status: 200 });
    mockHandler.mockResolvedValueOnce(mockResponse);

    const result = await withAuth(["Admin"], mockHandler)(mockRequest());
    expect(result).toBe(mockResponse);
  });

  it("throws Unauthorized when no session exists", async () => {
    mockGetSession.mockResolvedValueOnce(null);

    await expect(withAuth(["Admin"], mockHandler)(mockRequest())).rejects.toThrow("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("throws Forbidden when the user lacks the required role", async () => {
    mockGetSession.mockResolvedValueOnce(mockSession);

    await expect(withAuth(["Worker"], mockHandler)(mockRequest())).rejects.toThrow("Forbidden");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("allows access when the user has one of multiple allowed roles", async () => {
    mockGetSession.mockResolvedValueOnce(mockSession);
    mockHandler.mockResolvedValueOnce(new Response("OK"));

    await withAuth(["Worker", "Admin"], mockHandler)(mockRequest());
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("does not call the handler when session check fails", async () => {
    mockGetSession.mockRejectedValueOnce(new Error("Auth error"));

    await expect(withAuth(["Admin"], mockHandler)(mockRequest())).rejects.toThrow("Auth error");
    expect(mockHandler).not.toHaveBeenCalled();
  });
});