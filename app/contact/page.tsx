"use client";

import { useEffect, useState } from "react";
import ContactCard from "@/components/contacts/contactcard";
import { findBestMatch } from "@/components/contacts/bestMatch";

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

export default function ContactPage() {
  const [allMunicipalities, setAllMunicipalities] = useState<string[]>([]);
  const [selectedMunicipalityName, setSelectedMunicipalityName] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityData | null>(null);
  const [statusMessage, setStatusMessage] = useState("Loading municipality list...");
  const [geoState, setGeoState] = useState<"unknown" | "allowed" | "denied" | "unsupported">("unknown");
  const [wardMunicipality, setWardMunicipality] = useState("");
  const [loadingMunicipality, setLoadingMunicipality] = useState(false);

  useEffect(() => {
    async function loadMunicipalities() {
      try {
        const res = await fetch("/api/contactinfo?list=1");
        const names = (await res.json()) as string[];
        setAllMunicipalities(names);
        setStatusMessage("Allow location access to auto-detect your municipality or choose one from the list.");
      } catch (error) {
        setStatusMessage("Could not load municipalities. Please refresh the page.");
        console.error("Failed to load municipality list:", error);
      }
    }

    loadMunicipalities();
  }, []);

  useEffect(() => {
    if (geoState !== "unknown") return;
    if (!navigator.geolocation) {
      setGeoState("unsupported");
      setStatusMessage("Location is not available in this browser. Please choose your municipality manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGeoState("allowed");
        const { latitude, longitude } = position.coords;

        try {
          const wardRes = await fetch(`/api/wards?lat=${latitude}&lng=${longitude}`);
          if (!wardRes.ok) {
            setStatusMessage("Location found, but could not determine your municipality. Choose from the list below.");
            return;
          }

          const ward = await wardRes.json();
          const name = ward?.properties?.Municipali ?? ward?.properties?.municipality ?? "";
          if (!name) {
            setStatusMessage("Location found, but municipality name was not available. Choose from the list below.");
            return;
          }

          setWardMunicipality(name);
        } catch (error) {
          setStatusMessage("Could not determine municipality from your location. Choose from the list below.");
          console.error("Ward lookup failed:", error);
        }
      },
      () => {
        setGeoState("denied");
        setStatusMessage("Location access denied. Choose your municipality from the list below.");
      }
    );
  }, [geoState]);

  useEffect(() => {
    if (!wardMunicipality || allMunicipalities.length === 0 || selectedMunicipalityName) {
      return;
    }

    const best = findBestMatch(wardMunicipality, allMunicipalities);
    if (!best) {
      setStatusMessage("Your municipality was detected but could not be matched exactly. Please choose it from the list.");
      return;
    }

    setSelectedMunicipalityName(best);
  }, [wardMunicipality, allMunicipalities, selectedMunicipalityName]);

  useEffect(() => {
    if (!selectedMunicipalityName) return;
    async function loadContactInfo() {
      setLoadingMunicipality(true);
      setSelectedMunicipality(null);
      setStatusMessage("Loading contact details...");

      try {
        const res = await fetch(
          `/api/contactinfo?municipality=${encodeURIComponent(selectedMunicipalityName)}`
        );

        if (!res.ok) {
          setStatusMessage("Could not load that municipality. Please try another from the list.");
          return;
        }

        const municipality = (await res.json()) as MunicipalityData;
        setSelectedMunicipality(municipality);
        setStatusMessage(geoState === "allowed" ? "Showing contact details for your detected municipality." : "Showing contact details for the selected municipality.");
      } catch (error) {
        setStatusMessage("Failed to load contact details. Try again later.");
        console.error("Municipality lookup failed:", error);
      } finally {
        setLoadingMunicipality(false);
      }
    }

    loadContactInfo();
  }, [selectedMunicipalityName, geoState]);

  return (
    <main className="w-screen min-h-screen overflow-y-auto bg-linear-to-br from-white via-teal-100 to-teal-300">
      <section className="p-6 space-y-8 min-h-screen">
        <header className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 drop-shadow-mlg">Contact Directory</h1>

        </header>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 space-y-5">
            <header className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Choose municipality</h2>
            </header>

            <section className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
   
                <select
                  value={selectedMunicipalityName}
                  onChange={(event) => setSelectedMunicipalityName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white text-sm text-slate-900 p-3 shadow-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  aria-label="Select municipality"
                >
                  <option value="" disabled>Select municipality</option>
                  {allMunicipalities.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>
              {wardMunicipality && (
                <p className="text-sm text-slate-600">
                  Autodetected Municipality: <strong className="font-semibold text-slate-900">{wardMunicipality}</strong>
                </p>
              )}
            </section>
          </aside>

          <section className="space-y-6">
            {loadingMunicipality && (
              <article className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center text-slate-700 shadow-sm">
                Loading contact details...
              </article>
            )}
            {!loadingMunicipality && selectedMunicipality && (
              <ContactCard municipality={selectedMunicipality} />
            )}
            {!loadingMunicipality && !selectedMunicipality && (
              <article className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-slate-700 shadow-sm">
                <h2 className="font-semibold text-slate-900">Select a municipality to view contact details.</h2>
                <p className="mt-2 text-sm text-slate-600">If your browser blocked location access, choose from the dropdown above.</p>
              </article>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
