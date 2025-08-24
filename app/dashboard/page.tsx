import { UnifiedSearch } from "@/components/unified-search";
import { CveFeed } from "@/components/cve-feed";
import CyberMapClient from "@/components/cyber-map-client";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Cyber Map</h1>
  <CyberMapClient />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Unified Search</h1>
        <UnifiedSearch />
        <div className="mt-8">
          <CveFeed />
        </div>
      </div>
    </div>
  );
}
