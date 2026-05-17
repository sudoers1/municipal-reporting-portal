// tests/lib/db/complaints.test.ts
import {
  insertComplaint,
  insertComplaintwIMG,
  readComplaints,
  readMyComplaints,
  readoneComplaint,
  claimComplaint,
  updateComplaintStatus,
  getCompDate,
} from "@/lib/db/complaints";
import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

const mockedSql = sql as jest.Mock;

describe("complaints db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDate = new Date();
  const mockComplaint = {
    complaintid: 1,
    userid: "user-123",
    ward_id: "ward-1",
    municipality: "City Center",
    issuetype: "Pothole",
    details: "Large pothole on Main St",
    address: "123 Main St",
    coords: "-26.2,28.0",
    creationtime: mockDate,
    status: "pending",
  };

  const mockComplaintWithImage = {
    ...mockComplaint,
    image: "https://example.com/image.jpg",
  };

  describe("insertComplaint", () => {
    it("should insert complaint without image", async () => {
      mockedSql.mockResolvedValue([mockComplaint]);

      const result = await insertComplaint(
        "user-123",
        "ward-1",
        "City Center",
        "Pothole",
        "Large pothole on Main St",
        "123 Main St",
        "-26.2,28.0"
      );

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockComplaint]);
    });

    it("should handle database error during insert", async () => {
      mockedSql.mockRejectedValue(new Error("Insert failed"));

      await expect(
        insertComplaint("user-123", "ward-1", "City Center", "Pothole", "Details", "Address", "-26.2,28.0")
      ).rejects.toThrow("Insert failed");
    });
  });

  describe("insertComplaintwIMG", () => {
    it("should insert complaint with image", async () => {
      mockedSql.mockResolvedValue([mockComplaintWithImage]);

      const result = await insertComplaintwIMG(
        "user-123",
        "ward-1",
        "City Center",
        "Pothole",
        "Large pothole on Main St",
        "https://example.com/image.jpg",
        "123 Main St",
        "-26.2,28.0"
      );

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockComplaintWithImage]);
    });
  });

  describe("readComplaints", () => {
    it("should return all complaints", async () => {
      const mockComplaints = [mockComplaint, mockComplaintWithImage];
      mockedSql.mockResolvedValue(mockComplaints);

      const result = await readComplaints();

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockComplaints);
    });

    it("should return empty array when no complaints exist", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readComplaints();

      expect(result).toEqual([]);
    });
  });

  describe("readMyComplaints", () => {
    it("should return complaints for specific user", async () => {
      const userComplaints = [mockComplaint];
      mockedSql.mockResolvedValue(userComplaints);

      const result = await readMyComplaints("user-123");

      expect(mockedSql).toHaveBeenCalledTimes(1);
      // Check that the SQL contains the WHERE clause
      const sqlCall = mockedSql.mock.calls[0][0];
      const sqlString = Array.isArray(sqlCall) ? sqlCall.join('') : sqlCall;
      expect(sqlString).toContain("WHERE userid =");
      expect(result).toEqual(userComplaints);
    });

    it("should return empty array when user has no complaints", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readMyComplaints("user-999");

      expect(result).toEqual([]);
    });

    it("should handle undefined userid", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readMyComplaints(undefined);

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe("readoneComplaint", () => {
    it("should return single complaint when found", async () => {
      mockedSql.mockResolvedValue([mockComplaint]);

      const result = await readoneComplaint("1");

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockComplaint);
    });

    it("should return null when complaint not found", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readoneComplaint("999");

      expect(result).toBeNull();
    });
  });

  describe("claimComplaint", () => {
    it("should claim complaint for worker", async () => {
      mockedSql.mockResolvedValue([]);

      await claimComplaint("1", "worker-456");

      expect(mockedSql).toHaveBeenCalledTimes(1);
      const sqlCall = mockedSql.mock.calls[0][0];
      const sqlString = Array.isArray(sqlCall) ? sqlCall.join('') : sqlCall;
      expect(sqlString).toContain("UPDATE complaints");
      expect(sqlString).toContain("SET workerid =");
      expect(sqlString).toContain("status = 'in_progress'");
    });
  });

  describe("updateComplaintStatus", () => {
    it("should update complaint status", async () => {
      mockedSql.mockResolvedValue([]);

      await updateComplaintStatus("1", "resolved");

      expect(mockedSql).toHaveBeenCalledTimes(1);
      const sqlCall = mockedSql.mock.calls[0][0];
      const sqlString = Array.isArray(sqlCall) ? sqlCall.join('') : sqlCall;
      expect(sqlString).toContain("UPDATE complaints");
      expect(sqlString).toContain("SET status =");
    });
  });

  describe("getCompDate", () => {
    it("should return resolved_at date when found", async () => {
      const resolvedDate = new Date("2024-01-15T10:30:00Z");
      mockedSql.mockResolvedValue([{ resolved_at: resolvedDate }]);

      const result = await getCompDate("1");

      expect(mockedSql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(resolvedDate);
    });

    it("should handle assignment without resolved_at", async () => {
      mockedSql.mockResolvedValue([{ resolved_at: null }]);

      const result = await getCompDate("1");

      expect(result).toBeNull();
    });

    it("should handle undefined cid", async () => {
      const result = await getCompDate(undefined);

      expect(mockedSql).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should handle when no assignment found", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await getCompDate("999");

      expect(result).toBeNull();
    });
  });
});