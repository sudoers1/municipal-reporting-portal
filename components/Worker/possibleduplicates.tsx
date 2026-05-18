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

type PossibleDuplicate = {
  id: number;
  distance_meters: number | string | null;
  review_status: string;

  original_id: number;
  original_issuetype: string;
  original_details: string | null;
  original_address: string | null;
  original_status: string;
  original_priority: number | null;
  original_creationtime: string;

  duplicate_id: number;
  duplicate_issuetype: string;
  duplicate_details: string | null;
  duplicate_address: string | null;
  duplicate_status: string;
  duplicate_priority: number | null;
  duplicate_creationtime: string;

  original_report: Report;
  duplicate_report: Report;
};

type PossibleDuplicatesCardProps = {
  duplicates: PossibleDuplicate[];
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
  onViewReview: (review: PossibleDuplicate) => void;
};

export default function PossibleDuplicatesCard({
  duplicates,
  onConfirm,
  onReject,
  onViewReview,
}: PossibleDuplicatesCardProps) {
  return (
    <Card title="Possible Duplicate Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {duplicates.length === 0 && (
          <p className="text-slate-600 text-sm">
            No pending duplicate reviews.
          </p>
        )}

        {duplicates.map((item) => (
          <li key={item.id}>
            <article className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition">
              <header className="mb-2">
                <h3 className="font-semibold text-lg text-slate-900">
                  {item.duplicate_issuetype}
                </h3>

                <p className="text-xs text-slate-600">
                  Review #{item.id} ·{" "}
                  {item.distance_meters === null
                    ? "Unknown distance"
                    : `${Number(item.distance_meters).toFixed(2)}m away`}
                </p>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => onViewReview(item)}
                  className="text-left bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-slate-200 hover:border-slate-300 transition"
                >
                  <h4 className="text-sm font-semibold mb-1 text-slate-900">
                    Original Report
                  </h4>

                  <p className="text-xs text-slate-600 mb-1">
                    Complaint #{item.original_id}
                  </p>

                  <p className="text-sm text-slate-800 line-clamp-2">
                    {item.original_details || "No details provided."}
                  </p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                    {item.original_address || "No address"}
                  </p>

                  <p className="text-xs text-blue-600 mt-2">
                    Click to view details
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onViewReview(item)}
                  className="text-left bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-slate-200 hover:border-slate-300 transition"
                >
                  <h4 className="text-sm font-semibold mb-1 text-slate-900">
                    Possible Duplicate
                  </h4>

                  <p className="text-xs text-slate-600 mb-1">
                    Complaint #{item.duplicate_id}
                  </p>

                  <p className="text-sm text-slate-800 line-clamp-2">
                    {item.duplicate_details || "No details provided."}
                  </p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                    {item.duplicate_address || "No address"}
                  </p>

                  <p className="text-xs text-blue-600 mt-2">
                    Click to view details
                  </p>
                </button>
              </section>

              <footer className="mt-3 flex items-center justify-between gap-2">
                <time
                  dateTime={item.duplicate_creationtime}
                  className="text-xs text-slate-600"
                >
                  {new Date(item.duplicate_creationtime).toLocaleDateString()}
                </time>

                <section className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onConfirm(item.id)}
                    className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold text-white"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(item.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-semibold text-white"
                  >
                    Reject
                  </button>
                </section>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}
