// @/lib/db/complaints.test.ts

import {
  insertComplaint,
  insertComplaintwIMG,
  readComplaints,
  readMyComplaints,
  readoneComplaint,
  claimComplaint,
  updateComplaintStatus,
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

  // =====================================================
  // insertComplaint
  // =====================================================

  describe("insertComplaint", () => {
    it("should insert complaint without image", async () => {
      const mockResult = [
        {
          complaintid: "1",
          userid: "user-1",
          issuetype: "Road",
          details: "Pothole",
        },
      ];

      mockedSql.mockResolvedValue(mockResult);

      const result = await insertComplaint(
        "user-1",
        "Road",
        "Pothole",
        "123 Main St",
        "-26.1,28.0"
      );

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array if insert returns nothing", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await insertComplaint(
        "user-1",
        "Water",
        "Pipe burst",
        "Street 1",
        "coords"
      );

      expect(result).toEqual([]);
    });

    it("should throw if insert complaint fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Insert failed")
      );

      await expect(
        insertComplaint(
          "user-1",
          "Electricity",
          "Power outage",
          "Address",
          "coords"
        )
      ).rejects.toThrow("Insert failed");
    });
  });

  // =====================================================
  // insertComplaintwIMG
  // =====================================================

  describe("insertComplaintwIMG", () => {
    it("should insert complaint with image", async () => {
      const mockResult = [
        {
          complaintid: "1",
          image: "image.jpg",
        },
      ];

      mockedSql.mockResolvedValue(mockResult);

      const result = await insertComplaintwIMG(
        "user-1",
        "Road",
        "Huge pothole",
        "image.jpg",
        "123 Main St",
        "-26.1,28.0"
      );

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array if insert with image returns nothing", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await insertComplaintwIMG(
        "user-1",
        "Road",
        "Issue",
        "img.jpg",
        "Address",
        "coords"
      );

      expect(result).toEqual([]);
    });

    it("should throw if insert with image fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Insert failed")
      );

      await expect(
        insertComplaintwIMG(
          "user-1",
          "Road",
          "Issue",
          "img.jpg",
          "Address",
          "coords"
        )
      ).rejects.toThrow("Insert failed");
    });
  });

  // =====================================================
  // readComplaints
  // =====================================================

  describe("readComplaints", () => {
    it("should return all complaints", async () => {
      const mockComplaints = [
        {
          complaintid: "1",
          details: "Pothole",
        },
        {
          complaintid: "2",
          details: "Broken traffic light",
        },
      ];

      mockedSql.mockResolvedValue(mockComplaints);

      const result = await readComplaints();

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockComplaints);
    });

    it("should return empty array if no complaints exist", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readComplaints();

      expect(result).toEqual([]);
    });

    it("should throw if readComplaints fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Read failed")
      );

      await expect(
        readComplaints()
      ).rejects.toThrow("Read failed");
    });
  });

  // =====================================================
  // readMyComplaints
  // =====================================================

  describe("readMyComplaints", () => {
    it("should return complaints for a user", async () => {
      const mockResult = [
        {
          complaintid: "1",
          userid: "user-1",
        },
      ];

      mockedSql.mockResolvedValue(mockResult);

      const result = await readMyComplaints(
        "user-1"
      );

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });

    it("should return empty array if user has no complaints", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readMyComplaints(
        "user-1"
      );

      expect(result).toEqual([]);
    });

    it("should work with undefined userid", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readMyComplaints(
        undefined
      );

      expect(result).toEqual([]);
    });

    it("should throw if query fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Query failed")
      );

      await expect(
        readMyComplaints("user-1")
      ).rejects.toThrow("Query failed");
    });
  });

  // =====================================================
  // readoneComplaint
  // =====================================================

  describe("readoneComplaint", () => {
    it("should return one complaint", async () => {
      const mockResult = [
        {
          complaintid: "1",
          details: "Road issue",
        },
      ];

      mockedSql.mockResolvedValue(mockResult);

      const result = await readoneComplaint("1");

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult[0]);
    });

    it("should return null if complaint does not exist", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readoneComplaint(
        "999"
      );

      expect(result).toBeNull();
    });

    it("should throw if query fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Query failed")
      );

      await expect(
        readoneComplaint("1")
      ).rejects.toThrow("Query failed");
    });
  });

  // =====================================================
  // claimComplaint
  // =====================================================

  describe("claimComplaint", () => {
    it("should claim complaint successfully", async () => {
      mockedSql.mockResolvedValue([]);

      await claimComplaint(
        "complaint-1",
        "worker-1"
      );

      expect(sql).toHaveBeenCalledTimes(1);
    });

    it("should throw if claim fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Claim failed")
      );

      await expect(
        claimComplaint(
          "complaint-1",
          "worker-1"
        )
      ).rejects.toThrow("Claim failed");
    });
  });

  // =====================================================
  // updateComplaintStatus
  // =====================================================

  describe("updateComplaintStatus", () => {
    it("should update complaint status", async () => {
      mockedSql.mockResolvedValue([]);

      await updateComplaintStatus(
        "complaint-1",
        "resolved"
      );

      expect(sql).toHaveBeenCalledTimes(1);
    });

    it("should throw if update fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Update failed")
      );

      await expect(
        updateComplaintStatus(
          "complaint-1",
          "resolved"
        )
      ).rejects.toThrow("Update failed");
    });
  });
});