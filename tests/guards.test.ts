import { requireRole } from "@/lib/guards/route";

describe("requireRole", () => {
  test("throws when session is null", () => {
    expect(() => requireRole(null, ["Admin"])).toThrow("Forbidden");
  });

  test("throws when session is undefined", () => {
    expect(() => requireRole(undefined, ["Admin"])).toThrow("Forbidden");
  });

  test("throws when user role is not in allowed roles", () => {
    const session = { user: { role: "Worker" } };
    expect(() => requireRole(session, ["Admin"])).toThrow("Forbidden");
  });

  test("does not throw when user role matches single allowed role", () => {
    const session = { user: { role: "Admin" } };
    expect(() => requireRole(session, ["Admin"])).not.toThrow();
  });

  test("does not throw when user role is one of multiple allowed roles", () => {
    const session = { user: { role: "Worker" } };
    expect(() => requireRole(session, ["Admin", "Worker"])).not.toThrow();
  });

  test("throws when allowed roles array is empty", () => {
    const session = { user: { role: "Admin" } };
    expect(() => requireRole(session, [])).toThrow("Forbidden");
  });
});