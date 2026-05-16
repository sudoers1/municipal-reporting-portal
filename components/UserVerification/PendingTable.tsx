"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { approveVerification, rejectVerification } from "../../lib/db/verifications"; //
import { useRouter } from "next/navigation";

// Match exactly what your SQL SELECT returns: v.user_id, v.approved, u.name, u.email, u.image
type VerificationRequest = {
  user_id: string;
  approved: boolean | null;
  name: string | null;
  email: string | null;
  image: string | null;
};

export default function PendingVerificationsTable({ 
  initialRequests 
}: { 
  initialRequests: any[] // Accept any[] to prevent the immediate "initialRequests" error
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  // Cast the data safely
  const data = useMemo(() => initialRequests as VerificationRequest[], [initialRequests]);

  const handleApprove = async (userId: string) => {
    if (confirm("Approve this worker?")) {
      await approveVerification(userId); //
      router.refresh(); 
    }
  };

  const handleReject = async (userId: string) => {
    if (confirm("Reject this worker?")) {
      await rejectVerification(userId); //
      router.refresh();
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: (info: any) => (
          <section className="flex items-center gap-2">
            {/* {info.row.original.image && (
              <img src={info.row.original.image} className="w-6 h-6 rounded-full" alt="avatar" />
            )} */}
            <p>{info.getValue() || "Unknown User"}</p>
          </section>
        )
      },
      { accessorKey: "email", header: "Email" },
      {
        id: "actions",
        header: "Actions",
        cell: (info: any) => (
          <section className="flex gap-2">
            <button 
              onClick={() => handleApprove(info.row.original.user_id)}
              className="bg-green-500 text-green-900 uppercase tracking-widest w-fit px-3 py-1 rounded-full text-xs font-bold border border-green-700/80"
            >
              Approve
            </button>
            <button 
              onClick={() => handleReject(info.row.original.user_id)}
              className="bg-red-500 text-red-900 font-bold text-xs uppercase tracking-widest w-fit px-3 py-1 rounded-full border border-red-700/80"
            >
              Reject
            </button>
          </section>
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

  return (
    <section className="flex flex-col">
      <section className="flex gap-4 justify-center items-center px-2">
        {/* <h2 className="text-xl font-medium ">Approved Verifications</h2> */}
        {/* <h2 className="text-3xl p-4">Approved Requests</h2> */}
        <p className=" text-3xl p-8">{data.length} Requests Pending</p>
      </section>

      

      <section className="flex justify-center overflow-x-auto">
          <table className="bg-brand-primary/70 w-[85vw] text-white rounded-md overflow-hidden">
            <thead className="bg-brand-accent text-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-2 text-left border-r last:border-r-0">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-brand-primary/70 text-left hover:bg-brand-secondary">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-r last:border-r-0 border-t border-black">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
      </section>
    </section>
  );
}
// "use client"

// import { RowModel, Table, useReactTable } from "@tanstack/react-table";
// import { use, useMemo } from "react";

// type Verification = {
//     id: string;
//     identifier: string;
//     value: string;
//     expiresAt: string;
//     createdAt: string;
//     updatedAt: string
// }

// export default function ApprovedTable({verification}: {verification: Record<string, any>[]}){
    
//     // SELECT v.user_id, v.approved, u.name, u.email, u.image
// //         FROM verif_requests v
// //         LEFT JOIN "user" u ON u.id = v.user_id
// //         WHERE v.approved IS NULL
//     const {data} = useMemo(() => {
//         const mapped: Verification[] = verification.map((v) => ({
//             userid: v.user_id,
//             approved: v.v.approved,
//             username: v.u.name,
//             email: v.u.email,
//             image: v.u.image,
//     }));
//     return {
//         data: mapped,
//     };
//     }, [verification]);

//     const columns = useMemo(
//         () => [
//             {accesorKey:"userid", header: "user id" },
//             {accesorKey:"approved", header: "approved" },
//             {accesorKey:"username", header: "username" },
//             {accesorKey:"email", header: "useremail" },
//             {accesorKey:"image", header: "image" },
//         ],
//         []
//     ) 

//     const table = useReactTable({
//         data,
//         columns,
//         getCoreRowModel: function (table: Table<any>): () => RowModel<any> {
//             throw new Error("Function not implemented.");
//         }
//     })
    
//     return(
//         <>
           
//         </>
//     )
// }

