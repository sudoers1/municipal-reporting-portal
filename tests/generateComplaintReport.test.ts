// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSave            = jest.fn();
const mockAddImage        = jest.fn();
const mockText            = jest.fn();
const mockRect            = jest.fn();
const mockRoundedRect     = jest.fn();
const mockSetFont         = jest.fn();
const mockSetFontSize     = jest.fn();
const mockSetFillColor    = jest.fn();
const mockSetTextColor    = jest.fn();
const mockSetDrawColor    = jest.fn();
const mockSetLineWidth    = jest.fn();
const mockLine            = jest.fn();
const mockGetTextWidth    = jest.fn(() => 20);
const mockSplitTextToSize = jest.fn((text: string) => [text]);

jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save:             mockSave,
    addImage:         mockAddImage,
    text:             mockText,
    rect:             mockRect,
    roundedRect:      mockRoundedRect,
    setFont:          mockSetFont,
    setFontSize:      mockSetFontSize,
    setFillColor:     mockSetFillColor,
    setTextColor:     mockSetTextColor,
    setDrawColor:     mockSetDrawColor,
    setLineWidth:     mockSetLineWidth,
    line:             mockLine,
    getTextWidth:     mockGetTextWidth,
    splitTextToSize:  mockSplitTextToSize,
  })),
}));

// ── fetch mock ────────────────────────────────────────────────────────────────

const mockFetch = jest.fn().mockResolvedValue({
  blob: jest.fn().mockResolvedValue(new Blob(["mockimage"], { type: "image/png" })),
});
global.fetch = mockFetch;

// ── Browser API polyfills ─────────────────────────────────────────────────────

global.FileReader = class {
  onload:  ((e: any) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  readAsDataURL(_blob: Blob) {
    setTimeout(() => this.onload?.({ target: { result: "data:image/png;base64,mockimage" } }), 0);
  }
} as any;

const makeLandscapeImage = () => {
  global.Image = class {
    naturalWidth  = 800;
    naturalHeight = 600;
    onload:  (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_: string) {
      setTimeout(() => this.onload?.(), 0);
    }
  } as any;
};

const makePortraitImage = () => {
  global.Image = class {
    naturalWidth  = 300;
    naturalHeight = 800;
    onload:  (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_: string) {
      setTimeout(() => this.onload?.(), 0);
    }
  } as any;
};

makeLandscapeImage(); // default

import { generateComplaintReport, ComplaintReportData } from "@/lib/generateComplaintReport";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseComplaint: ComplaintReportData = {
  complaintid:  42,
  municipality: "City of Johannesburg",
  status:       "Resolved",
  issuetype:    "Pothole",
  details:      "Large pothole on Main Street causing damage to vehicles.",
  creationtime: "2024-01-10T08:30:00Z",
  address:      "123 Main Street, Johannesburg",
};

const complaintWithImage: ComplaintReportData = {
  ...baseComplaint,
  image: "https://example.com/complaint-image.jpg",
};

const complaintNoAddress: ComplaintReportData = {
  ...baseComplaint,
  address: undefined,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("generateComplaintReport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    makeLandscapeImage();
    mockFetch.mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["mockimage"], { type: "image/png" })),
    });
    mockSplitTextToSize.mockImplementation((text: string) => [text]);
  });

  it("saves PDF with correct filename containing complaint id and date", async () => {
    await generateComplaintReport(baseComplaint);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith(
      expect.stringMatching(/^complaint-42-\d{4}-\d{2}-\d{2}\.pdf$/)
    );
  });

  it("renders Complaint Report title in header", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("Complaint Report");
  });

  it("renders status badge with correct uppercase text", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("RESOLVED");
  });

  it("renders status badge with fallback color for unknown status", async () => {
    await generateComplaintReport({ ...baseComplaint, status: "Unknown" });
    expect(mockSetFillColor).toHaveBeenCalledWith(156, 163, 175);
  });

  it("renders all known status colors correctly", async () => {
    const statuses: [string, [number, number, number]][] = [
      ["Acknowledged", [96,  165, 250]],
      ["In Progress",  [251, 191,  36]],
      ["Resolved",     [74,  222, 128]],
      ["Rejected",     [248, 113, 113]],
      ["Pending",      [167, 139, 250]],
      ["Duplicate",    [203, 213, 225]],
    ];

    for (const [status, [r, g, b]] of statuses) {
      jest.clearAllMocks();
      await generateComplaintReport({ ...baseComplaint, status });
      expect(mockSetFillColor).toHaveBeenCalledWith(r, g, b);
    }
  });

  it("renders municipality and issue type labels and values", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("MUNICIPALITY");
    expect(allText).toContain("ISSUE TYPE");
    expect(allText).toContain("City of Johannesburg");
    expect(allText).toContain("Pothole");
  });

  it("renders address in info card", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("ADDRESS");
    expect(allText).toContain("123 Main Street, Johannesburg");
  });

  it("renders — when address is missing", async () => {
    await generateComplaintReport(complaintNoAddress);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("—");
  });

  it("renders complaint id in info card", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("#42");
  });

  it("renders DETAILS section heading", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("DETAILS");
  });

  it("renders fallback text when details is empty", async () => {
    mockSplitTextToSize.mockImplementationOnce(() => ["No details provided."]);
    await generateComplaintReport({ ...baseComplaint, details: "" });
    expect(mockSplitTextToSize).toHaveBeenCalledWith(
      "No details provided.",
      expect.any(Number),
    );
  });

  it("renders footer page label", async () => {
    await generateComplaintReport(baseComplaint);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("Page 1 of 1");
  });

  it("does not add JPEG image when no complaint image", async () => {
    await generateComplaintReport(baseComplaint);
    const jpegCalls = mockAddImage.mock.calls.filter((c) => c[1] === "JPEG");
    expect(jpegCalls).toHaveLength(0);
  });

  it("adds JPEG image when complaint has image", async () => {
    await generateComplaintReport(complaintWithImage);
    const jpegCalls = mockAddImage.mock.calls.filter((c) => c[1] === "JPEG");
    expect(jpegCalls).toHaveLength(1);
  });

  it("renders IMAGE section heading when image is present", async () => {
    await generateComplaintReport(complaintWithImage);
    const allText = mockText.mock.calls.map((c) => String(c[0]));
    expect(allText).toContain("IMAGE");
  });

  it("skips image section gracefully when image fetch fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        blob: jest.fn().mockResolvedValue(new Blob(["logo"])),
      })
      .mockRejectedValueOnce(new Error("Failed to load image"));

    await generateComplaintReport(complaintWithImage);
    expect(mockSave).toHaveBeenCalledTimes(1);
    const jpegCalls = mockAddImage.mock.calls.filter((c) => c[1] === "JPEG");
    expect(jpegCalls).toHaveLength(0);
  });

  it("skips logo gracefully when favicon fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("404"));
    await generateComplaintReport(baseComplaint);
    expect(mockSave).toHaveBeenCalledTimes(1);
    const pngCalls = mockAddImage.mock.calls.filter((c) => c[1] === "PNG");
    expect(pngCalls).toHaveLength(0);
  });

  it("constrains landscape image drawH to max 120", async () => {
    makeLandscapeImage();
    await generateComplaintReport(complaintWithImage);
    const jpegCall = mockAddImage.mock.calls.find((c) => c[1] === "JPEG");
    expect(jpegCall).toBeDefined();
    const drawH = jpegCall[5];
    expect(drawH).toBeLessThanOrEqual(120);
  });

  it("constrains portrait image drawH to max 120", async () => {
    makePortraitImage();
    await generateComplaintReport(complaintWithImage);
    const jpegCall = mockAddImage.mock.calls.find((c) => c[1] === "JPEG");
    expect(jpegCall).toBeDefined();
    const drawH = jpegCall[5];
    expect(drawH).toBeLessThanOrEqual(120);
  });
});