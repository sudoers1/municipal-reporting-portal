"use client";

type Props = {
  table: any;
  municipalityOptions: string[];
  dateRange: { start?: string; end?: string };
  setDateRange: (value: { start?: string; end?: string }) => void;
};

const roleOptions = [
  { label: "All Roles", value: "" },
  { label: "User", value: "0" },
  { label: "Worker", value: "1" },
  { label: "Admin", value: "2" },
];

export default function UserFilters({
  table,
  dateRange,
  municipalityOptions,
  setDateRange,
}: Props) {
  return (
    <header className="w-[85vw] p-2 flex flex-wrap gap-3 justify-center  rounded-2xl text-white">

      <input
        type="text"
        placeholder="Search name..."
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(
            e.target.value || undefined
          )
        }
      />
      <input
        type="text"
        placeholder="Search Email..."
        className="p-2 text-black rounded bg-brand-accent"
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("email")?.setFilterValue(
            e.target.value || undefined
          )
        }
      />

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
        value={(table.getColumn("user_types_id")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("user_types_id")?.setFilterValue(
            e.target.value || undefined
          )
        }
      >
        {roleOptions.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>



      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.start ?? ""}
        onChange={(e) =>
          setDateRange({ ...dateRange, start: e.target.value })
        }
      />

      <input
        type="date"
        className="p-2 text-black rounded bg-brand-accent"
        value={dateRange.end ?? ""}
        onChange={(e) =>
          setDateRange({ ...dateRange, end: e.target.value })
        }
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