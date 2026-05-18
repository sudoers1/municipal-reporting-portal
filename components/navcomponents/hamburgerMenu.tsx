import { useState } from "react";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <section className="flex flex-col items-end relative">
      {/* Hamburger Icon */}
      <img
        src="/menu-outline.svg"
        alt="Menu icon"
        className="w-8 cursor-pointer sm:hidden"
        onClick={handleMenu}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="text-slate-900 bg-white/30 backdrop-blur-md border border-slate-200 w-48 p-4 mt-2 flex flex-col gap-2 absolute top-full right-0 shadow-lg rounded-xl z-50 sm:hidden">
          <li>
            <a
              href="/dashboard"
              className="block px-2 py-1 rounded-md hover:bg-teal-100 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/reports"
              className="block px-2 py-1 rounded-md hover:bg-teal-100 transition"
            >
              Reports
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="block px-2 py-1 rounded-md hover:bg-teal-100 transition"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="block px-2 py-1 rounded-md hover:bg-teal-100 transition"
            >
              Contact
            </a>
          </li>
        </ul>
      )}
    </section>
  );
}
