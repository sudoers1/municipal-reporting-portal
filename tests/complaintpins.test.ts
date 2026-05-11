/** @jest-environment node */

import { POST } from "@/app/api/complaintpins/route";

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

jest.mock("@turf/turf", () => ({
  point: jest.fn((coords) => ({
    type: "Point",
    coordinates: coords,
  })),
  booleanPointInPolygon: jest.fn(),
}));

import { sql } from "@/lib/db/neon";
import * as turf from "@turf/turf";

const mockSql = sql as jest.Mock;
const mockBooleanPointInPolygon = turf.booleanPointInPolygon as jest.Mock;

describe("POST /api/complaintpins", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if ward is missing", async () => {
    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toBe("Ward polygon required");
  });

  test("filters complaints inside ward", async () => {
    const complaints = [
      {
        complaintid: 1,
        coords: "-26.2, 28.0",
        status: "Pending",
        issuetype: "Road",
        details: "Pothole",
      },
      {
        complaintid: 2,
        coords: "-26.3, 28.1",
        status: "Resolved",
        issuetype: "Water",
        details: "Leak",
      },
    ];

    mockSql.mockResolvedValue(complaints);

    // First complaint is inside the ward, second complaint is outside
    mockBooleanPointInPolygon
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body).toEqual([complaints[0]]);

    expect(turf.point).toHaveBeenCalledWith([28.0, -26.2]);
    expect(turf.point).toHaveBeenCalledWith([28.1, -26.3]);
    expect(mockBooleanPointInPolygon).toHaveBeenCalledTimes(2);
  });

  test("returns empty array if no complaints inside ward", async () => {
    const complaints = [
      {
        complaintid: 1,
        coords: "-26.2, 28.0",
      },
      {
        complaintid: 2,
        coords: "-26.3, 28.1",
      },
    ];

    mockSql.mockResolvedValue(complaints);
    mockBooleanPointInPolygon.mockReturnValue(false);

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body).toEqual([]);

    expect(mockBooleanPointInPolygon).toHaveBeenCalledTimes(2);
  });

  test("ignores complaints with missing or invalid coords", async () => {
    const complaints = [
      {
        complaintid: 1,
        coords: null,
      },
      {
        complaintid: 2,
        coords: "invalid-coords",
      },
      {
        complaintid: 3,
        coords: "-26.2, 28.0",
      },
    ];

    mockSql.mockResolvedValue(complaints);
    mockBooleanPointInPolygon.mockReturnValue(true);

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body).toEqual([complaints[2]]);

    expect(turf.point).toHaveBeenCalledTimes(1);
    expect(turf.point).toHaveBeenCalledWith([28.0, -26.2]);
    expect(mockBooleanPointInPolygon).toHaveBeenCalledTimes(1);
  });

  test("returns 500 on database error", async () => {
    mockSql.mockRejectedValue(new Error("DB error"));

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);

    const body = await res.json();

    expect(body.error).toBe("Failed to fetch complaint pins");
  });
});