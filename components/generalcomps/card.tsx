export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="dashboard-card">
      <header className="mb-4 border-b border-white/10 pb-2">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
      </header>
      <section>{children}</section>
    </article>
  );
}
