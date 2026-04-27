export function requireRole(session: any, roles: string[]) {
  if (!session || !roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
}