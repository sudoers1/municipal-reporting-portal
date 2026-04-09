"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoginModal from "@/components/login";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<unknown | null>(null);
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then((res) => {
      setSession(res?.data?.session ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setSession(null);       
    router.push("/");      
  };

  const handleLogin = () => {
    setIsOpen(true);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow dark:bg-black">
        <Link
          href="/"
          className="text-xl font-bold text-black dark:text-white hover:underline"
        >
          Municipal Portal Project
        </Link>
        {session ? (
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </nav>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
