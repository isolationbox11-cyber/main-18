import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { FloatingEyes } from "@/components/floating-eyes";
import QueryProvider from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Salem Cyber Vault - Internet Intelligence Platform",
  description:
    "Advanced cybersecurity intelligence platform for discovering and analyzing internet-connected devices and services. Visit www.salemcybervault.com for more.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gradient-to-br from-slate-900 via-black to-blue-950 min-h-screen antialiased">
        <QueryProvider>
          {/* Global Error Boundary */}
          <div id="global-error-boundary">
            <FloatingEyes />
            <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-cyan-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur border-b border-cyan-700/30 shadow-lg">
              <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                <div className="flex items-center gap-3">
                  {/* Cyber-themed SVG icon */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-cyber animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="#22d3ee" strokeWidth="2" fill="#0f172a" />
                    <path d="M20 8 Q32 20 20 32 Q8 20 20 8 Z" fill="#6366f1" opacity="0.7" />
                    <circle cx="20" cy="20" r="7" fill="#22d3ee" opacity="0.8" />
                    <g>
                      <rect x="17" y="17" width="6" height="6" rx="3" fill="#0ff" opacity="0.6" />
                      <rect x="19" y="19" width="2" height="2" rx="1" fill="#fff" />
                    </g>
                    <g>
                      <path d="M20 2 L20 8" stroke="#0ff" strokeWidth="1.5" />
                      <path d="M20 32 L20 38" stroke="#0ff" strokeWidth="1.5" />
                      <path d="M2 20 L8 20" stroke="#0ff" strokeWidth="1.5" />
                      <path d="M32 20 L38 20" stroke="#0ff" strokeWidth="1.5" />
                    </g>
                  </svg>
                  <span className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Salem Cyber Vault</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base md:text-lg text-cyan-200 font-medium">Internet Intelligence Platform</span>
                  <span className="text-xs text-slate-400 italic">Real-time cyber threat analytics</span>
                  <span className="text-xs text-blue-400 mt-1">www.salemcybervault.com</span>
                </div>
              </div>
            </header>
            <main className="w-full mx-auto">
              {children}
            </main>
            <footer className="w-full py-6 mt-12 text-center text-slate-400 border-t border-slate-800 bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-purple-900/80">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="drop-shadow-cyber animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="#22d3ee" strokeWidth="2" fill="#0f172a" />
                  <path d="M20 8 Q32 20 20 32 Q8 20 20 8 Z" fill="#6366f1" opacity="0.7" />
                  <circle cx="20" cy="20" r="7" fill="#22d3ee" opacity="0.8" />
                  <g>
                    <rect x="17" y="17" width="6" height="6" rx="3" fill="#0ff" opacity="0.6" />
                    <rect x="19" y="19" width="2" height="2" rx="1" fill="#fff" />
                  </g>
                </svg>
                <span className="font-bold text-lg tracking-wide">Salem Cyber Vault</span>
              </div>
              <span className="block text-xs mt-1">Powered by CVEDB, Shodan, VirusTotal, AbuseIPDB, GreyNoise, Google Custom Search APIs</span>
            </footer>
            <Toaster />
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
