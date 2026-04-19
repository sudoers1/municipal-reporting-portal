import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/guards/route";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requireRole(session, ["Resident"]);
    } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

  return NextResponse.json({ message: "Resident endpoint ready" });
}