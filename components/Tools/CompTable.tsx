"use client"

import React, { useEffect } from "react";
import { columns, Complaint } from "../ComplaintsData/Columns";
import { DataTable } from "../ComplaintsData/DataTable";
import ComplaintDetails from "../Forms/ComplaintDetails";

export default function ComplaintsTable(){

    const [showModal, setShowModal] = React.useState(false);

    return(
        <section className="flex justify-center">
            <table className="border border-gray-400">
                <tr className="text-gray-700 border-b border-gray-400">
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">complaintid</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">municipality</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">status</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">details</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">issuetype</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">image</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">creationtime</th>
                    <th className="bg-gray-300 text-left px-4 py-1 border-l border-gray-400">userid</th>
                </tr>
                <tr onClick={() => setShowModal(true)}>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                    <td className="text-left px-4 border-l border-gray-400">info</td>
                </tr>
            </table>
            {showModal && <ComplaintDetails/>}
        </section>
    )
}