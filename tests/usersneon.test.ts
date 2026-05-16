import {
  readUsers,
  readoneUser,
  insertUserMunicipality,
} from "@/lib/db/usersneon";

import { sql } from "@/lib/db/neon";

// Mock the neon db module
jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

const mockedSql = sql as jest.Mock;

describe("usersneon db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("readUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: "1",
          name: "John",
          email: "john@example.com",
          municipality: "Cape Town",
        },
        {
          id: "2",
          name: "Jane",
          email: "jane@example.com",
          municipality: "Johannesburg",
        },
      ];

      mockedSql.mockResolvedValue(mockUsers);

      const result = await readUsers();

      expect(sql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
  });

  describe("readoneUser", () => {
    it("should return one user", async () => {
      const mockUser = [
        {
          id: "1",
          name: "John",
          email: "john@example.com",
        },
      ];

      mockedSql.mockResolvedValue(mockUser);

      const result = await readoneUser("1");

      expect(sql).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser[0]);
    });

    it("should return null when user does not exist", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await readoneUser("999");

      expect(result).toBeNull();
    });
  });

  describe("insertUserMunicipality", () => {
    it("should insert municipality and return inserted row", async () => {
      const insertedRow = [
        {
          userid: "1",
          municipality: "Pretoria",
        },
      ];

      mockedSql.mockResolvedValue(insertedRow);

      const result = await insertUserMunicipality(
        "1",
        "Pretoria"
      );

      expect(sql).toHaveBeenCalledTimes(2);

      expect(result).toEqual(insertedRow[0]);
    });

    it("should return null if insert returns empty", async () => {
      mockedSql.mockResolvedValue([]);

      const result = await insertUserMunicipality(
        "1",
        "Durban"
      );

      expect(result).toBeNull();
    });
  });
});