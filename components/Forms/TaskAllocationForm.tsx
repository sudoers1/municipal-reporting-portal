"use client"
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TaskAllocationFormProps {
    complaint: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TaskAllocationForm({ complaint,onClose,onSuccess }: TaskAllocationFormProps){

    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [priority, setPriority] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/workers");
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

        if (!selectedEmployee || !priority) {
            console.error("Missing required fields");
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    complaintid: complaint.complaintid,
                    workerid: selectedEmployee,
                    priority: parseInt(priority),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            toast.success("Assignment created");
            onSuccess();
            onClose();

        } catch (error) {
            toast.error("Allocation failed:");
        } finally {
            setIsSubmitting(false);
        }
    };



    return(
    <section
        className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-60"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <article
          className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden relative p-8
            ${complaint.image ? "min-w-[60%] md:max-w-4xl" : "md:max-w-lg" }
          `}  onClick={(e) => e.stopPropagation()}
        >
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
                <section className="flex-1 overflow-y-auto ">
                    <section className="w-100 p-4">
                    <form
                    onSubmit={handleAllocate}
                    className="flex flex-col gap-4"
                    >
                        <section className="border-[2px] rounded-xl mt-2 border-brand-secondary p-2 bg-white/80">
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
                            className="border-[2px] rounded-xl border-brand-secondary p-2 bg-white/80"
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
                        <label htmlFor="">Priority Level</label>
                        <select name="" id="" className="border-[2px] rounded-xl border-brand-secondary p-2 bg-white/80"
                           value={priority}
                            onChange={(e) => setPriority(e.target.value)} >
                            <option value="">Priority Level</option>
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                            <option value="3">Critical</option>
                        </select>
                        {/*
                        <label htmlFor="">Completion Deadline</label>
                        
                        <input type="date" className="border-[2px] rounded-xl mt-2 border-brand-secondary p-2 bg-white/80"/>
                         <label htmlFor="">Notes</label>
                        <textarea name="" id="" rows={2} className="p-2 border  border-gray-400"></textarea> */}
                        <section className="flex justify-center-safe item">
                            <button
                            type="submit"
                            disabled={!selectedEmployee||!priority||isSubmitting}
                            className="bg-brand-secondary text-white w-24 px-2 py-1 rounded-md disabled:bg-gray-500"
                            >
                            Allocate
                            </button>

                        </section>
                    </form>
                </section>
                </section>
                
            </article>
            </section>
                
        
    )
}