import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedItem {
  id: string;
  source: string;
  title: string;
  description: string;
  date: string;
  url?: string;
}

export function ThreatFeedsPanel() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      setError(null);
      try {
        const sources = [
          { name: "SANS ISC", url: "/api/sans-isc" },
          { name: "DigitalSide", url: "/api/digitalside" },
          { name: "ThreatFox", url: "/api/threatfox" },
        ];
        const results: FeedItem[] = [];
        for (const src of sources) {
          const res = await fetch(src.url);
          if (!res.ok) { throw new Error(`Failed to fetch ${src.name}`); }
          const data = await res.json();
          for (const item of data.items || []) {
            results.push({
              id: item.id || item.url || Math.random().toString(36),
              source: src.name,
              title: item.title || item.indicator || item.subject || "Untitled",
              description: item.description || item.details || item.type || "No description",
              date: item.date || item.published || item.timestamp || "",
              url: item.url || item.link || undefined,
            });
          }
        }
        setFeeds(results);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-800/10 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-pink-400 flex items-center gap-2">
          📰 Threat Feeds
          <Badge variant="outline" className="text-pink-400 border-pink-400 animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading feeds…</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : feeds.length === 0 ? (
          <div className="text-slate-400">No threat feed data available.</div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-3 bg-slate-900/30 rounded border border-pink-700">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-pink-400 text-white text-xs">{feed.source}</Badge>
                  <span className="text-xs text-slate-400">{feed.date}</span>
                </div>
                <div className="font-semibold text-white mb-1">
                  {feed.url ? (
                    <a href={feed.url} target="_blank" rel="noopener noreferrer" className="underline text-pink-300 hover:text-pink-400">{feed.title}</a>
                  ) : (
                    feed.title
                  )}
                </div>
                <div className="text-sm text-slate-300">{feed.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
