type MunicipalityData = {
  name: string;
  url?: string;
  postal?: string;
  phone?: string;
  website?: string;
  facebook_page?: string;
  physical_address?: string;
  accounts_phone?: string;
  accounts_email?: string;
  electricity_phone?: string;
  electricity_email?: string;
  refuse_waste_phone?: string;
  refuse_waste_email?: string;
  roads_phone?: string;
  roads_email?: string;
  service_delivery_phone?: string;
  service_delivery_email?: string;
  water_phone?: string;
  water_email?: string;
};

function getLinkValue(value?: string) {
  if (!value || value.toLowerCase().includes("not available")) return "Not available";
  return value;
}

function maybeLink(url?: string) {
  if (!url || url.toLowerCase().includes("not available")) return null;
  const cleaned = url.trim();
  const locationMatch = cleaned.match(/\/locations\/[^/]+\/(.+)$/i);
  if (locationMatch?.[1]) {
    const target = locationMatch[1];
    return target.startsWith("http") ? target : `https://${target}`;
  }
  return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
}

export default function ContactCard({ municipality }: { municipality: MunicipalityData }) {
  const website = maybeLink(municipality.website);
  const facebook = maybeLink(municipality.facebook_page);

  const departments = [
    { label: "Accounts", phone: municipality.accounts_phone, email: municipality.accounts_email },
    { label: "Electricity", phone: municipality.electricity_phone, email: municipality.electricity_email },
    { label: "Refuse & Waste", phone: municipality.refuse_waste_phone, email: municipality.refuse_waste_email },
    { label: "Roads", phone: municipality.roads_phone, email: municipality.roads_email },
    { label: "Service Delivery", phone: municipality.service_delivery_phone, email: municipality.service_delivery_email },
    { label: "Water", phone: municipality.water_phone, email: municipality.water_email },
  ];

  return (
    <article className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6">
      <header className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{municipality.name}</h2>
        <section className="grid gap-4 md:grid-cols-2">
          <section className="space-y-4">
            <p className="text-sm text-slate-500">Postal address</p>
            <p className="text-base text-slate-900">{getLinkValue(municipality.postal)}</p>
                        <p className="text-sm text-slate-500">General contact</p>
            <p className="text-base text-slate-900">{getLinkValue(municipality.phone)}</p>
          </section>
          <section className="space-y-4">

            <p className="text-sm text-slate-500">Website</p>
            {website ? (
              <a href={website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                {website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <p className="text-base text-slate-900">Not available</p>
            )}
            <p className="text-sm text-slate-500">Social</p>
            {facebook ? (
              <a href={facebook} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                Facebook page
              </a>
            ) : (
              <p className="text-base text-slate-900">Not available</p>
            )}
          </section>
        </section>
      </header>

      <section className="grid gap-4">
        <header>
          <h3 className="text-lg font-semibold text-slate-900">Service department contacts</h3>
        </header>
        <section className="grid gap-4 md:grid-cols-2">
          {departments.map((item) => (
            <article key={item.label} className="rounded-xl bg-slate-50 p-4 border border-slate-200 shadow-sm">
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="text-sm text-slate-700">Phone: {getLinkValue(item.phone)}</p>
              <p className="text-sm text-slate-700">Email: {getLinkValue(item.email)}</p>
            </article>
          ))}
        </section>
      </section>

      <footer className="text-sm text-slate-500">
        Contact information is loaded from the municipality dataset and updated for the selected municipality. Last Updated: 17/05/2026
      </footer>
    </article>
  );
}
