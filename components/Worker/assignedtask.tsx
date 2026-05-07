import Card from "../card";

export default function AssignedTasksCard({ tasks, onSelect }: any) {
  return (
    <Card title="My Tasks">
      <ul className="space-y-2 max-h-[300px] overflow-y-auto">
        {tasks.map((task: any) => (
          <li key={task.id}>
            <article>
              <button
                onClick={() => onSelect(task)}
                className="w-full text-left"
              >
                <header>
                  <h3>{task.type}</h3>
                </header>

                <p>Status: {task.status}</p>
              </button>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}