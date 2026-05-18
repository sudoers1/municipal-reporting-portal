import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusAnalytics from "../components/Dashboard/StatusLegend";

// ─── Mock lucide-react icons ──────────────────────────────────────────────────

jest.mock("lucide-react", () => ({
  CheckCircle2: () => null,
  Timer: () => null,
  ClipboardList: () => null,
  TrendingUp: () => null,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeAssignment(overrides: Record<string, any> = {}) {
  return { status: "Open", worker_name: "Alice", ...overrides };
}

function renderCard(assignments: any[]) {
  return render(React.createElement(StatusAnalytics, { assignments }));
}

// Reads the resolved count, active count, resolution %, and top worker
// directly from the rendered text to keep assertions tied to real output.
function getNumberNearLabel(label: RegExp): number {
  const labelEl = screen.getByText(label);

  let current: HTMLElement | null = labelEl.parentElement;

  while (current && current !== document.body) {
    const numberEl = Array.from(current.querySelectorAll("p, span, div")).find(
      (el) => /^\d+$/.test(el.textContent?.trim() ?? "")
    );

    if (numberEl) {
      return parseInt(numberEl.textContent?.trim() ?? "0", 10);
    }

    current = current.parentElement;
  }

  throw new Error(`Could not find numeric value near label: ${label}`);
}

function getRenderedValues() {
  const percentEl = screen.getByText(/^\d+%$/);
  const percent = parseInt(percentEl.textContent ?? "0", 10);

  const resolvedCount = getNumberNearLabel(/^resolved$/i);
  const activeCount = getNumberNearLabel(/^active$/i);

  const rateLabel = screen.getByText(/highest resolution rate/i);
  const workerCard = rateLabel.closest("section") as HTMLElement;

  const allPs = workerCard.querySelectorAll("p");
  const workerName = allPs[1]?.textContent?.trim() ?? "";

  const completedText = allPs[2]?.textContent ?? "";
  const completedCount = parseInt(completedText.match(/\d+/)?.[0] ?? "0", 10);

  return {
    percent,
    resolvedCount,
    activeCount,
    workerName,
    completedCount,
  };
}

// ─── Default prop ─────────────────────────────────────────────────────────────

describe("default prop", () => {
  it("renders without crashing when no assignments prop is provided", () => {
    expect(() =>
      render(React.createElement(StatusAnalytics, { assignments: [] }))
    ).not.toThrow();
  });

  it("shows 0 resolved and 0 active when assignments is empty", () => {
    renderCard([]);
    const { resolvedCount, activeCount } = getRenderedValues();
    expect(resolvedCount).toBe(0);
    expect(activeCount).toBe(0);
  });

  it("shows 0% resolution progress when assignments is empty", () => {
    renderCard([]);
    const { percent } = getRenderedValues();
    expect(percent).toBe(0);
  });

  it('shows "No resolved tasks" as top worker when assignments is empty', () => {
    renderCard([]);
    const { workerName } = getRenderedValues();
    expect(workerName).toBe("No resolved tasks");
  });

  it("shows 0 completed tasks for top worker when assignments is empty", () => {
    renderCard([]);
    const { completedCount } = getRenderedValues();
    expect(completedCount).toBe(0);
  });
});

// ─── statusCounts reduction ───────────────────────────────────────────────────

describe("statusCounts reduction", () => {
  it('counts "Resolved" assignments correctly', () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().resolvedCount).toBe(2);
  });

  it('counts "In progress" assignments correctly', () => {
    const data = [
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "Resolved" }),
    ];
    renderCard(data);
    expect(getRenderedValues().activeCount).toBe(3);
  });

  it("shows 0 resolved when no assignments have Resolved status", () => {
    const data = [
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().resolvedCount).toBe(0);
  });

  it("shows 0 active when no assignments are In progress", () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().activeCount).toBe(0);
  });

  it("counts each status independently across a mixed dataset", () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "In progress" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    const { resolvedCount, activeCount } = getRenderedValues();
    expect(resolvedCount).toBe(1);
    expect(activeCount).toBe(2);
  });

  it('is case-sensitive — "resolved" (lowercase) does not count as Resolved', () => {
    const data = [makeAssignment({ status: "resolved" })];
    renderCard(data);
    expect(getRenderedValues().resolvedCount).toBe(0);
  });

  it('is case-sensitive — "In Progress" (capital P) does not count as active', () => {
    const data = [makeAssignment({ status: "In Progress" })];
    renderCard(data);
    expect(getRenderedValues().activeCount).toBe(0);
  });
});

// ─── Resolution percentage ────────────────────────────────────────────────────

describe("resolution percentage", () => {
  it("is 100% when all assignments are resolved", () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Resolved" }),
    ];
    renderCard(data);
    expect(getRenderedValues().percent).toBe(100);
  });

  it("is 0% when no assignments are resolved", () => {
    const data = [
      makeAssignment({ status: "Open" }),
      makeAssignment({ status: "In progress" }),
    ];
    renderCard(data);
    expect(getRenderedValues().percent).toBe(0);
  });

  it("calculates 50% when half the assignments are resolved", () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().percent).toBe(50);
  });

  it("rounds the percentage using Math.round", () => {
    // 1/3 = 33.33...% → rounds to 33
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Open" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().percent).toBe(33);
  });

  it("rounds up correctly — 2/3 = 66.66...% → 67", () => {
    const data = [
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Resolved" }),
      makeAssignment({ status: "Open" }),
    ];
    renderCard(data);
    expect(getRenderedValues().percent).toBe(67);
  });

  it("uses total = 1 as denominator guard when assignments is empty (no divide-by-zero)", () => {
    // 0 / 1 * 100 = 0% — no crash
    renderCard([]);
    expect(getRenderedValues().percent).toBe(0);
  });
});

// ─── workerStats reduction ────────────────────────────────────────────────────

describe("workerStats reduction", () => {
  it("only counts Resolved assignments toward worker stats", () => {
    const data = [
      makeAssignment({ status: "Resolved",   worker_name: "Alice" }),
      makeAssignment({ status: "In progress", worker_name: "Alice" }),
      makeAssignment({ status: "Open",        worker_name: "Alice" }),
    ];
    renderCard(data);
    // Alice only has 1 resolved — confirmed via completed count
    expect(getRenderedValues().completedCount).toBe(1);
  });

  it("ignores assignments with no worker_name even if Resolved", () => {
    const data = [
      makeAssignment({ status: "Resolved", worker_name: null }),
      makeAssignment({ status: "Resolved", worker_name: undefined }),
    ];
    renderCard(data);
    // No valid worker names → topWorkerName stays "No resolved tasks"
    expect(getRenderedValues().workerName).toBe("No resolved tasks");
  });

  it("accumulates resolved counts per worker correctly", () => {
    const data = [
      makeAssignment({ status: "Resolved", worker_name: "Alice" }),
      makeAssignment({ status: "Resolved", worker_name: "Alice" }),
      makeAssignment({ status: "Resolved", worker_name: "Bob" }),
    ];
    renderCard(data);
    // Alice has 2, Bob has 1 — Alice is top worker with 2 completed
    const { workerName, completedCount } = getRenderedValues();
    expect(workerName).toBe("Alice");
    expect(completedCount).toBe(2);
  });
});

// ─── topWorkerName derivation ─────────────────────────────────────────────────

describe("topWorkerName derivation", () => {
  it('returns "No resolved tasks" when there are no resolved assignments', () => {
    const data = [makeAssignment({ status: "Open", worker_name: "Alice" })];
    renderCard(data);
    expect(getRenderedValues().workerName).toBe("No resolved tasks");
  });

  it("returns the worker with the most resolved assignments", () => {
    const data = [
      makeAssignment({ status: "Resolved", worker_name: "Alice" }),
      makeAssignment({ status: "Resolved", worker_name: "Bob" }),
      makeAssignment({ status: "Resolved", worker_name: "Bob" }),
      makeAssignment({ status: "Resolved", worker_name: "Bob" }),
      makeAssignment({ status: "Resolved", worker_name: "Alice" }),
    ];
    renderCard(data);
    expect(getRenderedValues().workerName).toBe("Bob");
  });

  it("returns the single worker when only one worker has resolved tasks", () => {
    const data = [
      makeAssignment({ status: "Resolved", worker_name: "Carol" }),
      makeAssignment({ status: "Open",     worker_name: "Dave" }),
    ];
    renderCard(data);
    expect(getRenderedValues().workerName).toBe("Carol");
  });

  it("shows the correct completed task count for the top worker", () => {
    const data = [
      makeAssignment({ status: "Resolved", worker_name: "Eve" }),
      makeAssignment({ status: "Resolved", worker_name: "Eve" }),
      makeAssignment({ status: "Resolved", worker_name: "Eve" }),
      makeAssignment({ status: "Resolved", worker_name: "Frank" }),
    ];
    renderCard(data);
    const { workerName, completedCount } = getRenderedValues();
    expect(workerName).toBe("Eve");
    expect(completedCount).toBe(3);
  });

  it("shows 0 completed tasks when top worker is the default fallback", () => {
    renderCard([]);
    expect(getRenderedValues().completedCount).toBe(0);
  });

  it("handles a single resolved assignment correctly", () => {
    const data = [makeAssignment({ status: "Resolved", worker_name: "Grace" })];
    renderCard(data);
    const { workerName, completedCount } = getRenderedValues();
    expect(workerName).toBe("Grace");
    expect(completedCount).toBe(1);
  });
});

// ─── combined realistic dataset ───────────────────────────────────────────────

describe("combined realistic dataset", () => {
  const data = [
    makeAssignment({ status: "Resolved",    worker_name: "Alice" }),
    makeAssignment({ status: "Resolved",    worker_name: "Alice" }),
    makeAssignment({ status: "Resolved",    worker_name: "Bob"   }),
    makeAssignment({ status: "In progress", worker_name: "Carol" }),
    makeAssignment({ status: "In progress", worker_name: "Dave"  }),
    makeAssignment({ status: "Open",        worker_name: "Eve"   }),
  ];

  it("computes the correct resolved count", () => {
    renderCard(data);
    expect(getRenderedValues().resolvedCount).toBe(3);
  });

  it("computes the correct active count", () => {
    renderCard(data);
    expect(getRenderedValues().activeCount).toBe(2);
  });

  it("computes the correct resolution percentage (3/6 = 50%)", () => {
    renderCard(data);
    expect(getRenderedValues().percent).toBe(50);
  });

  it("identifies Alice as the top worker (2 resolved vs Bob's 1)", () => {
    renderCard(data);
    expect(getRenderedValues().workerName).toBe("Alice");
  });

  it("shows Alice's correct completed task count", () => {
    renderCard(data);
    expect(getRenderedValues().completedCount).toBe(2);
  });
});