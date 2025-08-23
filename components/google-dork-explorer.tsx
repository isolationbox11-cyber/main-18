"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ExternalLink,
  AlertTriangle,
  Info,
  Shield,
  BookOpen,
  Zap,
  Globe,
  Clock,
} from 'lucide-react';
import {
    performGoogleDork,
    type GoogleDorkResult,
  } from '@/lib/api-client';
  import { PUBLIC_API_KEYS } from '@/lib/public-config';

const riskColor = (risk: string) =>
  risk === 'high'
    ? 'text-red-500'
    : risk === 'medium'
    ? 'text-yellow-500'
    : risk === 'low'
    ? 'text-green-500'
    : 'text-gray-400';

const riskIcon = (risk: string) => {
  switch (risk) {
    case 'high':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'medium':
      return <Info className="w-4 h-4 text-yellow-500" />;
    case 'low':
      return <Shield className="w-4 h-4 text-green-500" />;
    default:
      return null;
  }
};

export function GoogleDorkExplorer() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'dork' | 'google'>('dork');
  const [dorkResults, setDorkResults] = useState<GoogleDorkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const [cseReady, setCseReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    const cseId = PUBLIC_API_KEYS.GOOGLE_CSE ?? '';
    if (!cseId || cseId.length < 5) {
      console.error('Google CSE ID is missing or invalid.');
      return;
    }
    script.src = `https://cse.google.com/cse.js?cx=${cseId}`;
    script.async = true;
    script.onload = () => setCseReady(true);
    script.onerror = () => console.error('Google CSE script failed to load');
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const runGoogleCse = useCallback(() => {
  if (!cseReady) { return; }
    try {
      // @ts-ignore – injected by the CSE script
      const el = window.google?.search?.cse?.element?.getElement('searchresults');
  if (el?.execute) { el.execute(query); }
    } catch (e) {
      console.error('CSE execution error', e);
    }
  }, [query, cseReady]);

  const handleSearch = async () => {
  if (!query.trim()) { return; }
    setLoading(true);
    if (mode === 'dork') {
      try {
        const data = await performGoogleDork(query);
        setDorkResults(data);
      } catch (e) {
        console.error(e);
        setDorkResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      runGoogleCse();
      setLoading(false);
    }
  };

  const presetDorks = [
    {
      name: 'Directory Listings',
      query: 'intitle:"index of" "parent directory"',
      description: 'Find exposed directory listings',
      risk: 'medium' as const,
      category: 'Information Disclosure',
    },
    {
      name: 'Login Pages',
      query: 'intitle:"login" OR intitle:"admin" OR intitle:"administrator"',
      description: 'Discover admin and login interfaces',
      risk: 'high' as const,
      category: 'Access Points',
    },
    // add more presets if you like …
  ];

  return (
    <Card className="bg-slate-900 text-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Search className="w-6 h-6 text-cyan-400" />
          Explorer
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ---------- Mode toggle (Dork ↔ Google) ---------- */}
        <div className="flex items-center gap-4">
          <Button
            variant={mode === 'dork' ? 'default' : 'outline'}
            onClick={() => setMode('dork')}
          >
            Dork Search
          </Button>
          <Button
            variant={mode === 'google' ? 'default' : 'outline'}
            onClick={() => setMode('google')}
          >
            Google CSE
          </Button>
        </div>

        {/* ---------------------- Search bar ---------------------- */}
        <div className="flex flex-col gap-4">
          <div className="relative max-w-xl">
            <Input
              placeholder={
                mode === 'dork'
                  ? 'Enter a Google‑dork query…'
                  : 'Search the web (CSE)…'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-white/10 border-purple-400/50 text-white placeholder-purple-200 text-center py-3 rounded-full"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>

            {/* “I’m Feeling Lucky” only makes sense for Google mode */}
            {mode === 'google' && (
              <Button
                variant="outline"
                className="bg-slate-700/50 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
                onClick={() => {
                  if (!query.trim()) return;
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(
                      query
                    )}&btnI=1`,
                    '_blank'
                  );
                }}
              >
                I&apos;m Feeling Lucky
              </Button>
            )}
          </div>
        </div>

        {/* ------------------- Preset dorks (toggleable) ------------------- */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="text-slate-400 hover:text-white"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showPresets ? 'Hide' : 'Show'} Preset Dorks
          </Button>
        </div>

        {showPresets && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              Popular Dorks 🧙‍♂️
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presetDorks.map((d, i) => (
                <Card
                  key={i}
                  className="bg-slate-800/30 border-slate-600 cursor-pointer hover:bg-slate-800/50 transition"
                  onClick={() => {
                    setQuery(d.query);
                    setMode('dork');
                    handleSearch();
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-white">{d.name}</h4>
                      <Badge className={`text-xs ${riskColor(d.risk)}`}>
                        {d.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{d.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge className="text-xs border-slate-500 text-slate-400">
                        {d.category}
                      </Badge>
                      <code className="text-xs text-purple-400 bg-slate-700/50 px-2 py-1 rounded">
                        {d.query.length > 30
                          ? d.query.slice(0, 30) + '…'
                          : d.query}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- Result area -------------------- */}
        <div className="space-y-6">
          {/* Google CSE results (only visible when mode === 'google') */}
          {mode === 'google' && (
            <div
              className="gcse-searchresults"
              id="cse-results"
              style={{ minHeight: '300px' }}
            />
          )}

          {/* Dork‑search result cards */}
          {mode === 'dork' && dorkResults.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                <Search className="w-5 h-5 text-cyan-400" />
                Dork Results ({dorkResults.length})
              </h3>
              <div className="space-y-3">
                {dorkResults.map((r, i) => (
                  <Card key={i} className="bg-slate-800/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="flex items-center gap-2 font-medium text-white mb-1">
                            {riskIcon(r.riskLevel)}
                            {r.title}
                          </h4>
                          <p className="text-sm text-slate-300 mb-2">{r.snippet}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{r.displayLink}</span>
                            <Badge variant="outline" className="border-slate-500">
                              {r.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${riskColor(r.riskLevel)}`}
                          >
                            {r.riskLevel.toUpperCase()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(r.link, '_blank')}
                            className="text-slate-400 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------
            Optional: a small “What are Google Dorks?” note – keeps the UI
           ----------------------------------------------------------------- */}
        <Card className="bg-amber-900/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-400 mb-1">
                  What are Google Dorks? 🎃
                </h4>
                <p className="text-sm text-amber-300">
                  Google dorks are advanced search queries that reveal exposed files,
                  vulnerable services, and misconfigurations. Use them responsibly and only
                  on assets you have permission to test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
