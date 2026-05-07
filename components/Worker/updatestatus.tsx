import Card from "../card";

export default function UpdateStatusCard({
  report,
  onUpdate,
}: any) {
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
          <label
            htmlFor="status"
            className="block mb-2 text-sm"
          >
            Assignment Status
          </label>

          <select
            id="status"
            value={report.assignment_status}
            onChange={(e) =>
              onUpdate(report.complaintid, e.target.value)
            }
            className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-white"
          >
            <option value="Acknowledged">
              Acknowledged
            </option>

            <option value="In progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>
        </div>
      </div>
    </Card>
  );
}