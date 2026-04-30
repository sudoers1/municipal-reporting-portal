import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import {sql} from "@/lib/db/neon";


export const GET = withAuth(["Worker"], async (req: Request, session: any) => {
  // fetch assigned reports here

  return NextResponse.json({
    message: "Assigned reports fetched",
  });
});

export const POST = withAuth(["Worker"], async (req: Request, session: any) => {

  return NextResponse.json({
    message: "Report assignment updated",
  })
});