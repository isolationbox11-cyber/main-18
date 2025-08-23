import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { FloatingEyes } from "@/components/floating-eyes";
import QueryProvider from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Cyber Watch Vault - Internet Intelligence Platform",
  description:
    "Advanced cybersecurity intelligence platform for discovering and analyzing internet-connected devices and services.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
      <body className="bg-gradient-to-br from-blue-900 via-black to-blue-950 min-h-screen">
        <QueryProvider>
          <FloatingEyes />
          <header className="relative z-20">
            <div className="w-full px-0 md:px-8 py-4 bg-gradient-to-r from-cyan-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-md border-b border-cyan-700/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-cyber animate-pulse" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="#22d3ee" strokeWidth="2" fill="#0f172a" />
                  <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="#6366f1" />
                  <circle cx="20" cy="20" r="5" fill="#22d3ee" />
                </svg>
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-cyber animate-glow">Salem Cyber Vault</span>
              </div>
              <div className="flex flex-col md:items-end">
                <span className="text-base md:text-lg text-cyan-200 font-medium">Internet Intelligence Platform</span>
                <span className="text-xs text-slate-400 italic">Real-time cyber threat analytics &amp; investigation</span>
              </div>
            </div>
          </header>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
