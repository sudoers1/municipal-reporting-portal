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
import UserViewer from "@/components/UserManagement/userView";
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

const actionsCell =
  (setSelected: (c: User) => void) => (info: CellContext<User, any>) =>
    (
      <button
        onClick={() => setSelected(info.row.original)}
        className="bg-brand-accent text-black px-3 py-1 rounded hover:bg-brand-accent/70"
      >
        View
      </button>
    );

export default function UserTable({ onSuccess, users }: { onSuccess: () => void; users: Record<string, any>[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
        filterFn: filterFns.equals,
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

  return (
    <section className="flex flex-col gap-3">
      <UserFilters
        table={table}
        municipalityOptions={municipalityOptions}
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

      {selectedUser && (
        <UserViewer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={onSuccess}
        />
      )}
    </section>
  );
}