import { columns } from "../ComplaintsData/Columns";
import { DataTable } from "../ComplaintsData/DataTable";

export default function ComplaintsTable(){
    const data = await ;
    return(
       <section>
            <h1>Municipal Complaints</h1>
            <DataTable columns={columns} data={data}/>
       </section>
    )
}