import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const GET = withAuth(["Worker", "Admin"], async (req: Request, session: any) => {
  // fetch report based on ID here

  return NextResponse.json({
    message: "Report fetched",
  });
});