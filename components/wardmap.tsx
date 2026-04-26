"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";

type WardProps = Record<string, unknown>;
type WardFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, WardProps>;
type WardCollection = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, WardProps>;

interface Props {
  wardsUrl?: string; // base API route
}

export default function WardMap({
  wardsUrl = "/api/wards",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geojsonRef = useRef<L.LayerGroup>(new L.LayerGroup());

  const [wardsData, setWardsData] = useState<WardCollection | null>(null);
  const [selectedWard, setSelectedWard] = useState<WardFeature | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const zoomToWard = useCallback((ward: WardFeature): void => {
    if (!mapRef.current) return;

    const bbox = turf.bbox(ward);
    if (!bbox || bbox.some(v => isNaN(Number(v)))) {
      console.warn("Skipping invalid ward geometry:", ward.properties);
      return;
    }

    const bounds = L.latLngBounds([
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]],
    ]);

    mapRef.current.fitBounds(bounds, { padding: 0 });
    mapRef.current.setMaxBounds(bounds);
    setSelectedWard(ward);
  }, []);

  const handleWardSelect = (wardLabel: string) => {
    if (!wardsData) return;
    const ward = wardsData.features.find(
      (w) => String(w.properties?.WardLabel) === wardLabel
    ) as WardFeature | undefined;
    if (ward) zoomToWard(ward);
  };

  const updateMapDisplay = useCallback((): void => {
    if (!mapRef.current || !selectedWard) return;
    geojsonRef.current.clearLayers();

    L.geoJSON(selectedWard, {
      style: {
        color: "#1e40af",
        weight: 2,
        opacity: 0.8,
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
      },
    }).addTo(geojsonRef.current);
  }, [selectedWard]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([28.0473, -26.2041], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    geojsonRef.current.addTo(map);
    mapRef.current = map;
  }, []);

// 🔹 Auto-detect province/ward from geolocation on mount
useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const point = turf.point([pos.coords.longitude, pos.coords.latitude]);

    const provinces = [
      "Eastern Cape","Free State","Gauteng","KwaZulu-Natal",
      "Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"
    ];

    for (const prov of provinces) {
      try {
        const res = await fetch(`${wardsUrl}?province=${prov}`);
        if (!res.ok) continue; // skip if 404

        const wards = (await res.json()) as WardCollection;
        const foundWard = wards.features.find((wardFeature) =>
          turf.booleanPointInPolygon(point, wardFeature as WardFeature)
        ) as WardFeature | undefined;

        if (foundWard) {
          setSelectedProvince(prov);
          setWardsData(wards);
          zoomToWard(foundWard);
          setSelectedWard(foundWard);
          break;
        }
      } catch (err) {
        console.error(`Error loading ${prov} wards:`, err);
      }
    }
  });
}, [zoomToWard]);

// 🔹 Manual province change effect
useEffect(() => {
  if (!selectedProvince) return;

  async function loadProvinceData() {
    try {
      setWardsData(null);        // 🔹 clear old wards
      setSelectedWard(null);     // 🔹 reset ward selection

      const res = await fetch(`${wardsUrl}?province=${selectedProvince}`);
      if (!res.ok) return;

      const wards = (await res.json()) as WardCollection;
      setWardsData(wards);
    } catch (err) {
      console.error(`Error loading ${selectedProvince} wards:`, err);
    }
  }

  loadProvinceData();
}, [selectedProvince]);




  useEffect(() => {
    if (!mapRef.current || !wardsData) return;
    const map = mapRef.current;

    const clickHandler = (e: L.LeafletMouseEvent) => {
      const point = turf.point([e.latlng.lng, e.latlng.lat]);
      const ward = wardsData.features.find((w) =>
        turf.booleanPointInPolygon(point, w as WardFeature)
      ) as WardFeature | undefined;
      if (ward) zoomToWard(ward);
    };

    map.on("click", clickHandler);
    return () => {
      map.off("click", clickHandler);
    };
  }, [wardsData, zoomToWard]);

  useEffect(() => {
    updateMapDisplay();
  }, [updateMapDisplay]);

  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
  ];

  const filteredWards = wardsData ?? null;

  return (
    <section className="w-full">
      <section className="mb-4 text-center">
        <label className="block text-lg font-bold text-white mb-2">
          Select Province
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 mb-4"
        >
          <option value="">Select Province</option>
          {provinces.map((prov, idx) => (
            <option key={idx} value={prov}>
              {prov}
            </option>
          ))}
        </select>

        {selectedProvince && filteredWards && (
          <>
            <label className="block text-lg font-bold text-white mb-2">
              Select Ward
            </label>
            <select
              value={selectedWard ? String(selectedWard.properties?.WardLabel) : ""}
              onChange={(e) => handleWardSelect(e.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Select Ward</option>
              {filteredWards.features.map((ward, index) => (
                <option key={index} value={String(ward.properties?.WardLabel)}>
                  {String(ward.properties?.WardLabel)}
                </option>
              ))}
            </select>
          </>
        )}
      </section>

      {/* Map container */}
      <section className="relative w-full h-125 rounded-4xl overflow-hidden shadow-lg">
        <section ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </section>
 {/* Info box for selected ward */}
      {selectedWard && (
        <aside className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ward Information</h3>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="space-y-2">
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">Ward:</p>
                <p className="text-gray-800">
                  {String(selectedWard.properties?.WardLabel)} (Ward {String(selectedWard.properties?.WardNo)})
                </p>
              </section>
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">Ward ID:</p>
                <p className="text-gray-800">{String(selectedWard.properties?.WardID)}</p>
              </section>
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">Province:</p>
                <p className="text-gray-800">{String(selectedWard.properties?.Province)}</p>
              </section>
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">Municipality:</p>
                <p className="text-gray-800">{String(selectedWard.properties?.Municipali)}</p>
              </section>
            </section>
            <section className="space-y-2">
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">District:</p>
                <p className="text-gray-800">{String(selectedWard.properties?.District)}</p>
              </section>
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">District Code:</p>
                <span className="text-gray-800">{String(selectedWard.properties?.DistrictCo)}</span>
              </section>
              <section className="flex justify-between">
                <p className="font-medium text-gray-600">CAT_B:</p>
                <p className="text-gray-800">{String(selectedWard.properties?.CAT_B)}</p>
              </section>
            </section>
          </section>
        </aside>
      )}
    </section>
  );
}

