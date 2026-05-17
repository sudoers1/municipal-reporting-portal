let mockSession = {
  user: {
    id: 10,
    role: "Worker",
  },
};


const mockSql = jest.fn();

jest.mock("@/lib/db/neon", () => ({
  sql: (...args: any[]) => mockSql(...args),
}));

jest.mock("@/lib/auth/server", () => ({
  withAuth: jest.fn((_roles: string[], handler: Function) => {
    return (req: Request) => handler(req, mockSession);
  }),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => {
      return {
        status: init?.status ?? 200,
        headers: {
          "content-type": "application/json",
        },
        json: async () => body,
        text: async () => JSON.stringify(body),
      };
    },
  },
}));

const ReportsRoute = require("@/app/api/reports/route");
const ReportByIdRoute = require("@/app/api/reports/[id]/route");
const AssignedRoute = require("@/app/api/reports/assigned/route");
const ClaimRoute = require("@/app/api/reports/claim/route");
const CompletedRoute = require("@/app/api/reports/completed/route");
const MyReportsRoute = require("@/app/api/reports/my/route");
const UnassignedRoute = require("@/app/api/reports/unassigned/route");
const AnalyticsRoute = require("@/app/api/reports/analytics/route");

const makeRequest = (
  url: string,
  method: string = "GET",
  body?: unknown
): Request => {
  return {
    url,
    method,
    headers: body
      ? {
          "content-type": "application/json",
        }
      : {},
    json: jest.fn().mockResolvedValue(body ?? {}),
  } as unknown as Request;
};

const readJson = async (res: Response) => {
  return {
    status: res.status,
    body: await res.json(),
  };
};

beforeEach(() => {
  mockSql.mockReset();

  mockSession = {
    user: {
      id: 10,
      role: "Worker",
    },
  };

  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("/api/reports/[id]", () => {
  describe("GET", () => {
    it("returns 400 when complaintid is missing", async () => {
      const req = makeRequest("http://localhost/api/reports/1");

      const res = await ReportByIdRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({ message: "Missing complaintid" });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 404 when report is not found", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports/1?complaintid=1");

      const res = await ReportByIdRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(404);
      expect(data.body).toEqual({ message: "Report not found" });
    });

    it("returns report when found", async () => {
      const report = {
        complaintid: 1,
        issuetype: "Water",
        details: "Pipe leaking",
        workerid: 10,
        assignment_status: "Acknowledged",
      };

      mockSql.mockResolvedValueOnce([report]);

      const req = makeRequest("http://localhost/api/reports/1?complaintid=1");

      const res = await ReportByIdRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Report fetched",
        data: report,
      });
    });

    it("returns 500 when database query fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/1?complaintid=1");

      const res = await ReportByIdRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({ message: "Failed to fetch report" });
    });
  });

  describe("PATCH", () => {
    it("returns 400 when complaintid or status is missing", async () => {
      const req = makeRequest("http://localhost/api/reports/1", "PATCH", {
        complaintid: 1,
      });

      const res = await ReportByIdRoute.PATCH(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({ message: "Missing complaintid or status" });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid status", async () => {
      const req = makeRequest("http://localhost/api/reports/1", "PATCH", {
        complaintid: 1,
        status: "Random",
      });

      const res = await ReportByIdRoute.PATCH(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({ message: "Invalid status" });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 404 when assignment is not found", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports/1", "PATCH", {
        complaintid: 1,
        status: "Resolved",
      });

      const res = await ReportByIdRoute.PATCH(req);
      const data = await readJson(res);

      expect(data.status).toBe(404);
      expect(data.body).toEqual({
        message: "Assignment not found or not authorized",
      });
    });
// In tests/report_routes.test.ts, update the PATCH test:

it("updates report status successfully", async () => {
  const updatedAssignment = {
    id: 1,
    complaintid: 1,
    workerid: 10,
    status: "Resolved",
  };

  // Mock the SQL responses IN ORDER:
  // 1. SELECT existing assignment (from the 'existing' query)
  mockSql
    .mockResolvedValueOnce([{ 
      previous_status: "In progress", 
      resident_id: 1, 
      issuetype: "Water" 
    }])
    // 2. UPDATE assignments (RETURNING *)
    .mockResolvedValueOnce([updatedAssignment])
    // 3. UPDATE complaints
    .mockResolvedValueOnce([])
    // 4. INSERT notification (for Resolved status)
    .mockResolvedValueOnce([]);

  const req = makeRequest("http://localhost/api/reports/1", "PATCH", {
    complaintid: "1",  // Make sure it's a string to match the API
    status: "Resolved",
  });

  const res = await ReportByIdRoute.PATCH(req);
  const data = await readJson(res);

  expect(data.status).toBe(200);
  expect(data.body).toEqual({
    message: "Status updated successfully",
    data: updatedAssignment,
  });
});
    it("returns 500 when status update fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/1", "PATCH", {
        complaintid: 1,
        status: "Resolved",
      });

      const res = await ReportByIdRoute.PATCH(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({ message: "Failed to update status" });
    });
  });
});

describe("/api/reports/assigned", () => {
  describe("GET", () => {
    it("returns assigned reports for the logged-in worker", async () => {
      const assignedReports = [
        {
          assignment_id: 1,
          workerid: 10,
          assignment_status: "In progress",
          complaintid: 5,
        },
      ];

      mockSql.mockResolvedValueOnce(assignedReports);

      const req = makeRequest("http://localhost/api/reports/assigned");

      const res = await AssignedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Assigned reports fetched",
        data: assignedReports,
      });
    });

    it("returns 500 when fetching assigned reports fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/assigned");

      const res = await AssignedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to fetch assigned reports",
      });
    });
  });

  describe("POST", () => {
    it("returns 400 when complaintid or workerid is missing", async () => {
      const req = makeRequest("http://localhost/api/reports/assigned", "POST", {
        complaintid: 1,
      });

      const res = await AssignedRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Missing complaintid or workerid",
      });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("assigns report successfully", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports/assigned", "POST", {
        complaintid: 1,
        workerid: 10,
      });

      const res = await AssignedRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(201);
      expect(data.body).toEqual({
        message: "Report assigned successfully",
      });
    });

    it("returns 409 when complaint is already assigned", async () => {
      mockSql.mockRejectedValueOnce({ code: "23505" });

      const req = makeRequest("http://localhost/api/reports/assigned", "POST", {
        complaintid: 1,
        workerid: 10,
      });

      const res = await AssignedRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(409);
      expect(data.body).toEqual({
        message: "Complaint already assigned",
      });
    });

    it("returns 400 for invalid complaintid or workerid", async () => {
      mockSql.mockRejectedValueOnce({ code: "23503" });

      const req = makeRequest("http://localhost/api/reports/assigned", "POST", {
        complaintid: 999,
        workerid: 999,
      });

      const res = await AssignedRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Invalid complaint or worker ID",
      });
    });

    it("returns 500 for general assignment errors", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/assigned", "POST", {
        complaintid: 1,
        workerid: 10,
      });

      const res = await AssignedRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to assign report",
      });
    });
  });
});

describe("/api/reports/claim", () => {
  describe("POST", () => {
    it("returns 400 when complaintid is missing", async () => {
      const req = makeRequest("http://localhost/api/reports/claim", "POST", {});

      const res = await ClaimRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({ message: "Missing complaintid" });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("claims report successfully", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports/claim", "POST", {
        complaintid: 1,
      });

      const res = await ClaimRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Report claimed successfully",
        complaintid: 1,
      });
    });

    it("returns 409 when complaint is already assigned", async () => {
      mockSql.mockRejectedValueOnce({ code: "23505" });

      const req = makeRequest("http://localhost/api/reports/claim", "POST", {
        complaintid: 1,
      });

      const res = await ClaimRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(409);
      expect(data.body).toEqual({
        message: "Complaint already assigned",
      });
    });

    it("returns 500 when claiming report fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/claim", "POST", {
        complaintid: 1,
      });

      const res = await ClaimRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to claim report",
      });
    });
  });
});

describe("/api/reports/completed", () => {
  describe("GET", () => {
    it("returns resolved complaints", async () => {
      const complaints = [
        {
          complaintid: 1,
          issuetype: "Roads",
          assignment_status: "Resolved",
        },
      ];

      mockSql.mockResolvedValueOnce(complaints);

      const req = makeRequest("http://localhost/api/reports/completed");

      const res = await CompletedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Resolved complaints fetched successfully",
        data: complaints,
      });
    });

    it("returns 500 when fetching resolved complaints fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/completed");

      const res = await CompletedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to fetch resolved complaints",
      });
    });
  });
});

describe("/api/reports/my", () => {
  describe("GET", () => {
    it("returns resident reports", async () => {
      const reports = [
        {
          complaintid: 1,
          issuetype: "Water",
          details: "Pipe burst",
          municipality: "Emfuleni",
        },
      ];

      mockSql.mockResolvedValueOnce(reports);

      const req = makeRequest("http://localhost/api/reports/my");

      const res = await MyReportsRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Resident reports fetched",
        reports,
      });
    });

    it("throws when resident report query fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/my");

      await expect(MyReportsRoute.GET(req)).rejects.toThrow("DB error");
    });
  });

  describe("POST", () => {
    it("returns 400 when required fields are missing", async () => {
      const req = makeRequest("http://localhost/api/reports/my", "POST", {
        issuetype: "Water",
        details: "Pipe burst",
      });

      const res = await MyReportsRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Missing required fields",
      });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid issue type", async () => {
      const req = makeRequest("http://localhost/api/reports/my", "POST", {
        issuetype: "Noise",
        details: "Too loud",
        municipality: "Emfuleni",
      });

      const res = await MyReportsRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(400);
      expect(data.body).toEqual({
        message: "Invalid issue type",
      });
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("submits resident report successfully", async () => {
      const insertedReport = {
        complaintid: 1,
        userid: 10,
        issuetype: "Water",
        details: "Pipe burst",
        municipality: "Emfuleni",
      };

      mockSql.mockResolvedValueOnce([insertedReport]);

      const req = makeRequest("http://localhost/api/reports/my", "POST", {
        issuetype: "Water",
        details: "Pipe burst",
        municipality: "Emfuleni",
      });

      const res = await MyReportsRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Report submitted successfully",
        data: insertedReport,
      });
    });

    it("returns 500 when submitting resident report fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/my", "POST", {
        issuetype: "Water",
        details: "Pipe burst",
        municipality: "Emfuleni",
      });

      const res = await MyReportsRoute.POST(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to submit report",
      });
    });
  });
});
describe("/api/reports/unassigned", () => {
  describe("GET", () => {
    it("returns unassigned reports", async () => {
      const complaints = [
        {
          complaintid: 1,
          issuetype: "Sanitation",
          details: "Bins not collected",
          creationtime: "2026-05-11T10:00:00.000Z",
          userid: 10,
          municipality: "Emfuleni",
          status: "Pending",
          priority: 1,
          address: "123 Main St",
        },
      ];

      mockSql.mockResolvedValueOnce(complaints);

      const req = makeRequest("http://localhost/api/reports/unassigned");

      const res = await UnassignedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(200);
      // Updated to match the actual API response
      expect(data.body).toEqual({
        message: "Unassigned reports fetched successfully", // This matches your route
        data: complaints,
      });
    });

    it("returns 500 when fetching unassigned reports fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/unassigned");

      const res = await UnassignedRoute.GET(req);
      const data = await readJson(res);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to fetch unassigned reports", // This matches your route
      });
    });
  });
});

describe("/api/reports/analytics", () => {
  describe("GET", () => {
    it("returns public analytics data successfully", async () => {
      const analyticsData = [
        {
          issuetype: "Water",
          status: "Open",
          municipality: "Emfuleni",
          creationtime: "2026-05-11T10:00:00.000Z",
        },
        {
          issuetype: "Electricity",
          status: "Resolved",
          municipality: "Midvaal",
          creationtime: "2026-05-10T08:30:00.000Z",
        },
      ];

      mockSql.mockResolvedValueOnce(analyticsData);

      const req = makeRequest("http://localhost/api/reports/analytics");

      const res = await AnalyticsRoute.GET(req);
      const data = await readJson(res);

      expect(mockSql).toHaveBeenCalledTimes(1);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Public analytics data",
        data: analyticsData,
      });
    });

    it("returns empty analytics data when there are no complaints", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports/analytics");

      const res = await AnalyticsRoute.GET(req);
      const data = await readJson(res);

      expect(mockSql).toHaveBeenCalledTimes(1);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Public analytics data",
        data: [],
      });
    });

    it("throws when analytics query fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports/analytics");

      await expect(AnalyticsRoute.GET(req)).rejects.toThrow("DB error");

      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });
});

describe("/api/reports", () => {
  describe("GET", () => {
    it("returns all reports successfully", async () => {
      const complaints = [
        {
          complaintid: 1,
          issuetype: "Electricity",
          details: "Power outage in the area",
          creationtime: "2026-05-11T10:00:00.000Z",
          userid: 10,
          municipality: "Emfuleni",
        },
      ];

      mockSql.mockResolvedValueOnce(complaints);

      const req = makeRequest("http://localhost/api/reports");

      const res = await ReportsRoute.GET(req);
      const data = await readJson(res);

      expect(mockSql).toHaveBeenCalledTimes(1);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Reports fetched successfully",
        data: complaints,
      });
    });

    it("returns an empty array when there are no reports", async () => {
      mockSql.mockResolvedValueOnce([]);

      const req = makeRequest("http://localhost/api/reports");

      const res = await ReportsRoute.GET(req);
      const data = await readJson(res);

      expect(mockSql).toHaveBeenCalledTimes(1);

      expect(data.status).toBe(200);
      expect(data.body).toEqual({
        message: "Reports fetched successfully",
        data: [],
      });
    });

    it("returns 500 when fetching reports fails", async () => {
      mockSql.mockRejectedValueOnce(new Error("DB error"));

      const req = makeRequest("http://localhost/api/reports");

      const res = await ReportsRoute.GET(req);
      const data = await readJson(res);

      expect(mockSql).toHaveBeenCalledTimes(1);

      expect(data.status).toBe(500);
      expect(data.body).toEqual({
        message: "Failed to fetch reports",
      });
    });
  });
});