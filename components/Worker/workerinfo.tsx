import Card from "../card";

export default function WorkerInfoCard({ worker }: any) {
  if (!worker) return null;

  return (
    <Card title="Worker Information">
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-300">Name</p>
          <p className="font-medium">{worker.name || "Unknown"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-300">Email</p>
          <p className="font-medium break-all">{worker.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-300">Worker ID</p>
          <p className="font-mono text-xs break-all">{worker.id}</p>
        </div>
      </div>
    </Card>
  );
}