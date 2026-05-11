export default function Tiles(){
    return(
        <main className="py-12 flex items-center gap-8 max-sm:flex-col">
            <a href="/admin/dashboard" className="bg-brand-secondary/50 text-2xl w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-md shadow-2xl">
                <h1  className="font-semibold text-3xl">Dashboard</h1>
                <p className="text-sm">View high-level analytics and real-time operational insights to monitor the status of all ongoing municipal tasks.</p>
            </a>
            <a href="/admin/complaints" className="bg-brand-secondary/50 text-2xl w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-md shadow-2xl">
                <h1  className="font-semibold text-3xl">Complaints</h1>
                <p className="text-sm">Access the full registry of citizen reports to review details, update progress, and assign issues to the appropriate personnel.</p>
            </a>
            <section className="bg-brand-secondary/50 text-2xl w-64 h-fit p-4 flex flex-col justify-center items-center gap-4 rounded-md shadow-2xl"> 
                <h2 className="font-semibold text-3xl">Manage</h2>
                <p className="text-sm">Oversee your team by managing system users and field workers to ensure resources are effectively distributed across all active projects.</p>
                <button className="bg-brand-secondary/50 px-4 py-1 rounded-md shadow-sm"><a href="/admin/usermanagement">Users</a></button>
                <button className="bg-brand-secondary/50 px-4 py-1 rounded-md shadow-sm"><a href="">workers</a></button>
            </section>
        </main>
    )
}