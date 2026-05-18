"use client"

import TaskAllocationForm from "@/components/Forms/TaskAllocationForm";
import CTable from "@/components/Tools/CompTable";
import React from "react";
import { useState } from "react";
import { Report } from "@/lib/structures/report";
import AdminComplaintsDetails from "@/components/AdminComplaints/AdminComplaintsDetails";


type ComplaintRow = ReturnType<Report["toPlainObject"]>;

export default function ComplaintsPage(){

    const [showModal, setShowModal] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] =useState<ComplaintRow | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshComplaints = () => {
    setRefreshKey(prev => prev + 1);
    }

    return(
        <main
      className="w-screen text-gray-800 min-h-[120vh] overflow-y-auto bg-cover bg-center bg-linear-to-br from-white via-teal-100 to-teal-300 bg-no-repeat">
            <section className="p-8 space-y-10  min-h-[120vh] flex flex-col">
                <header>
                    <section className="text-center flex flex-col gap-4">
                        <h1 className="text-4xl font-medium">Municipal Issue Management</h1>
                        <p className="text-lg">Review and manage incoming service requests by selecting a report from the table to assign it to a maintenance technician.</p>
                    </section>
                </header>
             {/* <AdminLayout/> */}
            {/* <BackButton/> */}
            {/* <section className="flex justify-center relative">
                <button onClick={() => setShowModal(true)} className=" bg-brand-secondary text-white w-fit px-4 py-2 rounded-md">Allocate Tasks To Workers</button>
            </section> */}
                

                
            <CTable setSelectedComplaint={setSelectedComplaint} refreshKey={refreshKey} />
                
            </section>
            {selectedComplaint && (
                <AdminComplaintsDetails
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                setShowModal={()=>{setShowModal(true)}}
                />
            )}

            {showModal && 
                <TaskAllocationForm
                    complaint={selectedComplaint}
                    onClose={() => {setShowModal(false);setSelectedComplaint(null)}}
                    onSuccess={()=>{refreshComplaints()}}
                />}
        </main>
    )
}