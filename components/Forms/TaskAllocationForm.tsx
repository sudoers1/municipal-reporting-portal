"use client"
import React from "react";

interface TaskAllocationFormProps {
    complaint: any;
    onClose: () => void;
}

export default function TaskAllocationForm({ complaint,onClose }: TaskAllocationFormProps){

    // const [showModal, setShowModal] = React.useState(false);

    // if(!showModal) return null;

    return(
        <section className="bg-gray-50 w-fit h-100 p-4 m-auto flex flex-col justify-center items-center border border-gray-400 fixed inset-0">
            {/* <section className="mb-4 flex justify-between items-center">
                <button  
                className="bg-red-600 text-white px-2 absolute top-2 right-4 border border-transparent rounded"
                > 
                    close
                </button>
            </section> */}
            
            <header>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
                    aria-label="Close dialog"
                >
                    ×
                </button>
                <h1 className="text-2xl">
                    Task Allocation Form
                </h1>
            </header>
            <section className="flex-1 overflow-y-auto">
                <section className="w-100 p-4">
                <form action="" className="flex flex-col gap-4">
                    <section className="bg-gray-100 p-2">
                        {complaint ? (
                                <>
                                    <p><strong>Municipality:</strong> {complaint.municipality}</p>
                                    <p><strong>Issue:</strong> {complaint.issuetype}</p>
                                    <p><strong>Status:</strong> {complaint.status ? "Completed" : "Pending"}</p>
                                    <p className="mt-1"><strong>Description:</strong> {complaint.details}</p>
                                </>
                            ) : (
                                <p>Loading complaint data...</p>
                            )}
                    </section>
                    <label htmlFor="">Employee Name</label>
                    <select name="Employee" id="" className="p-2 border  border-gray-400">
                        <option value="">John Langeveld</option>
                    </select>
                    <label htmlFor="">Department</label>
                    <select name="" id="" className="p-2 border  border-gray-400">
                        <option value="">Water & Sanitation</option>
                        <option value="">Electricity</option>
                        <option value="">Waste Management</option>
                        <option value="">Roads & Transport</option>
                        <option value="">Infrastructure & Engineering Services</option>
                        <option value="">Environmental Management</option>
                        <option value="">Human Settelments</option>
                        <option value="">Disaster Management</option>
                    </select>
                    <label htmlFor="">Priortiy Level</label>
                    <select name="" id="" className="p-2 border  border-gray-400">
                        <option value="">Priortiy Level</option>
                        <option value="">Low</option>
                        <option value="">Medium</option>
                        <option value="">High</option>
                    </select>
                    <label htmlFor="">Completion Deadline</label>
                    <input type="date" className="p-2 border  border-gray-400"/>
                    <label htmlFor="">Notes</label>
                    <textarea name="" id="" rows={2} className="p-2 border  border-gray-400"></textarea>
                    <section className="flex justify-center-safe item">
                        <button type="submit" className="bg-gray-400 w-24 px-2 py-1 rounded-md">Allocate</button>

                    </section>
                </form>
            </section>
            </section>
            
        </section>
        
    )
}