import {
  insertComplaint,
  insertComplaintwIMG,
  readComplaints,
  readoneComplaint,
  readMyComplaints,
} from "@/lib/db/complaints";

import { sql } from "@/lib/db/neon";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

describe("insertComplaint", () => {
  it("inserts complaint with correct values", async () => {
    (sql as jest.Mock).mockResolvedValue([{ id: 1 }]);

    await insertComplaint("user1", "Potholes", "Broken road");

    expect(sql).toHaveBeenCalled();
  });
});

describe("insertComplaintwIMG", () => {
  it("inserts complaint with image", async () => {
    (sql as jest.Mock).mockResolvedValue([{ id: 2 }]);

    await insertComplaintwIMG(
      "user1",
      "Potholes",
      "Broken road",
      "img-url"
    );

    expect(sql).toHaveBeenCalled();
  });
});

describe("readComplaints", () => {
  it("fetches all complaints", async () => {
    (sql as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await readComplaints();

    expect(sql).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });
});

describe("readoneComplaint", () => {
  it("returns first complaint", async () => {
    (sql as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const result = await readoneComplaint("1");

    expect(result).toEqual({ id: 1 });
  });

  it("returns null if empty", async () => {
    (sql as jest.Mock).mockResolvedValue([]);

    const result = await readoneComplaint("999");

    expect(result).toBeNull();
  });
});

describe("readMyComplaints", () => {
  it("fetches my complaints", async () => {
    (sql as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await readMyComplaints("1");

    expect(sql).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });
});