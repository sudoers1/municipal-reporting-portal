"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoginModal from "@/components/login";
import toast from "react-hot-toast";
import Hamburger from "@/components/hamburgerMenu";
import ProfilePopup from "@/components/profile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = authClient.useSession();
  const user = (session as any)?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleLogin = () => {
    setIsOpen(true);
  };

  const handleNotReady = (page: string) => {
    toast(`${page} page doesn't exist yet`);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-brand-primary shadow">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl text-white font-bold text-foreground hover:underline"
        >
          Municipal Portal Project
        </Link>

        <div className="flex items-center gap-6 text-white">
          <Hamburger />

          <section className="flex gap-4 navContainer max-sm:hidden">
            <Link href={user ? "/dashboard" : "/"} className="hover:underline">
              Dashboard
            </Link>

            <Link href="/reports" className="hover:underline">
              Reports
            </Link>

            <button onClick={() => handleNotReady("About")} className="hover:underline">
              About
            </button>

            <button onClick={() => handleNotReady("Contact")} className="hover:underline">
              Contact
            </button>
          </section>

          {user ? (
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)}>
                <img
                  src={user?.image ?? "/default-avatar.png"}
                  className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-white"
                />
              </button>

              {showProfile && (
                <ProfilePopup onClose={() => setShowProfile(false)} />
              )}
            </div>
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