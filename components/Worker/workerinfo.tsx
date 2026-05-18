import Card from "../generalcomps/card";

export default function WorkerInfoCard({
  worker,
}: {
  worker: { name?: string; email?: string };
}) {
  if (!worker) return null;

  return (
    <Card title="Worker Information">
      <dl className="space-y-3">
        <section>
          <dt className="text-sm text-black/70">Name</dt>
          <dd className="font-medium text-black">
            {worker.name || "Unknown"}
          </dd>
        </section>

        <section>
          <dt className="text-sm text-black/70">Email</dt>
          <dd className="font-medium text-black break-all">
            {worker.email || "No email provided"}
          </dd>
        </section>
      </dl>
    </Card>
  );
}
