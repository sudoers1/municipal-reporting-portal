import { readComplaints } from "@/lib/db/complaints";
import ComplaintsTable from "@/components/complaintsTable";

export default async function Reports() {
  
  const complaints = await readComplaints();

  return (
    <main
      className="w-screen min-h-[120vh] overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 space-y-10 md:bg-black/50 min-h-[120vh] flex flex-col">
        
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            View All Reports
          </h1>
        </header>

        

        <figure className="flex md:justify-center">
          <ComplaintsTable complaints={complaints} />
        </figure>
        

      </section>
    </main>
  );
}