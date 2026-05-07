import { useState } from "react";
import Card from "../card";

export default function UpdateStatusCard({
  report,
  onUpdate,
}: any) {
  const [status, setStatus] = useState(report.assignment_status);

  if (!report) return null;

  return (
    <Card title="Update Report Status">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-300">Selected Report</p>
          <h3 className="text-lg font-semibold">
            {report.issuetype}
          </h3>
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Assignment Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-white"
          >
            <option value="Acknowledged">Acknowledged</option>
            <option value="In progress">In progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button
          onClick={() => onUpdate(report.complaintid, status)}
          className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg"
        >
          Update Status
        </button>
      </div>
    </Card>
  );
}