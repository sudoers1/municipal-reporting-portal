import Card from "../generalcomps/card";

export default function UnassignedTasksCard({
  tasks,
  onClaim,
  currentUserId,
}: {
  tasks: any[];
  onClaim: (complaintid: number) => void;
  currentUserId?: string;
}) {
  return (
    <Card title="Unassigned Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-gray-300 text-sm">No unassigned reports.</p>
        )}

        {tasks.map((task: any) => {
          const isOwnComplaint =
            task.userid !== undefined &&
            currentUserId !== undefined &&
            String(task.userid) === String(currentUserId);

          return (
            <li key={task.complaintid}>
              <article className="bg-black/20 rounded-xl p-3 border border-white/10">
                <header className="mb-2">
                  <section className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg">{task.issuetype}</h3>

                    {isOwnComplaint && (
                      <span className="text-xs bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full">
                        Created by you
                      </span>
                    )}
                  </section>

                  <p className="text-xs text-gray-300">
                    Complaint #{task.complaintid}
                  </p>
                </header>

                <p className="text-sm text-gray-200 line-clamp-3">
                  {task.details}
                </p>

                <section className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
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
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isOwnComplaint
                        ? "bg-gray-500 cursor-not-allowed text-gray-200"
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