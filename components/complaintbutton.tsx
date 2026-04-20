"use client";

export default function ComplaintButton({ onClick, showComplaints }: { onClick: () => void; showComplaints: boolean }) {
  return (
    <footer className="p-8 flex justify-center">
      <button
        onClick={onClick}
        className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
      >
        {showComplaints ? "Close Complaint Form" : "Log a Complaint"}
      </button>
    </footer>
  );
}

