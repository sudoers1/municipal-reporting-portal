"use client";

import Link from "next/link";
import { Lightbulb } from "lucide-react";

export default function TutorialButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-2xl shadow-brand-primary-500/40 transition hover:bg-brand-primary"
      aria-label="Help & Tutorial"
    >
      <Lightbulb className="h-7 w-7" />
    </Link>
  );
}
