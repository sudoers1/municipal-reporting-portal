"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function ProfilePopup({ onClose }: { onClose: () => void }) {
  const { data: session } = authClient.useSession();
  const user = (session as any)?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    onClose();
    router.push("/");
  };

  return (
    <section className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg p-6 z-50 w-72">

      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ×
      </button>

      <section className="flex flex-col items-center gap-3">
<<<<<<< HEAD

        <img
          src={user?.image ?? "/default-avatar.png"}
          className="w-16 h-16 rounded-full"
          alt="Profile"
        />

        <h3 className="font-bold text-black text-lg">
          {user?.name}
        </h3>

        <p className="text-gray-500 text-sm">
          {user?.email}
        </p>

        <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">
          {user?.role}
        </span>

        {/* Worker Dashboard link */}
        {user?.role === "Worker" && (
          <Link
            href="/worker"
            className="w-full mt-2 px-4 py-2 rounded-xl text-center bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
          >
            View Worker Dashboard
          </Link>
        )}

        {/* Full profile */}
=======
        <img src={user?.image ?? "/default-avatar.png"} className="w-16 h-16 rounded-full" />
        <h3 className="font-bold text-black text-lg">{user?.name}</h3>
        <p className="text-gray-500 text-sm">{user?.email}</p>
        <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">{user?.role}</span>


        {/* Worker Dashboard link */}
          {user?.role?.toLowerCase() === "municipal worker" && (
          <Link
          href="/worker"
          className="w-full mt-2 px-4 py-2 rounded-xl text-center bg-green-500 text-white font-semibold hover:bg-green">

          View Worker Dashboard
          </Link>
        )
        }

        {/* Admin Dashboard link */}
          {user?.role?.toLowerCase() === "admin" && (
          <Link
          href="/admin"
          className="w-full mt-2 px-4 py-2 rounded-xl text-center bg-green-500 text-white font-semibold hover:bg-green">

          View Admin Dashboard
          </Link>
        )
        }


>>>>>>> bd756724904b6734082061f41dc5b0d4ddf44a95
        <Link
          href="/profilefull"
          className="w-full mt-2 px-4 py-2 rounded-xl text-center bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          View Full Profile
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-2 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>

      </section>
    </section>
  );
}