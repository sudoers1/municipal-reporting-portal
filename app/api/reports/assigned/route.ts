import { withAuth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const GET = withAuth(["Worker"], async (req: Request, session: any) => {
  // fetch assigned reports here

  return NextResponse.json({
    message: "Assigned reports fetched",
  });
});