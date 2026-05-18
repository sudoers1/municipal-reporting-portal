"use client";

import { authClient } from "@/lib/auth-client";

export default function Signup({ onBack }: { onBack: () => void }) {
  return (
    <section>
      <header>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center drop-shadow-sm">
          Sign Up
        </h2>
      </header>

      <main className="flex flex-col gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold shadow hover:bg-gray-900 transition"
          onClick={() =>
            authClient.signIn.social({
              provider: "github",
              callbackURL: "/dashboard",
            })
          }
        >
          Sign up with GitHub
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            })
          }
        >
          Sign up with Google
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          onClick={() =>
            authClient.signIn.social({
              provider: "discord",
              callbackURL: "/dashboard",
            })
          }
        >
          Sign up with Discord
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() =>
            authClient.signIn.social({
              provider: "facebook",
              callbackURL: "/dashboard",
            })
          }
        >
          Sign up with Facebook
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition"
          onClick={() =>
            authClient.signIn.social({
              provider: "linkedin",
              callbackURL: "/dashboard",
            })
          }
        >
          Sign up with LinkedIn
        </button>
      </main>

      <footer className="mt-6 text-center">
        <p className="text-sm text-slate-700">
          Already have an account?{" "}
          <button
            className="text-teal-600 font-semibold hover:underline"
            onClick={onBack}
          >
            Login
          </button>
        </p>
      </footer>
    </section>
  );
}
