"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, LayerGroup, Icon } from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Status-based icons (no Pending) - keys normalized to lowercase
const statusIcons: Record<string, Icon> = {
  "acknowledged": L.icon({ iconUrl: "/complaintpins/marker-acknowledgedv2.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41] }),
  "in progress": L.icon({ iconUrl: "/complaintpins/marker-inprogressv2.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41] }),
  "resolved": L.icon({ iconUrl: "/complaintpins/marker-resolvedv2.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41] }),
};

const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type WardFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

export interface Complaint {
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
  selectedComplaint?: Complaint | null;
  onLocationSelect?: (coords: {
    lat: number;
    lng: number;
    address?: string;
    ward_id?: string;
    municipality?: string;
  }) => void;
  onComplaintsLoad?: (complaints: Complaint[]) => void;
  onComplaintSelect?: (complaint: Complaint | null) => void;
}

export default function WardMap({
  wardsUrl = "/api/wards",
  complaintMode = false,
  selectedComplaint,
  onLocationSelect,
  onComplaintsLoad,
  onComplaintSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const geojsonLayerRef = useRef<LayerGroup | null>(null);
  const pinsLayerRef = useRef<LayerGroup | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [selectedWard, setSelectedWard] = useState<WardFeature | null>(null);
  const selectedComplaintRef = useRef<Complaint | null>(null);
  const onComplaintsLoadRef = useRef(onComplaintsLoad);
  const onComplaintSelectRef = useRef(onComplaintSelect);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  const fitWardBounds = useCallback((ward: WardFeature): void => {
    const map = mapRef.current;
    if (!map) return;
    const bbox = turf.bbox(ward);
    const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
    map.fitBounds(bounds, {
      padding: [0, 0],
      animate: true,
      duration: 1.8,
      easeLinearity: 0.2,
    });
  }, []);

  const selectWard = useCallback((ward: WardFeature): void => {
    setSelectedWard(ward);
    fitWardBounds(ward);
  }, [fitWardBounds]);

  useEffect(() => {
    if (!complaintMode && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [complaintMode]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([-26.2041, 28.0473], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 24,
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
        
        selectWard(ward);
      } catch (err) {
        if (!cancelled) console.error("Error loading ward:", err);
      }
    });
    return () => { cancelled = true; };
  }, [complaintMode, wardsUrl, selectWard]);

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
        try {
          const res = await fetch(`${wardsUrl}?lat=${lat}&lng=${lng}`);
          const ward = await res.json();
          onLocationSelect?.({
            lat,
            lng,
            address,
            ward_id: ward.properties?.WardID,
            municipality: ward.properties?.Municipali,
          });
        } catch {
          onLocationSelect?.({ lat, lng, address });
        }
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else markerRef.current = L.marker([lat, lng]).addTo(map);
        return;
      }
      try {
        const res = await fetch(`${wardsUrl}?lat=${lat}&lng=${lng}`);
        if (!res.ok) return;
        const ward = (await res.json()) as WardFeature;
        console.log(ward.properties)
        selectWard(ward);
      } catch (err) {
        console.error("Error fetching ward:", err);
      }
    };
    map.on("click", clickHandler);
    return () => { map.off("click", clickHandler); };
  }, [complaintMode, onLocationSelect, provider, wardsUrl, selectWard]);

  useEffect(() => {
    const geojsonLayer = geojsonLayerRef.current;
    if (!geojsonLayer) return;
    geojsonLayer.clearLayers();
    if (complaintMode || !selectedWard) return;
    L.geoJSON(selectedWard, {
      style: {
        color: "#20b2aa",
        weight: 2,
        opacity: 0.8,
        fillColor: "#20b2aa",
        fillOpacity: 0.15,
      },
    }).addTo(geojsonLayer);
  }, [selectedWard, complaintMode]);

  useEffect(() => {
    selectedComplaintRef.current = selectedComplaint ?? null;
  }, [selectedComplaint]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedComplaint) return;

    const [latStr, lngStr] = selectedComplaint.coords
      .split(",")
      .map((s) => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return;

    map.flyTo([lat, lng], 16, { animate: true, duration: 1.2, easeLinearity: 0.2 });
  }, [selectedComplaint]);

  useEffect(() => {
    onComplaintsLoadRef.current = onComplaintsLoad;
  }, [onComplaintsLoad]);

  useEffect(() => {
    onComplaintSelectRef.current = onComplaintSelect;
  }, [onComplaintSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedComplaint !== null || !selectedWard) return;
    fitWardBounds(selectedWard);
  }, [selectedComplaint, selectedWard, fitWardBounds]);

  useEffect(() => {
    const pinsLayer = pinsLayerRef.current;
    const map = mapRef.current;
    if (!pinsLayer || !map) return;
    pinsLayer.clearLayers();

    if (selectedWard) {
      (async () => {
        try {
          const res = await fetch("/api/complaintpins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ward: selectedWard }),
          });
          const complaints: Complaint[] = await res.json();

          onComplaintsLoadRef.current?.(complaints);

          complaints.forEach((c) => {
            if (c.status === "Pending") return;
            const [latStr, lngStr] = c.coords.split(",").map((s) => s.trim());
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
              const statusKey = (c.status || "").toLowerCase();
              const marker = L.marker([lat, lng], {
                icon: statusIcons[statusKey] || defaultIcon,
                interactive: !complaintMode,
              }).addTo(pinsLayer);
              if (!complaintMode) {
                marker.on("click", () => {
                  const alreadySelected = selectedComplaintRef.current?.complaintid === c.complaintid;
                  if (alreadySelected) {
                    onComplaintSelectRef.current?.(null);
                    if (selectedWard) fitWardBounds(selectedWard);
                    return;
                  }
                  onComplaintSelectRef.current?.(c);
                  map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
                });
              }
            }
          });
        } catch (err) {
          console.error("Error loading complaint pins:", err);
        }
      })();
    }
  }, [selectedWard, complaintMode, fitWardBounds]);

  return (
    <section className="relative w-full h-100 rounded-xl overflow-hidden shadow-lg">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </section>
  );
}
