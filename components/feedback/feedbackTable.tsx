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

const actionsCell = (setSelected: (c: Feedback) => void) => (info: CellContext<Feedback, any>) => (
  <button
    onClick={() => setSelected(info.row.original)}
    className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
  >
    View
  </button>
);

export default function FeedbackTable({ feedbacks }: { feedbacks: Record<string, any>[] }) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
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
      
      {/*the table*/}
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