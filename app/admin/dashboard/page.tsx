import KPICards from "@/components/Dashboard/KPIcard";
import { readComplaints } from "../../../lib/db/complaints";
import StatusAnalytics from "@/components/Dashboard/StatusLegend";
import { readAssignments } from "@/lib/db/assignments";

export default async function AdminDashboard(){

    const complaints = await readComplaints();
    const assignmentData = await readAssignments();

    return(
        <>
            <main className="p-4 flex flex-col gap-4">
                <h1 className="text-2xl text-center">Report Analytics</h1>
                <KPICards data={assignmentData}/>
                <h1 className="text-2xl text-center">Task & Worker Analytics</h1>
                <section className="">
                    {/* <MapView/> */}
                    <StatusAnalytics assignments={assignmentData}/>
                </section>
            </main>
        </>
    )
}