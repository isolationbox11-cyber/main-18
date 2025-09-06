"use client";

import React, { useState } from "react";
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table";

export function UnifiedSearch() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(10);

  type UnifiedData = {
    source?: string;
    results?: any[] | Record<string, any>;
  };

  const {
    data,
    isFetching,
    error,
  } = useQuery<UnifiedData>({
    queryKey: ["unified", query, count],
    queryFn: async () => {
      const { data } = await axios.get("/api/unified", {
        params: { q: query, count },
      });
      return data as UnifiedData;
    },
    enabled: !!query
  });

  const safeData: UnifiedData = data ?? {};
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Try: shodan:apache, censys:port:22, or any search term"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="max-w-xl"
        />
        <div className="flex gap-2 items-center">
          <label htmlFor="count" className="text-sm text-gray-400">Results:</label>
          <input
            id="count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-16 px-2 py-1 rounded border border-gray-700 bg-slate-900 text-white"
          />
        </div>
      </div>

      {isFetching && <p className="text-blue-400 animate-pulse">Looking up…</p>}
      {error && <p className="text-red-500 font-bold">{(error as any).message}</p>}

      {safeData.source && (
        <Tabs defaultValue={safeData.source} className="w-full">
          <TabsList>
            <TabsTrigger value="shodan">Shodan</TabsTrigger>
            <TabsTrigger value="censys">Censys</TabsTrigger>
            <TabsTrigger value="graynoise">GrayNoise</TabsTrigger>
            <TabsTrigger value="otx">OTX</TabsTrigger>
            <TabsTrigger value="vt">VirusTotal</TabsTrigger>
            <TabsTrigger value="abuse">AbuseIPDB</TabsTrigger>
            <TabsTrigger value="google">Web</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
          </TabsList>

          {/* Shodan results: show more interesting fields */}
          <TabsContent value="shodan">
            <ResultsTable
              data={Array.isArray(safeData.results) ? safeData.results : []}
              columns={["ip", "org", "port", "os", "vulns", "location"]}
              showMap
            />
          </TabsContent>

          {/* Censys results */}
          <TabsContent value="censys">
            <ResultsTable data={Array.isArray(safeData.results) ? safeData.results : []} columns={["ip", "services", "location"]} />
          </TabsContent>

          {/* GrayNoise IP info */}
          {safeData.source === "ipinfo" && typeof safeData.results === "object" && !Array.isArray(safeData.results) && (
            <TabsContent value="graynoise">
              <pre className="bg-gray-800 p-2 rounded">{JSON.stringify((safeData.results as Record<string, any>).gray, null, 2)}</pre>
            </TabsContent>
          )}

          {/* OTX IP info */}
          {safeData.source === "ipinfo" && typeof safeData.results === "object" && !Array.isArray(safeData.results) && (
            <TabsContent value="otx">
              <pre className="bg-gray-800 p-2 rounded">{JSON.stringify((safeData.results as Record<string, any>).otx, null, 2)}</pre>
            </TabsContent>
          )}

          {/* VirusTotal IP info */}
          {safeData.source === "ipinfo" && typeof safeData.results === "object" && !Array.isArray(safeData.results) && (
            <TabsContent value="vt">
              <pre className="bg-gray-800 p-2 rounded">{JSON.stringify((safeData.results as Record<string, any>).vt, null, 2)}</pre>
            </TabsContent>
          )}

          {/* AbuseIPDB IP info */}
          {safeData.source === "ipinfo" && typeof safeData.results === "object" && !Array.isArray(safeData.results) && (
            <TabsContent value="abuse">
              <pre className="bg-gray-800 p-2 rounded">{JSON.stringify((safeData.results as Record<string, any>).abuse, null, 2)}</pre>
            </TabsContent>
          )}

          {/* Google results */}
          <TabsContent value="google">
            {(Array.isArray(safeData.results) ? safeData.results : []).map((item: any, i: number) => (
              <div key={i} className="border-b border-gray-700 py-2 hover:bg-slate-800 transition cursor-pointer">
                <a href={item.link} target="_blank" rel="noopener" className="text-primary underline font-bold text-lg">
                  {item.title}
                </a>
                <p className="text-sm text-gray-300">{item.snippet}</p>
              </div>
            ))}
          </TabsContent>

          {/* Sandbox: interactive panel for exploring results visually */}
          <TabsContent value="sandbox">
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">Cyber Sandbox</h2>
              <p className="text-slate-300 mb-4">Drag, click, and explore real assets. Click IPs, orgs, ports, or vulnerabilities for instant forensics and visual aids.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(safeData.results) ? safeData.results : []).slice(0, 8).map((row: any, i: number) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-4 shadow hover:scale-105 transition cursor-pointer">
                    <div className="flex gap-2 items-center mb-2">
                      <span className="text-blue-400 font-mono text-lg">{row.ip}</span>
                      <span className="text-green-400 text-xs px-2 py-1 rounded bg-green-900">Port {row.port}</span>
                      <span className="text-yellow-400 text-xs px-2 py-1 rounded bg-yellow-900">{row.org}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{row.os ?? "Unknown OS"}</div>
                    <div className="flex gap-2 mb-2">
                      {row.vulns && row.vulns.length > 0 ? (
                        row.vulns.map((v: string, idx: number) => (
                          <a key={idx} href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`} target="_blank" rel="noopener noreferrer" className="text-red-400 underline text-xs">{v}</a>
                        ))
                      ) : (
                        <span className="text-green-400 text-xs">No known vulns</span>
                      )}
                    </div>
                    <div className="text-xs text-cyan-300">{row.location?.city}, {row.location?.country}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-400">Tip: Click any asset for details. Vulnerabilities link to CVE records. All panels are interactive and visually enhanced for cyber forensics.</div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

/* Tiny reusable table */
function ResultsTable({ data, columns, showMap }: { data: any[]; columns: string[]; showMap?: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c} className="font-bold text-cyan-300 text-base cursor-pointer">{c.toUpperCase()}</TableCell>
          ))}
          <TableCell className="font-bold text-orange-400 text-base">Forensics</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <React.Fragment key={i}>
            <TableRow className="hover:bg-slate-800 transition cursor-pointer">
              {columns.map((c) => (
                <TableCell key={c} className="text-blue-200">
                  {c === "vulns" && Array.isArray(row[c]) ? (
                    row[c].length > 0 ? row[c].map((v: string, idx: number) => (
                      <a key={idx} href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`} target="_blank" rel="noopener noreferrer" className="text-red-400 underline mx-1">{v}</a>
                    )) : <span className="text-green-400">No vulns</span>
                  ) : c === "location" && row[c] ? (
                    <span className="text-cyan-400">{row[c].city}, {row[c].country}</span>
                  ) : Array.isArray(row[c]) ? row[c].join(", ") : row[c] ?? "—"}
                </TableCell>
              ))}
              <TableCell>
                <button
                  className={`text-blue-400 underline text-xs px-2 py-1 rounded bg-blue-900 hover:bg-blue-700 transition font-bold`}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  aria-label="Show forensic details"
                >
                  {expanded === i ? "Hide" : "Show"} Details
                </button>
              </TableCell>
            </TableRow>
            {expanded === i && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <div className={`bg-slate-900 text-xs text-left p-4 flex gap-4 items-start rounded-lg shadow-lg border border-blue-900`}> 
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
                      <div className="mt-2 text-yellow-300">IP: <span className="font-mono">{row.ip ?? "N/A"}</span> | Port: <span className="font-mono">{row.port ?? "N/A"}</span> | Org: <span className="font-mono">{row.org ?? "N/A"}</span></div>
                      <div className="mt-1 text-blue-400">Beginner Tip: Click on vulnerabilities or external links for more info. No saving needed—just explore!</div>
                      <div className="mt-2 text-slate-300">This asset is a device or service exposed to the internet. <span className="text-green-400">IP Address</span> is its unique identifier. <span className="text-yellow-400">Port</span> is the entry point for network traffic. <span className="text-blue-400">Org</span> is the organization that owns it.</div>
                      <div className="mt-2 text-pink-400">Visual Aid: <span className="inline-block w-8 h-8 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full align-middle mr-2"></span> <span className="text-xs">(Represents a networked device on the map)</span></div>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 rounded bg-gradient-to-r from-green-400 to-red-400 text-white text-xs font-bold">Threat Level: {row.vulns && row.vulns.length > 0 ? "High" : "Low"}</span>
                      </div>
                      {row.vulns && Array.isArray(row.vulns) && row.vulns.length > 0 && (
                        <div className="mt-2">
                          <strong>Vulnerabilities:</strong>
                          {row.vulns.map((v: string, idx: number) => (
                            <a key={idx} href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${v}`} target="_blank" rel="noopener noreferrer" className="text-red-400 underline ml-2">{v}</a>
                          ))}
                          <div className="text-xs text-yellow-300 mt-1">CVEs are public records of security flaws. Click to learn more and see diagrams of attack paths.</div>
                        </div>
                      )}
                      <div className="mt-2 text-green-400">Forensic Explanation: Investigators use IP, port, and vulnerability data to understand how attackers might exploit a device. Visual aids (colored dots, diagrams) help map the relationships and risk levels.</div>
                      <div className="mt-2 text-blue-300">Beginner Explanation: This panel shows real-world devices/services found online. Each has an IP, a port, and may have known security issues. Cyber forensics means investigating these details to understand risks and protect networks.</div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
