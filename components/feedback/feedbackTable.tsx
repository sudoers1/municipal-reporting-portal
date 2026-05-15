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
import { Feedback } from "@/lib/structures/feedback";

type FeedbackRow = ReturnType<Feedback["toPlainObject"]>;

const dateRangeFilter = (
  row: Row<FeedbackRow>,
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

const dateCell = (info: CellContext<FeedbackRow, string>) =>
  new Date(info.getValue()).toLocaleString();

const ratingCell = (info: CellContext<FeedbackRow, number>) => {
  const rating = info.getValue();
  const fullStar = "★";
  const emptyStar = "☆";
  const stars = fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  return <p className="text-black">{stars}</p>;
};

const actionsCell = (setSelectedFeedback: (c: FeedbackRow) => void) => (info: CellContext<FeedbackRow, any>) => (
  <button
    onClick={() => setSelectedFeedback(info.row.original)}
    className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
  >
    View
  </button>
);

export default function FeedbackTable({ feedbacks,setSelectedFeedback }: { feedbacks: Record<string, any>[]; setSelectedFeedback:(feedback:FeedbackRow)=>{};}) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { data } = useMemo(() => {
    const rows: FeedbackRow[] = feedbacks.map((d) =>
      Feedback.fromRecord(d).toPlainObject()
    );

    return {
      data: rows,
    };
  }, [feedbacks]);

  const columns = useMemo(
    () => [
      { 
        accessorKey: "name" as const, 
        header: "Respondent", 
        filterFn: filterFns.includesString 
      },
      { 
        accessorKey: "creationtime" as const, 
        header: "Date", 
        filterFn: dateRangeFilter, 
        cell: dateCell 
      },
      { 
        accessorKey: "rating" as const, 
        header: "Rating", 
        filterFn: filterFns.equals,
        cell: ratingCell 
      },
      { 
        id: "actions", 
        header: "", 
        cell: actionsCell(setSelectedFeedback) 
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
    <section className="flex flex-col gap-6">
      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-4">
        <FeedbackFilters
          table={table}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </article>
      
      {/*the table*/}
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
    </section>
  );
}
