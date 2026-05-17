// tests/lib/structures/feedback.test.ts
import { Feedback } from "@/lib/structures/feedback";
import { insertFeedbackwIMG, readFeedback } from "@/lib/db/feedback";
import { sql } from "@/lib/db/neon";

// Mock the database module
jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

const mockedSql = sql as jest.Mock;

describe("Feedback Class", () => {
  let mockDate: Date;
  let validFeedbackData: Record<string, any>;

  beforeEach(() => {
    mockDate = new Date("2024-01-15T10:30:00Z");
    validFeedbackData = {
      feedbackId: 123,
      userId: "user-456",
      complaintId: 789,
      details: "Great service, issue resolved quickly!",
      image: "https://example.com/image.jpg",
      creationtime: mockDate.toISOString(),
      rating: 5,
      name: "John Doe",
    };
  });

  describe("Constructor and Getters", () => {
    it("should create a Feedback instance with all properties", () => {
      const feedback = new Feedback(
        123,
        "user-456",
        789,
        "Great service!",
        "https://example.com/image.jpg",
        mockDate,
        5,
        "John Doe"
      );

      expect(feedback.getFeedbackId()).toBe(123);
      expect(feedback.getUserId()).toBe("user-456");
      expect(feedback.getComplaintId()).toBe(789);
      expect(feedback.getDetails()).toBe("Great service!");
      expect(feedback.getImage()).toBe("https://example.com/image.jpg");
      expect(feedback.getCreationTime()).toBe(mockDate);
      expect(feedback.getRating()).toBe(5);
      expect(feedback.getName()).toBe("John Doe");
    });

    it("should handle default values when not provided", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 0, "");
      expect(feedback.getFeedbackId()).toBe(0);
      expect(feedback.getUserId()).toBe("");
      expect(feedback.getComplaintId()).toBe(0);
      expect(feedback.getDetails()).toBe("");
      expect(feedback.getImage()).toBe("");
      expect(feedback.getRating()).toBe(0);
      expect(feedback.getName()).toBe("");
    });
  });

  describe("Setters", () => {
    it("should update all properties correctly", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 0, "");
      
      feedback.setFeedbackId(999);
      feedback.setUserId("new-user");
      feedback.setComplaintId(111);
      feedback.setDetails("Updated details");
      feedback.setImage("new-image.jpg");
      feedback.setCreationTime(mockDate);
      feedback.setRating(3);
      feedback.setName("Jane Smith");

      expect(feedback.getFeedbackId()).toBe(999);
      expect(feedback.getUserId()).toBe("new-user");
      expect(feedback.getComplaintId()).toBe(111);
      expect(feedback.getDetails()).toBe("Updated details");
      expect(feedback.getImage()).toBe("new-image.jpg");
      expect(feedback.getCreationTime()).toBe(mockDate);
      expect(feedback.getRating()).toBe(3);
      expect(feedback.getName()).toBe("Jane Smith");
    });
  });

  describe("toPlainObject", () => {
    it("should convert Feedback instance to plain object", () => {
      const feedback = new Feedback(
        123,
        "user-456",
        789,
        "Great service!",
        "https://example.com/image.jpg",
        mockDate,
        5,
        "John Doe"
      );

      const plainObject = feedback.toPlainObject();

      expect(plainObject).toEqual({
        feedbackId: 123,
        userId: "user-456",
        complaintId: 789,
        details: "Great service!",
        image: "https://example.com/image.jpg",
        creationtime: mockDate.toISOString(),
        rating: 5,
        name: "John Doe",
        stars: "★★★★★",
      });
    });

    it("should handle empty/zero values in toPlainObject", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 0, "");
      const plainObject = feedback.toPlainObject();
      expect(plainObject.stars).toBe("☆☆☆☆☆");
      expect(plainObject.rating).toBe(0);
    });
  });

  describe("fromRecord", () => {
    it("should create Feedback instance from database record", () => {
      const feedback = Feedback.fromRecord(validFeedbackData);
      expect(feedback.getFeedbackId()).toBe(123);
      expect(feedback.getUserId()).toBe("user-456");
      expect(feedback.getComplaintId()).toBe(789);
      expect(feedback.getDetails()).toBe("Great service, issue resolved quickly!");
      expect(feedback.getImage()).toBe("https://example.com/image.jpg");
      expect(feedback.getCreationTime()).toEqual(mockDate);
      expect(feedback.getRating()).toBe(5);
      expect(feedback.getName()).toBe("John Doe");
    });

    it("should default rating to 1 when not provided", () => {
      const dataWithoutRating = { ...validFeedbackData, rating: undefined };
      const feedback = Feedback.fromRecord(dataWithoutRating);
      expect(feedback.getRating()).toBe(1);
    });

    it("should handle missing optional fields", () => {
      const minimalData = {
        feedbackId: 1,
        userId: "user1",
        complaintId: 100,
        details: "Test",
        image: "img.jpg",
        creationtime: new Date().toISOString(),
        name: "Test User",
      };
      const feedback = Feedback.fromRecord(minimalData);
      expect(feedback.getRating()).toBe(1);
    });
  });

  describe("validateForInsert", () => {
    it("should return null for valid feedback", () => {
      const feedback = new Feedback(0, "user-456", 789, "Great service!", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBeNull();
    });

    it("should return error when userId is missing", () => {
      const feedback = new Feedback(0, "", 789, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBe("User ID is missing");
    });

    it("should return error when complaintId is missing (0)", () => {
      const feedback = new Feedback(0, "user-456", 0, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBe("Complaint ID is missing");
    });

    it("should return error when details is empty", () => {
      const feedback = new Feedback(0, "user-456", 789, "", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBe("Please provide feedback details");
    });

    it("should return error when details is only whitespace", () => {
      const feedback = new Feedback(0, "user-456", 789, "   ", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBe("Please provide feedback details");
    });

    it("should return error when image is missing", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "", new Date(), 5, "John Doe");
      expect(feedback.validateForInsert()).toBe("Image is required");
    });

    it("should return error when name is missing", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "image.jpg", new Date(), 5, "");
      expect(feedback.validateForInsert()).toBe("User name is missing");
    });

    it("should return error when name is only whitespace", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "image.jpg", new Date(), 5, "   ");
      expect(feedback.validateForInsert()).toBe("User name is missing");
    });

    it("should return error when rating is less than 1", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "image.jpg", new Date(), 0, "John Doe");
      expect(feedback.validateForInsert()).toBe("Please provide a valid rating (1-5)");
    });

    it("should return error when rating is greater than 5", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "image.jpg", new Date(), 6, "John Doe");
      expect(feedback.validateForInsert()).toBe("Please provide a valid rating (1-5)");
    });
  });

  describe("isValid", () => {
    it("should return true for valid feedback with ID", () => {
      const feedback = new Feedback(123, "user-456", 789, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.isValid()).toBe(true);
    });

    it("should return false when feedbackId is missing (0)", () => {
      const feedback = new Feedback(0, "user-456", 789, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.isValid()).toBe(false);
    });

    it("should return false when userId is missing", () => {
      const feedback = new Feedback(123, "", 789, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.isValid()).toBe(false);
    });

    it("should return false when complaintId is missing", () => {
      const feedback = new Feedback(123, "user-456", 0, "Details", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.isValid()).toBe(false);
    });

    it("should return false when details is missing", () => {
      const feedback = new Feedback(123, "user-456", 789, "", "image.jpg", new Date(), 5, "John Doe");
      expect(feedback.isValid()).toBe(false);
    });

    it("should return false when rating is invalid", () => {
      const feedback = new Feedback(123, "user-456", 789, "Details", "image.jpg", new Date(), 6, "John Doe");
      expect(feedback.isValid()).toBe(false);
    });
  });

  describe("getRatingStars", () => {
    it("should return 5 stars for rating 5", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 5, "");
      expect(feedback.getRatingStars()).toBe("★★★★★");
    });

    it("should return 3 stars for rating 3", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 3, "");
      expect(feedback.getRatingStars()).toBe("★★★☆☆");
    });

    it("should return 0 stars for rating 0", () => {
      const feedback = new Feedback(0, "", 0, "", "", new Date(), 0, "");
      expect(feedback.getRatingStars()).toBe("☆☆☆☆☆");
    });
  });

  describe("getFormattedDate", () => {
    it("should return formatted date string", () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      const feedback = new Feedback(0, "", 0, "", "", date, 0, "");
      const formattedDate = feedback.getFormattedDate();
      expect(formattedDate).toBe(date.toLocaleString('en-US'));
    });

    it("should respect custom locale", () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      const feedback = new Feedback(0, "", 0, "", "", date, 0, "");
      const formattedDate = feedback.getFormattedDate('de-DE');
      expect(formattedDate).toBe(date.toLocaleString('de-DE'));
    });
  });
});

describe("feedback db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertFeedbackwIMG", () => {
    it("should insert feedback with image", async () => {
      const mockResult = [{ feedbackId: "1", userId: "user-1", complaintId: "complaint-1", details: "Road damaged", image: "image.jpg" }];
      mockedSql.mockResolvedValue(mockResult);

      const result = await insertFeedbackwIMG("user-1", "complaint-1", "Road damaged", "image.jpg", 5);

      expect(sql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("should handle empty insert result", async () => {
      mockedSql.mockResolvedValue([]);
      const result = await insertFeedbackwIMG("user-1", "complaint-1", "No image", "", 3);
      expect(result).toEqual([]);
    });

    it("should throw when database fails", async () => {
      mockedSql.mockRejectedValue(new Error("Database error"));
      await expect(insertFeedbackwIMG("user-1", "complaint-1", "Broken traffic light", "traffic.jpg", 4))
        .rejects.toThrow("Database error");
    });
  });

  describe("readFeedback", () => {
    it("should return feedback for a complaint", async () => {
      const mockFeedback = [
        { name: "John Doe", feedbackId: "1", complaintId: "complaint-1", userId: "user-1", details: "Issue resolved", image: "resolved.jpg", creationtime: new Date(), rating: 5 },
        { name: "Jane Doe", feedbackId: "2", complaintId: "complaint-1", userId: "user-2", details: "Still ongoing", image: "ongoing.jpg", creationtime: new Date(), rating: 3 },
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
      mockedSql.mockRejectedValue(new Error("Query failed"));
      await expect(readFeedback("complaint-1")).rejects.toThrow("Query failed");
    });
  });
});