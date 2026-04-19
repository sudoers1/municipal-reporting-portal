import { GET } from "../app/api/analytics/route";
import { auth } from "../lib/auth";

jest.mock("../lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

const mockGetSession = auth.api.getSession as jest.Mock;

function makeRequest() {
  return new Request("http://localhost/api/analytics", { method: "GET" });
}

describe("GET /api/analytics", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns guest viewer when no session", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.viewer).toBe("guest");
  });

  test("returns authenticated viewer when session exists", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "u1" } });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.viewer).toBe("authenticated");
  });
});