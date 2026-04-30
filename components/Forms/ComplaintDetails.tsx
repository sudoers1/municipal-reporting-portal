export default function ComplaintDetails(){
    return(
        <section className="bg-white w-fit h-fit p-4 m-auto flex flex-col items-center justify-center border border-gray-600 fixed inset-0">
            <h1 className="font-semibold text-2xl text-center p-2">Complaint No.001</h1>
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