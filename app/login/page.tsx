"use client";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <div>
      <h1>Sign in test page</h1>
      <button
        onClick={() =>
          authClient.signIn.social({
            //REPLACE WITH YOUR PROVIDER
            provider: "facebook",
            callbackURL: "/dashboard",
          })
        }
      >
        Sign in with Facebook
      </button>
    </div>
  );
}
