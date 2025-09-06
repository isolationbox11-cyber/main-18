'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// Helper to fetch exposed assets from backend API
async function fetchExposedAssets(): Promise<any[]> {
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'port:80,443,23,22', type: 'shodan' })
    });
    if (!res.ok) { return []; }
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

// Helper to fetch VirusTotal, AbuseIPDB, and Google Custom Search results for an IP
async function fetchAssetIntel(ip: string): Promise<{ vt: any, abuse: any, google: any[] }> {
  try {
    const vtRes = await fetch(`/api/threat-intel?ip=${ip}`);
    let vtData = { virustotal: null, abuseipdb: null };
  if (vtRes.ok) { vtData = await vtRes.json(); }

    // Google Custom Search (live dork)
    const googleRes = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: ip, type: 'google' })
    });
    let google: any[] = [];
    if (googleRes.ok) {
      const gData = await googleRes.json();
      google = gData.results || [];
    }

    return {
      vt: vtData.virustotal,
      abuse: vtData.abuseipdb,
      google,
    };
  } catch {
    return { vt: null, abuse: null, google: [] };
  }
}
// Helper to fetch CVE details from local API proxy
async function fetchCveDetails(cveId: string): Promise<any> {
  try {
    const res = await fetch(`/api/cve-proxy?action=cve&cveId=${cveId}`);
    if (!res.ok) { return null; }
    return await res.json();
  } catch {
    return null;
  }
}
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import MarkerClusterGroup from 'react-leaflet-cluster'; // Removed: not installed
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const eyeIcon = new L.Icon({ iconUrl: '/eye-marker.svg', iconSize: [30, 30], iconAnchor: [15, 30] });
const defaultPos: [number, number] = [20, 0];

// Mock device data for demonstration (with images)
const mockDevices = [
  {
    ip: '192.168.1.1',
    type: 'Router',
    vulns: ['CVE-2023-1234'],
    city: 'London',
    amenity: 'Cafe',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80',
    meta: { vendor: 'Netgear', model: 'R7000', os: 'Linux' }
  },
  {
    ip: '192.168.1.2',
    type: 'Camera',
    vulns: [],
    city: 'Paris',
    amenity: 'Cafe',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
    meta: { vendor: 'Axis', model: 'M1065-L', os: 'Embedded' }
  },
  {
    ip: '192.168.1.3',
    type: 'POS',
    vulns: ['CVE-2022-5678'],
    city: 'New York',
    amenity: 'Cafe',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
    meta: { vendor: 'Verifone', model: 'VX520', os: 'RTOS' }
  },
  {
    ip: '192.168.1.4',
    type: 'Router',
    vulns: [],
    city: 'Tokyo',
    amenity: 'Cafe',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    meta: { vendor: 'TP-Link', model: 'Archer C7', os: 'Linux' }
  },
];

export function MapExplorer() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState<any | null>(null);
  const [filter, setFilter] = useState({ city: '', type: '', amenity: '' });
  const [exposedAssets, setExposedAssets] = useState<any[]>([]);
  type AssetIntel = { vt: any; abuse: any; google: any[] };
  const [assetIntel, setAssetIntel] = useState<Record<string, AssetIntel>>({});
  // Load exposed assets on mount
  useEffect(() => {
    fetchExposedAssets().then(setExposedAssets);
  }, []);

  // Forensic panel expanded row index
  const [expanded, setExpanded] = useState<number | null>(null);

  // Fetch VirusTotal and AbuseIPDB for top assets
  useEffect(() => {
    async function loadIntel() {
      const ips = exposedAssets.slice(0, 20).map(a => a.ip);
      const results: Record<string, AssetIntel> = {};
      await Promise.all(
        ips.map(async ip => {
          if (!assetIntel[ip]) {
            const intel = await fetchAssetIntel(ip);
            results[ip] = {
              vt: intel.vt ?? null,
              abuse: intel.abuse ?? null,
              google: Array.isArray(intel.google) ? intel.google : [],
            };
          }
        })
      );
      setAssetIntel(prev => ({ ...prev, ...results }));
    }
    if (exposedAssets.length > 0) {
      loadIntel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exposedAssets]);
  const [cveDetails, setCveDetails] = useState<Record<string, any>>({});
  // Fetch CVE details for all vulnerabilities in mockDevices
  useEffect(() => {
    async function loadCveDetails() {
      const allCves = Array.from(new Set(mockDevices.flatMap(d => d.vulns)));
      const details: Record<string, any> = {};
      await Promise.all(
        allCves.map(async (cve) => {
          if (!cveDetails[cve]) {
            const data = await fetchCveDetails(cve);
            if (data) { details[cve] = data; }
          }
        })
      );
      setCveDetails(prev => ({ ...prev, ...details }));
    }
    loadCveDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Overpass API query: fetch public amenities (cafes)
    const query = '[out:json][timeout:25];node[amenity=cafe](if:lat > -60 && lat < 60);out;';
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setAmenities(data.elements || []);
        setLoading(false);
      });
  }, []);

  // Filter devices
  const filteredDevices = mockDevices.filter(d =>
    (!filter.city || d.city.toLowerCase().includes(filter.city.toLowerCase())) &&
    (!filter.type || d.type.toLowerCase().includes(filter.type.toLowerCase())) &&
    (!filter.amenity || d.amenity.toLowerCase().includes(filter.amenity.toLowerCase()))
  );

  // Prepare heatmap points
  const heatmapPoints = amenities.map((a) => [a.lat, a.lon, 1]);

  return (
    <div className="w-full">
      {/* Top panel: World-wide exposed assets table */}
      <div className="bg-black/90 p-4 rounded-t-lg mb-2">
        <h2 className="text-lg font-bold text-orange-400 mb-2">World Exposed Assets (Live)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-white border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 py-1">IP</th>
                <th className="px-2 py-1">Org</th>
                <th className="px-2 py-1">Port</th>
                <th className="px-2 py-1">OS</th>
                <th className="px-2 py-1">Country</th>
                <th className="px-2 py-1">Vulnerabilities</th>
                <th className="px-2 py-1">VirusTotal</th>
                <th className="px-2 py-1">AbuseIPDB</th>
                <th className="px-2 py-1">Google Search</th>
              </tr>
            </thead>
            <tbody>
              {exposedAssets.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-gray-400">Loading or no data…</td></tr>
              ) : exposedAssets.slice(0, 20).map((a, i) => {
                const intel = assetIntel[a.ip];
                return (
                  <>
                    <tr key={i} className="border-b border-gray-700">
                      <td className="px-2 py-1">{a.ip}</td>
                      <td className="px-2 py-1">{a.org || 'Unknown'}</td>
                      <td className="px-2 py-1">{a.port}</td>
                      <td className="px-2 py-1">{a.os || 'Unknown'}</td>
                      <td className="px-2 py-1">{a.location?.country_name || 'Unknown'}</td>
                      <td className="px-2 py-1">{a.vulns && a.vulns.length ? a.vulns.map((v: string) => (
                        <a key={v} href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`} target="_blank" rel="noopener noreferrer" className="text-red-400 underline mr-1">{v}</a>
                      )) : 'None'}</td>
                      <td className="px-2 py-1">
                        {intel?.vt ? (
                          <span>
                            <span className="text-green-400">Harmless: {intel.vt.data?.attributes?.last_analysis_stats?.harmless ?? 'N/A'}</span>,
                            <span className="text-red-400 ml-1">Malicious: {intel.vt.data?.attributes?.last_analysis_stats?.malicious ?? 'N/A'}</span>
                          </span>
                        ) : <span className="text-gray-400">Loading…</span>}
                      </td>
                      <td className="px-2 py-1">
                        {intel?.abuse ? (
                          <span>
                            <span className="text-yellow-400">Reports: {intel.abuse.totalReports ?? 'N/A'}</span>,
                            <span className="text-red-400 ml-1">Confidence: {intel.abuse.abuseConfidence ?? 'N/A'}%</span>
                          </span>
                        ) : <span className="text-gray-400">Loading…</span>}
                      </td>
                      <td className="px-2 py-1">
                        {intel?.google && intel.google.length > 0 ? (
                          <div className="max-w-xs overflow-x-auto">
                            {intel.google.slice(0, 2).map((g, idx) => (
                              <div key={idx} className="mb-1">
                                <a href={g.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                  {g.title}
                                </a>
                                <div className="text-xs text-gray-400">{g.snippet}</div>
                              </div>
                            ))}
                          </div>
                        ) : <span className="text-gray-400">Loading…</span>}
                      </td>
                      <td className="px-2 py-1">
                        <button
                          className="text-blue-400 underline text-xs"
                          onClick={() => setExpanded(expanded === i ? null : i)}
                          aria-label="Show forensic details"
                        >
                          {expanded === i ? "Hide" : "Show"} Details
                        </button>
                      </td>
                    </tr>
                    {expanded === i && (
                      <tr>
                        <td colSpan={10} className="bg-slate-900 text-xs text-left p-4">
                          <div className="flex gap-4 items-start">
                            <div>
                              <Image src="/placeholder-logo.png" alt="Asset" className="w-16 h-16 rounded mb-2 border border-gray-700" width={64} height={64} />
                              <svg width="80" height="60" viewBox="0 0 80 60" className="mb-2">
                                <circle cx="40" cy="30" r="18" fill="#38bdf8" opacity="0.3" />
                                <circle cx="40" cy="30" r="8" fill="#f59e42" />
                                <line x1="40" y1="30" x2="70" y2="10" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                                <defs>
                                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
                                  </marker>
                                </defs>
                              </svg>
                              <div className="flex gap-2 mb-2">
                                <span className="inline-block w-4 h-4 bg-blue-400 rounded-full" title="IP Address"></span>
                                <span className="inline-block w-4 h-4 bg-green-400 rounded-full" title="Port"></span>
                                <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full" title="Org"></span>
                              </div>
                            </div>
                            <div>
                              <strong className="text-lg text-orange-400">Forensic Details</strong>
                              <div className="mt-2 text-yellow-300">IP: <span className="font-mono">{a.ip ?? "N/A"}</span> | Port: <span className="font-mono">{a.port ?? "N/A"}</span> | Org: <span className="font-mono">{a.org ?? "N/A"}</span></div>
                              <div className="mt-1 text-blue-400">Beginner Tip: Click on vulnerabilities or external links for more info. No saving needed—just explore!</div>
                              <div className="mt-2 text-slate-300">This asset is a device or service exposed to the internet. <span className="text-green-400">IP Address</span> is its unique identifier. <span className="text-yellow-400">Port</span> is the entry point for network traffic. <span className="text-blue-400">Org</span> is the organization that owns it.</div>
                              <div className="mt-2 text-pink-400">Visual Aid: <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full align-middle mr-2"></span> <span className="text-xs">(Represents a networked device on the map)</span></div>
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 rounded bg-gradient-to-r from-green-400 to-red-400 text-white text-xs font-bold">Threat Level: {a.vulns && a.vulns.length > 0 ? "High" : "Low"}</span>
                              </div>
                              {a.vulns && Array.isArray(a.vulns) && a.vulns.length > 0 && (
                                <div className="mt-2">
                                  <strong>Vulnerabilities:</strong>
                                  {a.vulns.map((v: string, idx: number) => (
                                    <a key={idx} href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`} target="_blank" rel="noopener noreferrer" className="text-red-400 underline ml-2">{v}</a>
                                  ))}
                                  <div className="text-xs text-yellow-300 mt-1">CVEs are public records of security flaws. Click to learn more and see diagrams of attack paths.</div>
                                </div>
                              )}
                              <div className="mt-2 text-green-400">Forensic Explanation: Investigators use IP, port, and vulnerability data to understand how attackers might exploit a device. Visual aids (colored dots, diagrams) help map the relationships and risk levels.</div>
                              <div className="mt-2 text-blue-300">Beginner Explanation: This panel shows real-world devices/services found online. Each has an IP, a port, and may have known security issues. Cyber forensics means investigating these details to understand risks and protect networks.</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-black/80 p-4 rounded-t-lg mb-2 flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Filter by city"
            value={filter.city}
            onChange={e => setFilter({ ...filter, city: e.target.value })}
            className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
          />
          <input
            type="text"
            placeholder="Filter by device type"
            value={filter.type}
            onChange={e => setFilter({ ...filter, type: e.target.value })}
            className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
          />
          <input
            type="text"
            placeholder="Filter by amenity"
            value={filter.amenity}
            onChange={e => setFilter({ ...filter, amenity: e.target.value })}
            className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-2 py-1">IP</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Vulnerabilities</th>
                <th className="px-2 py-1">City</th>
                <th className="px-2 py-1">Amenity</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((d, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="px-2 py-1">{d.ip}</td>
                  <td className="px-2 py-1">{d.type}</td>
                  <td className="px-2 py-1">{d.vulns.length ? d.vulns.join(', ') : 'None'}</td>
                  <td className="px-2 py-1">{d.city}</td>
                  <td className="px-2 py-1">{d.amenity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Map below */}
      <div className="relative h-[500px] w-full rounded-b-lg overflow-hidden shadow-lg">
        <MapContainer center={defaultPos} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='© OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <HeatmapLayer
            points={heatmapPoints}
            longitudeExtractor={(m: [number, number, number]) => m[1]}
            latitudeExtractor={(m: [number, number, number]) => m[0]}
            intensityExtractor={(m: [number, number, number]) => m[2]}
          />
          {/* Clustered markers removed due to missing dependency. Show markers directly. */}
          {amenities.map((a) => (
            <Marker key={a.id} position={[a.lat, a.lon]} icon={eyeIcon} eventHandlers={{ click: () => setSelectedAmenity(a) }}>
              <Popup minWidth={250} maxWidth={350}>
                <div className="flex flex-col gap-2">
                  <strong>{a.tags?.name ?? 'Cafe'}</strong>
                  <span>{a.tags?.amenity ?? 'Amenity'}</span>
                  <span>Lat: {a.lat}, Lon: {a.lon}</span>
                  {/* Show device info for matching city/amenity */}
                  {mockDevices.filter(d => d.city.toLowerCase() === (a.tags?.city?.toLowerCase() || '') && d.amenity.toLowerCase() === (a.tags?.amenity?.toLowerCase() || 'cafe')).map((d, i) => (
                    <div key={i} className="border-t border-gray-700 pt-2">
                      <Image src={d.image} alt={d.type} className="w-24 h-16 object-cover rounded mb-1" width={96} height={64} />
                      <div><strong>Type:</strong> {d.type} <span className="text-xs text-gray-400">(A {d.type} is a networked device. Example: routers connect networks, cameras stream video, POS handles payments.)</span></div>
                      <div><strong>IP Address:</strong> {d.ip} <span className="text-xs text-gray-400">(Unique identifier for this device on the network.)</span></div>
                      <div><strong>Vendor:</strong> {d.meta.vendor} <span className="text-xs text-gray-400">(Company that made the device.)</span></div>
                      <div><strong>Model:</strong> {d.meta.model} <span className="text-xs text-gray-400">(Specific product version.)</span></div>
                      <div><strong>Operating System:</strong> {d.meta.os} <span className="text-xs text-gray-400">(Software running on the device.)</span></div>
                      <div><strong>Vulnerabilities:</strong> {d.vulns.length ? d.vulns.map(v => (
                        <div key={v} className="mb-2">
                          <a
                            href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-red-500 underline hover:text-red-700"
                          >
                            {v} <span className="text-xs text-gray-400">(Security issue. Click to learn more.)</span>
                          </a>
                          {cveDetails[v] ? (
                            <div className="text-xs text-yellow-300 mt-1">
                              <strong>{cveDetails[v].summary}</strong>
                              <div>Published: {cveDetails[v].Published}</div>
                              <div>CVSS Score: {cveDetails[v].cvss}</div>
                              <div>References: {cveDetails[v].references?.slice(0,2).map((r: string, idx: number) => (
                                <a key={idx} href={r} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 mr-2">Source</a>
                              ))}</div>
                            </div>
                          ) : <div className="text-xs text-gray-500">Loading details…</div>}
                        </div>
                      )) : 'None'} </div>
                      <div className="mt-2 text-xs text-blue-400">Forensic Tip: Devices like these can be entry points for hackers. Always update firmware and use strong passwords. Vulnerabilities (CVEs) are public records of security flaws—search the CVE code for details and fixes.</div>
                      <div className="mt-1 text-xs text-green-400">Beginner Explanation: This panel shows real-world devices found in public places. Each device has an IP address, a vendor, and may have known security issues. Cyber forensics means investigating these details to understand risks and protect networks.</div>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">Loading map…</div>}
      </div>
    </div>
  );
}
