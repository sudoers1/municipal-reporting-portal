"use client";

import { authClient } from "@/lib/auth-client";

export default function Signup({ onBack }: { onBack: () => void }) {
  return (
    <section>
      <header>
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Sign Up
        </h2>
      </header>
      <main className="flex flex-col gap-3">
        <button
          className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          onClick={() =>
            authClient.signIn.social({
              provider: "github",
              callbackURL: "/api/auth/callback/github",
            })
          }
        >
          Sign up with GitHub
        </button>

        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "/api/auth/callback/google",
            })
          }
        >
          Sign up with Google
        </button>

        <button
          className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
          onClick={() =>
            authClient.signIn.social({
              provider: "discord",
              callbackURL: "/api/auth/callback/discord",
            })
          }
        >
          Sign up with Discord
        </button>

        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() =>
            authClient.signIn.social({
              provider: "facebook",
              callbackURL: "/api/auth/callback/facebook",
            })
          }
        >
          Sign up with Facebook
        </button>

        <button
          className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
          onClick={() =>
            authClient.signIn.social({
              provider: "linkedin",
              callbackURL: "/api/auth/callback/linkedin",
            })
          }
        >
          Sign up with LinkedIn
        </button>
      </main>
      <footer className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button className="text-blue-600 hover:underline" onClick={onBack}>
            Login
          </button>
        </p>
      </footer>
    </section>
  );
}
