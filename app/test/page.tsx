"use client";

import { authClient } from "@/lib/auth-client";

export default function TestPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <section>Loading...</section>;

  return (
    <section>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}