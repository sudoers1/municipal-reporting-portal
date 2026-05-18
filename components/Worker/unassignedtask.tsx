import Card from "../generalcomps/card";

export default function UnassignedTasksCard({
  tasks,
  onClaim,
  currentUserId,
}: {
  tasks: any[];
  onClaim: (complaintid: number) => void;
  currentUserId?: string;
  className?: string;
}) {
  return (
    <Card title="Unassigned Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-slate-600 text-sm">No unassigned reports.</p>
        )}

        {tasks.map((task: any) => {
          const isOwnComplaint =
            task.userid !== undefined &&
            currentUserId !== undefined &&
            String(task.userid) === String(currentUserId);

          return (
            <li key={task.complaintid}>
              <article className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition">
                <header className="mb-2">
                  <section className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg text-slate-900">
                      {task.issuetype}
                    </h3>

                    {isOwnComplaint && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Created by you
                      </span>
                    )}
                  </section>

                  <p className="text-xs text-slate-600">
                    Complaint #{task.complaintid}
                  </p>
                </header>

                <p className="text-sm text-slate-800 line-clamp-3">
                  {task.details}
                </p>

                <section className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {new Date(task.creationtime).toLocaleDateString()}
                  </p>

                  <button
                    type="button"
                    onClick={() => onClaim(task.complaintid)}
                    disabled={isOwnComplaint}
                    title={
                      isOwnComplaint
                        ? "You cannot claim a report you created"
                        : "Claim report"
                    }
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                      isOwnComplaint
                        ? "bg-slate-400 cursor-not-allowed text-slate-200"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {isOwnComplaint ? "Cannot Claim" : "Claim"}
                  </button>
                </section>
              </article>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
