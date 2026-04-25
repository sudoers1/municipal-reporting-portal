"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
    <aside className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg p-6 z-50 w-72">
      
      <button
        onClick={onClose}
        aria-label="Close profile popup"
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ×
      </button>

      <section className="flex flex-col items-center gap-3">
        
        <figure>
          <img
            src={user?.image ?? "/default-avatar.png"}
            alt={`${user?.name ?? "User"} avatar`}
            className="w-16 h-16 rounded-full"
          />
        </figure>

        <header className="text-center">
          <h2 className="font-bold text-black text-lg">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </header>

        <p className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">
          {user?.role}
        </p>

        <button
          onClick={handleLogout}
          className="w-full mt-2 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>

      </section>
    </aside>
  );
}