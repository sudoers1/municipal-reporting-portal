// tests/generateAnalyticsReport.test.ts

global.fetch = jest.fn().mockResolvedValue({
    blob: jest.fn().mockResolvedValue(new Blob(["mockimage"], { type: "image/png" })),
});

global.FileReader = class {
    onload: ((e: any) => void) | null = null;
    onerror: ((e: any) => void) | null = null;
    readAsDataURL(_blob: Blob) {
        setTimeout(() => this.onload?.({ target: { result: "data:image/png;base64,mockimage" } }), 0);
    }
} as any;
// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSave = jest.fn();
const mockAddImage = jest.fn();
const mockText = jest.fn();
const mockRect = jest.fn();
const mockSetFont = jest.fn();
const mockSetFontSize = jest.fn();
const mockSetFillColor = jest.fn();
const mockSetTextColor = jest.fn();
const mockSetDrawColor = jest.fn();
const mockSetLineWidth = jest.fn();
const mockLine = jest.fn();
const mockRoundedRect = jest.fn();
const mockCircle = jest.fn();
const mockAddPage = jest.fn();
const mockSetPage = jest.fn();
const mockGetTextWidth = jest.fn(() => 20);
const mockGetNumberOfPages = jest.fn(() => 1);

jest.mock("jspdf", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        save: mockSave,
        addImage: mockAddImage,
        text: mockText,
        rect: mockRect,
        setFont: mockSetFont,
        setFontSize: mockSetFontSize,
        setFillColor: mockSetFillColor,
        setTextColor: mockSetTextColor,
        setDrawColor: mockSetDrawColor,
        setLineWidth: mockSetLineWidth,
        line: mockLine,
        roundedRect: mockRoundedRect,
        circle: mockCircle,
        addPage: mockAddPage,
        setPage: mockSetPage,
        getTextWidth: mockGetTextWidth,
        internal: {
            getNumberOfPages: mockGetNumberOfPages,
        },
    })),
}));

jest.mock("html2canvas", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        toDataURL: jest.fn(() => "data:image/png;base64,mockimage"),
        width: 200,
        height: 100,
    }),
}));

import { generateAnalyticsReport, ReportData } from "@/lib/generateAnalyticsReport";
import html2canvas from "html2canvas";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockData: ReportData = {
    worker: {
        name: "John Doe",
        email: "john@municipality.gov.za",
        municipality: "City of Johannesburg",
    },
    statusData: [
        { status: "Resolved", count: 10 },
        { status: "In Progress", count: 3 },
        { status: "Acknowledged", count: 2 },
    ],
    resolvedData: [
        { week: "1 Jan", resolved: 4, avg_hours: 3.5 },
        { week: "8 Jan", resolved: 6, avg_hours: 2.1 },
    ],
    generatedAt: new Date("2024-01-15T10:00:00Z"),
};

const mockEl = document.createElement("div");

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("generateAnalyticsReport", () => {
    beforeEach(() => jest.clearAllMocks());

    it("calls doc.save with a filename containing the worker name and date", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith(
            expect.stringMatching(/analytics-report-john-doe-\d{4}-\d{2}-\d{2}\.pdf/)
        );
    });

    it("calls html2canvas for both chart elements", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        expect(html2canvas).toHaveBeenCalledTimes(2);
        expect(html2canvas).toHaveBeenCalledWith(mockEl, expect.any(Object));
    });

    it("adds both chart images to the PDF", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        // 3 calls: logo + status chart + resolved chart
        expect(mockAddImage).toHaveBeenCalledTimes(3);
        expect(mockAddImage).toHaveBeenCalledWith(
            "data:image/png;base64,mockimage",
            "PNG",
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
    });

    it("renders worker name and municipality in the PDF", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        const allTextCalls = mockText.mock.calls.map((c) => c[0]);
        expect(allTextCalls).toContain("John Doe");
        expect(allTextCalls).toContain("City of Johannesburg");
    });

    it("renders all status rows in the table", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        const allTextCalls = mockText.mock.calls.map((c) => c[0]);
        expect(allTextCalls).toContain("Resolved");
        expect(allTextCalls).toContain("In Progress");
        expect(allTextCalls).toContain("Acknowledged");
    });


    it("skips addImage when chart elements are null", async () => {
        await generateAnalyticsReport(mockData, null, null);
        // 1 call for the logo only, no chart images
        expect(mockAddImage).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
    it("handles html2canvas failure gracefully and still saves PDF", async () => {
        (html2canvas as jest.Mock).mockRejectedValueOnce(new Error("Canvas failed"));
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("renders correct total count in metric cards", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        const allTextCalls = mockText.mock.calls.map((c) => String(c[0]));
        const total = mockData.statusData.reduce((s, r) => s + r.count, 0);
        expect(allTextCalls).toContain(String(total));
    });

    it("renders resolved week labels in the table", async () => {
        await generateAnalyticsReport(mockData, mockEl, mockEl);
        const allTextCalls = mockText.mock.calls.map((c) => c[0]);
        expect(allTextCalls).toContain("1 Jan");
        expect(allTextCalls).toContain("8 Jan");
    });
    it("handles status chart html2canvas failure gracefully", async () => {
        (html2canvas as jest.Mock)
            .mockRejectedValueOnce(new Error("Canvas failed")) // status chart fails
            .mockResolvedValueOnce({                            // resolved chart succeeds
                toDataURL: jest.fn(() => "data:image/png;base64,mockimage"),
                width: 200,
                height: 100,
            });

        await generateAnalyticsReport(mockData, mockEl, mockEl);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});