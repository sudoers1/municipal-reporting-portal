import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import WardMap from "../components/wardmap";

// 🔹 Mock turf functions directly to avoid ESM parsing issues
jest.mock("@turf/turf", () => ({
  booleanPointInPolygon: jest.fn(() => true),
  point: jest.fn(() => ({})),
  bbox: jest.fn(() => [0, 0, 1, 1]),
}));

// 🔹 Mock fetch globally
global.fetch = jest.fn();

beforeAll(() => {
  // 🔹 Mock geolocation
  Object.defineProperty(global.navigator, "geolocation", {
    value: {
      getCurrentPosition: jest.fn((success) =>
        success({ coords: { latitude: -26.0, longitude: 28.0 } })
      ),
    },
    configurable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("WardMap component", () => {
  const mockGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          WardLabel: "JHB_1",
          WardNo: 1,
          Province: "Gauteng",
          WardID: "79800001",
          District: "City of Johannesburg",
          DistrictCo: "JHB",
          CAT_B: "JHB",
          Municipali: "City of Johannesburg Metropolitan Municipality",
        },
        geometry: { type: "Polygon", coordinates: [[[0, 0]]] },
      },
    ],
  };

  it("renders province dropdown", () => {
    render(<WardMap />);
    expect(screen.getByText("Select Province")).toBeInTheDocument();
  });

  it("shows ward dropdown after province selection", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeoJSON,
    });

    render(<WardMap />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Gauteng" },
    });

    await waitFor(() => {
      expect(screen.getByText("Select Ward")).toBeInTheDocument();
      expect(screen.getByText("JHB_1")).toBeInTheDocument();
    });
  });

  it("auto-detects province and ward via geolocation", async () => {
    // Fail first two provinces, succeed on Gauteng
    ["Eastern Cape", "Free State"].forEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeoJSON,
    });

    render(<WardMap />);

    await waitFor(() => {
      expect(screen.getByText("JHB_1")).toBeInTheDocument();
    });
  });

  it("clears wards when switching province", async () => {
    const mockGeoJSONA = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: { WardLabel: "Ward A" }, geometry: {} }],
    };
    const mockGeoJSONB = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: { WardLabel: "Ward B" }, geometry: {} }],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeoJSONA,
    });

    render(<WardMap />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Gauteng" },
    });

    await waitFor(() => {
      expect(screen.getByText("Ward A")).toBeInTheDocument();
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeoJSONB,
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Limpopo" },
    });

    await waitFor(() => {
      expect(screen.getByText("Ward B")).toBeInTheDocument();
      expect(screen.queryByText("Ward A")).not.toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<WardMap />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Northern Cape" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Select Ward")).not.toBeInTheDocument();
    });
  });
});
