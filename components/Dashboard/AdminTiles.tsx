export default function Tiles(){
    return(
        <main className="py-12 flex text-gray-800 items-center gap-8 max-sm:flex-col">
            <a href="/admin/dashboard" className="bg-linear-to-br from-white to-teal-100  text-2xl w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-2xl shadow-2xl">
                <h1  className="font-semibold text-3xl text-center">Analytics</h1>
                <p className="text-sm text-center">View high-level analytics and real-time operational insights to monitor the status of all ongoing municipal tasks.</p>
            </a>
            <a href="/admin/complaints" className="bg-linear-to-br from-white to-teal-100  text-2xl w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-2xl shadow-2xl">
                <h1  className="font-semibold text-3xl">Complaints</h1>
                <p className="text-sm text-center">Access the full registry of citizen reports to review details, update progress, and assign issues to the appropriate personnel.</p>
            </a>
            <section className="bg-linear-to-br from-white to-teal-100  text-2xl w-64 h-fit p-4 flex flex-col justify-center items-center gap-2 rounded-2xl shadow-2xl"> 
                <h2 className="font-semibold text-3xl">Manage</h2>
                <p className="text-sm">Oversee your team by managing system users and field workers to ensure resources are effectively distributed across all active projects.</p>
                <button className="text-white bg-brand-secondary px-4 py-1 rounded-lg shadow-sm"><a href="/admin/usermanagement">Manage Users</a></button>
                <button className="text-white bg-brand-secondary px-4 py-1 rounded-lg shadow-sm"><a href="/admin/verification">Verify Workers</a></button>
            </section>
        </main>
    )
}