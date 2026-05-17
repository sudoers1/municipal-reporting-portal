import ApprovedVerificationsTable from "@/components/UserVerification/ApprovedTable";
import PendingVerificationsTable from "@/components/UserVerification/PendingTable";
import DeniedVerificationsTable from "@/components/UserVerification/RejectedTable";
import { approveVerification, readApprovedVerifications, readDeniedVerifications, readPendingVerifications, rejectVerification } from "@/lib/db/verifications";

export default async function Verification(){

    const userID = "";

    const handleApprove = async () => {
        await approveVerification(userID)
    }

    const handleReject = async () => {
        await rejectVerification(userID)
    }

    const requests = await readPendingVerifications();
    const approvedData = await readApprovedVerifications();
    const deniedData = await readDeniedVerifications();

    return(
        <main className="w-screen text-gray-800 min-h-screen overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300">
            <section className="p-8 space-y-10 min-h-screen">
            <header>
                <h1 className="text-3xl py-2 md:text-5xl font-bold z-10 text-center drop-shadow-md">User Verification</h1>
                <p className="text-lg md:text-xl py-2 z-10 text-center">Review user applications to become workers on the system</p>
            </header>
            <article className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5">
                <section className="flex flex-col z-30 gap-3">
                    <PendingVerificationsTable initialRequests={requests} />

                    <ApprovedVerificationsTable initialRequests={approvedData}/>

                    <DeniedVerificationsTable initialRequests={deniedData}/>
                </section>
            </article>
            </section>
        </main>
    )
}