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
import FeedbackFilters from "@/components/feedback/feedbackFilters";

type Feedback = {
  name: string;
  feedbackId: number;
  complaintId: number;
  userId: string;
  details: string;
  image?: string | null;
  creationtime: string;
  rating:number;
};

const dateRangeFilter = (row: Row<Feedback>, columnId: string, value: any) => {
  const rowDate = new Date(row.getValue(columnId)).getTime();
  const start = value?.start ? new Date(value.start).getTime() : null;
  const end = value?.end ? new Date(value.end).getTime() : null;
  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
};

const dateCell = (info: CellContext<Feedback, string>) =>
  new Date(info.getValue()).toLocaleString();

export default function FeedbackTable({
  feedbacks,
  onSelectFeedback,
}: {
  feedbacks: Record<string, any>[];
  onSelectFeedback: (f: Feedback) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

const { data } = useMemo(() => {
  const mapped: Feedback[] = feedbacks.map((d) => ({
    name: d.name,
    feedbackId: d.feedbackId,
    complaintId: d.complaintId,
    userId: d.userId,
    details: d.details,
    image: d.image,
    creationtime: d.creationtime,
    rating:d.rating,
  }));

  return {
    data: mapped,
  };
}, [feedbacks]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Respondant", filterFn: filterFns.includesString },
      { accessorKey: "creationtime", header: "Date", filterFn: dateRangeFilter, cell: dateCell },
      { accessorKey: "rating", header: "Rating", filterFn: filterFns.equals },
      { id: "actions", header: "", cell: actionsCell(setSelectedFeedback) },
    ],
    [onSelectFeedback]
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
    <section className="flex flex-col gap-6">
      {/* Filters */}
      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-4">
        <FeedbackFilters
          table={table}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </article>

      {/* Table */}
      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full table-fixed text-sm text-gray-900">
          <thead className="bg-teal-500/80 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sort = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-3 text-left font-semibold cursor-pointer select-none border-r last:border-r-0"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                    className="p-3 truncate border-r last:border-r-0 border-white/20"
                    title={String(cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
