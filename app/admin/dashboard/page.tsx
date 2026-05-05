import KPICards from "@/components/Dashboard/KPIcard";
import StatusLegend from "@/components/Dashboard/StatusLegend";
import MapView from "@/components/Map/MapView";
import BackButton from "@/components/Tools/BackButton";
import SearchBar from "@/components/Tools/SearchBar";
import AdminLayout from "@/layouts/AdminLayout";
import { readComplaints } from "../../../lib/db/complaints";

export default async function AdminDashboard(){

    const complaints = await readComplaints();

    return(
        <>
            <AdminLayout/>
            <section className="p-4 grid grid-cols-4">
                <section>
                    <BackButton/>
                </section>
                <section className="col-span-2">
                    <SearchBar/>
                </section>
            </section>
            <main>
                <KPICards data={complaints}/>
                <section className="p-4 grid grid-cols-2 gap-8">
                    <MapView/>
                    <StatusLegend/>
                </section>
            </main>
        </>
    )
}