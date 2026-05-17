// tests/api/complaints.test.ts
// Mock Next.js server modules FIRST before importing the route
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => {
      return {
        status: init?.status ?? 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => body,
      };
    },
  },
}));

jest.mock("@/lib/auth/server", () => ({
  withAuth: jest.fn((_roles: string[], handler: Function) => {
    return (req: Request, context?: any) => {
      const mockSession = { user: { id: "user-123", role: "Resident" } };
      return handler(req, mockSession, context);
    };
  }),
}));

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

// Mock Request for Node environment
global.Request = class {
  url: string;
  method: string;
  body: any;
  headers: Headers;

  constructor(url: string, options?: { method?: string; body?: string; headers?: HeadersInit }) {
    this.url = url;
    this.method = options?.method || "GET";
    this.body = options?.body;
    this.headers = new Headers(options?.headers);
  }

  async json() {
    return JSON.parse(this.body);
  }
} as any;

import { POST } from "@/app/api/complaints/route";
import { sql } from "@/lib/db/neon";

const mockSql = sql as jest.Mock;

// Helper to create request
const makeRequest = (body: unknown, method: string = "POST"): Request => {
  return new Request("http://localhost/api/complaints", {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
};

describe("POST /api/complaints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const validComplaint = {
    municipality: "Emfuleni",
    issuetype: "Potholes",
    details: "Large pothole on Main Street",
    latitude: -26.2,
    longitude: 28.0,
    address: "123 Main St",
    coords: "-26.2,28.0",
    ward_id: "ward-1",
    image: "https://example.com/image.jpg",
  };

  it("returns 401 when user is not authenticated", async () => {
    // Override the mock for this test
    (require("@/lib/auth/server").withAuth as jest.Mock).mockImplementationOnce(
      (_roles: string[], handler: Function) => {
        return async (req: Request) => {
          const mockSession = null;
          return handler(req, mockSession);
        };
      }
    );

    const req = makeRequest(validComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data).toEqual({ message: "Missing authenticated user" });
  });

  it("returns 400 when municipality is missing", async () => {
    const { municipality, ...invalidComplaint } = validComplaint;
    const req = makeRequest(invalidComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Missing municipality, issuetype, or details" });
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 when issuetype is missing", async () => {
    const { issuetype, ...invalidComplaint } = validComplaint;
    const req = makeRequest(invalidComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Missing municipality, issuetype, or details" });
  });

  it("returns 400 when details is missing", async () => {
    const { details, ...invalidComplaint } = validComplaint;
    const req = makeRequest(invalidComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Missing municipality, issuetype, or details" });
  });

  it("returns 400 when latitude is missing", async () => {
    const { latitude, ...invalidComplaint } = validComplaint;
    const req = makeRequest(invalidComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Missing latitude or longitude" });
  });

  it("returns 400 when longitude is missing", async () => {
    const { longitude, ...invalidComplaint } = validComplaint;
    const req = makeRequest(invalidComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Missing latitude or longitude" });
  });

  it("returns 400 when latitude is invalid", async () => {
    const req = makeRequest({ ...validComplaint, latitude: "invalid" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Invalid latitude or longitude" });
  });

  it("returns 400 when latitude is out of range", async () => {
    const req = makeRequest({ ...validComplaint, latitude: -100 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Latitude or longitude is out of range" });
  });

  it("returns 400 when longitude is out of range", async () => {
    const req = makeRequest({ ...validComplaint, longitude: -200 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ message: "Latitude or longitude is out of range" });
  });

  it("creates complaint successfully without duplicate detection", async () => {
    const mockComplaint = {
      complaintid: 1,
      userid: "user-123",
      ward_id: "ward-1",
      municipality: "Emfuleni",
      status: "Pending",
      image: "https://example.com/image.jpg",
      issuetype: "Potholes",
      details: "Large pothole on Main Street",
      creationtime: new Date(),
      latitude: -26.2,
      longitude: 28.0,
      address: "123 Main St",
      coords: "-26.2,28.0",
      priority: 0,
    };

    mockSql.mockResolvedValueOnce([mockComplaint]);
    mockSql.mockResolvedValueOnce([]);

    const req = makeRequest(validComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({
      message: "Complaint created successfully",
      complaint: mockComplaint,
      possibleDuplicateCount: 0,
      possibleDuplicates: [],
    });
    expect(mockSql).toHaveBeenCalledTimes(2);
  });

  it("creates complaint successfully with duplicate detection", async () => {
    const mockComplaint = {
      complaintid: 1,
      userid: "user-123",
      ward_id: "ward-1",
      municipality: "Emfuleni",
      status: "Pending",
      image: "https://example.com/image.jpg",
      issuetype: "Potholes",
      details: "Large pothole on Main Street",
      creationtime: new Date(),
      latitude: -26.2,
      longitude: 28.0,
      address: "123 Main St",
      coords: "-26.2,28.0",
      priority: 0,
    };

    const mockDuplicates = [
      {
        original_complaint_id: 2,
        duplicate_complaint_id: 1,
        distance_meters: 50,
        review_status: "Pending",
      },
    ];

    mockSql.mockResolvedValueOnce([mockComplaint]);
    mockSql.mockResolvedValueOnce(mockDuplicates);

    const req = makeRequest(validComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({
      message: "Complaint created successfully",
      complaint: mockComplaint,
      possibleDuplicateCount: 1,
      possibleDuplicates: mockDuplicates,
    });
  });

  it("returns 500 when database insert fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const req = makeRequest(validComplaint);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ message: "Failed to create complaint" });
    expect(console.error).toHaveBeenCalled();
  });
});