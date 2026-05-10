import Card from "../card";

export default function UpdateStatusCard({ report, onUpdate }: any) {
  if (!report) return null;

  return (
    <Card title="Update Status">
      <form>
        <label htmlFor="status" className="block mb-2">
          Update Status
        </label>

        <select
          id="status"
          value={report.status}
          onChange={(e) => onUpdate(report.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </form>
    </Card>
  );
}