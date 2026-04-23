export default function Tiles(){
    return(
        <main className="py-12 flex gap-8">
            <section className="bg-gray-400 text-2xl w-64 h-64 flex justify-center items-center rounded-md shadow-2xl"> Dashboard</section>
            <section className="bg-gray-400 text-2xl w-64 h-64 flex justify-center items-center rounded-md shadow-2xl"> Complaints</section>
            <section className="bg-gray-400 text-2xl w-64 h-64 flex flex-col justify-center items-center gap-4 rounded-md shadow-2xl"> 
                <h2>Manage</h2>
                <button className="bg-gray-500 px-4 py-1 rounded-md shadow-sm"><a href="">Users</a></button>
                <button className="bg-gray-500 px-4 py-1 rounded-md shadow-sm"><a href="">workers</a></button>
            </section>
        </main>
    )
}