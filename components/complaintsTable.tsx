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
import ComplaintsFilters from "@/components/complaintsFilters";

type Complaint = {
  complaintid: string;
  municipality: string;
  status: string;
  issuetype: string;
  creationtime: string;
  image?: string;
  details: string;
};

const dateRangeFilter = (row: Row<Complaint>, columnId: string, value: any) => {
  const rowDate = new Date(row.getValue(columnId)).getTime();
  const start = value?.start ? new Date(value.start).getTime() : null;
  const end = value?.end ? new Date(value.end).getTime() : null;
  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
};

const dateCell = (info: CellContext<Complaint, string>) =>
  new Date(info.getValue()).toLocaleString();

export default function ComplaintsTable({
  complaints,
  onSelectComplaint,
}: {
  complaints: Record<string, any>[];
  onSelectComplaint: (c: Complaint) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { data, municipalityOptions, issueTypeOptions } = useMemo(() => {
    const mapped: Complaint[] = complaints.map((d) => ({
      complaintid: d.complaintid,
      municipality: d.municipality,
      status: d.status,
      issuetype: d.issuetype,
      creationtime: d.creationtime,
      image: d.image,
      details: d.details,
    }));
    return {
      data: mapped,
      municipalityOptions: [...new Set(mapped.map((d) => d.municipality))],
      issueTypeOptions: [...new Set(mapped.map((d) => d.issuetype))],
    };
  }, [complaints]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "municipality",
        header: "Municipality",
        filterFn: filterFns.equals,
        size: 180,
        maxSize: 200,
        cell: (info: CellContext<Complaint, string>) => (
          <span className="truncate max-w-[160px]" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: filterFns.equals,
        size: 120,
        cell: (info: CellContext<Complaint, string>) => (
          <span className="truncate" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "issuetype",
        header: "Issue Type",
        filterFn: filterFns.equals,
        size: 160,
        cell: (info: CellContext<Complaint, string>) => (
          <span className="truncate" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "creationtime",
        header: "Date",
        filterFn: dateRangeFilter,
        cell: dateCell,
        size: 160,
      },
      {
        id: "actions",
        header: "",
        cell: (info: CellContext<Complaint, any>) => (
          <button
            onClick={() => onSelectComplaint(info.row.original)}
            className="px-3 py-1 rounded-lg bg-teal-500/80 text-white text-sm font-semibold hover:bg-teal-500 transition-colors shadow-sm"
          >
            View
          </button>
        ),
        size: 80,
      },
      { accessorKey: "municipality", header: "Municipality", filterFn: filterFns.includesString },
      { accessorKey: "status", header: "Status", filterFn: filterFns.equals},
      { accessorKey: "issuetype", header: "Issue Type", filterFn: filterFns.equals },
      { accessorKey: "creationtime", header: "Date", filterFn: dateRangeFilter, cell: dateCell },
      { id: "actions", header: "", cell: actionsCell(setSelectedComplaint) },
    ],
    [onSelectComplaint]
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
        <ComplaintsFilters
          table={table}
          municipalityOptions={municipalityOptions}
          issueTypeOptions={issueTypeOptions}
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
                      className="p-2 text-left font-semibold cursor-pointer select-none"
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
                    className="p-2 truncate max-w-[160px]"
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
