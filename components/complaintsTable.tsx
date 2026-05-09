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

type Complaint = {
  complaintid: string;
  municipality: string;
  status: string;
  issuetype: string;
  creationtime: string;
  image?: string;      // for the viewer
  details: string;    // for the viewer
  // any other fields from the original complaint
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

const actionsCell = (setSelected: (c: Complaint) => void) => (info: CellContext<Complaint, any>) => (
  <button
    onClick={() => setSelected(info.row.original)}
    className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
  >
    View
  </button>
);

export default function ComplaintsTable({ complaints }: { complaints: Record<string, any>[] }) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
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
      image: d.image,          // preserve image URL
      details: d.details,      // preserve description
    }));
    return {
      data: mapped,
      municipalityOptions: [...new Set(mapped.map((d) => d.municipality))],
      issueTypeOptions: [...new Set(mapped.map((d) => d.issuetype))],
    };
  }, [complaints]);

  const columns = useMemo(
    () => [
      { accessorKey: "municipality", header: "Municipality", filterFn: filterFns.equals },
      { accessorKey: "status", header: "Status", filterFn: filterFns.equals},
      { accessorKey: "issuetype", header: "Issue Type", filterFn: filterFns.equals },
      { accessorKey: "creationtime", header: "Date", filterFn: dateRangeFilter, cell: dateCell },
      { id: "actions", header: "", cell: actionsCell(setSelectedComplaint) },
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
      <ComplaintsFilters
        table={table}
        municipalityOptions={municipalityOptions}
        issueTypeOptions={issueTypeOptions}
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


      {selectedComplaint && (
        <ComplaintViewer
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </section>
  );
}