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

const mockRequest = (headers: Record<string, string> = {}) => {
  return {
    headers,
  } as unknown as Request;
};

const createMockResponse = (status = 200) => {
  return {
    status,
    body: "OK",
  } as unknown as Response;
};

describe("auth server helpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getSession", () => {
    it("calls auth.api.getSession with request headers", async () => {
      const req = mockRequest({
        cookie: "session=test-cookie",
      });

      const mockSession = {
        user: {
          id: 1,
          role: "Admin",
        },
      };

      mockGetSession.mockResolvedValueOnce(mockSession);

      const result = await getSession(req);

      expect(mockGetSession).toHaveBeenCalledWith({
        headers: req.headers,
      });

      expect(result).toEqual(mockSession);
    });
  });

  describe("requireSession", () => {
    it("throws Unauthorized when no session exists", async () => {
      mockGetSession.mockResolvedValueOnce(null);

      await expect(requireSession(mockRequest())).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("throws Unauthorized when session is undefined", async () => {
      mockGetSession.mockResolvedValueOnce(undefined);

      await expect(requireSession(mockRequest())).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("returns the session when session exists", async () => {
      const mockSession = {
        user: {
          id: 1,
          role: "Admin",
        },
      };

      mockGetSession.mockResolvedValueOnce(mockSession);

      await expect(requireSession(mockRequest())).resolves.toEqual(mockSession);
    });

    it("throws the original error when getSession fails", async () => {
      mockGetSession.mockRejectedValueOnce(new Error("Auth error"));

      await expect(requireSession(mockRequest())).rejects.toThrow("Auth error");
    });
  });

  describe("requireRole", () => {
    it("throws Forbidden when user role is not allowed", () => {
      const session = {
        user: {
          role: "Worker",
        },
      };

      expect(() => requireRole(session, ["Admin"])).toThrow("Forbidden");
    });

    it("does not throw when user role is allowed", () => {
      const session = {
        user: {
          role: "Admin",
        },
      };

      expect(() => requireRole(session, ["Admin"])).not.toThrow();
    });

    it("does not throw when user has one of multiple allowed roles", () => {
      const session = {
        user: {
          role: "Worker",
        },
      };

      expect(() => requireRole(session, ["Admin", "Worker"])).not.toThrow();
    });

    it("throws Forbidden when allowed roles array is empty", () => {
      const session = {
        user: {
          role: "Admin",
        },
      };

      expect(() => requireRole(session, [])).toThrow("Forbidden");
    });
  });

  describe("withAuth", () => {
    const mockSession = {
      user: {
        id: 1,
        role: "Admin",
      },
    };

    let mockHandler: jest.Mock;

    beforeEach(() => {
      mockHandler = jest.fn();
    });

    it("calls the handler with req and session when auth passes", async () => {
      const req = mockRequest();
      const mockResponse = createMockResponse(200);

      mockGetSession.mockResolvedValueOnce(mockSession);
      mockHandler.mockResolvedValueOnce(mockResponse);

      await withAuth(["Admin"], mockHandler)(req);

      expect(mockHandler).toHaveBeenCalledWith(req, mockSession);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("returns the handler's response", async () => {
      const mockResponse = createMockResponse(200);

      mockGetSession.mockResolvedValueOnce(mockSession);
      mockHandler.mockResolvedValueOnce(mockResponse);

      const result = await withAuth(["Admin"], mockHandler)(mockRequest());

      expect(result).toBe(mockResponse);
    });

    it("throws Unauthorized when no session exists", async () => {
      mockGetSession.mockResolvedValueOnce(null);

      await expect(
        withAuth(["Admin"], mockHandler)(mockRequest())
      ).rejects.toThrow("Unauthorized");

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("throws Forbidden when user does not have required role", async () => {
      const workerSession = {
        user: {
          id: 2,
          role: "Worker",
        },
      };

      mockGetSession.mockResolvedValueOnce(workerSession);

      await expect(
        withAuth(["Admin"], mockHandler)(mockRequest())
      ).rejects.toThrow("Forbidden");

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("allows access when the user has one of multiple allowed roles", async () => {
      const mockResponse = createMockResponse(200);

      mockGetSession.mockResolvedValueOnce(mockSession);
      mockHandler.mockResolvedValueOnce(mockResponse);

      await withAuth(["Worker", "Admin"], mockHandler)(mockRequest());

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("does not call the handler when session check fails", async () => {
      mockGetSession.mockRejectedValueOnce(new Error("Auth error"));

      await expect(
        withAuth(["Admin"], mockHandler)(mockRequest())
      ).rejects.toThrow("Auth error");

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});