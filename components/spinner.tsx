export default function Spinner({
  splash="",
}: {
  splash?:string;
}) {
  return (
    <section className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/10">
      <section className="w-10 h-10 border-4 border-gray-300 border-t-brand-secondary rounded-full animate-spin" />
      {splash !== "" && (
      <p className="text-white text-lg font-semibold">Loading {splash}...</p>)}
    </section>
  );
}