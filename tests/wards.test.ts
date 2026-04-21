
/** @jest-environment node */

import { GET } from "@/app/api/wards/route";

jest.mock("fs");
jest.mock("path");

import fs from "fs";
import path from "path";

const mockReadFileSync = fs.readFileSync as jest.Mock;
const mockJoin = path.join as jest.Mock;

describe("GET /api/wards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJoin.mockReturnValue("/mocked/path/wards_Western_Cape.json");
  });

  test("returns 400 when province param is missing", async () => {
    const req = new Request("http://localhost/api/wards");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Province required");
  });

  test("returns geojson when province file exists", async () => {
    const mockGeoJson = { type: "FeatureCollection", features: [] };
    mockReadFileSync.mockReturnValue(JSON.stringify(mockGeoJson));

    const req = new Request("http://localhost/api/wards?province=Western+Cape");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockGeoJson);
  });

  test("replaces spaces with underscores in filename", async () => {
    const mockGeoJson = { type: "FeatureCollection", features: [] };
    mockReadFileSync.mockReturnValue(JSON.stringify(mockGeoJson));

    const req = new Request(
      "http://localhost/api/wards?province=Northern+Cape"
    );
    await GET(req);

    expect(mockJoin).toHaveBeenCalledWith(
      expect.anything(),
      "public",
      "data",
      "wards_Northern_Cape.json"
    );
  });

  test("returns 404 when province file does not exist", async () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error("File not found");
    });

    const req = new Request(
      "http://localhost/api/wards?province=FakeProvince"
    );
    const res = await GET(req);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Province file not found for FakeProvince");
  });

  test("handles province with multiple spaces", async () => {
    const mockGeoJson = { type: "FeatureCollection", features: [] };
    mockReadFileSync.mockReturnValue(JSON.stringify(mockGeoJson));

    const req = new Request(
      "http://localhost/api/wards?province=Kwazulu+Natal"
    );
    await GET(req);

    expect(mockJoin).toHaveBeenCalledWith(
      expect.anything(),
      "public",
      "data",
      "wards_Kwazulu_Natal.json"
    );
  });
});