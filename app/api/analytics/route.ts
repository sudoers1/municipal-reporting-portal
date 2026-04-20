import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const viewer = session?.user?.id ? "authenticated" : "guest";

  return NextResponse.json({
    analytics: [], // or whatever placeholder/mock data you currently have
    viewer,
  });
}