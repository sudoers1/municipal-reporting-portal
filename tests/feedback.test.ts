import {
  insertFeedbackwIMG,
  readFeedback,
} from "@/lib/db/feedback";

import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

const mockedSql = sql as jest.Mock;

describe("feedback db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertFeedbackwIMG", () => {
    it("should insert feedback with image", async () => {
      const mockResult = [
        {
          feedbackId: "1",
          userId: "user-1",
          complaintId: "complaint-1",
          details: "Road damaged",
          image: "image.jpg",
        },
      ];

      mockedSql.mockResolvedValue(mockResult);

      const result = await insertFeedbackwIMG(
        "user-1",
        "complaint-1",
        "Road damaged",
        "image.jpg"
      );

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });

    it("should handle empty insert result", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await insertFeedbackwIMG(
        "user-1",
        "complaint-1",
        "No image",
        ""
      );

      expect(result).toEqual([]);
    });

    it("should throw when database fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        insertFeedbackwIMG(
          "user-1",
          "complaint-1",
          "Broken traffic light",
          "traffic.jpg"
        )
      ).rejects.toThrow("Database error");
    });
  });

  describe("readFeedback", () => {
    it("should return feedback for a complaint", async () => {
      const mockFeedback = [
        {
          name: "John Doe",
          feedbackId: "1",
          complaintId: "complaint-1",
          userId: "user-1",
          details: "Issue resolved",
          image: "resolved.jpg",
          creationtime: new Date(),
        },
        {
          name: "Jane Doe",
          feedbackId: "2",
          complaintId: "complaint-1",
          userId: "user-2",
          details: "Still ongoing",
          image: "ongoing.jpg",
          creationtime: new Date(),
        },
      ];

      mockedSql.mockResolvedValue(mockFeedback);

      const result = await readFeedback("complaint-1");

      expect(sql).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockFeedback);
    });

    it("should return empty array when no feedback exists", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readFeedback("missing-id");

      expect(result).toEqual([]);
    });

    it("should throw when query fails", async () => {
      mockedSql.mockRejectedValue(
        new Error("Query failed")
      );

      await expect(
        readFeedback("complaint-1")
      ).rejects.toThrow("Query failed");
    });
  });
});