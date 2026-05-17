// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

jest.mock("@/lib/auth/server", () => ({
  withAuth: (_roles: string[], handler: Function) => handler,
}));

// ── Request polyfill (jsdom doesn't include Request) ─────────────────────────

global.Request = class {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method ?? "GET";
    this.headers = (init?.headers as Record<string, string>) ?? {};
    this.body = (init?.body as string) ?? null;
  }

  async json() {
    return this.body ? JSON.parse(this.body) : null;
  }
} as any;

const mocksSession = { user: { id: "worker-123" } };
const BASE_URL = "http://localhost";

// ── /api/reports/analytics/status ────────────────────────────────────────────

describe("GET /api/assignments/stats/status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status counts and municipality", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql
      .mockResolvedValueOnce([
        { status: "Resolved",     count: 5, avg_hours_to_resolve: 3.2  },
        { status: "In Progress",  count: 2, avg_hours_to_resolve: null },
        { status: "Acknowledged", count: 1, avg_hours_to_resolve: null },
      ])
      .mockResolvedValueOnce([{ municipality: "City of Johannesburg" }]);

    const { GET } = await import("@/app/api/reports/analytics/status/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/status`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(3);
    expect(body.data[0]).toMatchObject({ status: "Resolved", count: 5 });
    expect(body.municipality).toBe("City of Johannesburg");
  });

  it("returns empty data and null municipality when worker has no assignments", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { GET } = await import("@/app/api/reports/analytics/status/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/status`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.municipality).toBeNull();
  });

  it("returns 500 when sql throws", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql.mockRejectedValueOnce(new Error("DB connection failed"));

    const { GET } = await import("@/app/api/reports/analytics/status/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/status`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe("Failed to fetch status stats");
  });
});

// ── /api/reports/analytics/resolved ─────────────────────────────────────────

describe("GET /api/assignments/stats/resolved", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns weekly resolved rows with avg hours", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql.mockResolvedValueOnce([
      { week: "2024-01-01", resolved: 3, avg_hours: 4.5 },
      { week: "2024-01-08", resolved: 5, avg_hours: 2.1 },
    ]);

    const { GET } = await import("@/app/api/reports/analytics/resolved/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/resolved`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.data[0]).toMatchObject({ week: "2024-01-01", resolved: 3, avg_hours: 4.5 });
    expect(body.data[1]).toMatchObject({ week: "2024-01-08", resolved: 5, avg_hours: 2.1 });
  });

  it("returns empty array when no resolved complaints", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql.mockResolvedValueOnce([]);

    const { GET } = await import("@/app/api/reports/analytics/resolved/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/resolved`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
  });

  it("returns 500 when sql throws", async () => {
    const { sql } = await import("@/lib/db/neon");
    const mockSql = sql as unknown as jest.Mock;

    mockSql.mockRejectedValueOnce(new Error("Timeout"));

    const { GET } = await import("@/app/api/reports/analytics/resolved/route");
    const req = new Request(`${BASE_URL}/api/reports/analytics/resolved`);
    const res = await GET(req, mocksSession);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe("Failed to fetch resolved stats");
  });
});