"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster"; // Removed: not installed
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import L from "leaflet";

// Mock device data for cyber exploration (replace with API data later)
const mockDevices = [
  { ip: "192.168.1.1", type: "Router", vulns: ["CVE-2023-1234"], lat: 37.751, lon: -97.822 },
  { ip: "192.168.1.2", type: "Camera", vulns: ["CVE-2022-5678"], lat: 33.448, lon: -112.074 },
  { ip: "192.168.1.3", type: "POS System", vulns: [], lat: 37.7749, lon: -122.4194 },
];

const amenities = [
  { id: 1, tags: { name: "Cafe Central", amenity: "cafe", city: "Wichita" }, lat: 37.751, lon: -97.822 },
  { id: 2, tags: { name: "Coffee Spot", amenity: "cafe", city: "Phoenix" }, lat: 33.448, lon: -112.074 },
  { id: 3, tags: { name: "POS Hub", amenity: "restaurant", city: "San Francisco" }, lat: 37.7749, lon: -122.4194 },
];

const defaultPos: [number, number] = [37.751, -97.822];

const eyeIcon = new L.Icon({
  iconUrl: "/placeholder-logo.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapAdvanced() {
  const [search, setSearch] = useState("");
  const filteredAmenities = amenities.filter((a) => {
    if (!search) {
      return true;
    }
    const name = a.tags?.name?.toLowerCase() ?? "";
    const city = a.tags?.city?.toLowerCase() ?? "";
    return name.includes(search.toLowerCase()) || city.includes(search.toLowerCase());
  });

  // Example API call for hosts (replace with real API)
  type Host = {
    ip: string;
    port: number;
    location: { latitude: number; longitude: number };
  };
  const { data = [], isLoading: loading } = useQuery<{ ip: string; port: number; location: { latitude: number; longitude: number } }[]>(
    {
      queryKey: ["hosts"],
      queryFn: async () => {
        // Replace with real API endpoint
        const res = await axios.get("/api/threat-intel");
        return res.data;
      },
      initialData: [],
    }
  );

  // Example heatmap points
  type HeatmapPoint = [number, number, number];
  const heatmapPoints: HeatmapPoint[] = filteredAmenities.map((a) => [a.lat, a.lon, 10]);

  return (
    <div className="flex">
      {/* Sidebar for device details and search */}
      <aside className="w-80 bg-black/80 text-white p-4 flex flex-col gap-4 border-r border-white/10">
        <h2 className="text-lg font-bold mb-2">Cyber Exploration</h2>
        <Input
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="overflow-y-auto max-h-[400px]">
          {filteredAmenities.map((a) => (
            <div key={a.id} className="mb-3 p-2 rounded bg-white/10">
              <div className="font-semibold">{a.tags?.name ?? "Cafe"}</div>
              <div className="text-xs">{a.tags?.amenity ?? "Amenity"} | Lat: {a.lat}, Lon: {a.lon}</div>
              {/* Show mock devices near this location */}
              <div className="mt-2">
                <span className="font-bold text-orange-300">Nearby Devices:</span>
                <ul className="list-disc ml-4">
                  {mockDevices.filter(d => Math.abs(d.lat - a.lat) < 1 && Math.abs(d.lon - a.lon) < 1).map((d, i) => (
                    <li key={i}>
                      <span className="font-mono">{d.ip}</span> – {d.type}
                      {d.vulns.length > 0 && (
                        <span className="text-red-400 ml-2">Vulns: {d.vulns.join(", ")}</span>
                      )}
                    </li>
                  ))}
                  {mockDevices.filter(d => Math.abs(d.lat - a.lat) < 1 && Math.abs(d.lon - a.lon) < 1).length === 0 && (
                    <li className="text-gray-400">No devices found</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </aside>
      {/* Map */}
      <div className="flex-1 relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={defaultPos} zoom={2} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <HeatmapLayer
            points={heatmapPoints}
            longitudeExtractor={(m: HeatmapPoint) => m[1]}
            latitudeExtractor={(m: HeatmapPoint) => m[0]}
            intensityExtractor={(m: HeatmapPoint) => m[2]}
          />
          {/* Clustered markers removed due to missing dependency. Show markers directly. */}
          {filteredAmenities.map((a) => (
            <Marker key={a.id} position={[a.lat, a.lon]} icon={eyeIcon}>
              <Popup>
                <strong>{a.tags?.name ?? "Cafe"}</strong>
                <br />
                {a.tags?.amenity ?? "Amenity"}
                <br />
                Lat: {a.lat}, Lon: {a.lon}
                <br />
                <span className="font-bold text-orange-300">Nearby Devices:</span>
                <ul className="list-disc ml-4">
                  {mockDevices.filter(d => Math.abs(d.lat - a.lat) < 1 && Math.abs(d.lon - a.lon) < 1).map((d, i) => (
                    <li key={i}>
                      <span className="font-mono">{d.ip}</span> – {d.type}
                      {d.vulns.length > 0 && (
                        <span className="text-red-400 ml-2">Vulns: {d.vulns.join(", ")}</span>
                      )}
                    </li>
                  ))}
                  {mockDevices.filter(d => Math.abs(d.lat - a.lat) < 1 && Math.abs(d.lon - a.lon) < 1).length === 0 && (
                    <li className="text-gray-400">No devices found</li>
                  )}
                </ul>
              </Popup>
            </Marker>
          ))}
          {/* Show API hosts if available */}
          {Array.isArray(data) && data.map((host: Host) => (
            <Marker key={host.ip + host.port} position={[host.location.latitude, host.location.longitude]} icon={eyeIcon}>
              <Popup>
                <strong>{host.ip}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">Loading map…</div>}
      </div>
    </div>
  );
}
