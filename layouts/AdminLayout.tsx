import Profiles from "@/components/Profiles";
import React from "react";

export default function AdminLayout(){

    const [showModal, setShowModal] = React.useState(false);

    

    return(
        <>
        <header className="bg-gray-400 p-2 flex justify-between relative">
            <section className="text-2xl flex justify-center align-items ">Muncipal Portal Project</section>
            <section>
                <section 
                    onClick={()=> setShowModal(true)} 
                    className="bg-gray-300 border-2 border-gray-600 w-8 h-8 rounded-4xl"
                >
                </section>
                {showModal && <Profiles/>}
            </section>
        </header>
        <main>
            {/* all the main content will go in here */}
        </main>
        <footer className="bg-gray-400 w-full h-8 p-2 flex flex-col justify-center items-center fixed bottom-0 ">
            © 2026 sudoers1. All rights reserved.
        </footer>
        </>
    )
}