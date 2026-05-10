export default function ComplaintDetails(){
    return(
        <section className="bg-white max-w-90  h-fit p-4 m-auto flex flex-col items-center justify-center border border-gray-600 fixed inset-0">
            <section className="mb-4 flex justify-between items-center">
                <button  
                className="bg-red-600 text-white px-2 absolute top-2 right-4 border border-transparent rounded"
                > 
                    close
                </button>
            </section>
            <h1 className="font-semibold text-2xl pl-4">Complaint No.001</h1>
            <section className="p-4 flex flex-col gap-2">
                <p className="">Complaint Details...</p>
                <p className="">Complaint Details...</p>
                <p className="">Complaint Details...</p>
                <p className="">Complaint Details...</p>
                <p className="">Complaint Details...</p>
                <p className="">Complaint Details...</p>
            </section>
            <section className="flex justify-center">
                <button className=" bg-gray-300 px-4 py-2 m-2 rounded-md">Allocate Work</button>
            </section>
        </section>
    )
}