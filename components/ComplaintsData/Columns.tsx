"use client"

import { ColumnDef } from "@tanstack/react-table"
// import { Badge } from "@/components/ui/badge"

export type Complaint = {
    complainid: number
    muncipality: string
    status: boolean
    image: string
    issuetype: string
    details: string 
    creationtime: string
    userid: string
    user: string
}

export const columns: ColumnDef<Complaint>[] = [
    {
        accessorKey: "complainid",
        header: "ID"
    },
    {
        accessorKey: "muncipality",
        header: "Municipality"
    },
    {
        accessorKey: "status",
        header: "Status",
        // cell: ({ row }) => {
        //     const status = row.getValue("status") as boolean
        //     return(
        //         <Badge variant={status? "success" : "destructive"}>
        //             {status? "Resolved": "Pending"}
        //         </Badge>
        //     )
        // },
    },

]