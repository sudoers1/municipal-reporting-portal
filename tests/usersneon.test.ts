import {
  readUsers,
  readoneUser,
  insertUserMunicipality,
} from "@/lib/db/usersneon";

import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

describe("Users Neon Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("readUsers", () => {
    const mockUsersData = [
      {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/image.jpg",
        createdAt: new Date("2024-01-01T10:00:00Z"),
        updatedAt: new Date("2024-01-01T10:00:00Z"),
        user_types_id: 1,
        municipality: "Springfield",
      },
      {
        id: "user456",
        name: "Jane Smith",
        email: "jane@example.com",
        image: null,
        createdAt: new Date("2024-01-02T14:30:00Z"),
        updatedAt: new Date("2024-01-02T14:30:00Z"),
        user_types_id: 2,
        municipality: "Shelbyville",
      },
    ];

    it("should fetch all users with their roles and municipalities", async () => {
      (sql as jest.Mock).mockResolvedValue(mockUsersData);

      const result = await readUsers();

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.stringContaining("user.id"),
        expect.stringContaining("user.name"),
        expect.stringContaining("user.email"),
        expect.stringContaining("FROM \"user\""),
        expect.stringContaining("LEFT JOIN roles"),
        expect.stringContaining("LEFT JOIN user_municipality")
      );
      expect(result).toEqual(mockUsersData);
      expect(result).toHaveLength(2);
    });

    it("should return users without roles (null user_types_id)", async () => {
      const usersWithoutRoles = [
        {
          id: "user789",
          name: "No Role User",
          email: "norole@example.com",
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user_types_id: null,
          municipality: "Springfield",
        },
      ];
      (sql as jest.Mock).mockResolvedValue(usersWithoutRoles);

      const result = await readUsers();

      expect(result[0].user_types_id).toBeNull();
      expect(result).toHaveLength(1);
    });

    it("should return users without municipality (null municipality)", async () => {
      const usersWithoutMunicipality = [
        {
          id: "user999",
          name: "No Municipality User",
          email: "nomuni@example.com",
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user_types_id: 1,
          municipality: null,
        },
      ];
      (sql as jest.Mock).mockResolvedValue(usersWithoutMunicipality);

      const result = await readUsers();

      expect(result[0].municipality).toBeNull();
    });

    it("should return empty array when no users exist", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readUsers();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle database error", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

      await expect(readUsers()).rejects.toThrow("Database connection failed");
    });

    it("should return correct data structure for each user", async () => {
      (sql as jest.Mock).mockResolvedValue(mockUsersData);

      const result = await readUsers();

      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("email");
      expect(result[0]).toHaveProperty("image");
      expect(result[0]).toHaveProperty("createdAt");
      expect(result[0]).toHaveProperty("updatedAt");
      expect(result[0]).toHaveProperty("user_types_id");
      expect(result[0]).toHaveProperty("municipality");
    });
  });

  describe("readoneUser", () => {
    const mockUserData = {
      id: "user123",
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/image.jpg",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-01-01T10:00:00Z"),
      user_types_id: 1,
      municipality: "Springfield",
    };

    it("should fetch single user by ID with their role and municipality", async () => {
      (sql as jest.Mock).mockResolvedValue([mockUserData]);

      const result = await readoneUser("user123");

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.stringContaining("FROM \"user\""),
        expect.stringContaining("LEFT JOIN roles"),
        expect.stringContaining("LEFT JOIN user_municipality"),
        expect.stringContaining("WHERE \"user\".id ="),
        expect.stringContaining("user123")
      );
      expect(result).toEqual(mockUserData);
    });

    it("should return null when user not found", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readoneUser("nonexistent123");

      expect(result).toBeNull();
    });

    it("should return user without role (null user_types_id)", async () => {
      const userWithoutRole = {
        ...mockUserData,
        user_types_id: null,
      };
      (sql as jest.Mock).mockResolvedValue([userWithoutRole]);

      const result = await readoneUser("user123");

      expect(result?.user_types_id).toBeNull();
    });

    it("should return user without municipality (null municipality)", async () => {
      const userWithoutMunicipality = {
        ...mockUserData,
        municipality: null,
      };
      (sql as jest.Mock).mockResolvedValue([userWithoutMunicipality]);

      const result = await readoneUser("user123");

      expect(result?.municipality).toBeNull();
    });

    it("should handle empty string userid", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await readoneUser("");

      expect(result).toBeNull();
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("WHERE \"user\".id ="),
        expect.stringContaining("")
      );
    });

    it("should handle database error", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database query failed"));

      await expect(readoneUser("user123")).rejects.toThrow("Database query failed");
    });

    it("should return user with all expected properties", async () => {
      (sql as jest.Mock).mockResolvedValue([mockUserData]);

      const result = await readoneUser("user123");

      expect(result).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("insertUserMunicipality", () => {
    const mockUserid = "user123";
    const mockMunicipality = "Springfield";

    it("should insert user municipality successfully", async () => {
      const mockResult = [
        {
          userid: mockUserid,
          municipality: mockMunicipality,
        },
      ];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, mockMunicipality);

      expect(sql).toHaveBeenCalledTimes(1);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO user_municipality"),
        expect.stringContaining("VALUES"),
        expect.stringContaining("RETURNING *")
      );
      expect(result).toEqual(mockResult[0]);
    });

    it("should return null when insert fails", async () => {
      (sql as jest.Mock).mockResolvedValue([]);

      const result = await insertUserMunicipality(mockUserid, mockMunicipality);

      expect(result).toBeNull();
    });

    it("should handle duplicate municipality for user", async () => {
      const duplicateError = new Error("Duplicate key violation");
      (sql as jest.Mock).mockRejectedValue(duplicateError);

      await expect(
        insertUserMunicipality(mockUserid, mockMunicipality)
      ).rejects.toThrow("Duplicate key violation");
    });

    it("should handle empty municipality string", async () => {
      const mockResult = [{ userid: mockUserid, municipality: "" }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, "");

      expect(result?.municipality).toBe("");
    });

    it("should handle special characters in municipality name", async () => {
      const specialMunicipality = "St. Louis County (MO)";
      const mockResult = [{ userid: mockUserid, municipality: specialMunicipality }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, specialMunicipality);

      expect(result?.municipality).toBe(specialMunicipality);
    });

    it("should handle unicode municipality names", async () => {
      const unicodeMunicipality = "München (Мюнхен) 北京";
      const mockResult = [{ userid: mockUserid, municipality: unicodeMunicipality }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, unicodeMunicipality);

      expect(result?.municipality).toBe(unicodeMunicipality);
    });

    it("should handle very long municipality names", async () => {
      const longMunicipality = "A".repeat(500);
      const mockResult = [{ userid: mockUserid, municipality: longMunicipality }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, longMunicipality);

      expect(result?.municipality).toBe(longMunicipality);
    });

    it("should handle database connection error", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

      await expect(
        insertUserMunicipality(mockUserid, mockMunicipality)
      ).rejects.toThrow("Database connection failed");
    });

    it("should handle invalid userid format", async () => {
      (sql as jest.Mock).mockRejectedValue(new Error("Invalid userid format"));

      await expect(
        insertUserMunicipality("", mockMunicipality)
      ).rejects.toThrow("Invalid userid format");
    });

    it("should return inserted data with correct structure", async () => {
      const mockResult = [{ userid: mockUserid, municipality: mockMunicipality }];
      (sql as jest.Mock).mockResolvedValue(mockResult);

      const result = await insertUserMunicipality(mockUserid, mockMunicipality);

      expect(result).toHaveProperty("userid");
      expect(result).toHaveProperty("municipality");
      expect(result?.userid).toBe(mockUserid);
      expect(result?.municipality).toBe(mockMunicipality);
    });
  });

  describe("Integration workflow tests", () => {
    it("should read all users then read specific user", async () => {
      const mockUsers = [
        { id: "user1", name: "User One", email: "user1@example.com", user_types_id: 1, municipality: "City A" },
        { id: "user2", name: "User Two", email: "user2@example.com", user_types_id: 2, municipality: "City B" },
      ];
      
      // Mock readUsers
      (sql as jest.Mock).mockResolvedValueOnce(mockUsers);
      const allUsers = await readUsers();
      
      // Mock readoneUser
      (sql as jest.Mock).mockResolvedValueOnce([mockUsers[0]]);
      const singleUser = await readoneUser("user1");
      
      expect(allUsers).toHaveLength(2);
      expect(singleUser).toEqual(mockUsers[0]);
      expect(sql).toHaveBeenCalledTimes(2);
    });

    it("should insert municipality and then read user to verify", async () => {
      const userid = "user123";
      const municipality = "New City";
      
      // Mock insert
      (sql as jest.Mock).mockResolvedValueOnce([{ userid, municipality }]);
      const inserted = await insertUserMunicipality(userid, municipality);
      
      // Mock read user with new municipality
      const userWithMunicipality = {
        id: userid,
        name: "Test User",
        email: "test@example.com",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user_types_id: 1,
        municipality: municipality,
      };
      (sql as jest.Mock).mockResolvedValueOnce([userWithMunicipality]);
      const user = await readoneUser(userid);
      
      expect(inserted?.municipality).toBe(municipality);
      expect(user?.municipality).toBe(municipality);
    });

    it("should handle user with multiple data updates", async () => {
      const userid = "user123";
      const municipalities = ["City A", "City B", "City C"];
      
      for (const municipality of municipalities) {
        (sql as jest.Mock).mockResolvedValueOnce([{ userid, municipality }]);
        const result = await insertUserMunicipality(userid, municipality);
        expect(result?.municipality).toBe(municipality);
      }
      
      expect(sql).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edge cases and error scenarios", () => {
    it("should handle null userid in readoneUser", async () => {
      (sql as jest.Mock).mockResolvedValue([]);
      
      const result = await readoneUser(null as unknown as string);
      
      expect(result).toBeNull();
    });

    it("should handle undefined userid in readoneUser", async () => {
      (sql as jest.Mock).mockResolvedValue([]);
      
      const result = await readoneUser(undefined as unknown as string);
      
      expect(result).toBeNull();
    });

    it("should handle case sensitivity in municipality names", async () => {
      const lowercaseMunicipality = "springfield";
      const uppercaseMunicipality = "SPRINGFIELD";
      
      (sql as jest.Mock).mockResolvedValueOnce([{ userid: "user1", municipality: lowercaseMunicipality }]);
      const result1 = await insertUserMunicipality("user1", lowercaseMunicipality);
      
      (sql as jest.Mock).mockResolvedValueOnce([{ userid: "user2", municipality: uppercaseMunicipality }]);
      const result2 = await insertUserMunicipality("user2", uppercaseMunicipality);
      
      expect(result1?.municipality).toBe(lowercaseMunicipality);
      expect(result2?.municipality).toBe(uppercaseMunicipality);
    });

    it("should handle SQL injection attempts in inputs", async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      // The parameterized query should handle this safely
      (sql as jest.Mock).mockResolvedValue([{ userid: "user1", municipality: maliciousInput }]);
      
      const result = await insertUserMunicipality("user1", maliciousInput);
      
      // Verify the malicious input is treated as data, not SQL
      expect(result?.municipality).toBe(maliciousInput);
      expect(sql).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO user_municipality"),
        expect.any(String),
        expect.any(String),
        expect.stringContaining(maliciousInput)
      );
    });
  });
});