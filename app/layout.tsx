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
      <body className="bg-black min-h-screen antialiased">
        <QueryProvider>
          {/* Global Error Boundary */}
          <div id="global-error-boundary">
            <FloatingEyes />
            {/* Figma-style top bar, no sidebar, nothing overlays results */}
            <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-pink-100/80 via-purple-100/60 to-blue-100/80 backdrop-blur border-b border-pink-200/30 shadow-lg">
              <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
                <div className="flex items-center gap-3">
                  {/* Feminine cyber-themed SVG icon */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-cyber animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="#e879f9" strokeWidth="2" fill="#fdf2f8" />
                    <path d="M20 8 Q32 20 20 32 Q8 20 20 8 Z" fill="#c4b5fd" opacity="0.7" />
                    <circle cx="20" cy="20" r="7" fill="#f472b6" opacity="0.8" />
                    <g>
                      <rect x="17" y="17" width="6" height="6" rx="3" fill="#fdf2f8" opacity="0.6" />
                      <rect x="19" y="19" width="2" height="2" rx="1" fill="#fff" />
                    </g>
                    <g>
                      <path d="M20 2 L20 8" stroke="#e879f9" strokeWidth="1.5" />
                      <path d="M20 32 L20 38" stroke="#e879f9" strokeWidth="1.5" />
                      <path d="M2 20 L8 20" stroke="#e879f9" strokeWidth="1.5" />
                      <path d="M32 20 L38 20" stroke="#e879f9" strokeWidth="1.5" />
                    </g>
                  </svg>
                  <span className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 font-serif">Salem Cyber Vault</span>
                </div>
                <div className="flex items-center gap-4">
                  {/* Search input */}
                  <div className="relative w-48 md:w-64">
                    <input
                      type="text"
                      className="bg-pink-50/80 text-purple-700 placeholder-transparent rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 font-serif"
                      style={{ zIndex: 1 }}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-serif text-base pointer-events-none select-none opacity-80" style={{ zIndex: 2 }}>
                      Explore the Vault: Google, Threats, Domains...
                    </span>
                  </div>
                  {/* Notification icon */}
                  <button className="relative p-2 rounded-full hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <svg width="24" height="24" fill="none" stroke="#c4b5fd" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22c1.1 0 2-.9 2-2H10a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.7 1.7A1 1 0 006 20h12a1 1 0 00.7-1.7L18 16z" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                  </button>
                  {/* User avatar */}
                  <button className="ml-2 p-1 rounded-full hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <img src="/placeholder-user.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-pink-400 shadow-lg" />
                  </button>
                </div>
              </div>
            </header>
            {/* Main dashboard area, full width, no overlays or sidebar */}
            <main className="w-full mx-auto px-0 md:px-0 lg:px-0">
              <div className="max-w-7xl mx-auto py-8 px-2 md:px-8">
                {children}
              </div>
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
