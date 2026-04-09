import Image from "next/image";

export default function Home() {
  return (
    <main className="relative h-screen w-screen">
      <Image
        src="/municipality.png"
        alt="Dashboard placeholder"
        fill
        className="object-cover brightness-75"
        priority
      />
    </main>
  );
}
