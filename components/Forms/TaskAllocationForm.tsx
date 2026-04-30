"use client"
import React from "react";

export default function TaskAllocationForm(){

    // const [showModal, setShowModal] = React.useState(false);

    // if(!showModal) return null;

    return(
        <main>
            <section className="bg-gray-50 w-fit h-fit p-4 m-auto flex flex-col justify-center items-center border border-gray-400 fixed inset-0">
                <h1 className="text-2xl">
                    Task Allocation Form
                </h1>
                <section className="w-100 p-4">
                    <form action="" className="flex flex-col gap-4">
                        <label htmlFor="" className="w-80 text-wrap">Preloaded information about the complaint will be loaded here</label>
                        <section className="bg-white"></section>
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
        </main>
    )
}