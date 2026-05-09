"use client";

import { useState } from "react";
import ComplaintViewer from "../complaintView";
import AdminComplaintsDetails from "./AdminComplaintsDetails";

export default function AdminComplaintsTable({ complaints }: { complaints: Record<string, any>[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      <table className="border text-black">

        <thead className="bg-[#138808] text-white">
          <tr>

            <th onClick={() => handleSort("municipality")} className="p-3 text-left border-r border-black cursor-pointer">
              Municipality
            </th>

            <th onClick={() => handleSort("status")} className="p-3 text-left border-r border-black cursor-pointer">
              Status
            </th>

            <th onClick={() => handleSort("issuetype")} className="p-3 text-left border-r border-black cursor-pointer">
              Issue Type
            </th>

            <th onClick={() => handleSort("creationtime")} className="p-3 text-left border-r border-black cursor-pointer">
              Date
            </th>

            <th className="p-3 text-left border-r border-black cursor-pointer">
              View Complaint
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedTable.map((entry) => (
 
          <tr
              key={entry.complaintid}
              className="border-t hover:bg-brand-secondary/30 border-black"
            >
              <td className="p-3 border-r border-black">{entry.municipality}</td>

              <td className="p-3 border-r border-black">
                {entry.status}
              </td>

              <td className="p-3 border-r border-black">{entry.issuetype}</td>

              <td className="p-3 border-r border-black">
                <time dateTime={entry.creationtime}>
                  {new Date(entry.creationtime).toLocaleString()}
                </time>
              </td>

              <td className="p-3 flex justify-center ">
                <button
                  onClick={() => setSelectedId(entry.complaintid)}
                  className="bg-[#138808]/60 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* MODAL */}
      {selectedId && (
        <AdminComplaintsDetails
          cid={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}