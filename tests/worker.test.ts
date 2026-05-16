import { GET } from "@/app/api/workers/route";
import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const mockSql = sql as unknown as jest.Mock;

describe("GET /api/workers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns workers successfully", async () => {
    const workers = [
      {
        id: 1,
        name: "Alice Worker",
      },
      {
        id: 2,
        name: "Bob Worker",
      },
    ];

    mockSql.mockResolvedValueOnce(workers);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(workers);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  test("returns empty array when no workers exist", async () => {
    mockSql.mockResolvedValueOnce([]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({
      error: "Failed to fetch workers",
    });

    expect(mockSql).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalled();
  });
});