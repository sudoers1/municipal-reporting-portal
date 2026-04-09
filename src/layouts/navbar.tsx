"use client";

import { useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/login";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow dark:bg-black">
        <Link href="/" className="text-xl font-bold text-black dark:text-white hover:underline">
          Municipal Portal Project
        </Link>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          Login
        </button>
      </nav>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
