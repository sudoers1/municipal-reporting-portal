"use client"
import React, { useEffect, useState } from "react";

interface TaskAllocationFormProps {
    complaint: any;
    onClose: () => void;
}

export default function TaskAllocationForm({ complaint,onClose }: TaskAllocationFormProps){

    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/workers");
                console.log(response);
                const data = await response.json();

                setEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleAllocate = async (
        e: React.FormEvent<HTMLFormElement>
        ) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/assignments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                complaintid: complaint.complaintid,
                workerid: selectedEmployee,
            }),
            });

            const data = await response.json();

            if (!response.ok) {
            console.error(data.error);
            return;
            }

            console.log("Assignment created:", data);

            onClose();

        } catch (error) {
            console.error("Allocation failed:", error);
        }
        };



    return(
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <section className="bg-white w-fit h-125 p-4 shadow-xl rounded-2xl flex flex-col border border-gray-200 relative">
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
                    <form
                    onSubmit={handleAllocate}
                    className="flex flex-col gap-4"
                    >
                        <section className="bg-brand-secondary/30 p-2">
                            {complaint ? (
                                    <>
                                        <p><strong>Complaint ID:</strong> {complaint.complaintid}</p>
                                        <p><strong>Municipality:</strong> {complaint.municipality}</p>
                                        <p><strong>Issue:</strong> {complaint.issuetype}</p>
                                        <p><strong>Status:</strong> {complaint.status}</p>
                                        <p className="mt-1"><strong>Description:</strong> {complaint.details}</p>
                                    </>
                                ) : (
                                    <p>Loading complaint data...</p>
                                )}
                        </section>
                        <label htmlFor="">Employee Name</label>
                        <select
                            name="Employee"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="p-2 border border-gray-400"
                        >
                            <option value="">Select employee</option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                        {/* <label htmlFor="">Department</label>
                        <select name="" id="" className="p-2 border  border-gray-400">
                            <option value="">Water & Sanitation</option>
                            <option value="">Electricity</option>
                            <option value="">Waste Management</option>
                            <option value="">Roads & Transport</option>
                            <option value="">Infrastructure & Engineering Services</option>
                            <option value="">Environmental Management</option>
                            <option value="">Human Settelments</option>
                            <option value="">Disaster Management</option>
                        </select> */}
                        <label htmlFor="">Priortiy Level</label>
                        <select name="" id="" className="p-2 border  border-gray-400">
                            <option value="">Priortiy Level</option>
                            <option value="">Low</option>
                            <option value="">Medium</option>
                            <option value="">High</option>
                        </select>
                        <label htmlFor="">Completion Deadline</label>
                        <input type="date" className="p-2 border  border-gray-400"/>
                        {/* <label htmlFor="">Notes</label>
                        <textarea name="" id="" rows={2} className="p-2 border  border-gray-400"></textarea> */}
                        <section className="flex justify-center-safe item">
                            <button
                            type="submit"
                            disabled={!selectedEmployee}
                            className="bg-brand-secondary text-white w-24 px-2 py-1 rounded-md disabled:opacity-50"
                            >
                            Allocate
                            </button>

                        </section>
                    </form>
                </section>
                </section>
            </section>
                
        </section>
        
    )
}