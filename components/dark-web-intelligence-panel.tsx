import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type DarkWebSite = {
  url: string;
  title: string;
  snippet: string;
};

export function DarkWebIntelligencePanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DarkWebSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullText, setFullText] = useState<Record<string, string>>({});

  async function searchDarkWeb(q: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/darkweb/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      // For each result, try to extract full text (via public proxy or placeholder)
      for (const site of data.results || []) {
        // Use ahmia text extraction API if available, else placeholder
        try {
          const textRes = await fetch(`https://ahmia.fi/text/?url=${encodeURIComponent(site.url)}`);
          if (textRes.ok) {
            const text = await textRes.text();
            setFullText(prev => ({ ...prev, [site.url]: text }));
          } else {
            setFullText(prev => ({ ...prev, [site.url]: site.snippet }));
          }
        } catch {
          setFullText(prev => ({ ...prev, [site.url]: site.snippet }));
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch dark web data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-black/80 border border-purple-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          🕸️ Dark Web Intelligence
          <Badge variant="outline" className="text-purple-400 border-purple-400 animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search .onion sites, keywords, or threats"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="max-w-lg"
            aria-label="Dark web search"
          />
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            onClick={() => searchDarkWeb(query)}
            disabled={loading || !query.trim()}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <div className="space-y-4">
          {results.length === 0 && !loading && <div className="text-slate-400">No results yet. Try searching for ransomware, drugs, leaks, etc.</div>}
          {results.map((site, i) => (
            <Card key={i} className="bg-slate-900/60 border border-purple-600 p-3">
              <div className="flex gap-4 items-start">
                <div>
                  {/* Full-length screenshot preview using Onion.live API or placeholder */}
                  <Image
                    src={`https://onion.live/api/v1/screenshot?url=${encodeURIComponent(site.url)}&fullpage=true`}
                    alt={site.title}
                    width={160}
                    height={256}
                    className="w-40 h-64 object-cover rounded border border-purple-700 mb-2"
                    onError={(e: any) => (e.currentTarget.src = "/placeholder.jpg")}
                  />
                  <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs">.onion</Badge>
                </div>
                <div className="flex-1">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline text-lg font-bold">
                    {site.title}
                  </a>
                  <div className="text-slate-300 text-sm mt-1">{site.snippet}</div>
                  <div className="mt-2 text-xs text-pink-400">Visual Aid: <span className="inline-block w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full align-middle mr-2"></span> (Represents a dark web site)</div>
                  <div className="mt-2 text-yellow-300">Forensic Tip: Screenshots are generated in a sandboxed environment for safety. Never visit .onion sites directly unless you know what you’re doing.</div>
                  <div className="mt-2 text-blue-300">Beginner Explanation: The dark web is a hidden part of the internet accessible only via Tor. This panel shows live intelligence, previews, and metadata for .onion sites—no popups, no downloads, just explore safely.</div>
                  <div className="mt-2 text-green-400">
                    <strong>Extracted Text:</strong>
                    <div className="bg-slate-800 p-2 rounded text-xs max-h-40 overflow-y-auto mt-1">
                      {fullText[site.url] || site.snippet}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
