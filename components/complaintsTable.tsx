"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  filterFns,
  CellContext,
  Row,
} from "@tanstack/react-table";
import ComplaintViewer from "@/components/complaintView";
import ComplaintsFilters from "@/components/complaintsFilters";
import { ReportsBleed } from "@/lib/structures/reportsbleed";

type ComplaintRow = ReturnType<ReportsBleed["toPlainObject"]>;

const dateRangeFilter = (
  row: Row<ComplaintRow>,
  columnId: string,
  value: { start?: string; end?: string }
) => {
  const rowDate = new Date(row.getValue(columnId)).getTime();
  const start = value?.start ? new Date(value.start).getTime() : null;
  const end = value?.end ? new Date(value.end).getTime() : null;
  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
};

const dateCell = (info: CellContext<ComplaintRow, string>) =>
  new Date(info.getValue()).toLocaleString();

const actionsCell =
  (setSelected: (c: ComplaintRow) => void) =>
  (info: CellContext<ComplaintRow, unknown>) =>
    (
      <button
        onClick={() => setSelected(info.row.original)}
        className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
      >
        View
      </button>
    );

export default function ComplaintsTable({
  complaints,
}: {
  complaints: Record<string, any>[];
}) {
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintRow | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>(
    {}
  );

  const { data, issueTypeOptions } = useMemo(() => {
    const rows: ComplaintRow[] = complaints
      .map((d) => ReportsBleed.fromRecord(d).toPlainObject());

    return {
      data: rows,
      issueTypeOptions: [...new Set(rows.map((r) => r.issuetype))],
    };
  }, [complaints]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "municipality" as const,
        header: "Municipality",
        filterFn: filterFns.includesString,
      },
      {
        accessorKey: "status" as const,
        header: "Status",
        filterFn: filterFns.equals,
      },
      {
        accessorKey: "issuetype" as const,
        header: "Issue Type",
        filterFn: filterFns.equals,
      },
      {
        accessorKey: "creationtime" as const,
        header: "Date",
        filterFn: dateRangeFilter,
        cell: dateCell,
      },
      {
        id: "actions",
        header: "",
        cell: actionsCell(setSelectedComplaint),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    table.getColumn("creationtime")?.setFilterValue(dateRange);
  }, [dateRange, table]);

  return (
    <section className="flex flex-col z-30 gap-3">
      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-4">
        <ComplaintsFilters
          table={table}
          issueTypeOptions={issueTypeOptions}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </article>

      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden"></article>
      <table className="w-full table-fixed text-sm text-gray-900">
        <thead className="bg-brand-accent text-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sort = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-3 text-left border-r last:border-r-0  font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {sort === "asc" ? " ↑" : sort === "desc" ? " ↓" : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
                className="border-t border-white/20 hover:bg-white/10 transition-colors"
              >
              {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-2 truncate max-w-[160px]"
                    //title={String(cell.getValue())}
                  >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedComplaint && (
        <ComplaintViewer
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </section>
  );
}
