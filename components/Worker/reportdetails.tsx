import Card from "../card";

export default function ReportDetailsCard({
  report,
}: any) {
  if (!report) return null;

  return (
    <Card title="Report Details">
      <dl className="space-y-4">
        <div>
          <dt className="text-sm text-gray-300">
            Complaint ID
          </dt>

          <dd className="font-medium">
            #{report.complaintid}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Issue Type
          </dt>

          <dd className="font-medium">
            {report.issuetype}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Municipality
          </dt>

          <dd>{report.municipality}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Resident/User ID
          </dt>

          <dd className="break-all text-sm">
            {report.userid}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Created
          </dt>

          <dd>
            {new Date(
              report.creationtime
            ).toLocaleString()}
          </dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Assignment Status
          </dt>

          <dd>{report.assignment_status}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-300">
            Description
          </dt>

          <dd className="leading-relaxed text-sm">
            {report.details}
          </dd>
        </div>
      </dl>
    </Card>
  );
}