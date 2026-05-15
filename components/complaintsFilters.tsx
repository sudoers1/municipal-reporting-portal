"use client";

type Props = {
  table: any;
  municipalityOptions: string[];
  issueTypeOptions: string[];
  dateRange: { start?: string; end?: string };
  setDateRange: (value: { start?: string; end?: string }) => void;
};

export default function ComplaintsFilters({
  table,
  municipalityOptions,
  issueTypeOptions,
  dateRange,
  setDateRange,
}: Props) {
  return (
    <header className="w-[85vw] p-2 flex gap-3 justify-center bg-brand-primary rounded-2xl text-white">
      <input
        type="text"
        placeholder="Search Municipality..."
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("municipality")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("municipality")?.setFilterValue(
            e.target.value || undefined
          )
        }
      />

      <select
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("status")?.setFilterValue(
            e.target.value || undefined
          )
        }
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Duplicate">Duplicate</option>
        <option value="Acknowledged">Acknowledged</option>
        <option value="In progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      <select
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("issuetype")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("issuetype")?.setFilterValue(e.target.value || undefined)
        }
      >
        <option value="">All Issues</option>
        {issueTypeOptions.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.start ?? ""}
        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
      />

      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.end ?? ""}
        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
      />

      <button
        onClick={() => {
          table.resetColumnFilters();
          setDateRange({});
        }}
        className="bg-brand-secondary hover:bg-brand-secondary/70 text-black p-3 rounded"
      >
        Reset
      </button>
    </header>
  );
}