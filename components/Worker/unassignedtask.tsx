import Card from "../card";

export default function UnassignedTasksCard({ tasks, onClaim }: any) {
  return (
    <Card title="Unassigned Tasks">
      <ul className="space-y-2 max-h-[300px] overflow-y-auto">
        {tasks.map((task: any) => (
          <li key={task.id}>
            <article className="border-b border-white/20 pb-2">
              <header>
                <h3>{task.type}</h3>
              </header>

              <footer className="mt-2">
                <button onClick={() => onClaim(task.id)}>
                  Claim
                </button>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}