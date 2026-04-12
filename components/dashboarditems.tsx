"use client";

export default function DashboardItems() {
  return (
    <section id="dashboard" className="grow p-8 space-y-10">
      {/* Dashboard items */}
      <section className="flex flex-row justify-center gap-6">
        {["Potholes", "Illegal Dumping", "Burst Pipes", "Stolen Cables"].map(
          (heading) => (
            <article
              key={heading}
              className="bg-brand-accent hover:bg-brand-primary text-black hover:text-white rounded-lg shadow-lg w-48 h-80 flex items-center justify-center text-xl font-semibold transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              {heading}
            </article>
          )
        )}
      </section>
    </section>
  );
}
