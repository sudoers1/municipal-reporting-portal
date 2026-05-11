"use client"

import TaskAllocationForm from "@/components/Forms/TaskAllocationForm";
import CTable from "@/components/Tools/CompTable";
import React from "react";

interface TaskAllocationFormProps {
    complaint: any;
    onClose: () => void;
}

export default function ComplaintsPage({ complaint,onClose }: TaskAllocationFormProps){

    const [showModal, setShowModal] = React.useState(false);

    return(
        <>
        {/* <AdminLayout/> */}
        {/* <BackButton/> */}
        <main className="py-8 flex flex-col justify-center items-center gap-8">
            {/* <section className="flex justify-center relative">
                <button onClick={() => setShowModal(true)} className=" bg-brand-secondary text-white w-fit px-4 py-2 rounded-md">Allocate Tasks To Workers</button>
            </section> */}
            <section className="text-center flex flex-col gap-4">
                <h1 className="text-4xl font-medium">Municipal Issue Management</h1>
                <p className="text-lg">Review and manage incoming service requests by selecting a report from the table to assign it to a maintenance technician.</p>
            </section>
            <CTable/>
            {showModal && 
            <TaskAllocationForm
                complaint={complaint}
                onClose={() => setShowModal(false)}
            />}
        </main>
        </>
    )
}