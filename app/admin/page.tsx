import AdminLayout from "../../layouts/AdminLayout";


export default function AdminPage() {
  return (
    <>
    <AdminLayout/>
    <main className="m-4">
      <section>
        <h1 className="text-6xl pb-4">Welcome Admin</h1>
        <p className="text-xl">Some informative text for the admin to read</p>
      </section>
      <section>
      </section>
    </main>
    </>
  );
}