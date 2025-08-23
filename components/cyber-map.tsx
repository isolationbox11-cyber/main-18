'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Example custom marker icon (optional)
const eyeIcon: Icon = new L.Icon({
  iconUrl: '/placeholder-logo.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export function CyberMap() {
  // Example static data; replace with real API data as needed
  const hosts = [
    { ip: '8.8.8.8', org: 'Google', port: 53, os: 'Linux', location: { latitude: 37.751, longitude: -97.822 } },
    { ip: '1.1.1.1', org: 'Cloudflare', port: 53, os: 'Linux', location: { latitude: 33.448, longitude: -112.074 } },
  ];
  const defaultPos: [number, number] = [20, 0]; // world centre

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={defaultPos} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hosts.map((host) => (
          <Marker
            key={host.ip + host.port}
            position={[host.location.latitude, host.location.longitude]}
            icon={eyeIcon}
          >
            <Popup>
              <strong>{host.ip}</strong>
              <br />
              {host.org ?? 'Unknown org'}
              <br />
              Port: {host.port}
              <br />
              OS: {host.os ?? '—'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
