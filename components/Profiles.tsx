import React from "react";

export default function Profiles(){

    const [showModal, setShowModal] = React.useState(true);

    if(!showModal) return null;

    return(
        <section className="bg-gray-100 absolute top-full right-4 shadow-xl z-50">
            <section className="border w-100 p-4 relative">
                <button 
                    onClick={() => setShowModal(false)} 
                    className="bg-red-600 text-white px-2 absolute top-2 right-4 border border-transparent rounded"
                >
                    Close
                </button>
                <section className="py-4 flex flex-col justify-center items-center gap-2">
                    <section className="bg-gray-400 w-24 h-24 border-2 border-gray-600 rounded-full"></section>
                    <h2>Admin Name</h2>
                </section>
                <section className="flex flex-col justify-center items-center gap-2">
                    <p>admin@email.address</p>
                    <p>admin phone number</p>
                    <p>Muncipality - District - Ward</p>
                </section>
                <section className="py-4 flex flex-col justify-center items-center gap-4">
                    <h3 className="bg-gray-200 text-center w-24 h-8 flex justify-center items-center rounded-2xl">Admin</h3>
                    <button  className="bg-gray-200 text-center w-24 h-8 flex justify-center items-center rounded-md"><a href="">Logout</a></button>
                </section>
            </section>
        </section>
    )
        
    
}