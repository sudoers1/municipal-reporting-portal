import { getUserRole, setUserRole, setResident } from "../lib/db/users";

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockQuery = jest.fn();
const mockConnect = jest.fn().mockResolvedValue(mockClient);

jest.mock("pg", () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: jest.fn((...args) => mockQuery(...args)),
    connect: jest.fn((...args) => mockConnect(...args)),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockClient.query.mockResolvedValue({ rows: [] });
});

describe("getUserRole", () => {
  test("returns Resident when no role found", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await getUserRole("user-1");
    expect(result).toBe("Resident");
  });

  test("returns the role name when found", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ type_name: "Worker" }] });

    const result = await getUserRole("user-1");
    expect(result).toBe("Worker");
  });
});

describe("setUserRole", () => {
  test("throws when role is not found in user_types", async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    await expect(setUserRole("user-1", "InvalidRole")).rejects.toThrow(
      "Role 'InvalidRole' not found"
    );
  });

  test("runs transaction when role is valid", async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [{ id: 3 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await setUserRole("user-1", "Worker");

    expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(mockClient.release).toHaveBeenCalled();
  });
});

describe("setResident", () => {
  test("inserts resident role for new user", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [] });

    await setResident("user-1");

    expect(mockQuery).toHaveBeenCalledTimes(2);
  });
});