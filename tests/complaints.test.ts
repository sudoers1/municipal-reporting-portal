import {
  insertComplaint,
  insertComplaintwIMG,
  readComplaints,
  readoneComplaint,
  readMyComplaints,
  claimComplaint,
  updateComplaintStatus,
} from "@/lib/db/complaints";

import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

describe("Complaints Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertComplaint", () => {
    it("should insert complaint without image with correct values", async () => {
      const mockResult = [{ complaintid: 1, userid: "user1" }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertComplaint(
        "user1",
        "Potholes",
        "Broken road at intersection",
        "123 Main St",
        "40.7128,-74.0060"
      );

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO complaints")
      );
      expect(result).toEqual(mockResult);
    });

    it("should handle database errors", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

      await expect(
        insertComplaint("user1", "Potholes", "Broken road", "123 Main St", "40.7128,-74.0060")
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("insertComplaintwIMG", () => {
    it("should insert complaint with image", async () => {
      const mockResult = [{ complaintid: 2, userid: "user1", image: "base64image" }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertComplaintwIMG(
        "user1",
        "Graffiti",
        "Wall sprayed",
        "base64encodedimage",
        "456 Oak Ave",
        "40.7128,-74.0060"
      );

      expect(sql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should handle empty image string", async () => {
      (sql as jest.Mock).mockResolvedValue([{ complaintid: 3 }]);

      await insertComplaintwIMG(
        "user1",
        "Trash",
        "Overflowing bin",
        "",
        "789 Pine Rd",
        "40.7128,-74.0060"
      );

      expect(sql).toHaveBeenCalled();
    });
  });

  describe("readComplaints", () => {
    it("should fetch all complaints", async () => {
      const mockComplaints = [
        { complaintid: 1, userid: "user1", issuetype: "Potholes" },
        { complaintid: 2, userid: "user2", issuetype: "Graffiti" },
      ];
      (sql as jest.Mock).mockResolvedValue(mockComplaints);

      const result = await readComplaints();

      expect(sql).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM complaints"));
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockComplaints);
    });

    it("should return empty array when no complaints exist", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readComplaints();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("readMyComplaints", () => {
    it("should fetch complaints for specific user", async () => {
      const mockComplaints = [
        { complaintid: 1, userid: "user123", issuetype: "Potholes" },
        { complaintid: 2, userid: "user123", issuetype: "Graffiti" },
      ];
      (sql as jest.Mock).mockResolvedValue(mockComplaints);

      const result = await readMyComplaints("user123");

      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("WHERE userid =")
      );
      expect(result).toHaveLength(2);
      expect(result[0].userid).toBe("user123");
    });

    it("should handle undefined userid", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readMyComplaints(undefined);

      expect(sql).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return empty array when user has no complaints", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readMyComplaints("nonexistent");

      expect(result).toEqual([]);
    });
  });

  describe("readoneComplaint", () => {
    it("should return single complaint when found", async () => {
      const mockComplaint = { complaintid: "123", userid: "user1", issuetype: "Potholes" };
      (sql as jest.Mock).mockResolvedValue([mockComplaint]);

      const result = await readoneComplaint("123");

      expect(sql).toHaveBeenCalledWith(expect.stringContaining("WHERE complaintid ="));
      expect(result).toEqual(mockComplaint);
    });

    it("should return null when complaint not found", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readoneComplaint("999");

      expect(result).toBeNull();
    });

    it("should handle database error gracefully", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(readoneComplaint("123")).rejects.toThrow("Database error");
    });
  });

  describe("claimComplaint", () => {
    it("should update complaint with worker ID and status to in_progress", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      await claimComplaint("complaint123", "worker456");

      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE complaints"),
        expect.stringContaining("SET workerid ="),
        expect.stringContaining("status = 'in_progress'"),
        expect.stringContaining("WHERE complaintid =")
      );
      expect(sql).toHaveBeenCalledTimes(1);
    });

    it("should handle claiming already claimed complaint", async () => {
      // Mock successful update even if already claimed
      (sql as jest.Mock).mockResolvedValue([]);

      await expect(claimComplaint("complaint123", "worker789")).resolves.not.toThrow();
      expect(sql).toHaveBeenCalled();
    });
  });

  describe("updateComplaintStatus", () => {
    it("should update complaint status", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      await updateComplaintStatus("complaint123", "resolved");

      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE complaints"),
        expect.stringContaining("SET status ="),
        expect.stringContaining("WHERE complaintid =")
      );
    });

    it("should handle various status values", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const statuses = ["pending", "in_progress", "resolved", "closed"];
      
      for (const status of statuses) {
        await updateComplaintStatus("complaint123", status);
        expect(sql).toHaveBeenCalledWith(
          expect.stringContaining(`SET status = ${status}`)
        );
      }
    });

    it("should handle updating non-existent complaint", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      await expect(updateComplaintStatus("nonexistent", "resolved")).resolves.not.toThrow();
      expect(sql).toHaveBeenCalled();
    });
  });
});