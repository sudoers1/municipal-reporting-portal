import Card from "../generalcomps/card";

export default function UnassignedTasksCard({
  tasks,
  onClaim,
}: any) {
  return (
    <Card title="Unassigned Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-gray-300 text-sm">
            No unassigned reports.
          </p>
        )}

        {tasks.map((task: any) => (
          <li key={task.complaintid}>
            <article className="bg-black/20 rounded-xl p-3 border border-white/10">
              <header className="mb-2">
                <h3 className="font-semibold text-lg">
                  {task.issuetype}
                </h3>

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
                  onClick={() => onClaim(task.complaintid)}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
                >
                  Claim
                </button>
              </section>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}