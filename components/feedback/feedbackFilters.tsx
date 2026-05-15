"use client";

type Props = {
  table: any;
  dateRange: { start?: string; end?: string };
  setDateRange: (value: { start?: string; end?: string }) => void;
};

export default function FeedbackFilters({
  table,
  dateRange,
  setDateRange,
}: Props) {
  return (
    <header className="w-[85vw] p-2 flex gap-3 justify-center bg-brand-primary rounded-2xl text-white">
            <input
        type="text"
        placeholder="Search Respondant..."
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(
            e.target.value || undefined
          )
        }
      />
      

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

        <select
          className="p-2 text-black rounded bg-brand-accent text-center"
          value={(table.getColumn("rating")?.getFilterValue() as number | undefined) ?? ""}
          onChange={(e) =>
            table.getColumn("rating")?.setFilterValue(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

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