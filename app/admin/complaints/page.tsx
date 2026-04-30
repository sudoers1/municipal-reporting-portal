import TaskAllocationForm from "@/components/Forms/TaskAllocationForm";
import BackButton from "@/components/Tools/BackButton";
import ComplaintsTable from "@/components/Tools/CompTable";
import SearchBar from "@/components/Tools/SearchBar";
import AdminLayout from "@/layouts/AdminLayout";
import React from "react";

export default function ComplaintsPage(){

    const [showModal, setShowModal] = React.useState(false);

    return(
        <>
        <AdminLayout/>
        <BackButton/>
        <main className="p-2 flex flex-col gap-8">
            <SearchBar/>
            <section className="flex justify-center relative">
                <button onClick={() => setShowModal(true)} className=" bg-gray-300 w-fit px-4 py-2 rounded-md">Allocate Tasks To Workers</button>
            </section>
            <ComplaintsTable/>
            {showModal && <TaskAllocationForm/>}
        </main>
        </>
    )
}