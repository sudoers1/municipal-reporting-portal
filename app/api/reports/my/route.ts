import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const GET = withAuth(["Resident"], async (req: Request, session: any) => {
  // fetch resident reports here

  return NextResponse.json({
    message: "Resident reports fetched",
  });
});