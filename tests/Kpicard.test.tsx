import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import KPICards from "../components/Dashboard/KPIcard";

// ─── Mock lucide-react icons ──────────────────────────────────────────────────
// Prevents SVG rendering issues in jsdom without affecting logic under test.

jest.mock("lucide-react", () => ({
  AlertCircle: () => null,
  CheckCircle: () => null,
  Clock: () => null,
  Droplets: () => null,
  Hammer: () => null,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeComplaint(overrides: Record<string, any> = {}) {
  return {
    status: "Open",
    workerid: "W-1",
    ...overrides,
  };
}

function getValueForLabel(label: string): number {
  const labelEl = screen.getByText(new RegExp(label, "i"));

  let current: HTMLElement | null = labelEl.parentElement;

  while (current && current !== document.body) {
    const numbers = within(current).queryAllByText(/^\d+$/);

    if (numbers.length > 0) {
      return parseInt(numbers[0].textContent ?? "0", 10);
    }

    current = current.parentElement;
  }

  throw new Error(`Could not find numeric KPI value for label: ${label}`);
}

// Renders KPICards and returns the five stat values in label order:
// [total, resolved, pending, acknowledged, unassigned]
function getStatValues(data: any[]) {
  render(<KPICards data={data} />);

  return [
    getValueForLabel("Total Reports"),
    getValueForLabel("Resolved"),
    getValueForLabel("In Progress"),
    getValueForLabel("Acknowledged"),
    getValueForLabel("Unassigned"),
  ];
}

// ─── Default prop ─────────────────────────────────────────────────────────────

describe("default prop", () => {
  it("renders without crashing when data prop is empty", () => {
    expect(() => render(<KPICards data={[]} />)).not.toThrow();
  });

  it("shows 0 for all stats when data is empty", () => {
    const [total, resolved, pending, acknowledged, unassigned] = getStatValues([]);

    expect(total).toBe(0);
    expect(resolved).toBe(0);
    expect(pending).toBe(0);
    expect(acknowledged).toBe(0);
    expect(unassigned).toBe(0);
  });
});

// ─── total ────────────────────────────────────────────────────────────────────

describe("total", () => {
  it("equals the length of the data array", () => {
    const data = [makeComplaint(), makeComplaint(), makeComplaint()];

    const [total] = getStatValues(data);

    expect(total).toBe(3);
  });

  it("is 1 when data has a single complaint", () => {
    const [total] = getStatValues([makeComplaint()]);

    expect(total).toBe(1);
  });

  it("counts complaints regardless of their status", () => {
    const data = [
      makeComplaint({ status: "Resolved" }),
      makeComplaint({ status: "In progress" }),
      makeComplaint({ status: "Acknowledged" }),
      makeComplaint({ status: "false" }),
      makeComplaint({ status: "Open" }),
    ];

    const [total] = getStatValues(data);

    expect(total).toBe(5);
  });
});

// ─── resolved ─────────────────────────────────────────────────────────────────

describe("resolved", () => {
  it('counts only complaints with status "Resolved"', () => {
    const data = [
      makeComplaint({ status: "Resolved" }),
      makeComplaint({ status: "Resolved" }),
      makeComplaint({ status: "Open" }),
    ];

    const [, resolved] = getStatValues(data);

    expect(resolved).toBe(2);
  });

  it("is 0 when no complaints are resolved", () => {
    const data = [
      makeComplaint({ status: "Open" }),
      makeComplaint({ status: "In progress" }),
    ];

    const [, resolved] = getStatValues(data);

    expect(resolved).toBe(0);
  });

  it('is case-sensitive — "resolved" lowercase does not count', () => {
    const data = [makeComplaint({ status: "resolved" })];

    const [, resolved] = getStatValues(data);

    expect(resolved).toBe(0);
  });

  it("equals total when all complaints are resolved", () => {
    const data = [
      makeComplaint({ status: "Resolved" }),
      makeComplaint({ status: "Resolved" }),
    ];

    const [total, resolved] = getStatValues(data);

    expect(resolved).toBe(total);
  });
});

// ─── pending / in progress ────────────────────────────────────────────────────

describe("pending / in progress", () => {
  it('counts only complaints with status "In progress"', () => {
    const data = [
      makeComplaint({ status: "In progress" }),
      makeComplaint({ status: "In progress" }),
      makeComplaint({ status: "Resolved" }),
    ];

    const [, , pending] = getStatValues(data);

    expect(pending).toBe(2);
  });

  it("is 0 when no complaints are in progress", () => {
    const data = [makeComplaint({ status: "Resolved" })];

    const [, , pending] = getStatValues(data);

    expect(pending).toBe(0);
  });

  it('"In Progress" capital P does not count if component filters by "In progress"', () => {
    const data = [makeComplaint({ status: "In Progress" })];

    const [, , pending] = getStatValues(data);

    expect(pending).toBe(0);
  });
});

// ─── acknowledged ─────────────────────────────────────────────────────────────

describe("acknowledged", () => {
  it('counts only complaints with status "Acknowledged"', () => {
    const data = [
      makeComplaint({ status: "Acknowledged" }),
      makeComplaint({ status: "Resolved" }),
      makeComplaint({ status: "Acknowledged" }),
    ];

    const [, , , acknowledged] = getStatValues(data);

    expect(acknowledged).toBe(2);
  });

  it("is 0 when no complaints are acknowledged", () => {
    const data = [makeComplaint({ status: "Open" })];

    const [, , , acknowledged] = getStatValues(data);

    expect(acknowledged).toBe(0);
  });

  it('is case-sensitive — "acknowledged" lowercase does not count', () => {
    const data = [makeComplaint({ status: "acknowledged" })];

    const [, , , acknowledged] = getStatValues(data);

    expect(acknowledged).toBe(0);
  });
});

// ─── unassigned ───────────────────────────────────────────────────────────────

describe("unassigned", () => {
  it('counts complaints with status "false"', () => {
    const data = [
      makeComplaint({ status: "false", workerid: "W-1" }),
      makeComplaint({ status: "Open", workerid: "W-2" }),
    ];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(1);
  });

  it("counts complaints with no workerid undefined", () => {
    const data = [
      makeComplaint({ workerid: undefined }),
      makeComplaint({ workerid: "W-1" }),
    ];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(1);
  });

  it("counts complaints with null workerid", () => {
    const data = [makeComplaint({ workerid: null })];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(1);
  });

  it("counts complaints with empty string workerid", () => {
    const data = [makeComplaint({ workerid: "" })];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(1);
  });

  it('counts once when both status is "false" and workerid is missing', () => {
    const data = [makeComplaint({ status: "false", workerid: undefined })];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(1);
  });

  it("does not count assigned complaints with a valid workerid", () => {
    const data = [makeComplaint({ status: "Open", workerid: "W-99" })];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(0);
  });

  it("counts all unassigned complaints across a mixed dataset", () => {
    const data = [
      makeComplaint({ status: "false", workerid: "W-1" }),
      makeComplaint({ status: "Open", workerid: null }),
      makeComplaint({ status: "Open", workerid: "W-2" }),
      makeComplaint({ workerid: undefined }),
    ];

    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(3);
  });
});

// ─── combined counts ──────────────────────────────────────────────────────────

describe("combined counts across a realistic dataset", () => {
  const data = [
    makeComplaint({ status: "Resolved", workerid: "W-1" }),
    makeComplaint({ status: "Resolved", workerid: "W-2" }),
    makeComplaint({ status: "In progress", workerid: "W-3" }),
    makeComplaint({ status: "Acknowledged", workerid: "W-4" }),
    makeComplaint({ status: "false", workerid: "W-5" }),
    makeComplaint({ status: "Open", workerid: null }),
    makeComplaint({ status: "Open", workerid: "W-6" }),
  ];

  it("computes the correct total", () => {
    const [total] = getStatValues(data);

    expect(total).toBe(7);
  });

  it("computes the correct resolved count", () => {
    const [, resolved] = getStatValues(data);

    expect(resolved).toBe(2);
  });

  it("computes the correct in-progress count", () => {
    const [, , pending] = getStatValues(data);

    expect(pending).toBe(1);
  });

  it("computes the correct acknowledged count", () => {
    const [, , , acknowledged] = getStatValues(data);

    expect(acknowledged).toBe(1);
  });

  it("computes the correct unassigned count", () => {
    const [, , , , unassigned] = getStatValues(data);

    expect(unassigned).toBe(2);
  });

  it("resolved + pending + acknowledged does not exceed total", () => {
    const [total, resolved, pending, acknowledged] = getStatValues(data);

    expect(resolved + pending + acknowledged).toBeLessThanOrEqual(total);
  });
});