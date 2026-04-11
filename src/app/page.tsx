import DashboardItems from "@/components/dashboarditems";

export default function Home() {
  return (
    <main
      className="w-screen min-h-[120vh] overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/municipality.png')" }}
    >
      <section className="p-8 space-y-10 bg-black/50 min-h-[120vh] flex flex-col justify-start">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
          Municipal Portal Landing Page
        </h1>

        <p className="text-lg text-white max-w-3xl mx-auto text-center">
          Welcome to the Municipal Portal. Log in to see your personalized dashboard and information
          regarding your municipality. You can also log a complaint or report an issue directly from
          your dashboard.
        </p>


      <h2 className="text-2xl space-y-10 md:text-3xl font-bold text-center text-white">
        General Dashboard
      </h2>

          <DashboardItems />
     
      </section>
    </main>
  );
}
