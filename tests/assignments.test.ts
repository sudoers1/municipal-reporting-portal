import { POST } from "@/app/api/assignments/route";
import { sql } from "@/lib/db/neon";
import {
  readAssignments,
  readWorkerAssignments,
  updateAssignmentStatus,
} from "@/lib/db/assignments";


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




describe("assignments db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("readAssignments", () => {
    it("should fetch all assignments with worker names", async () => {
      const mockAssignments = [
        {
          id: 1,
          workerid: "worker-1",
          complaintid: 101,
          status: "In progress",
          worker_name: "John Doe",
        },
        {
          id: 2,
          workerid: "worker-2",
          complaintid: 102,
          status: "Resolved",
          worker_name: "Jane Smith",
        },
      ];

      mockSql.mockResolvedValue(mockAssignments);

      const result = await readAssignments();

      expect(mockSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAssignments);
    });

    it("should return empty array when no assignments exist", async () => {
      mockSql.mockResolvedValue([]);

      const result = await readAssignments();

      expect(result).toEqual([]);
    });

    it("should handle database error", async () => {
      const dbError = new Error("Database connection failed");
      mockSql.mockRejectedValue(dbError);

      await expect(readAssignments()).rejects.toThrow("Database connection failed");
    });
  });

  describe("readWorkerAssignments", () => {
    it("should fetch assignments for specific worker", async () => {
      const mockAssignments = [
        {
          id: 1,
          workerid: "worker-1",
          complaintid: 101,
          status: "In progress",
        },
        {
          id: 2,
          workerid: "worker-1",
          complaintid: 102,
          status: "Resolved",
        },
      ];

      mockSql.mockResolvedValue(mockAssignments);

      const result = await readWorkerAssignments("worker-1");

      expect(mockSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAssignments);
    });

    it("should return empty array when worker has no assignments", async () => {
      mockSql.mockResolvedValue([]);

      const result = await readWorkerAssignments("nonexistent");

      expect(result).toEqual([]);
    });

    it("should handle database error", async () => {
      mockSql.mockRejectedValue(new Error("Query failed"));

      await expect(readWorkerAssignments("worker-1")).rejects.toThrow("Query failed");
    });
  });

  describe("updateAssignmentStatus", () => {
    it("should update assignment status and return updated record", async () => {
      const mockUpdated = [
        {
          id: 1,
          workerid: "worker-1",
          complaintid: 101,
          status: "Resolved",
          updated_at: new Date(),
        },
      ];

      mockSql.mockResolvedValue(mockUpdated);

      const result = await updateAssignmentStatus(1, "Resolved");

      expect(mockSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdated);
    });

    it("should return empty array when assignment not found", async () => {
      mockSql.mockResolvedValue([]);

      const result = await updateAssignmentStatus(999, "Resolved");

      expect(result).toEqual([]);
    });

    it("should handle database error during update", async () => {
      mockSql.mockRejectedValue(new Error("Update failed"));

      await expect(updateAssignmentStatus(1, "Resolved")).rejects.toThrow("Update failed");
    });
  });
});