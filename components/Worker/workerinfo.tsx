import Card from "../generalcomps/card";

export default function WorkerInfoCard({ worker }: any) {
  if (!worker) return null;

  return (
    <Card title="Worker Information">
      <table className="w-full">
        <tbody className="space-y-3">
          <tr>
            <th className="text-sm text-gray-300 text-left">Name</th>
            <td className="font-medium">{worker.name || "Unknown"}</td>
          </tr>
          <tr>
            <th className="text-sm text-gray-300 text-left">Email</th>
            <td className="font-medium break-all">{worker.email}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}