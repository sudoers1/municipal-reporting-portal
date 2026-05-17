// tests/api/duplicate_routes.test.ts

let mockSession: any = {
  user: {
    id: 10,
    role: "Worker",
  },
};

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => {
      return {
        status: init?.status ?? 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => body,
        text: async () => JSON.stringify(body),
      };
    },
  },
}));

jest.mock("@/lib/auth/server", () => ({
  withAuth: jest.fn((_roles: string[], handler: Function) => {
    return (req: Request, context?: any) => {
      return handler(req, mockSession, context);
    };
  }),
}));

jest.mock("@/lib/db/neon", () => ({
  sql: jest.fn(),
}));

import { sql } from "@/lib/db/neon";

import { POST as ConfirmDuplicatePOST } from "@/app/api/duplicates/[id]/confirm/route";
import { POST as RejectDuplicatePOST } from "@/app/api/duplicates/[id]/reject/route";
import { GET as PendingDuplicatesGET } from "@/app/api/duplicates/pending/route";

const mockSql = sql as jest.Mock;

const makeRequest = (url: string, method: string = "POST"): Request => {
  return {
    url,
    method,
  } as Request;
};

const readJson = async (res: any) => {
  return {
    status: res.status,
    body: await res.json(),
  };
};

describe("Duplicate routes", () => {
  beforeEach(() => {
    mockSql.mockReset();

    mockSession = {
      user: {
        id: 10,
        role: "Worker",
      },
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("/api/duplicate/[id]/confirm", () => {
    it("returns 400 when duplicate review id is invalid", async () => {
      const req = makeRequest("http://localhost/api/duplicate/abc/confirm");

      const res = await ConfirmDuplicatePOST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Invalid duplicate review id",
      });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("confirms duplicate successfully", async () => {
      const confirmedDuplicate = {
        duplicate_review_id: 5,
        original_complaint_id: 1,
        duplicate_complaint_id: 2,
        review_status: "Confirmed",
        verified_by: 10,
        verified_at: new Date("2026-05-17T10:00:00.000Z"),
        duplicate_status: "Duplicate",
        linked_complaint_id: 1,
        original_priority: 2,
      };

      mockSql.mockResolvedValueOnce([confirmedDuplicate]);

      const req = makeRequest("http://localhost/api/duplicate/5/confirm");

      const res = await ConfirmDuplicatePOST(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Duplicate confirmed successfully",
        duplicate: confirmedDuplicate,
      });
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns 404 when duplicate review is not found or already reviewed", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/duplicate/5/confirm");

      const res = await ConfirmDuplicatePOST(req);
      const data = await readJson(res);

      expect(data.status).toBe(404);
      expect(data.body).toEqual({
        message: "Duplicate review not found, or it has already been reviewed",
      });
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns 500 when confirming duplicate fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/duplicate/5/confirm");

      const res = await ConfirmDuplicatePOST(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to confirm duplicate",
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("/api/duplicate/[id]/reject", () => {
    it("returns 400 when duplicate review id is invalid", async () => {
      const req = makeRequest("http://localhost/api/duplicate/abc/reject");

      const context = {
        params: Promise.resolve({
          id: "abc",
        }),
      };

      const res = await RejectDuplicatePOST(req, context);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Invalid duplicate review id",
      });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("rejects duplicate successfully", async () => {
      const rejectedDuplicate = {
        id: 5,
        original_complaint_id: 1,
        duplicate_complaint_id: 2,
        distance_meters: 40,
        review_status: "Rejected",
        verified_by: 10,
        verified_at: new Date("2026-05-17T10:00:00.000Z"),
      };

      mockSql.mockResolvedValueOnce([rejectedDuplicate]);

      const req = makeRequest("http://localhost/api/duplicate/5/reject");

      const context = {
        params: Promise.resolve({
          id: "5",
        }),
      };

      const res = await RejectDuplicatePOST(req, context);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Duplicate rejected successfully",
        duplicate: rejectedDuplicate,
      });
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns 404 when duplicate review is not found or already reviewed", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/duplicate/5/reject");

      const context = {
        params: Promise.resolve({
          id: "5",
        }),
      };

      const res = await RejectDuplicatePOST(req, context);
      const data = await readJson(res);

      expect(data.status).toBe(404);
      expect(data.body).toEqual({
        message: "Duplicate review not found, or it has already been reviewed",
      });
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns 500 when rejecting duplicate fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/duplicate/5/reject");

      const context = {
        params: Promise.resolve({
          id: "5",
        }),
      };

      const res = await RejectDuplicatePOST(req, context);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to reject duplicate",
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("/api/duplicate/pending", () => {
    it("fetches pending duplicates successfully", async () => {
      const row = {
        id: 5,
        original_complaint_id: 1,
        duplicate_complaint_id: 2,
        distance_meters: "42.5",
        review_status: "Pending",

        original_id: 1,
        original_userid: "resident-1",
        original_ward_id: "ward-1",
        original_municipality: "Emfuleni",
        original_status: "Pending",
        original_image: "original.jpg",
        original_issuetype: "Potholes",
        original_details: "Large pothole near the school",
        original_creationtime: "2026-05-17T10:00:00.000Z",
        original_latitude: -26.2,
        original_longitude: 28.0,
        original_address: "123 Main St",
        original_coords: "-26.2,28.0",
        original_priority: 1,
        original_linked_complaint_id: null,

        duplicate_id: 2,
        duplicate_userid: "resident-2",
        duplicate_ward_id: "ward-1",
        duplicate_municipality: "Emfuleni",
        duplicate_status: "Pending",
        duplicate_image: "duplicate.jpg",
        duplicate_issuetype: "Potholes",
        duplicate_details: "Another pothole report near the school",
        duplicate_creationtime: "2026-05-17T10:05:00.000Z",
        duplicate_latitude: -26.2001,
        duplicate_longitude: 28.0001,
        duplicate_address: "125 Main St",
        duplicate_coords: "-26.2001,28.0001",
        duplicate_priority: 0,
        duplicate_linked_complaint_id: null,
      };

      mockSql.mockResolvedValueOnce([row]);

      const res = await PendingDuplicatesGET();
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body.message).toBe("Pending duplicates fetched successfully");
      expect(data.body.data).toHaveLength(1);

      expect(data.body.data[0]).toMatchObject({
        id: 5,
        original_complaint_id: 1,
        duplicate_complaint_id: 2,
        distance_meters: 42.5,
        review_status: "Pending",
        original_report: {
          complaintid: 1,
          userid: "resident-1",
          ward_id: "ward-1",
          municipality: "Emfuleni",
          status: "Pending",
          image: "original.jpg",
          issuetype: "Potholes",
          details: "Large pothole near the school",
          creationtime: "2026-05-17T10:00:00.000Z",
          latitude: -26.2,
          longitude: 28.0,
          address: "123 Main St",
          coords: "-26.2,28.0",
          priority: 1,
          linked_complaint_id: null,
        },
        duplicate_report: {
          complaintid: 2,
          userid: "resident-2",
          ward_id: "ward-1",
          municipality: "Emfuleni",
          status: "Pending",
          image: "duplicate.jpg",
          issuetype: "Potholes",
          details: "Another pothole report near the school",
          creationtime: "2026-05-17T10:05:00.000Z",
          latitude: -26.2001,
          longitude: 28.0001,
          address: "125 Main St",
          coords: "-26.2001,28.0001",
          priority: 0,
          linked_complaint_id: null,
        },
      });

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns empty data when there are no pending duplicates", async () => {
      mockSql.mockResolvedValueOnce([]);

      const res = await PendingDuplicatesGET();
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Pending duplicates fetched successfully",
        data: [],
      });
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("returns 500 when fetching pending duplicates fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const res = await PendingDuplicatesGET();
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to fetch pending duplicates",
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
});