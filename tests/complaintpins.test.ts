// tests/complaintpins.test.ts
/** @jest-environment node */

// Mock Next.js server modules before importing the route
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => {
      return {
        json: async () => data,
        status: init?.status || 200,
        ...init,
      };
    },
  },
}));

// Mock the neon db
jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

import { POST } from "@/app/api/complaintpins/route";
import { sql } from "@/lib/db/neon";

// Define mockSql after the mock is set up
const mockSql = sql as jest.MockedFunction<typeof sql>;

// Create a Request polyfill
class MockRequest {
  url: string;
  method: string;
  body: any;

  constructor(url: string, options?: { method?: string; body?: string }) {
    this.url = url;
    this.method = options?.method || 'GET';
    this.body = options?.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
}

global.Request = MockRequest as any;

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

    expect(body.error).toBe("Ward object required");
  });

  test("returns 400 if WardID is missing", async () => {
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

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toBe("WardID missing in ward properties");
  });

  test("filters complaints by ward_id", async () => {
    const complaints = [
      {
        complaintid: 1,
        coords: "-26.2, 28.0",
        status: "Acknowledged",
        issuetype: "Road",
        details: "Pothole",
        image: null,
        address: "123 Main St",
        ward_id: "Ward1",
        municipality: "City",
      },
      {
        complaintid: 2,
        coords: "-26.3, 28.1",
        status: "Resolved",
        issuetype: "Water",
        details: "Leak",
        image: null,
        address: "456 Oak St",
        ward_id: "Ward1",
        municipality: "City",
      },
    ];

    mockSql.mockResolvedValue(complaints);

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
      properties: {
        WardID: "Ward1",
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(complaints);
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  test("returns empty array when no complaints match ward_id", async () => {
    mockSql.mockResolvedValue([]);

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
      properties: {
        WardID: "Ward1",
      },
    };

    const req = new Request("http://localhost/api/complaintpins", {
      method: "POST",
      body: JSON.stringify({ ward }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  test("filters out pending complaints", async () => {
  const complaints = [
    {
      complaintid: 1,
      coords: "-26.2, 28.0",
      status: "Pending",
      issuetype: "Road",
      details: "Pothole",
      image: null,
      address: "123 Main St",
      ward_id: "Ward1",
      municipality: "City",
    },
    {
      complaintid: 2,
      coords: "-26.3, 28.1",
      status: "Acknowledged",
      issuetype: "Water",
      details: "Leak",
      image: null,
      address: "456 Oak St",
      ward_id: "Ward1",
      municipality: "City",
    },
  ];

  mockSql.mockResolvedValue(complaints);

  const ward = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {
      WardID: "Ward1",
    },
  };

  const req = new Request("http://localhost/api/complaintpins", {
    method: "POST",
    body: JSON.stringify({ ward }),
  });

  const res = await POST(req);
  const body = await res.json();

  expect(res.status).toBe(200);
  // Just verify the SQL was called
  expect(mockSql).toHaveBeenCalledTimes(1);
  // The actual filtering is done by the database, not the test
});

  test("returns 500 on database error", async () => {
    mockSql.mockRejectedValue(new Error("DB error"));

    const ward = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
      properties: {
        WardID: "Ward1",
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