import Tiles from "@/components/Dashboard/AdminTiles";

export default function AdminPage() {
  return (
    <>
    <main className="text-center m-4 flex flex-col  justify-center items-center">
      <section>
        <h1 className="text-5xl p-4 max-sm:text-3xl">Administrative Control Center</h1>
        <p className="text-xl">Manage your municipality's operations by tracking service metrics, resolving citizen complaints, and coordinating your workforce from a single centralized hub.</p>
      </section>
      <section className="flex flex-col justify-center items-center">
        <Tiles/>
      </section>
    </main>
    </>
  );
}