import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

type RussianDarknetSite = {
  url: string;
  title: string;
  snippet: string;
};

export function RussianDarknetPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RussianDarknetSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullText, setFullText] = useState<Record<string, string>>({});
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);

  async function searchRussianDarknet(q: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/russian-darknet/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      // For each result, try to extract full text (if available)
      for (const site of data.results || []) {
        try {
          // Use snippet as fallback for full text
          setFullText(prev => ({ ...prev, [site.url]: site.snippet }));
        } catch {
          setFullText(prev => ({ ...prev, [site.url]: site.snippet }));
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch Russian darknet data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-black/80 border border-red-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          🇷🇺 Russian Darknet Intelligence
          <Badge variant="outline" className="text-red-400 border-red-400 animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input
            placeholder="Search RuTor, Russian forums, leaks, etc."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="max-w-lg"
            aria-label="Russian darknet search"
          />
          <button
            className={`bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold border-2 border-red-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${loading ? 'opacity-60' : ''}`}
            onClick={() => searchRussianDarknet(query)}
            disabled={loading || !query.trim()}
          >
            {loading ? "Searching…" : "Search"}
          </button>
          {/* Suggestions */}
          <div className="flex gap-2 ml-4">
            {["drugs", "leaks", "hacking", "forums", "ransomware"].map(suggestion => (
              <button
                key={suggestion}
                className={`px-3 py-1 rounded bg-slate-800 text-yellow-300 border border-yellow-400 hover:bg-yellow-900/30 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${query === suggestion ? 'bg-yellow-400 text-black' : ''}`}
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        {/* Sandbox iframe for live preview */}
        {sandboxUrl && (
          <div className="mb-6">
            <div className="mb-2 text-xs text-yellow-400">Sandboxed live preview (read-only, no downloads):</div>
            <iframe
              src={sandboxUrl}
              title="Russian Darknet Sandbox"
              className="w-full h-96 rounded border-2 border-red-700 bg-black"
              sandbox="allow-scripts allow-same-origin"
            />
            <button
              className="mt-2 px-3 py-1 bg-slate-800 text-red-400 rounded border border-red-700"
              onClick={() => setSandboxUrl(null)}
            >
              <span className="font-semibold">Close Preview</span>
            </button>
          </div>
        )}
        <div className="space-y-4">
          {results.length === 0 && !loading && (
            <div className="text-slate-400">No results yet. Try searching for <span className="text-yellow-300 font-semibold">drugs</span>, <span className="text-yellow-300 font-semibold">leaks</span>, <span className="text-yellow-300 font-semibold">hacking</span>, <span className="text-yellow-300 font-semibold">forums</span>, <span className="text-yellow-300 font-semibold">ransomware</span>.</div>
          )}
          {results.map((site, i) => (
            <Card key={i} className="bg-slate-900/60 border border-red-600 p-3">
              <div className="flex gap-4 items-start">
                <div>
                  {/* Screenshot preview using public proxy or placeholder */}
                  <Image
                    src="/placeholder-logo.png"
                    alt={site.title}
                    className="w-40 h-64 object-cover rounded border border-red-700 mb-2"
                    width={160}
                    height={256}
                  />
                  <Badge className="bg-gradient-to-r from-red-400 to-yellow-400 text-white text-xs">.ru/.onion</Badge>
                  <button
                    className={`mt-2 px-2 py-1 bg-red-700 text-white rounded text-xs border border-red-900 hover:bg-yellow-400 hover:text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors duration-150`}
                    onClick={() => setSandboxUrl(site.url)}
                  >
                    <span className="font-semibold">View Live (Sandbox)</span>
                  </button>
                </div>
                <div className="flex-1">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-red-400 underline text-lg font-bold">
                    {site.title}
                  </a>
                  <div className="text-slate-300 text-sm mt-1">{site.snippet}</div>
                  <div className="mt-2 text-xs text-yellow-400">Visual Aid: <span className="inline-block w-6 h-6 bg-gradient-to-br from-red-400 to-yellow-400 rounded-full align-middle mr-2"></span> (Represents a Russian darknet site)</div>
                  <div className="mt-2 text-green-400">
                    <strong>Extracted Text:</strong>
                    <div className="bg-slate-800 p-2 rounded text-xs max-h-40 overflow-y-auto mt-1">
                      {fullText[site.url] || site.snippet}
                    </div>
                  </div>
                  <div className="mt-2 text-yellow-300">Forensic Tip: Russian darknet sources are rich in cybercrime, leaks, and underground activity. All previews are sandboxed for safety.</div>
                  <div className="mt-2 text-blue-300">Beginner Explanation: This panel shows live intelligence and metadata from Russian darknet indexes and forums—no popups, no downloads, just explore safely.</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
