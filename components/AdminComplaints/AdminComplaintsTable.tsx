// "use client";

// import { useState } from "react";
// import ComplaintViewer from "../complaintView";
// import AdminComplaintsDetails from "./AdminComplaintsDetails";

// export default function AdminComplaintsTable({ complaints }: { complaints: Record<string, any>[] }) {
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   const [sortKey, setSortKey] = useState("creationtime");
//   const [ascending, setAscending] = useState(false);

//   const sortedTable = [...complaints].sort((a, b) => {
//     let first = a[sortKey];
//     let second = b[sortKey];

//     if (sortKey === "creationtime") {
//       first = new Date(first).getTime();
//       second = new Date(second).getTime();
//     }

//     if (first < second) return ascending ? -1 : 1;
//     if (first > second) return ascending ? 1 : -1;
//     return 0;
//   });

//   const handleSort = (key: string) => {
//     if (sortKey === key) {
//       setAscending(!ascending);
//     } else {
//       setSortKey(key);
//       setAscending(true);
//     }
//   };

//   return (
//     <>
//       <table className="border text-black">

//         <thead className="bg-[#138808] text-white">
//           <tr>
            
//             <th onClick={() => handleSort("municipality")} className="p-3 text-left border-r border-black cursor-pointer">
//               Municipality
//             </th>

//             <th onClick={() => handleSort("status")} className="p-3 text-left border-r border-black cursor-pointer">
//               Status
//             </th>

//             <th onClick={() => handleSort("issuetype")} className="p-3 text-left border-r border-black cursor-pointer">
//               Issue Type
//             </th>

//             <th onClick={() => handleSort("creationtime")} className="p-3 text-left border-r border-black cursor-pointer">
//               Date
//             </th>

//             <th className="p-3 text-left border-r border-black cursor-pointer">
//               View Complaint
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {sortedTable.map((entry) => (
//             <tr
//               key={entry.complaintid}
//               className="border-t hover:bg-brand-secondary/30 border-black"
//             >
//               <td className="p-3 border-r border-black">{entry.municipality}</td>

//               <td className="p-3 border-r border-black">
//                 {entry.status}
//               </td>

//               <td className="p-3 border-r border-black">{entry.issuetype}</td>

//               <td className="p-3 border-r border-black">
//                 <time dateTime={entry.creationtime}>
//                   {new Date(entry.creationtime).toLocaleString()}
//                 </time>
//               </td>

//               <td className="p-3 flex justify-center ">
//                 <button
//                   onClick={() => setSelectedId(entry.complaintid)}
//                   className="bg-[#138808]/60 text-white px-3 py-1 rounded"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>

//       {/* MODAL */}
//       {selectedId && (
//         <AdminComplaintsDetails
//           cid={selectedId}
//           onClose={() => setSelectedId(null)}
//         />
//       )}
//     </>
//   );
// }

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
import AdminComplaintsDetails from "./AdminComplaintsDetails";
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
        Allocate Work
      </button>
    );

export default function AdminComplaintsTable({
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
    <section className="flex flex-col gap-3">
      <ComplaintsFilters
        table={table}
        issueTypeOptions={issueTypeOptions}
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
              className="border-t hover:bg-brand-secondary border-black"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-3 border-r last:border-r-0 border-black"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedComplaint && (
        <AdminComplaintsDetails
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </section>
  );
}