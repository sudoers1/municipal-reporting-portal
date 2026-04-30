import {withAuth} from "@/lib/auth/server";
import {NextResponse} from "next/server";

export async function GET(req: Request){
    return withAuth(["Admin"], async (req: Request, session: any) => {
        

        return NextResponse.json({message: "Report created successfully"});
    })
}