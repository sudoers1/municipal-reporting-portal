"use client";

import { authClient } from "@/lib/auth-client";



export default function LoginButton() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "linkedin",
    });
  };

  return (
    <button onClick={handleLogin} className="text-4xl font-light px-4 py-2 bg-blue-600 text-white rounded-lg border">
      Continue with LinkedIn
    </button>
  );
}