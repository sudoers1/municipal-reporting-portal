/** @jest-environment node */

import { POST, GET } from "../app/api/admin/assign-role/route";
import { auth } from "../lib/auth";
import { setUserRole } from "../lib/db/users";
import { requireRole } from "../lib/guards/route";

jest.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("../lib/db/users", () => ({
  setUserRole: jest.fn(),
}));

jest.mock("../lib/guards/route", () => ({
  requireRole: jest.fn(),
}));

const mockGetSession = auth.api.getSession as jest.Mock;
const mockSetUserRole = setUserRole as jest.Mock;
const mockRequireRole = requireRole as jest.Mock;

function makeRequest(body: object) {
  return new Request("http://localhost/api/admin/assign-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/assign-role", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns 401 when no session", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await POST(makeRequest({ userId: "u1", role: "Worker" }));
    expect(res.status).toBe(401);
  });

  test("returns 403 when user is not Admin", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Worker" } });
    mockRequireRole.mockImplementation(() => { throw new Error("Forbidden"); });

    const res = await POST(makeRequest({ userId: "u2", role: "Worker" }));
    expect(res.status).toBe(403);
  });

  test("returns 400 when role is invalid", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Admin" } });
    mockRequireRole.mockImplementation(() => {});

    const res = await POST(makeRequest({ userId: "u2", role: "SuperHacker" }));
    expect(res.status).toBe(400);
  });

  test("returns 400 when userId is missing", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Admin" } });
    mockRequireRole.mockImplementation(() => {});

    const res = await POST(makeRequest({ role: "Worker" }));
    expect(res.status).toBe(400);
  });

  test("returns 200 and calls setUserRole on valid request", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Admin" } });
    mockRequireRole.mockImplementation(() => {});
    mockSetUserRole.mockResolvedValue(undefined);

    const res = await POST(makeRequest({ userId: "u2", role: "Worker" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockSetUserRole).toHaveBeenCalledWith("u2", "Worker");
  });
});

describe("GET /api/admin/assign-role", () => {
  test("returns message to use POST", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body.message).toBe("Use POST");
  });
});