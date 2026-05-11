"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, LayerGroup, Icon } from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Status-based icons
const statusIcons: Record<string, Icon> = {
  Pending: L.icon({
    iconUrl: "/complaintpins/marker-pending.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  }),
  Acknowledged: L.icon({
    iconUrl: "/complaintpins/marker-acknowledged.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  }),
  "In Progress": L.icon({
    iconUrl: "/complaintpins/marker-inprogress.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  }),
  Resolved: L.icon({
    iconUrl: "/complaintpins/marker-resolved.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  }),
};

// Default icon for new complaint marker
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type WardFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

interface Complaint {
  complaintid: number;
  status: string;
  issuetype: string;
  details: string;
  image?: string;
  coords: string;
  address?: string;
}

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
  const mapRef = useRef<LeafletMap | null>(null);
  const geojsonLayerRef = useRef<LayerGroup | null>(null);
  const pinsLayerRef = useRef<LayerGroup | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [selectedWard, setSelectedWard] = useState<WardFeature | null>(null);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  const zoomToWard = useCallback((ward: WardFeature): void => {
    const map = mapRef.current;
    if (!map) return;
    const bbox = turf.bbox(ward);
    const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
    map.fitBounds(bounds, { padding: [0, 0] });
    setSelectedWard(ward);
  }, []);

  // Remove complaint marker when leaving complaint mode
  useEffect(() => {
    if (!complaintMode && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [complaintMode]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([-26.2041, 28.0473], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    const geojsonLayer = L.layerGroup().addTo(map);
    const pinsLayer = L.layerGroup().addTo(map);
    mapRef.current = map;
    geojsonLayerRef.current = geojsonLayer;
    pinsLayerRef.current = pinsLayer;
    return () => {
      map.remove();
      mapRef.current = null;
      geojsonLayerRef.current = null;
      pinsLayerRef.current = null;
      markerRef.current = null;
    };
  }, []);
  // Auto-detect ward from geolocation
  useEffect(() => {
    if (complaintMode) return;
    if (!navigator.geolocation) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`${wardsUrl}?lat=${latitude}&lng=${longitude}`);
        if (!res.ok || cancelled) return;
        const ward = (await res.json()) as WardFeature;
        zoomToWard(ward);
      } catch (err) {
        if (!cancelled) console.error("Error loading ward:", err);
      }
    });
    return () => { cancelled = true; };
  }, [complaintMode, wardsUrl, zoomToWard]);

  // Click handler
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const clickHandler = async (e: L.LeafletMouseEvent): Promise<void> => {
      const { lat, lng } = e.latlng;
      if (complaintMode) {
        let address = "";
        try {
          const results = await provider.search({ query: `${lat}, ${lng}` });
          address = results[0]?.label || "";
        } catch {
          address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
        onLocationSelect?.({ lat, lng, address });
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else markerRef.current = L.marker([lat, lng]).addTo(map);
        return;
      }
      try {
        const res = await fetch(`${wardsUrl}?lat=${lat}&lng=${lng}`);
        if (!res.ok) return;
        const ward = (await res.json()) as WardFeature;
        zoomToWard(ward);
      } catch (err) {
        console.error("Error fetching ward:", err);
      }
    };
    map.on("click", clickHandler);
    return () => { map.off("click", clickHandler); };
  }, [complaintMode, onLocationSelect, provider, wardsUrl, zoomToWard]);

  // Update ward polygons
  useEffect(() => {
    const geojsonLayer = geojsonLayerRef.current;
    if (!geojsonLayer) return;
    geojsonLayer.clearLayers();
    if (complaintMode || !selectedWard) return;
    L.geoJSON(selectedWard, {
      style: {
        color: "#1e40af",
        weight: 2,
        opacity: 0.8,
        fillColor: "#20b2aa",
        fillOpacity: 0.15,
      },
    }).addTo(geojsonLayer);
  }, [selectedWard, complaintMode]);

  // Complaint pins (filtered by backend)
  useEffect(() => {
    const pinsLayer = pinsLayerRef.current;
    const map = mapRef.current;
    if (!pinsLayer || !map) return;
    pinsLayer.clearLayers();
    if (!complaintMode && selectedWard) {
      fetch("/api/complaintpins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward: selectedWard }),
      })
        .then((res) => res.json())
        .then((complaints: Complaint[]) => {
          complaints.forEach((c) => {
            const [latStr, lngStr] = c.coords.split(",").map((s) => s.trim());
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
              const marker = L.marker([lat, lng], {
                icon: statusIcons[c.status] || defaultIcon,
              }).addTo(pinsLayer);
              const popupContent = `
                <div style="font-family: sans-serif; font-size: 14px; line-height: 1.4; max-width: 220px;">
                  <div style="font-weight: bold; color: #1e40af; margin-bottom: 6px;">
                    ${c.issuetype}
                  </div>
                  <div style="margin-bottom: 6px;">${c.details}</div>
                  <div style="color: #374151; margin-bottom: 6px;">
                    <strong>Status:</strong> ${c.status}
                  </div>
                  ${c.address ? `<div style="color: #6b7280; margin-bottom: 6px;">${c.address}</div>` : ""}
                  ${c.image ? `<div style="margin-top: 8px;"><img src="${c.image}" width="120" style="border-radius: 6px;"/></div>` : ""}
                </div>
              `;
              marker.bindPopup(popupContent);
              marker.on("click", () => {
                const zoom = 15;
                const pxPoint = map.project([lat, lng], zoom);
                const offsetPx = pxPoint.subtract([0, 200]);
                const offsetLatLng = map.unproject(offsetPx, zoom);
                map.setView(offsetLatLng, zoom, { animate: true });
              });
            }
          });
        })
        .catch((err) => console.error("Error loading complaint pins:", err));
    }
  }, [complaintMode, selectedWard]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

