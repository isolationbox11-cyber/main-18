import { ReactNode } from "react";
import Image from "next/image";
import QueryProvider from "@/components/query-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950 text-white">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
          <span className="text-xl font-bold tracking-wide">SalemCyberVault</span>
          {/* Optional: Avatar badge */}
          <div className="flex items-center gap-2">
            <Image src="/placeholder-user.jpg" alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full border border-white/20" />
            <span className="text-sm">Cyber Explorer</span>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </QueryProvider>
  );
}
