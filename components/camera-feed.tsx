'use client';
import { useEffect, useRef, useState } from 'react';

import { getShodanHostDetails } from '@/lib/shodan';
import { Badge } from './ui/badge';

// Add missing type definition
export interface CameraFeedProps {
  ip: string;
  port: number;
}

export function CameraFeed({ ip, port }: CameraFeedProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraInfo, setCameraInfo] = useState<string | null>(null); // Added cameraInfo state

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError(null);
      setImageUrl(null);
  setCameraInfo(null); // Reset cameraInfo on fetch
      try {
        const hostDetails = await getShodanHostDetails(ip);
        // More robust image extraction
        let foundImageUrl: string | null = null;
        let info: string | null = null;

        // Try to extract image from HTML
        if (hostDetails.http && hostDetails.http.html) {
          // Try <img src="...">
          const imgMatch = hostDetails.http.html.match(/<img[^>]+src=["']([^"']+)["']/);
          if (imgMatch && imgMatch[1]) {
            foundImageUrl = imgMatch[1].startsWith('/')
              ? `http://${ip}:${port}${imgMatch[1]}`
              : imgMatch[1];
          }
          // Try <iframe src="...">
          if (!foundImageUrl) {
            const iframeMatch = hostDetails.http.html.match(/<iframe[^>]+src=["']([^"']+)["']/);
            if (iframeMatch && iframeMatch[1]) {
              foundImageUrl = iframeMatch[1].startsWith('/')
                ? `http://${ip}:${port}${iframeMatch[1]}`
                : iframeMatch[1];
            }
          }
        }

        // Try common snapshot endpoints
        if (!foundImageUrl && hostDetails.product) {
          if (hostDetails.product.toLowerCase().includes('axis')) {
            foundImageUrl = `http://${ip}:${port}/axis-cgi/jpg/image.cgi`;
            info = 'Axis Camera';
          } else if (hostDetails.product.toLowerCase().includes('hikvision')) {
            foundImageUrl = `http://${ip}:${port}/ISAPI/Streaming/channels/101/picture`;
            info = 'Hikvision Camera';
          } else if (hostDetails.product.toLowerCase().includes('dahua')) {
            foundImageUrl = `http://${ip}:${port}/cgi-bin/snapshot.cgi`;
            info = 'Dahua Camera';
          }
        }

        // Fallback to placeholder
        if (!foundImageUrl) {
          foundImageUrl = `https://via.placeholder.com/400x250?text=No+Feed+from+${ip}:${port}`;
          info = hostDetails.product || null;
        }
        setImageUrl(foundImageUrl);
        setCameraInfo(info);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch camera feed');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [ip, port]);

  return (
    <div className="my-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-purple-900/30 to-slate-900/30 rounded-xl border-2 border-dashed border-purple-400 animate-pulse shadow-lg">
          <span className="text-purple-300 text-lg font-semibold mb-2">Loading Camera Feed…</span>
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-red-900/30 to-slate-900/30 rounded-xl border-2 border-dashed border-red-400 shadow-lg">
          <Badge variant="outline" className="text-red-400 border-red-400 mb-2">Error</Badge>
          <span className="text-red-300 text-lg font-semibold">{error}</span>
        </div>
      ) : (
        <div className="relative group max-w-lg mx-auto">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-400/40 to-pink-400/30 blur-lg opacity-60 group-hover:opacity-80 transition"></div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-purple-400/40 bg-slate-900">
            <img
              src={imageUrl || ''}
              alt={`Camera feed for ${ip}:${port}`}
              className="w-full h-64 object-cover transition duration-300 group-hover:scale-105"
              style={{ filter: 'brightness(0.95) blur(0px)' }}
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge className="bg-purple-400 text-white text-xs">{ip}:{port}</Badge>
              {cameraInfo && <Badge className="bg-pink-400 text-white text-xs">{cameraInfo}</Badge>}
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="text-purple-300 border-purple-300">LIVE</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
