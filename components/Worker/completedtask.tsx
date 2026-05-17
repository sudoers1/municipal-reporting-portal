import Card from "../card";

export default function CompletedTasksCard({ tasks }: any) {
  return (
    <Card title="Completed Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-gray-300 text-sm">
            No completed reports.
          </p>
        )}

        {tasks.map((task: any) => (
          <li key={task.complaintid}>
            <article className="bg-black/20 rounded-xl p-3 border border-green-500/20">
              <header className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {task.issuetype}
                </h3>

                <p className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded-full">
                  Resolved
                </p>
              </header>

              <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                {task.details}
              </p>

              <footer className="mt-3 text-xs text-gray-400">
                #{task.complaintid}
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}