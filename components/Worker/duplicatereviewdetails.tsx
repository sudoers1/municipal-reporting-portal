import Card from "../generalcomps/card";

type Report = {
  complaintid: number;
  userid: string;
  ward_id: string | null;
  municipality: string;
  status: string;
  image: string | null;
  issuetype: string;
  details: string | null;
  creationtime: string;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  coords: string | null;
  priority: number | null;
  linked_complaint_id: number | null;
};

type DuplicateReview = {
  id: number;
  distance_meters: number | string | null;
  review_status: string;
  original_report: Report;
  duplicate_report: Report;
};

type DuplicateReviewDetailsProps = {
  review: DuplicateReview;
  onClose: () => void;
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
};

function priorityLabel(priority: number | null) {
  switch (priority) {
    case 0:
      return "Low";
    case 1:
      return "Medium";
    case 2:
      return "High";
    case 3:
      return "Critical";
    default:
      return "Unknown";
  }
}

function ReportComparePanel({
  title,
  report,
}: {
  title: string;
  report: Report;
}) {
  return (
    <article className="bg-black/20 rounded-xl p-4 border border-black/10 space-y-3">
      <header>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-xs text-gray-300">
          Complaint #{report.complaintid}
        </p>
      </header>

      {report.image && (
        <img
          src={report.image}
          alt={`${title} image`}
          className="w-full h-40 object-cover rounded-lg border border-black/10"
        />
      )}

      <section className="space-y-2 text-sm text-black-200">
        <p>
          <span className="text-black-400">Issue:</span>{" "}
          {report.issuetype}
        </p>

        <p>
          <span className="text-black-400">Status:</span>{" "}
          {report.status}
        </p>

        <p>
          <span className="text-black-400">Priority:</span>{" "}
          {priorityLabel(report.priority)}
        </p>

        <p>
          <span className="text-gray-400">Municipality:</span>{" "}
          {report.municipality || "Unknown"}
        </p>

        <p>
          <span className="text-gray-400">Ward:</span>{" "}
          {report.ward_id || "Unknown"}
        </p>

        <p>
          <span className="text-gray-400">Address:</span>{" "}
          {report.address || "No address"}
        </p>

        <p>
          <span className="text-gray-400">Coordinates:</span>{" "}
          {report.latitude && report.longitude
            ? `${report.latitude}, ${report.longitude}`
            : report.coords || "No coordinates"}
        </p>

        <p>
          <span className="text-gray-400">Created:</span>{" "}
          {new Date(report.creationtime).toLocaleString()}
        </p>
      </section>

      <section>
        <h4 className="text-sm font-semibold mb-1">Details</h4>
        <p className="text-sm text-gray-200 blackspace-pre-wrap">
          {report.details || "No details provided."}
        </p>
      </section>
    </article>
  );
}

export default function DuplicateReviewDetails({
  review,
  onClose,
  onConfirm,
  onReject,
}: DuplicateReviewDetailsProps) {
  const distance =
    review.distance_meters === null
      ? "Unknown distance"
      : `${Number(review.distance_meters).toFixed(2)}m apart`;

  return (
    <section className="md:col-span-2 xl:col-span-3">
      <Card title={`Duplicate Review #${review.id}`}>
        <section className="space-y-4">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <section>
              <p className="text-sm text-gray-300">
                Compare both reports before confirming or rejecting.
              </p>

              <p className="text-sm text-gray-400">
                Distance: {distance}
              </p>
            </section>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReportComparePanel
              title="Original Report"
              report={review.original_report}
            />

            <ReportComparePanel
              title="Possible Duplicate"
              report={review.duplicate_report}
            />
          </section>

          <footer className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => onReject(review.id)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-semibold"
            >
              Reject Duplicate
            </button>

            <button
              type="button"
              onClick={() => onConfirm(review.id)}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold"
            >
              Confirm Duplicate
            </button>
          </footer>
        </section>
      </Card>
    </section>
  );
}