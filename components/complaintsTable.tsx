"use client";

import { useState } from "react";
import ComplaintViewer from "@/components/complaintView";

export default function ComplaintsTable({ complaints }: { complaints: Record<string, any>[] }) {
  const [selected, setSelected] = useState<Record<string,any> | null>(null);

  const [sortKey, setSortKey] = useState("creationtime");
  const [ascending, setAscending] = useState(false);

  const sortedTable = [...complaints].sort((a, b) => {
    let first = a[sortKey];
    let second = b[sortKey];

    if (sortKey === "creationtime") {
      first = new Date(first).getTime();
      second = new Date(second).getTime();
    }

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
    <>
      <table className="w-[85vw] bg-brand-primary rounded-2xl overflow-hidden text-white">

        <thead className="bg-brand-accent text-black">
          <tr>
            <th onClick={() => handleSort("municipality")} className="p-3 text-left border-r cursor-pointer">
              Municipality
            </th>

            <th onClick={() => handleSort("status")} className="p-3 text-left border-r cursor-pointer">
              Status
            </th>

            <th onClick={() => handleSort("issuetype")} className="p-3 text-left border-r cursor-pointer">
              Issue Type
            </th>

            <th onClick={() => handleSort("creationtime")} className="p-3 text-left cursor-pointer">
              Date
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {sortedTable.map((entry) => (
            <tr
              key={entry.complaintid}
              className="border-t hover:bg-brand-secondary border-black"
            >
              <td className="p-3 border-r border-black">{entry.municipality}</td>

              <td className="p-3 border-r border-black">
                {entry.status ? "Completed" : "Pending"}
              </td>

              <td className="p-3 border-r border-black">{entry.issuetype}</td>

              <td className="p-3 border-black">
                <time dateTime={entry.creationtime}>
                  {new Date(entry.creationtime).toLocaleString()}
                </time>
              </td>

              <td className="p-3">
                <button
                  onClick={() => setSelected(entry)}
                  className="bg-brand-accent text-black px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {selected && (
        <ComplaintViewer
          complaint={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}