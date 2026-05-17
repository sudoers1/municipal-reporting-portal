// tests/auth.test.ts
import { withAuth, getSession, requireSession, requireRole } from "@/lib/auth/server";
import { auth } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

// Mock Response for Node environment
global.Response = class {
  status: number;
  body: any;
  constructor(body?: any, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status || 200;
  }
  json() {
    return Promise.resolve(this.body);
  }
} as any;

const mockGetSession = auth.api.getSession as jest.Mock;

describe("auth server helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSession", () => {
    it("should return session from auth api", async () => {
      const mockSession = { user: { id: "1", role: "Admin" } };
      const mockReq = { headers: { authorization: "Bearer token" } } as Request;
      mockGetSession.mockResolvedValue(mockSession);

      const result = await getSession(mockReq);

      expect(mockGetSession).toHaveBeenCalledWith({ headers: mockReq.headers });
      expect(result).toEqual(mockSession);
    });
  });

  describe("requireSession", () => {
    it("should return session when authenticated", async () => {
      const mockSession = { user: { id: "1", role: "Admin" } };
      const mockReq = { headers: {} } as Request;
      mockGetSession.mockResolvedValue(mockSession);

      const result = await requireSession(mockReq);

      expect(result).toEqual(mockSession);
    });

    it("should throw error when no session", async () => {
      const mockReq = { headers: {} } as Request;
      mockGetSession.mockResolvedValue(null);

      await expect(requireSession(mockReq)).rejects.toThrow("Unauthorized");
    });
  });

  describe("requireRole", () => {
    it("should not throw when role is allowed", () => {
      const session = { user: { role: "Admin" } };
      expect(() => requireRole(session, ["Admin", "Worker"])).not.toThrow();
    });

    it("should throw Forbidden when role not allowed", () => {
      const session = { user: { role: "Resident" } };
      expect(() => requireRole(session, ["Admin", "Worker"])).toThrow("Forbidden");
    });
  });

  describe("withAuth", () => {
    it("should call handler with req and session when auth passes", async () => {
      const mockSession = { user: { id: "1", role: "Admin" } };
      const mockReq = { headers: {} } as Request;
      const mockHandler = jest.fn().mockResolvedValue({ status: 200 });
      const mockContext = { params: { id: "1" } };

      mockGetSession.mockResolvedValue(mockSession);

      const wrapped = withAuth(["Admin"], mockHandler);
      await wrapped(mockReq, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockSession, mockContext);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should throw error when no session", async () => {
      const mockReq = { headers: {} } as Request;
      const mockHandler = jest.fn();
      mockGetSession.mockResolvedValue(null);

      const wrapped = withAuth(["Admin"], mockHandler);

      await expect(wrapped(mockReq)).rejects.toThrow("Unauthorized");
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should throw error when role not allowed", async () => {
      const mockSession = { user: { role: "Resident" } };
      const mockReq = { headers: {} } as Request;
      const mockHandler = jest.fn();
      mockGetSession.mockResolvedValue(mockSession);

      const wrapped = withAuth(["Admin"], mockHandler);

      await expect(wrapped(mockReq)).rejects.toThrow("Forbidden");
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});