import KPICards from "@/components/Dashboard/KPIcard";
import { readComplaints } from "../../../lib/db/complaints";
import StatusAnalytics from "@/components/Dashboard/StatusLegend";
import { readAssignments } from "@/lib/db/assignments";

export default async function AdminDashboard(){

    const complaints = await readComplaints();
    const assignmentData = await readAssignments();

    return(
        <>
            <main className="text-center p-4 flex flex-col gap-4">
                <h1 className="text-5xl font-semibold p-4">Administrative Dashboard</h1>
                <h2 className="text-3xl font-medium">Report Analytics</h2>
                <p className="text-xl">Overview of all submitted complaints categorized by their current status to ensure timely response and resolution.</p>
                <section className="py-4">
                    <KPICards data={assignmentData}/>
                </section>
                <h2 className="text-3xl font-medium">Task & Worker Analytics</h2>
                <p className="text-xl">Assess team productivity and resolution progress to optimize the dispatching of workers to active maintenance sites.</p>
                <section className="py-4">
                    {/* <MapView/> */}
                    <StatusAnalytics assignments={assignmentData}/>
                </section>
            </main>
        </>
    )
}