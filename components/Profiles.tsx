export default function Profiles(){
    return(
        <section className="border w-100 p-4 relative">
            <button className="absolute top-2 right-4 ">X</button>
            <div className="py-4 flex flex-col justify-center items-center gap-2">
                <div className="bg-gray-400 w-24 h-24 border-2 border-gray-600 rounded-full"></div>
                <h2>Admin Name</h2>
            </div>
            <section className="flex flex-col justify-center items-center gap-2">
                <p>admin@email.address</p>
                <p>admin phone number</p>
                <p>Muncipality - District - Ward</p>
            </section>
            <section className="py-4 flex flex-col justify-center items-center gap-4">
                <h3 className="bg-gray-200 text-center w-24 h-8 flex justify-center items-center rounded-2xl">Admin</h3>
                <button className="bg-gray-200 text-center w-24 h-8 flex justify-center items-center rounded-md"><a href="">Logout</a></button>
            </section>
            
        </section>
    )
        
    
}