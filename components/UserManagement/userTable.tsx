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
import UserFilters from "@/components/UserManagement/userFilters";

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  user_types_id: number;
  municipality: string;
};

const roleLabel = (role: number) => {
  switch (role) {
    case 1:
      return "Worker";
    case 2:
      return "Admin";
    default:
      return "User";
  }
};

const dateRangeFilter = (row: Row<User>, columnId: string, value: any) => {
  const rowDate = new Date(row.getValue(columnId)).getTime();
  const start = value?.start ? new Date(value.start).getTime() : null;
  const end = value?.end ? new Date(value.end).getTime() : null;

  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
};

const dateCell = (info: CellContext<User, string>) =>
  new Date(info.getValue()).toLocaleString();



export default function UserTable(
  { setSelectedUser,users }: 
  { users: Record<string, any>[] ;setSelectedUser: (c: User) => void;})
   {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});



  const { data, municipalityOptions } = useMemo(() => {
    const mapped: User[] = users.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      image: d.image,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      user_types_id: d.user_types_id ?? 0,
      municipality: d.municipality ?? "Not assigned",
    }));

    return {
      data: mapped,
      municipalityOptions: [...new Set(mapped.map((d) => d.municipality))],
    };
  }, [users]);

  const actionsCell =
  (setSelectedUser: (c: User) => void) => (info: CellContext<User, any>) =>
    (
      <button
        onClick={() => setSelectedUser(info.row.original)}
        className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
      >
        View
      </button>
    );


  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        filterFn: filterFns.includesString,
      },
      {
        accessorKey: "email",
        header: "Email",
        filterFn: filterFns.includesString,
      },
      {
        accessorKey: "municipality",
        header: "Municipality",
        filterFn: filterFns.includesString,
      },
      {
        accessorKey: "user_types_id",
        header: "Role",
        cell: (info: CellContext<User, number>) => roleLabel(info.getValue() ?? 0),
        filterFn: (  row: Row<User>,columnId: string,value: string | undefined) => {
          if (value === undefined || value === "") return true;
          return row.getValue(columnId) === Number(value);
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        filterFn: dateRangeFilter,
        cell: dateCell,
      },
      {
        id: "actions",
        header: "",
        cell: actionsCell(setSelectedUser),
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
    table.getColumn("createdAt")?.setFilterValue(dateRange);
  }, [dateRange, table]);
  
  const filteredRows = table.getRowModel().rows;
  const hasNoResults = filteredRows.length === 0;

  return (
    <section className="flex flex-col z-30 gap-3">
      <article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-4">
      <UserFilters
        table={table}
        municipalityOptions={municipalityOptions}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      </article>

      {/*<article className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden"></article>*/}
      <article className="mt-3 rounded-xl  overflow-hidden">
      {hasNoResults ? (
              <p  className="p-8 text-center text-lg text-gray-800">
                No users found
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