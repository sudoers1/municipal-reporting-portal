export default function Tiles() {
  return (
    <main className="py-12 flex text-slate-900 items-stretch gap-8 max-sm:flex-col">
      {/* Analytics Tile */}
      <a
        href="/admin/dashboard"
        className="w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-2xl bg-white/30 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
      >
        <h1 className="font-semibold text-3xl text-center">Analytics</h1>
        <p className="text-sm text-center text-slate-600 px-3">
          View high-level analytics and real-time operational insights to monitor the status of all ongoing municipal tasks.
        </p>
      </a>

      {/* Complaints Tile */}
      <a
        href="/admin/complaints"
        className="w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-2xl bg-white/30 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
      >
        <h1 className="font-semibold text-3xl">Complaints</h1>
        <p className="text-sm text-center text-slate-600 px-3">
          Access the full registry of citizen reports to review details, update progress, and assign issues to the appropriate personnel.
        </p>
      </a>

      {/* Manage Tile */}
      <section className="w-64 h-fit p-6 flex flex-col justify-center items-center gap-3 rounded-2xl bg-white/30 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
        <h2 className="font-semibold text-3xl">Manage</h2>
        <p className="text-sm text-center text-slate-600">
          Oversee your team by managing system users and field workers to ensure resources are effectively distributed across all active projects.
        </p>
        <div className="flex flex-col gap-2 mt-2 w-full">
          <a
            href="/admin/usermanagement"
            className="text-white bg-teal-600 hover:bg-brand-primary-500 px-4 py-2 rounded-lg shadow-sm text-center font-semibold transition"
          >
            Manage Users
          </a>
          <a
            href="/admin/verification"
            className="text-white bg-teal-600 hover:bg-brand-primary-500 px-4 py-2 rounded-lg shadow-sm text-center font-semibold transition"
          >
            Verify Workers
          </a>
        </div>
      </section>
    </main>
  );
}
