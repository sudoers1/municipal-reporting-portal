import Card from "../generalcomps/card";

export default function ReportDetailsCard({
  report,
  onClose,
}: {
  report: any;
  onClose: () => void;
}) {
  if (!report) return null;

  return (
    <Card title="Report Details">
      <button
        onClick={onClose}
        className="mb-4 text-sm text-red-300 hover:text-red-200"
      >
        ← Back to dashboard
      </button>

      <dl className="space-y-4">
        <section>
          <dt className="text-sm text-black/70">Complaint ID</dt>
          <dd className="font-medium text-black">#{report.complaintid}</dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Issue Type</dt>
          <dd className="font-medium text-black">{report.issuetype}</dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Municipality</dt>
          <dd className="text-black">{report.municipality}</dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Created</dt>
          <dd className="text-black">
            {new Date(report.creationtime).toLocaleString()}
          </dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Assignment Status</dt>
          <dd className="text-black">{report.assignment_status}</dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Description</dt>
          <dd className="leading-relaxed text-sm text-black">
            {report.details}
          </dd>
        </section>
      </dl>
    </Card>
  );
}
