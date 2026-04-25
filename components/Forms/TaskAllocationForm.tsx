"use client"
import React from "react";

export default function TaskAllocationForm(){

    // const [showModal, setShowModal] = React.useState(false);

    // if(!showModal) return null;

    return(
        <main>
            <section className="bg-gray-50 p-4 flex flex-col justify-center items-center border border-gray-400">
                <h1 className="text-2xl">
                    Task Allocation Form
                </h1>
                <section className="w-100 p-4">
                    <form action="" className="flex flex-col gap-4">
                        <label htmlFor="" className="w-80 text-wrap">Preloaded information about the complaint will be loaded here</label>
                        <section className="bg-white"></section>
                        <select name="Employee" id="" className="p-2 border  border-gray-400">
                            <option value="">Employee Name</option>
                        </select>
                        <select name="" id="" className="p-2 border  border-gray-400">
                            <option value="">Department</option>
                        </select>
                        <select name="" id="" className="p-2 border  border-gray-400">
                            <option value="">Priortiy Level</option>
                            <option value="">Low</option>
                            <option value="">Medium</option>
                            <option value="">High</option>
                        </select>
                        <label htmlFor="">Completion Deadline</label>
                        <input type="date" className="p-2 border  border-gray-400"/>
                        <label htmlFor="">Notes</label>
                        <textarea name="" id="" rows={4} className="p-2 border  border-gray-400"></textarea>
                        <section className="flex justify-center-safe item">
                            <button type="submit" className="bg-gray-400 w-24 px-2 py-1 rounded-md">Allocate</button>

                        </section>
                    </form>
                </section>
            </section>
        </main>
    )
}