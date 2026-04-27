"use client";

import { authClient } from "@/lib/auth-client";

export default function TestPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}