import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // adjust to your setup
import { setUserRole } from "@/lib/db/users";  // your DB 
import { requireRole } from "@/lib/guards/route"; // your RBAC guard
// function

export async function POST(req: Request) {
 const session = await auth.api.getSession({
    headers: req.headers,
    });

  // 1. Auth check
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. RBAC check (critical)
    try {
        requireRole(session, ["Admin"]);
    } catch {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

  // 3. Validate input
  const { userId, role } = await req.json();

  const validRoles = ["Resident", "Worker", "Admin"];
  if (!userId || !validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 4. Apply change
  await setUserRole(userId, role);

  return NextResponse.json({ success: true });
}
