"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import * as turf from "@turf/turf"; // import turf
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

// Fix Leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type WardFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

interface Props {
  wardsUrl?: string;
  complaintMode?: boolean;
  onLocationSelect?: (coords: { lat: number; lng: number; address?: string }) => void;
}

export default function WardMap({
  wardsUrl = "/api/wards",
  complaintMode = false,
  onLocationSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geojsonRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedWard, setSelectedWard] = useState<WardFeature | null>(null);

  const provider = new OpenStreetMapProvider();

  const zoomToWard = useCallback((ward: WardFeature): void => {
    if (!mapRef.current) return;
    const bbox = turf.bbox(ward);
    const bounds = L.latLngBounds([
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]],
    ]);
    mapRef.current.fitBounds(bounds, { padding: 0 });
    setSelectedWard(ward);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([-26.2041, 28.0473], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
    geojsonRef.current.addTo(map);
    mapRef.current = map;
  }, []);

  // Auto-detect ward from geolocation
  useEffect(() => {
    if (complaintMode) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(
          `${wardsUrl}?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        );
        if (!res.ok) return;
        const ward = (await res.json()) as WardFeature;
        zoomToWard(ward);
        setSelectedWard(ward);
      } catch (err) {
        console.error("Error loading ward:", err);
      }
    });
  }, [zoomToWard, complaintMode, wardsUrl]);

  // Click handler
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const clickHandler = async (e: L.LeafletMouseEvent) => {
      if (complaintMode) {
        let address = "";
        try {
          const results = await provider.search({ query: `${e.latlng.lat}, ${e.latlng.lng}` });
          address = results[0]?.label || "";
        } catch {
          address = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
        }
        if (onLocationSelect) {
          onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address });
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([e.latlng.lat, e.latlng.lng]);
        } else {
          markerRef.current = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        }
      } else {
        try {
          const res = await fetch(`${wardsUrl}?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
          if (!res.ok) return;
          const ward = (await res.json()) as WardFeature;
          zoomToWard(ward);
          setSelectedWard(ward);
        } catch (err) {
          console.error("Error fetching ward:", err);
        }
      }
    };

    map.on("click", clickHandler);
    return () => map.off("click", clickHandler);
  }, [complaintMode, zoomToWard, onLocationSelect, provider, wardsUrl]);

  // Update ward polygons (only in normal mode)
  useEffect(() => {
    if (!mapRef.current) return;
    geojsonRef.current.clearLayers();
    if (!complaintMode && selectedWard) {
      L.geoJSON(selectedWard, {
        style: {
          color: "#1e40af",
          weight: 2,
          opacity: 0.8,
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
        },
      }).addTo(geojsonRef.current);
    }
  }, [selectedWard, complaintMode]);

  // Add/remove search bar depending on complaint mode
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    let searchControl: any;

    if (complaintMode) {
      searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        autoComplete: true,
        autoCompleteDelay: 250,
        showMarker: false,
        retainZoomLevel: false,
      });
      map.addControl(searchControl);
    }

    return () => {
      if (searchControl) {
        map.removeControl(searchControl);
      }
    };
  }, [complaintMode, provider]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
