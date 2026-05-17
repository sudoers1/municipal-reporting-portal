import Card from "../generalcomps/card";

export default function AssignedTasksCard({
  tasks,
  onSelect,
}: any) {
  return (
    <Card title="Assigned Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-gray-300 text-sm">
            No assigned reports.
          </p>
        )}

        {tasks.map((task: any) => (
          <li key={task.complaintid}>
            <button
              onClick={() => onSelect(task)}
              className="w-full text-left"
            >
              <article className="bg-black/20 rounded-xl p-3 border border-white/10 hover:border-white/30 transition">
                <header className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    {task.issuetype}
                  </h3>

                  <p className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full">
                    {task.assignment_status}
                  </p>
                </header>

                <p className="text-sm text-gray-200 line-clamp-2">
                  {task.details}
                </p>

                <footer className="mt-3 text-xs text-gray-400">
                  #{task.complaintid}
                </footer>
              </article>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}