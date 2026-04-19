"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoginModal from "@/components/login";
import toast from "react-hot-toast";
import Hamburger from "@/components/hamburgerMenu";

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

  // Temporary handler for unfinished pages
  const handleNotReady = (page: string) => {
    toast(`${page} page doesn’t exist yet`);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-brand-primary shadow">
     
        <Link
          href={session ? "/dashboard" : "/"}
          className="text-xl text-white font-bold text-foreground hover:underline"
        >
          Municipal Portal Project
        </Link>


        <div className="flex items-center gap-6 text-white">

            <Hamburger/>

            <section className="flex gap-4 navContainer max-sm:hidden">
                <Link
              href={session ? "/dashboard" : "/"}
              className="hover:underline"
            >
              Dashboard
            </Link>

            <Link
              href={"/reports"}
              className="hover:underline"
            >
              Reports
            </Link>

            <button
              onClick={() => handleNotReady("About")}
              className="hover:underline"
            >
              About
            </button>

            <button
              onClick={() => handleNotReady("Contact")}
              className="hover:underline"
            >
              Contact
            </button>
            </section>



          {session ? (
            <button
              className="px-4 py-2 rounded bg-brand-accent text-black hover:bg-brand-primary hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded bg-brand-accent text-black hover:bg-brand-primary hover:text-white"
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
