import { GET } from "../app/api/worker/task/route";
import { auth } from "../lib/auth";
import { requireRole } from "../lib/guards/route";

jest.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("../lib/guards/route", () => ({
  requireRole: jest.fn(),
}));

const mockGetSession = auth.api.getSession as jest.Mock;
const mockRequireRole = requireRole as jest.Mock;

function makeRequest() {
  return new Request("http://localhost/api/worker/task", { method: "GET" });
}

describe("GET /api/worker/task", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns 401 when no session", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  test("returns 403 when user is not a Worker", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Resident" } });
    mockRequireRole.mockImplementation(() => { throw new Error("Forbidden"); });

    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  test("returns 200 when user is a Worker", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1", role: "Worker" } });
    mockRequireRole.mockImplementation(() => {});

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Worker endpoint ready");
  });
});