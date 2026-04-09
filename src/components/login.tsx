"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Signup from "@/components/signup";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <article className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-96">
        {!showSignup ? (
          <>
            <header>
              <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Login</h2>
            </header>
            <main className="flex flex-col gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
                onClick={() =>
                  authClient.signIn.social({
                    provider: "github",
                    callbackURL: "/dashboard",
                  })
                }
              >
                Continue with GitHub
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => console.log("Google login clicked")}
              >
                Continue with Google
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
                onClick={() => console.log("Microsoft login clicked")}
              >
                Continue with Microsoft
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => console.log("Facebook login clicked")}
              >
                Continue with Facebook
              </button>
              <button
                className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
                onClick={() => console.log("Twitter login clicked")}
              >
                Continue with Twitter
              </button>
            </main>
            <footer className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up
                </button>
              </p>
              <button
                className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                onClick={onClose}
              >
                Close
              </button>
            </footer>
          </>
        ) : (
          <Signup onBack={() => setShowSignup(false)} />
        )}
      </article>
    </section>
  );
}
