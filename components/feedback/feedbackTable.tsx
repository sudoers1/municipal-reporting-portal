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
import FeedbackViewer from "@/components/feedback/feedbackView";
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
  return <p className="text-white">{stars}</p>;
};

const actionsCell = (setSelected: (c: FeedbackRow) => void) => (info: CellContext<FeedbackRow, any>) => (
  <button
    onClick={() => setSelected(info.row.original)}
    className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
  >
    View
  </button>
);

export default function FeedbackTable({ feedbacks }: { feedbacks: Record<string, any>[] }) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null);
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
    <section className="flex flex-col gap-3">
      <FeedbackFilters
        table={table}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <table className="w-[85vw] bg-brand-primary rounded-2xl overflow-hidden text-white">
        <thead className="bg-brand-accent text-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sort = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-3 text-left border-r last:border-r-0 cursor-pointer"
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
            <tr key={row.id} className="border-t hover:bg-brand-secondary border-black">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3 border-r last:border-r-0 border-black">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFeedback && (
        <FeedbackViewer
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </section>
  );
}