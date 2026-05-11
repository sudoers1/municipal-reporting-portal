import { insertVerification, readApprovedVerifications, readDeniedVerifications, readPendingVerifications, approveVerification, rejectVerification } from "@/lib/db/verifications";

// Mock the db and setUserRole
jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));
jest.mock("@/lib/db/users", () => ({
  setUserRole: jest.fn(),
}));

import { sql } from "@/lib/db/neon";
import { setUserRole } from "@/lib/db/users";

const mockSql = sql as jest.MockedFunction<any>;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── insertVerification ───────────────────────────────────────────────────────

describe("insertVerification", () => {
  it("inserts a verification request for the given user_id", async () => {
    mockSql.mockResolvedValueOnce([]);
    await insertVerification("user-123");
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("does not throw on successful insert", async () => {
    mockSql.mockResolvedValueOnce([]);
    await expect(insertVerification("user-123")).resolves.not.toThrow();
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(insertVerification("user-123")).rejects.toThrow("DB error");
  });
});

// ─── readApprovedVerifications ────────────────────────────────────────────────

describe("readApprovedVerifications", () => {
  const mockRows = [
    { user_id: "user-1", approved: true, name: "Alice", email: "alice@example.com", image: "" },
  ];

  it("returns approved verifications", async () => {
    mockSql.mockResolvedValueOnce(mockRows);
    const result = await readApprovedVerifications();
    expect(result).toEqual(mockRows);
  });

  it("returns an empty array when no approved verifications exist", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await readApprovedVerifications();
    expect(result).toEqual([]);
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(readApprovedVerifications()).rejects.toThrow("DB error");
  });
});

// ─── readDeniedVerifications ──────────────────────────────────────────────────

describe("readDeniedVerifications", () => {
  const mockRows = [
    { user_id: "user-2", approved: false, name: "Bob", email: "bob@example.com", image: "" },
  ];

  it("returns denied verifications", async () => {
    mockSql.mockResolvedValueOnce(mockRows);
    const result = await readDeniedVerifications();
    expect(result).toEqual(mockRows);
  });

  it("returns an empty array when no denied verifications exist", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await readDeniedVerifications();
    expect(result).toEqual([]);
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(readDeniedVerifications()).rejects.toThrow("DB error");
  });
});

// ─── readPendingVerifications ─────────────────────────────────────────────────

describe("readPendingVerifications", () => {
  const mockRows = [
    { user_id: "user-3", approved: null, name: "Carol", email: "carol@example.com", image: "" },
  ];

  it("returns pending verifications", async () => {
    mockSql.mockResolvedValueOnce(mockRows);
    const result = await readPendingVerifications();
    expect(result).toEqual(mockRows);
  });

  it("returns an empty array when no pending verifications exist", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await readPendingVerifications();
    expect(result).toEqual([]);
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(readPendingVerifications()).rejects.toThrow("DB error");
  });
});

// ─── approveVerification ──────────────────────────────────────────────────────

describe("approveVerification", () => {
  it("updates approved to true for the given user_id", async () => {
    mockSql.mockResolvedValueOnce([]);
    await approveVerification("user-123");
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("calls setUserRole with the correct user_id and Worker role", async () => {
    mockSql.mockResolvedValueOnce([]);
    await approveVerification("user-123");
    expect(setUserRole).toHaveBeenCalledWith("user-123", "Worker");
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(approveVerification("user-123")).rejects.toThrow("DB error");
  });

  it("does not call setUserRole when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(approveVerification("user-123")).rejects.toThrow();
    expect(setUserRole).not.toHaveBeenCalled();
  });
});

// ─── rejectVerification ───────────────────────────────────────────────────────

describe("rejectVerification", () => {
  it("updates approved to false for the given user_id", async () => {
    mockSql.mockResolvedValueOnce([]);
    await rejectVerification("user-123");
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("does not call setUserRole on rejection", async () => {
    mockSql.mockResolvedValueOnce([]);
    await rejectVerification("user-123");
    expect(setUserRole).not.toHaveBeenCalled();
  });

  it("throws when the query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("DB error"));
    await expect(rejectVerification("user-123")).rejects.toThrow("DB error");
  });
});