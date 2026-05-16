import { POST } from "@/app/api/assignments/route";
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

const mockRequest = (body: unknown): Request => {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Request;
};

describe("POST /api/assignments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns 400 when complaintid is missing", async () => {
    const req = mockRequest({
      workerid: 10,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({
      error: "Missing complaintid or workerid",
    });

    expect(mockSql).not.toHaveBeenCalled();
  });

  test("returns 400 when workerid is missing", async () => {
    const req = mockRequest({
      complaintid: 1,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({
      error: "Missing complaintid or workerid",
    });

    expect(mockSql).not.toHaveBeenCalled();
  });

  test("creates assignment successfully", async () => {
    const assignment = {
      id: 1,
      complaintid: 5,
      workerid: 10,
      status: "Acknowledged",
    };

    mockSql.mockResolvedValueOnce([assignment]);

    const req = mockRequest({
      complaintid: 5,
      workerid: 10,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(assignment);

    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when database insert fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));

    const req = mockRequest({
      complaintid: 5,
      workerid: 10,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({
      error: "Failed to create assignment",
    });

    expect(mockSql).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalled();
  });
});