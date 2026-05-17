import { useState } from "react";
import Card from "../generalcomps/card";

export default function UpdateStatusCard({ report, onUpdate }: any) {
  if (!report) return null;

  const [status, setStatus] = useState(report.assignment_status);

  return (
    <Card title="Update Report Status">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onUpdate(report.complaintid, status);
        }}
      >
        <header>
          <p className="text-sm text-gray-300">Selected Report</p>
          <h3 className="text-lg font-semibold">{report.issuetype}</h3>
        </header>

        <fieldset>
          <legend className="mb-2 text-sm">Assignment Status</legend>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-white"
          >
            <option value="Acknowledged">Acknowledged</option>
            <option value="In progress">In progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg"
        >
          Update Status
        </button>
      </form>
    </Card>
  );
}