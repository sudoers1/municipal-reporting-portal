"use client";
import { useState } from "react";
import Image from "next/image";

export default function VerificationsTable({ verifications }: { verifications: Record<string, any>[] }) {
  const [sortKey, setSortKey] = useState("name");
  const [ascending, setAscending] = useState(true);

  const sortedTable = [...verifications].sort((a, b) => {
    const first = a[sortKey] ?? "";
    const second = b[sortKey] ?? "";
    if (first < second) return ascending ? -1 : 1;
    if (first > second) return ascending ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setAscending(!ascending);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <table className="w-[85vw] bg-brand-primary rounded-2xl overflow-hidden text-white">
      <thead className="bg-brand-accent text-black">
        <tr>
          <th className="p-3 text-left border-r">User</th>
          <th onClick={() => handleSort("name")} className="p-3 text-left border-r cursor-pointer">
            Name
          </th>
          <th onClick={() => handleSort("email")} className="p-3 text-left border-r cursor-pointer">
            Email
          </th>
          <th onClick={() => handleSort("verified")} className="p-3 text-left cursor-pointer">
            Verified
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedTable.map((entry, index) => (
          <tr
            key={entry.userid ?? index}
            className="border-t hover:bg-brand-secondary border-black"
          >
            <td className="p-3 border-r border-black">
              {entry.image ? (
                <Image
                  src={entry.image}
                  alt={entry.name ?? "User"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <section className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center text-black font-bold">
                  {entry.name?.[0]?.toUpperCase() ?? "?"}
                </section>
              )}
            </td>
            <td className="p-3 border-r border-black">{entry.name ?? "Unknown"}</td>
            <td className="p-3 border-r border-black">{entry.email ?? "Unknown"}</td>
            <td className="p-3">
              {entry.verified ? "✅ Yes" : "❌ No"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}