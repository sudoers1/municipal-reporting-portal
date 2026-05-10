import Tiles from "@/components/Dashboard/AdminTiles";
import AdminLayout from "../../layouts/AdminLayout";
import BackButton from "@/components/Tools/BackButton";


export default function AdminPage() {
  return (
    <>
    <AdminLayout/>
    <BackButton/>
    <main className="m-12 flex flex-col justify-center items-center">
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