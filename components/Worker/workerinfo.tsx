import Card from "../card";

export default function WorkerInfoCard({ worker }: any) {
  if (!worker) return null;

  return (
    <Card title="Worker Info">
      <address className="not-italic">
        <p>Name: {worker.name}</p>
        <p>Email: {worker.email}</p>
      </address>
    </Card>
  );
}