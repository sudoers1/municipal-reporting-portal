import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskAllocationForm from "../components/Forms/TaskAllocationForm";

// ─── Shared Test Data ────────────────────────────────────────────────────────

const mockComplaint = {
  complaintid: "C-001",
  municipality: "Test Municipality",
  issuetype: "Water Leak",
  status: "Open",
  details: "Pipe burst on main road.",
};

const mockEmployees = [
  { id: "E-1", name: "Alice Dlamini" },
  { id: "E-2", name: "Bob Nkosi" },
];

const mockOnClose = jest.fn();

// Helper: renders the component with default props
function renderForm(props?: Partial<{ complaint: any; onClose: () => void }>) {
  return render(
    React.createElement(TaskAllocationForm, {
      complaint: mockComplaint,
      onClose: mockOnClose,
      ...props,
    })
  );
}

// Helper: gets the employee select by its name attribute (label has no htmlFor)
function getEmployeeSelect(container: HTMLElement) {
  return container.querySelector('select[name="Employee"]') as HTMLSelectElement;
}

// ─── Setup / Teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

// ─── useEffect — fetchEmployees ───────────────────────────────────────────────

describe("useEffect — fetchEmployees", () => {
  it("calls fetch with the correct employees endpoint on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    renderForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/workers");
    });
  });

  it("calls fetch exactly once on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    renderForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("populates the employee select with fetched employees", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    renderForm();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Alice Dlamini" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Bob Nkosi" })).toBeInTheDocument();
    });
  });

  it("renders the default placeholder option before and after fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    renderForm();

    expect(screen.getByRole("option", { name: /select employee/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /select employee/i })).toBeInTheDocument();
    });
  });

  it("does not crash when the API returns an empty employee list", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/workers");
    });

    expect(screen.getAllByRole("option", { name: /select employee/i })).toHaveLength(1);
  });

  it("handles a network error without crashing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network failure"));

    renderForm();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch employees:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles a fetch rejection with the correct error message", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const networkError = new Error("Network failure");
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    renderForm();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch employees:", networkError);
    });

    consoleSpy.mockRestore();
  });
});

// ─── handleAllocate ───────────────────────────────────────────────────────────

describe("handleAllocate", () => {
  // Renders, waits for employees to load, then selects Alice (E-1).
  // All handleAllocate tests call this first since a selection is required
  // before the Allocate button is enabled and the POST can fire.
  async function renderAndSelectEmployee() {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    const { container } = renderForm();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Alice Dlamini" })).toBeInTheDocument();
    });

    // The employee <label> has htmlFor="" so the select has no accessible name.
    // Query it directly by the name attribute instead.
    const employeeSelect = getEmployeeSelect(container);
    fireEvent.change(employeeSelect, { target: { value: "E-1" } });

    return { container };
  }

  it("sends a POST to /api/assignments on form submit", async () => {
    await renderAndSelectEmployee();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/assignments",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("sends the correct complaintid and workerid in the request body", async () => {
    await renderAndSelectEmployee();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/assignments",
        expect.objectContaining({
          body: JSON.stringify({ complaintid: "C-001", workerid: "E-1" }),
        })
      );
    });
  });

  it("sends Content-Type: application/json in the request headers", async () => {
    await renderAndSelectEmployee();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/assignments",
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("calls onClose after a successful allocation", async () => {
    await renderAndSelectEmployee();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("does not call onClose when the API returns a non-ok response", async () => {
    await renderAndSelectEmployee();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Assignment failed" }),
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Assignment failed");
    });

    expect(mockOnClose).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("logs the error and does not call onClose on a network failure", async () => {
    await renderAndSelectEmployee();

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network down"));

    fireEvent.submit(screen.getByRole("button", { name: /allocate/i }).closest("form")!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Allocation failed:",
        expect.any(Error)
      );
    });

    expect(mockOnClose).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("Allocate button is disabled before an employee is selected", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    renderForm();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Alice Dlamini" })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /allocate/i })).toBeDisabled();
  });

  it("enables the Allocate button once an employee is selected", async () => {
    await renderAndSelectEmployee();

    expect(screen.getByRole("button", { name: /allocate/i })).not.toBeDisabled();
  });
});