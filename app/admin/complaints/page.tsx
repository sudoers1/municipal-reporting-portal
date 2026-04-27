import ComplaintsTable from "@/components/Tools/CompTable";
import SearchBar from "@/components/Tools/SearchBar";
import AdminLayout from "@/layouts/AdminLayout";

export default function ComplaintsPage(){
    return(
        <>
        <AdminLayout/>
        <main>
            <SearchBar/>
            <ComplaintsTable/>
        </main>
        </>
    )
}