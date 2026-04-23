export default function AdminLayout(){
    return(
        <>
        <header className="bg-gray-400 p-2 flex justify-between relative">
            <div className="text-2xl flex justify-center align-items ">Muncipal Portal Project</div>
            <section>
                <div className="bg-gray-300 border-2 border-gray-600 w-8 h-8 rounded-4xl"></div>
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