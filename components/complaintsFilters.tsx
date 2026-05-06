"use client";

type Props = {
  table: any;
  municipalityOptions: string[];
  issueTypeOptions: string[];
  dateRange: { start?: string; end?: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ start?: string; end?: string }>>;
};

export default function ComplaintsFilters({ table, municipalityOptions, issueTypeOptions, dateRange, setDateRange }: Props) {
  return (
    <header className="w-[85vw] p-2 flex gap-3 justify-center bg-brand-primary rounded-2xl text-white">
      <select
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("municipality")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("municipality")?.setFilterValue(e.target.value || undefined)}
      >
        <option value="">All Municipalities</option>
        {municipalityOptions.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <select
        className="p-2 text-black rounded bg-brand-accent"
        value={table.getColumn("status")?.getFilterValue()?.toString() ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          table.getColumn("status")?.setFilterValue(val === "" ? undefined : val === "true");
        }}
      >
        <option value="">All Status</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>

      <select
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("issuetype")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("issuetype")?.setFilterValue(e.target.value || undefined)}
      >
        <option value="">All Issues</option>
        {issueTypeOptions.map((i) => <option key={i} value={i}>{i}</option>)}
      </select>

      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.start ?? ""}
        onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
      />

      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.end ?? ""}
        onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
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