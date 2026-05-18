"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Signup from "@/components/navcomponents/signup";

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showSignup, setShowSignup] = useState(false);

  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <article
        className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-96 relative p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-slate-700 text-xl font-bold hover:text-slate-900 transition"
          onClick={onClose}
        >
          ×
        </button>

        {!showSignup ? (
          <>
            <header>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center drop-shadow-sm">
                Login
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
                Continue with GitHub
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
                Continue with Google
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
                Continue with Discord
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
                Continue with Facebook
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
                Continue with LinkedIn
              </button>
            </main>

            <footer className="mt-6 text-center">
              <p className="text-sm text-slate-700">
                Don’t have an account?{" "}
                <button
                  className="text-teal-600 font-semibold hover:underline"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up
                </button>
              </p>
            </footer>
          </>
        ) : (
          <Signup onBack={() => setShowSignup(false)} />
        )}
      </article>
    </section>
  );
}
