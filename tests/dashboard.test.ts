
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

// Mock auth client
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn(),
  },
}));

// Mock next/dynamic (WardMap)
jest.mock("next/dynamic", () => () => {
  const MockWardMap = () => <div data-testid="ward-map" />;
  return MockWardMap;
});

// Mock Swiper
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

jest.mock("swiper/modules", () => ({
  Keyboard: {},
  Navigation: {},
}));

jest.mock("swiper/css", () => {});
jest.mock("swiper/css/keyboard", () => {});
jest.mock("swiper/css/navigation", () => {});

// Mock child components
jest.mock("@/components/dashboarditems", () => () => (
  <div data-testid="dashboard-items" />
));

jest.mock("@/components/complaintform", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="complaints-form">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock("@/components/complaintbutton", () => ({
  __esModule: true,
  default: ({
    onClick,
    showComplaints,
  }: {
    onClick: () => void;
    showComplaints: boolean;
  }) => (
    <button data-testid="complaint-button" onClick={onClick}>
      {showComplaints ? "Hide" : "Show"} Complaints
    </button>
  ),
}));

import { authClient } from "@/lib/auth-client";
const mockUseSession = authClient.useSession as jest.Mock;

describe("DashboardPage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("loading state", () => {
    test("shows loading spinner when isPending is true", () => {
      mockUseSession.mockReturnValue({ data: null, isPending: true });

      render(<DashboardPage />);

      expect(
        screen.getByText("Loading your dashboard...")
      ).toBeInTheDocument();
    });

    test("does not show dashboard content while loading", () => {
      mockUseSession.mockReturnValue({ data: null, isPending: true });

      render(<DashboardPage />);

      expect(screen.queryByText(/Hello/)).not.toBeInTheDocument();
      expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
    });
  });

  describe("authenticated state", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: { user: { name: "John" } },
        isPending: false,
      });
    });

    test("shows user name in heading", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Hello, John!")).toBeInTheDocument();
    });

    test("renders dashboard heading", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    test("renders swiper with slides", () => {
      render(<DashboardPage />);
      expect(screen.getByTestId("swiper")).toBeInTheDocument();
      expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2);
    });

    test("renders dashboard items in first slide", () => {
      render(<DashboardPage />);
      expect(screen.getByTestId("dashboard-items")).toBeInTheDocument();
    });

    test("renders ward map in second slide", () => {
      render(<DashboardPage />);
      expect(screen.getByTestId("ward-map")).toBeInTheDocument();
    });

    test("renders complaint button", () => {
      render(<DashboardPage />);
      expect(screen.getByTestId("complaint-button")).toBeInTheDocument();
    });

    test("complaint form is hidden by default", () => {
      render(<DashboardPage />);
      expect(screen.queryByTestId("complaints-form")).not.toBeInTheDocument();
    });

    test("shows complaint form when button is clicked", () => {
      render(<DashboardPage />);
      fireEvent.click(screen.getByTestId("complaint-button"));
      expect(screen.getByTestId("complaints-form")).toBeInTheDocument();
    });

    test("hides complaint form when button is clicked again", () => {
      render(<DashboardPage />);
      fireEvent.click(screen.getByTestId("complaint-button"));
      fireEvent.click(screen.getByTestId("complaint-button"));
      expect(screen.queryByTestId("complaints-form")).not.toBeInTheDocument();
    });

    test("hides complaint form when onClose is called", () => {
      render(<DashboardPage />);
      fireEvent.click(screen.getByTestId("complaint-button"));
      expect(screen.getByTestId("complaints-form")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Close"));
      expect(screen.queryByTestId("complaints-form")).not.toBeInTheDocument();
    });
  });

  describe("session with no name", () => {
    test("renders Hello with undefined when name is missing", () => {
      mockUseSession.mockReturnValue({
        data: { user: {} },
        isPending: false,
      });

      render(<DashboardPage />);
      expect(screen.getByText("Hello, !")).toBeInTheDocument();
    });
  });
});