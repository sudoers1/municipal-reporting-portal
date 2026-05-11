/** @jest-environment node */

import { GET } from "@/app/api/wards/route";

jest.mock("fs");
jest.mock("path");
jest.mock("@turf/turf", () => ({
  point: jest.fn(() => ({ type: "Point" })),
  booleanPointInPolygon: jest.fn(),
}));

import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";

const mockReadFileSync = fs.readFileSync as jest.Mock;
const mockJoin = path.join as jest.Mock;
const mockBooleanPointInPolygon = turf.booleanPointInPolygon as jest.Mock;

describe("GET /api/wards (lat/lng based)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJoin.mockImplementation((...args) => args.join("/"));
  });

  test("returns 400 when lat/lng params are missing", async () => {
    const req = new Request("http://localhost/api/wards");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("lat and lng required");
  });

  test("returns ward polygon when point is inside", async () => {
    const mockWard = { type: "Feature", geometry: { type: "Polygon", coordinates: [] } };
    const mockGeoJson = { type: "FeatureCollection", features: [mockWard] };

    mockReadFileSync.mockReturnValue(JSON.stringify(mockGeoJson));
    mockBooleanPointInPolygon.mockReturnValue(true);

    const req = new Request("http://localhost/api/wards?lat=-26.2&lng=28.0");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockWard);
  });

  test("skips provinces with missing files", async () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error("File not found");
    });

    const req = new Request("http://localhost/api/wards?lat=-26.2&lng=28.0");
    const res = await GET(req);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Ward not found");
  });

  test("returns 404 when no ward contains point", async () => {
    const mockWard = { type: "Feature", geometry: { type: "Polygon", coordinates: [] } };
    const mockGeoJson = { type: "FeatureCollection", features: [mockWard] };

    mockReadFileSync.mockReturnValue(JSON.stringify(mockGeoJson));
    mockBooleanPointInPolygon.mockReturnValue(false);

    const req = new Request("http://localhost/api/wards?lat=-26.2&lng=28.0");
    const res = await GET(req);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Ward not found");
  });

  test("loops through multiple provinces until ward is found", async () => {
    const mockWard = { type: "Feature", geometry: { type: "Polygon", coordinates: [] } };
    const mockGeoJson = { type: "FeatureCollection", features: [mockWard] };

    let callCount = 0;
    mockReadFileSync.mockImplementation(() => {
      callCount++;
      return JSON.stringify(mockGeoJson);
    });
    mockBooleanPointInPolygon.mockImplementation(() => callCount === 3); // found on 3rd province

    const req = new Request("http://localhost/api/wards?lat=-26.2&lng=28.0");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockWard);
    expect(callCount).toBeGreaterThan(1);
  });
});
