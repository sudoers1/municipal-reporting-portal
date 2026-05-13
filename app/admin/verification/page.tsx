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
        <main className="text-center m-4">
            <h1 className="text-5xl  pb-4">User Verification</h1>
            <p className="text-xl">Review user applications to become workers on the system</p>

            <section >
                <PendingVerificationsTable initialRequests={requests} />

                <ApprovedVerificationsTable initialRequests={approvedData}/>

                <DeniedVerificationsTable initialRequests={deniedData}/>
            </section>
        </main>
    )
}