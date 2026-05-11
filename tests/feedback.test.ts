import {
  insertFeedbackwIMG,
  readFeedback,
} from "@/lib/db/feedback";

import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

describe("Feedback Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertFeedbackwIMG", () => {
    const mockUserid = "user123";
    const mockComplaintid = "complaint456";
    const mockDetails = "Great work on fixing the pothole!";
    const mockImage = "data:image/png;base64,iVBORw0KGgoAAAANS...";

    it("should insert feedback with image successfully", async () => {
      const mockResult = [{ feedbackId: 1, userId: mockUserid, complaintId: mockComplaintid }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertFeedbackwIMG(
        mockUserid,
        mockComplaintid,
        mockDetails,
        mockImage
      );

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO feedback"),
        expect.stringContaining("userId"),
        expect.stringContaining("complaintId"),
        expect.stringContaining("details"),
        expect.stringContaining("image"),
        expect.stringContaining("creationtime")
      );
      expect(result).toEqual(mockResult);
    });

    it("should handle feedback without image (empty string)", async () => {
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 2 }]);

      const result = await insertFeedbackwIMG(
        mockUserid,
        mockComplaintid,
        mockDetails,
        ""
      );

      expect(sql).toHaveBeenCalled();
      expect(result).toEqual([{ feedbackId: 2 }]);
    });

    it("should handle feedback with null image", async () => {
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 3 }]);

      const result = await insertFeedbackwIMG(
        mockUserid,
        mockComplaintid,
        mockDetails,
        null as unknown as string
      );

      expect(sql).toHaveBeenCalled();
      expect(result).toEqual([{ feedbackId: 3 }]);
    });

    it("should handle very long details text", async () => {
      const longDetails = "A".repeat(10000);
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 4 }]);

      await insertFeedbackwIMG(mockUserid, mockComplaintid, longDetails, mockImage);

      expect(sql).toHaveBeenCalled();
    });

    it("should handle special characters in details", async () => {
      const specialCharsDetails = "Great! @#$%^&*()_+{}[]|\\:;\"'<>,.?/~`";
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 5 }]);

      await insertFeedbackwIMG(mockUserid, mockComplaintid, specialCharsDetails, mockImage);

      expect(sql).toHaveBeenCalled();
    });

    it("should handle Unicode/emoji characters", async () => {
      const unicodeDetails = "Excellent service! 👍🎉👏 Thanks! 谢谢";
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 6 }]);

      await insertFeedbackwIMG(mockUserid, mockComplaintid, unicodeDetails, mockImage);

      expect(sql).toHaveBeenCalled();
    });

    it("should create timestamp automatically", async () => {
      const beforeInsert = new Date();
      (sql as jest.Mock).mockResolvedValue([{ feedbackId: 7 }]);

      await insertFeedbackwIMG(mockUserid, mockComplaintid, mockDetails, mockImage);

      expect(sql).toHaveBeenCalled();
      // Note: Verify that a Date object is passed for creationtime
      const callArgs = (sql as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toContain("creationtime");
    });

    it("should handle database connection error", async () => {
      const dbError = new Error("Database connection failed");
      (sql as jest.Mock).mockRejectedValue(dbError);

      await expect(
        insertFeedbackwIMG(mockUserid, mockComplaintid, mockDetails, mockImage)
      ).rejects.toThrow("Database connection failed");
    });

    it("should handle duplicate feedback submission", async () => {
      const duplicateError = new Error("Duplicate key violation");
      (sql as jest.Mock).mockRejectedValue(duplicateError);

      await expect(
        insertFeedbackwIMG(mockUserid, mockComplaintid, mockDetails, mockImage)
      ).rejects.toThrow("Duplicate key violation");
    });

    it("should handle invalid userid format", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Invalid userid format"));

      await expect(
        insertFeedbackwIMG("", mockComplaintid, mockDetails, mockImage)
      ).rejects.toThrow("Invalid userid format");
    });
  });

  describe("readFeedback", () => {
    const mockComplaintid = "complaint456";

    const mockFeedbackData = [
      {
        name: "John Doe",
        feedbackId: 1,
        complaintId: "complaint456",
        userId: "user123",
        details: "Great work!",
        image: "base64image123",
        creationtime: new Date("2024-01-01T10:00:00Z"),
      },
      {
        name: "Jane Smith",
        feedbackId: 2,
        complaintId: "complaint456",
        userId: "user456",
        details: "Very responsive team",
        image: null,
        creationtime: new Date("2024-01-02T14:30:00Z"),
      },
    ];

    it("should fetch all feedback for a complaint with user details", async () => {
      (sql as jest.Mock).mockResolvedValue(mockFeedbackData);

      const result = await readFeedback(mockComplaintid);

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.stringContaining("user.name"),
        expect.stringContaining("feedback"),
        expect.stringContaining("INNER JOIN"),
        expect.stringContaining("WHERE feedback.\"complaintId\" ="),
        expect.stringContaining(mockComplaintid)
      );
      expect(result).toEqual(mockFeedbackData);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no feedback exists for complaint", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readFeedback(mockComplaintid);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return correct data structure", async () => {
      (sql as jest.Mock).mockResolvedValue(mockFeedbackData);

      const result = await readFeedback(mockComplaintid);

      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("feedbackId");
      expect(result[0]).toHaveProperty("complaintId");
      expect(result[0]).toHaveProperty("userId");
      expect(result[0]).toHaveProperty("details");
      expect(result[0]).toHaveProperty("image");
      expect(result[0]).toHaveProperty("creationtime");
    });

    it("should handle multiple feedback entries for same complaint", async () => {
      const multipleFeedback = [
        ...mockFeedbackData,
        {
          name: "Bob Wilson",
          feedbackId: 3,
          complaintId: "complaint456",
          userId: "user789",
          details: "Issue resolved quickly",
          image: "base64image789",
          creationtime: new Date("2024-01-03T09:15:00Z"),
        },
      ];
      (sql as jest.Mock).mockResolvedValue(multipleFeedback);

      const result = await readFeedback(mockComplaintid);

      expect(result).toHaveLength(3);
      expect(result[2].name).toBe("Bob Wilson");
    });

    it("should handle feedback with null image values", async () => {
      const feedbackWithNullImage = [
        {
          name: "Test User",
          feedbackId: 1,
          complaintId: mockComplaintid,
          userId: "user123",
          details: "No image attached",
          image: null,
          creationtime: new Date(),
        },
      ];
      (sql as jest.Mock).mockResolvedValue(feedbackWithNullImage);

      const result = await readFeedback(mockComplaintid);

      expect(result[0].image).toBeNull();
    });

    it("should handle database error when reading feedback", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database query failed"));

      await expect(readFeedback(mockComplaintid)).rejects.toThrow(
        "Database query failed"
      );
    });

    it("should handle non-existent complaint ID", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readFeedback("nonexistent123");

      expect(result).toEqual([]);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("WHERE feedback.\"complaintId\" ="),
        expect.stringContaining("nonexistent123")
      );
    });

    it("should preserve order of feedback (likely by creationtime)", async () => {
      const orderedFeedback = [
        { ...mockFeedbackData[0], creationtime: new Date("2024-01-01") },
        { ...mockFeedbackData[1], creationtime: new Date("2024-01-02") },
        {
          name: "Newest",
          feedbackId: 3,
          complaintId: mockComplaintid,
          userId: "user999",
          details: "Latest feedback",
          image: null,
          creationtime: new Date("2024-01-03"),
        },
      ];
      (sql as jest.Mock).mockResolvedValue(orderedFeedback);

      const result = await readFeedback(mockComplaintid);

      // Verify order (should match database order)
      expect(result[0].creationtime).toBeLessThan(result[2].creationtime);
    });
  });

  describe("Integration workflow tests", () => {
    it("should insert and then read feedback for a complaint", async () => {
      const userid = "user123";
      const complaintid = "complaint456";
      const details = "Excellent service!";
      const image = "base64image";

      // Mock insert
      (sql as jest.Mock).mockResolvedValueOnce([{ feedbackId: 1 }]);
      await insertFeedbackwIMG(userid, complaintid, details, image);

      // Mock read
      const insertedFeedback = [
        {
          name: "Test User",
          feedbackId: 1,
          complaintId: complaintid,
          userId: userid,
          details: details,
          image: image,
          creationtime: new Date(),
        },
      ];
      (sql as jest.Mock).mockResolvedValueOnce(insertedFeedback);

      const result = await readFeedback(complaintid);

      expect(result).toHaveLength(1);
      expect(result[0].details).toBe(details);
      expect(result[0].userId).toBe(userid);
      expect(sql).toHaveBeenCalledTimes(2);
    });

    it("should handle multiple feedback entries from different users", async () => {
      const complaintid = "complaint789";
      const feedbacks = [
        { userid: "user1", details: "First feedback", image: "img1" },
        { userid: "user2", details: "Second feedback", image: "img2" },
        { userid: "user3", details: "Third feedback", image: "img3" },
      ];

      // Mock inserts
      for (const feedback of feedbacks) {
        (sql as jest.Mock).mockResolvedValueOnce([{ feedbackId: Math.random() }]);
        await insertFeedbackwIMG(
          feedback.userid,
          complaintid,
          feedback.details,
          feedback.image
        );
      }

      // Mock read all feedback
      const allFeedback = feedbacks.map((f, index) => ({
        name: `User ${f.userid}`,
        feedbackId: index + 1,
        complaintId: complaintid,
        userId: f.userid,
        details: f.details,
        image: f.image,
        creationtime: new Date(),
      }));
      (sql as jest.Mock).mockResolvedValueOnce(allFeedback);

      const result = await readFeedback(complaintid);

      expect(result).toHaveLength(3);
      expect(result.map((r) => r.details)).toEqual(expect.arrayContaining(feedbacks.map(f => f.details)));
    });
  });
});