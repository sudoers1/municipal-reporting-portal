export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg text-white border border-white/10">
      <header className="mb-4 border-b border-white/10 pb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
      </header>

      <section>{children}</section>
    </article>
  );
}