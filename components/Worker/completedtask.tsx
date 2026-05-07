import Card from "../card";

export default function CompletedTasksCard({ tasks }: any) {
  return (
    <Card title="Completed Tasks">
      <ul className="space-y-1 max-h-[300px] overflow-y-auto">
        {tasks.map((task: any) => (
          <li key={task.id}>
            <article>
              <p>{task.type}</p>
            </article>
          </li>
        ))}
      </ul>
    </Card>
  );
}