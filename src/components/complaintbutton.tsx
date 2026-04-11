"use client";

import toast from "react-hot-toast";

export default function ComplaintButton() {
  const handleClick = () => {
    // Temporary until the complaints page is built
    toast("Complaints page doesn’t exist yet");
  };

  return (
    <footer className="p-8 flex justify-center">
      <button
        onClick={handleClick}
        className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
      >
        Log a Complaint
      </button>
    </footer>
  );
}
