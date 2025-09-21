import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

// Using system font fallback instead of Google Fonts for reliable builds
const inter = { className: "font-sans" }

export const metadata: Metadata = {
  title: "Salem Cyber Vault - Internet Intelligence Platform",
  description:
    "Advanced cybersecurity intelligence platform for discovering and analyzing internet-connected devices and services.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
