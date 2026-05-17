"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

// Type based on readApprovedVerifications SQL return
type ApprovedRequest = {
  user_id: string;
  approved: boolean;
  name: string | null;
  email: string | null;
  image: string | null;
};

export default function ApprovedVerificationsTable({ 
  initialRequests 
}: { 
  initialRequests: any[] 
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Cast the data safely
  const data = useMemo(() => initialRequests as ApprovedRequest[], [initialRequests]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Worker Name",
        cell: (info: any) => (
          <section className="flex items-center gap-3">
            {/* {info.row.original.image ? (
              <img 
                src={info.row.original.image} 
                className="w-8 h-8 rounded-full object-cover border border-brand-accent" 
                alt="avatar" 
              />
            ) : (
              <section className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                ?
              </section>
            )} */}
            <p className="font-medium">{info.getValue() || "N/A"}</p>
          </section>
        )
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "approved",
        header: "Status",
        cell: () => (
          <p className="bg-green-500 text-green-900 uppercase tracking-widest w-fit px-3 py-1 rounded-full text-xs font-bold border border-green-700/80">
            Verified Worker
          </p>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

    const filteredRows = table.getRowModel().rows;
  const hasNoResults = filteredRows.length === 0;

  return (
    <section className="flex flex-col">
      <section className="flex gap-4 justify-center items-center px-2">
        {/* <h2 className="text-xl font-medium ">Approved Verifications</h2> */}
        {/* <h2 className="text-3xl p-4">Approved Requests</h2> */}
        <p className=" text-3xl p-8">{data.length} Workers Approved</p>
      </section>

      <article className=" rounded-xl  overflow-hidden shadow-lg p-4">
      {hasNoResults ? (
              <p  className="p-8 text-center text-xl text-gray-800">
                No Approved Workers
              </p>
          ) : (
      <table className="w-full table-fixed text-sm text-gray-900">
        <thead className="bg-brand-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sort = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-3 text-left border-r last:border-r-0 cursor-pointer border-brand-primary/50"
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
              className="border-t hover:bg-brand-accent/30  border-brand-primary/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-2 truncate max-w-[160px]"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>)}
      </article>
    </section>
  );
}