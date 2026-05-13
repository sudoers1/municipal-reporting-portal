import Card from "../card";

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
  onSelectReport: (report: Report) => void;
};

export default function PossibleDuplicatesCard({
  duplicates,
  onConfirm,
  onReject,
  onSelectReport,
}: PossibleDuplicatesCardProps) {
  return (
    <Card title="Possible Duplicate Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {duplicates.length === 0 && (
          <p className="text-gray-300 text-sm">
            No pending duplicate reviews.
          </p>
        )}

        {duplicates.map((item) => (
          <li key={item.id}>
            <article className="bg-black/20 rounded-xl p-3 border border-white/10">
              <header className="mb-2">
                <h3 className="font-semibold text-lg">
                  {item.duplicate_issuetype}
                </h3>

                <p className="text-xs text-gray-300">
                  Review #{item.id} ·{" "}
                  {item.distance_meters === null
                    ? "Unknown distance"
                    : `${Number(item.distance_meters).toFixed(2)}m away`}
                </p>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => onSelectReport(item.original_report)}
                  className="text-left bg-black/20 rounded-lg p-3 border border-white/10 hover:bg-black/30 hover:border-white/30 transition"
                >
                  <h4 className="text-sm font-semibold mb-1">
                    Original Report
                  </h4>

                  <p className="text-xs text-gray-300 mb-1">
                    Complaint #{item.original_id}
                  </p>

                  <p className="text-sm text-gray-200 line-clamp-2">
                    {item.original_details || "No details provided."}
                  </p>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                    {item.original_address || "No address"}
                  </p>

                  <p className="text-xs text-blue-300 mt-2">
                    Click to view details
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectReport(item.duplicate_report)}
                  className="text-left bg-black/20 rounded-lg p-3 border border-white/10 hover:bg-black/30 hover:border-white/30 transition"
                >
                  <h4 className="text-sm font-semibold mb-1">
                    Possible Duplicate
                  </h4>

                  <p className="text-xs text-gray-300 mb-1">
                    Complaint #{item.duplicate_id}
                  </p>

                  <p className="text-sm text-gray-200 line-clamp-2">
                    {item.duplicate_details || "No details provided."}
                  </p>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                    {item.duplicate_address || "No address"}
                  </p>

                  <p className="text-xs text-blue-300 mt-2">
                    Click to view details
                  </p>
                </button>
              </section>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(item.duplicate_creationtime).toLocaleDateString()}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onConfirm(item.id)}
                    className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-sm"
                  >
                    Confirm
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject(item.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}