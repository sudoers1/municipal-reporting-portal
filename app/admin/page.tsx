import Tiles from "@/components/Dashboard/AdminTiles";

export default function AdminPage() {
  return (
    <>
    <main className="m-4 flex flex-col justify-center items-center">
      <section>
        <h1 className="text-6xl pb-4 max-sm:text-5xl">Welcome Admin</h1>
        <p className="text-xl">Some informative text for the admin to read</p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <Tiles/>
      </section>
    </main>
    </>
  );
}