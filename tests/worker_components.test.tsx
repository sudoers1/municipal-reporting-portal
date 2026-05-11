import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import AssignedTasksCard from "@/components/Worker/assignedtask";
import UnassignedTasksCard from "@/components/Worker/unassignedtask";
import CompletedTasksCard from "@/components/Worker/completedtask";
import ReportDetailsCard from "@/components/Worker/reportdetails";
import UpdateStatusCard from "@/components/Worker/updatestatus";
import WorkerInfoCard from "@/components/Worker/workerinfo";

describe("Worker components", () => {
  const mockTask = {
    complaintid: 1,
    issuetype: "Water",
    details: "There is a leaking pipe near the main road.",
    creationtime: "2026-05-11T10:00:00.000Z",
    municipality: "Emfuleni",
    assignment_status: "Acknowledged",
  };

  describe("AssignedTasksCard", () => {
    test("shows empty message when there are no assigned reports", () => {
      render(<AssignedTasksCard tasks={[]} onSelect={jest.fn()} />);

      expect(screen.getByText("No assigned reports.")).toBeInTheDocument();
    });

    test("renders assigned tasks and calls onSelect when clicked", () => {
      const onSelect = jest.fn();

      render(<AssignedTasksCard tasks={[mockTask]} onSelect={onSelect} />);

      expect(screen.getByText("Water")).toBeInTheDocument();
      expect(screen.getByText("Acknowledged")).toBeInTheDocument();
      expect(
        screen.getByText("There is a leaking pipe near the main road.")
      ).toBeInTheDocument();
      expect(screen.getByText("#1")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button"));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(mockTask);
    });
  });

  describe("UnassignedTasksCard", () => {
    test("shows empty message when there are no unassigned reports", () => {
      render(<UnassignedTasksCard tasks={[]} onClaim={jest.fn()} />);

      expect(screen.getByText("No unassigned reports.")).toBeInTheDocument();
    });

    test("renders unassigned tasks and calls onClaim when claim button is clicked", () => {
      const onClaim = jest.fn();

      render(<UnassignedTasksCard tasks={[mockTask]} onClaim={onClaim} />);

      expect(screen.getByText("Water")).toBeInTheDocument();
      expect(screen.getByText("Complaint #1")).toBeInTheDocument();
      expect(
        screen.getByText("There is a leaking pipe near the main road.")
      ).toBeInTheDocument();

      const expectedDate = new Date(mockTask.creationtime).toLocaleDateString();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /claim/i }));

      expect(onClaim).toHaveBeenCalledTimes(1);
      expect(onClaim).toHaveBeenCalledWith(1);
    });
  });

  describe("CompletedTasksCard", () => {
    test("shows empty message when there are no completed reports", () => {
      render(<CompletedTasksCard tasks={[]} />);

      expect(screen.getByText("No completed reports.")).toBeInTheDocument();
    });

    test("renders completed tasks", () => {
      render(<CompletedTasksCard tasks={[mockTask]} />);

      expect(screen.getByText("Water")).toBeInTheDocument();
      expect(screen.getByText("Resolved")).toBeInTheDocument();
      expect(
        screen.getByText("There is a leaking pipe near the main road.")
      ).toBeInTheDocument();
      expect(screen.getByText("#1")).toBeInTheDocument();
    });
  });

  describe("ReportDetailsCard", () => {
    test("renders nothing when report is null", () => {
      const { container } = render(
        <ReportDetailsCard report={null} onClose={jest.fn()} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    test("renders report details", () => {
      render(<ReportDetailsCard report={mockTask} onClose={jest.fn()} />);

      expect(screen.getByText("Complaint ID")).toBeInTheDocument();
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("Issue Type")).toBeInTheDocument();
      expect(screen.getByText("Water")).toBeInTheDocument();
      expect(screen.getByText("Municipality")).toBeInTheDocument();
      expect(screen.getByText("Emfuleni")).toBeInTheDocument();
      expect(screen.getByText("Assignment Status")).toBeInTheDocument();
      expect(screen.getByText("Acknowledged")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();

      const expectedDate = new Date(mockTask.creationtime).toLocaleString();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    test("calls onClose when back button is clicked", () => {
      const onClose = jest.fn();

      render(<ReportDetailsCard report={mockTask} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", { name: /back to dashboard/i })
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("UpdateStatusCard", () => {
    test("renders nothing when report is null", () => {
      const { container } = render(
        <UpdateStatusCard report={null} onUpdate={jest.fn()} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    test("renders selected report and initial status", () => {
      render(<UpdateStatusCard report={mockTask} onUpdate={jest.fn()} />);

      expect(screen.getByText("Selected Report")).toBeInTheDocument();
      expect(screen.getByText("Water")).toBeInTheDocument();

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("Acknowledged");
    });

    test("calls onUpdate with complaintid and selected status on submit", () => {
      const onUpdate = jest.fn();

      render(<UpdateStatusCard report={mockTask} onUpdate={onUpdate} />);

      const select = screen.getByRole("combobox");

      fireEvent.change(select, {
        target: {
          value: "Resolved",
        },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /update status/i })
      );

      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith(1, "Resolved");
    });
  });

  describe("WorkerInfoCard", () => {
    test("renders nothing when worker is null", () => {
      const { container } = render(<WorkerInfoCard worker={null} />);

      expect(container).toBeEmptyDOMElement();
    });

    test("renders worker name and email", () => {
      const worker = {
        name: "John Worker",
        email: "john@example.com",
      };

      render(<WorkerInfoCard worker={worker} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("John Worker")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("shows Unknown when worker name is missing", () => {
      const worker = {
        email: "unknown@example.com",
      };

      render(<WorkerInfoCard worker={worker} />);

      expect(screen.getByText("Unknown")).toBeInTheDocument();
      expect(screen.getByText("unknown@example.com")).toBeInTheDocument();
    });
  });
});