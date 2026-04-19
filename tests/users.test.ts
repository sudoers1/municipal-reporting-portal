import { getUserRole, setUserRole, setResident } from "../lib/db/users";

jest.mock("@neondatabase/serverless", () => {
  const mockSql = jest.fn();
  mockSql.transaction = jest.fn();
  return { neon: jest.fn(() => mockSql) };
});

const mockSql = require("@neondatabase/serverless").neon();

describe("getUserRole", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns Resident when no role found in roles table", async () => {
    mockSql.mockResolvedValueOnce([]);

    const result = await getUserRole("user-1");
    expect(result).toBe("Resident");
  });

  test("returns the role name when found", async () => {
    mockSql
      .mockResolvedValueOnce([{ user_types_id: 2 }])
      .mockResolvedValueOnce([{ type_name: "Worker" }]);

    const result = await getUserRole("user-1");
    expect(result).toBe("Worker");
  });

  test("returns Resident when user_types query returns empty", async () => {
    mockSql
      .mockResolvedValueOnce([{ user_types_id: 2 }])
      .mockResolvedValueOnce([]);

    const result = await getUserRole("user-1");
    expect(result).toBe("Resident");
  });
});

describe("setUserRole", () => {
  beforeEach(() => jest.clearAllMocks());

  test("throws when role is not found in user_types", async () => {
    mockSql.mockResolvedValueOnce([{}]);

    await expect(setUserRole("user-1", "InvalidRole")).rejects.toThrow(
      "Role 'InvalidRole' not found"
    );
  });

  test("runs transaction when role is valid", async () => {
    mockSql.mockResolvedValueOnce([{ id: 3 }]);
    mockSql.transaction.mockResolvedValueOnce(undefined);

    await setUserRole("user-1", "Worker");

    expect(mockSql.transaction).toHaveBeenCalledTimes(1);
  });
});

describe("setResident", () => {
  beforeEach(() => jest.clearAllMocks());

  test("inserts resident role for new user", async () => {
    mockSql
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce(undefined);

    await setResident("user-1");

    expect(mockSql).toHaveBeenCalledTimes(2);
  });
});