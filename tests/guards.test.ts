import {
  getSession,
  requireSession,
  requireRole,
  withAuth,
} from "@/lib/auth/server";

import { auth } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

const mockGetSession = auth.api.getSession as unknown as jest.Mock;

describe("auth server helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSession", () => {
    test("calls auth.api.getSession with request headers", async () => {
      const req = new Request("http://localhost/api/test", {
        headers: {
          cookie: "session=test-cookie",
        },
      });

      const mockSession = {
        user: {
          id: 1,
          role: "Admin",
        },
      };

      mockGetSession.mockResolvedValueOnce(mockSession);

      const session = await getSession(req);

      expect(mockGetSession).toHaveBeenCalledWith({
        headers: req.headers,
      });

      expect(session).toEqual(mockSession);
    });
  });

  describe("requireSession", () => {
    test("throws Unauthorized when session is null", async () => {
      const req = new Request("http://localhost/api/test");

      mockGetSession.mockResolvedValueOnce(null);

      await expect(requireSession(req)).rejects.toThrow("Unauthorized");
    });

    test("throws Unauthorized when session is undefined", async () => {
      const req = new Request("http://localhost/api/test");

      mockGetSession.mockResolvedValueOnce(undefined);

      await expect(requireSession(req)).rejects.toThrow("Unauthorized");
    });

    test("returns session when session exists", async () => {
      const req = new Request("http://localhost/api/test");

      const mockSession = {
        user: {
          id: 1,
          role: "Admin",
        },
      };

      mockGetSession.mockResolvedValueOnce(mockSession);

      await expect(requireSession(req)).resolves.toEqual(mockSession);
    });
  });

  describe("requireRole", () => {
    test("throws Forbidden when user role is not in allowed roles", () => {
      const session = {
        user: {
          role: "Worker",
        },
      };

      expect(() => requireRole(session, ["Admin"])).toThrow("Forbidden");
    });

    test("does not throw when user role matches single allowed role", () => {
      const session = {
        user: {
          role: "Admin",
        },
      };

      expect(() => requireRole(session, ["Admin"])).not.toThrow();
    });

    test("does not throw when user role is one of multiple allowed roles", () => {
      const session = {
        user: {
          role: "Worker",
        },
      };

      expect(() => requireRole(session, ["Admin", "Worker"])).not.toThrow();
    });

    test("throws Forbidden when allowed roles array is empty", () => {
      const session = {
        user: {
          role: "Admin",
        },
      };

      expect(() => requireRole(session, [])).toThrow("Forbidden");
    });
  });

  describe("withAuth", () => {
    test("runs handler when user is authenticated and has required role", async () => {
      const req = new Request("http://localhost/api/test");

      const mockSession = {
        user: {
          id: 1,
          role: "Admin",
        },
      };

      const handler = jest.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
        })
      );

      mockGetSession.mockResolvedValueOnce(mockSession);

      const protectedHandler = withAuth(["Admin"], handler);

      const response = await protectedHandler(req);

      expect(handler).toHaveBeenCalledWith(req, mockSession);
      expect(response.status).toBe(200);
    });

    test("throws Unauthorized when user is not authenticated", async () => {
      const req = new Request("http://localhost/api/test");

      const handler = jest.fn();

      mockGetSession.mockResolvedValueOnce(null);

      const protectedHandler = withAuth(["Admin"], handler);

      await expect(protectedHandler(req)).rejects.toThrow("Unauthorized");
      expect(handler).not.toHaveBeenCalled();
    });

    test("throws Forbidden when user does not have required role", async () => {
      const req = new Request("http://localhost/api/test");

      const mockSession = {
        user: {
          id: 1,
          role: "Worker",
        },
      };

      const handler = jest.fn();

      mockGetSession.mockResolvedValueOnce(mockSession);

      const protectedHandler = withAuth(["Admin"], handler);

      await expect(protectedHandler(req)).rejects.toThrow("Forbidden");
      expect(handler).not.toHaveBeenCalled();
    });
  });
});