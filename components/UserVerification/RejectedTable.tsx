"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { approveVerification } from "../../lib/db/verifications";
import { useRouter } from "next/navigation";

type DeniedRequest = {
  user_id: string;
  approved: boolean;
  name: string | null;
  email: string | null;
  image: string | null;
};

export default function DeniedVerificationsTable({ 
  initialRequests 
}: { 
  initialRequests: any[] 
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const data = useMemo(() => initialRequests as DeniedRequest[], [initialRequests]);

  const handleReconsider = async (userId: string) => {
    if (confirm("Are you sure you want to approve this previously denied user?")) {
      await approveVerification(userId);
      router.refresh();
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: (info: any) => (
          <section className="flex items-center gap-3">
            {/* {info.row.original.image ? (
              <img src={info.row.original.image} className="w-8 h-8 rounded-full grayscale" alt="denied-user" />
            ) : (
              <section className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-xs">!</section>
            )} */}
            <p className="line-through">{info.getValue() || "N/A"}</p>
          </section>
        )
      },
      { accessorKey: "email", header: "Email" },
      {
        id: "status",
        header: "Status",
        cell: () => (
          <p className="bg-red-500 text-red-900 font-bold text-xs uppercase tracking-widest w-fit px-3 py-1 rounded-full border border-red-700/80">
            Rejected
          </p>
        ),
      },
    //   {
    //     id: "actions",
    //     header: "Actions",
    //     cell: (info: any) => (
    //       <button 
    //         onClick={() => handleReconsider(info.row.original.user_id)}
    //         className="bg-green-500 text-green-900 uppercase tracking-widest w-fit px-3 py-1 rounded-full text-xs font-bold border border-green-700/80"
    //       >
    //         Approve Anyway
    //       </button>
    //     ),
    //   },
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
        {/* <h2 className="text-xl font-medium ">Denied Verifications</h2> */}
        <p className=" text-3xl p-8">{data.length} Workers Denied</p>
      </section>
      
      <article className="rounded-xl  overflow-hidden shadow-lg p-4">
      {hasNoResults ? (
              <p  className="p-8 text-center text-xl text-gray-800">
                No rejected requests
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