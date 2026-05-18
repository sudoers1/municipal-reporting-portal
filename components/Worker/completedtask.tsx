import Card from "../generalcomps/card";

export default function CompletedTasksCard({ tasks }: { tasks: any[] }) {
  return (
    <Card title="Completed Reports">
      <ul className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 && (
          <li>
            <p className="text-sm text-slate-700">No completed reports.</p>
          </li>
        )}

        {tasks.map((task) => (
          <li key={task.complaintid}>
            <article className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-green-200 hover:border-green-300 transition">
              <header className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-slate-900">
                  {task.issuetype}
                </h3>
                <span className="text-xs bg-green-100/70 text-green-700 px-2 py-1 rounded-full">
                  Resolved
                </span>
              </header>

              <p className="mt-2 text-sm text-slate-800 line-clamp-2">
                {task.details}
              </p>

              <footer className="mt-3 text-xs text-slate-600">
                #{task.complaintid}
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}
