import Card from "../card";

export default function ReportDetails({ report }: any) {
  if (!report) return null;

  return (
    <Card title="Report Details">
      <dl className="space-y-2">
        <div>
          <dt className="font-semibold">Resident</dt>
          <dd>{report.resident}</dd>
        </div>

        <div>
          <dt className="font-semibold">Type</dt>
          <dd>{report.type}</dd>
        </div>

        <div>
          <dt className="font-semibold">Date</dt>
          <dd>{report.date}</dd>
        </div>

        <div>
          <dt className="font-semibold">Ward</dt>
          <dd>{report.ward}</dd>
        </div>

        <div>
          <dt className="font-semibold">Description</dt>
          <dd>{report.description}</dd>
        </div>
      </dl>
    </Card>
  );
}