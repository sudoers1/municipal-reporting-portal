"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LoginModal from "@/components/navcomponents/login";
import toast from "react-hot-toast";
import Hamburger from "@/components/navcomponents/hamburgerMenu";
import ProfilePopup from "@/components/navcomponents/profile";
import { NotificationBell } from "@/components/navcomponents/notificationBell";
import type { Notification } from "@/lib/notifications/client";

export default function Navbar({ initialNotifications = [] }: { initialNotifications?: Notification[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session, isPending } = authClient.useSession();
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
      <nav className="w-full flex items-center justify-between px-6 py-2 z-60 bg-brand-primary shadow">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 text-xl font-bold text-foreground hover:underline"
        >
          <Image src="/favicon.ico" alt="Portal logo" width={28} height={28} className="rounded-sm" />
          <span>Municipal Portal Project</span>
        </Link>
        <section className="flex items-center gap-6 text-white">
          <Hamburger />
          <section className="flex gap-4 navContainer max-sm:hidden">
            <Link href={user ? "/dashboard" : "/"} className="hover:underline">
              Dashboard
            </Link>
            <Link href="/reports" className="hover:underline">
              Reports
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </section>
          {user ? (
            <>
              <NotificationBell initialNotifications={initialNotifications} />
              <figure className="relative m-0">
                <button onClick={() => setShowProfile(!showProfile)}>
                  <img
                    src={user?.image ?? "/default-avatar.png"}
                    className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-white"
                  />
                </button>
                {showProfile && (
                  <ProfilePopup onClose={() => setShowProfile(false)} />
                )}
              </figure>
            </>
          ) : !isPending ? (
            <button
              className="px-4 py-2 rounded bg-brand-accent text-black hover:bg-brand-primary hover:text-white"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : null}
        </section>
      </nav>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}