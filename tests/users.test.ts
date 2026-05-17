// tests/lib/db/users.test.ts
import { Pool } from "pg";
import { getUserRole, setUserRole, setResident, setAdmin } from "@/lib/db/users";

jest.mock("pg", () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue(mockClient),
  };
  
  return { Pool: jest.fn(() => mockPool) };
});

const mockPool = new Pool() as jest.Mocked<Pool>;
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

describe("users db functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockPool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  describe("getUserRole", () => {
    it("should return user role when found", async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ type_name: "Admin" }],
      });

      const result = await getUserRole("user-123");

      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(result).toBe("Admin");
    });

    it("should return 'Resident' as default when no role found", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await getUserRole("user-123");

      expect(result).toBe("Resident");
    });
  });

  describe("setUserRole", () => {
    it("should set user role successfully", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // role exists
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({}) // DELETE
        .mockResolvedValueOnce({}) // INSERT
        .mockResolvedValueOnce({}); // COMMIT

      await setUserRole("user-123", "Admin");

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id FROM user_types WHERE type_name = $1"),
        ["Admin"]
      );
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM roles WHERE user_id = $1"),
        ["user-123"]
      );
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should throw error when role not found", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      await expect(setUserRole("user-123", "SuperAdmin")).rejects.toThrow(
        "Role 'SuperAdmin' not found"
      );

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should rollback transaction on error", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // role exists
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("DB error"));

      await expect(setUserRole("user-123", "Admin")).rejects.toThrow("DB error");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("setResident", () => {
    it("should set resident role successfully", async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // default role
        .mockResolvedValueOnce({}); // insert

      await setResident("user-123");

      expect(mockPool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("setAdmin", () => {
    it("should set admin role successfully", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // get Admin role
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({}) // DELETE
        .mockResolvedValueOnce({}) // INSERT
        .mockResolvedValueOnce({}); // COMMIT

      await setAdmin("user-123");

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id FROM user_types WHERE type_name = 'Admin'")
      );
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should throw error when Admin role not found", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      await expect(setAdmin("user-123")).rejects.toThrow(
        "Admin role not found in user_types table"
      );

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should rollback on error during setAdmin", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // get Admin role
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("Delete failed"));

      await expect(setAdmin("user-123")).rejects.toThrow("Delete failed");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});