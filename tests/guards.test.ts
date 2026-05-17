// tests/guards.test.ts
import { withAuth } from "@/lib/auth/server";
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

  describe("withAuth", () => {
    it("runs handler when user is authenticated and has required role", async () => {
      const mockSession = { user: { id: "1", role: "Admin" } };
      const mockReq = { headers: {} } as Request;
      const handler = jest.fn().mockResolvedValue({ status: 200 });

      mockGetSession.mockResolvedValue(mockSession);

      const protectedHandler = withAuth(["Admin"], handler);
      const response = await protectedHandler(mockReq);

      expect(handler).toHaveBeenCalledWith(mockReq, mockSession, undefined);
      expect(response.status).toBe(200);
    });

    it("throws when user is not authenticated", async () => {
      const mockReq = { headers: {} } as Request;
      const handler = jest.fn();
      mockGetSession.mockResolvedValue(null);

      const protectedHandler = withAuth(["Admin"], handler);

      await expect(protectedHandler(mockReq)).rejects.toThrow("Unauthorized");
      expect(handler).not.toHaveBeenCalled();
    });

    it("throws when user has insufficient role", async () => {
      const mockSession = { user: { role: "Resident" } };
      const mockReq = { headers: {} } as Request;
      const handler = jest.fn();
      mockGetSession.mockResolvedValue(mockSession);

      const protectedHandler = withAuth(["Admin"], handler);

      await expect(protectedHandler(mockReq)).rejects.toThrow("Forbidden");
      expect(handler).not.toHaveBeenCalled();
    });
  });
});