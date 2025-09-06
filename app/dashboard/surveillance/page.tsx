'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraFeed } from '@/components/camera-feed'; // Assuming this component exists and is suitable

export default function SurveillanceDashboardPage() {
  // Placeholder data for demonstration
  const stats = [
    { label: 'LIVE', value: '9:51:22 PM', type: 'time' },
    { label: 'Config', value: '+2,847', subValue: '47,892', description: 'Live Devices' },
    { label: 'Critical Exposures', value: '+89', subValue: '1,156', description: 'Unprotected camera feeds' },
    { label: 'Countries', value: '+3', subValue: '187', description: 'Geographic coverage' },
    { label: 'Data Streams', value: '+12.4TB', subValue: '89.2TB', description: 'Live intelligence feeds' },
    { label: 'Intelligence Sources', value: 'stable', subValue: '7', description: 'Connected threat feeds' },
    { label: 'Response Time', value: '-23ms', subValue: '145ms', description: 'Average query latency' },
  ];

  const liveFeeds = [
    { ip: '62.200.234.86', port: '8080', location: 'Moscow, Brazil', type: 'Dome Camera', status: 'ONLINE', severity: 'CRITICAL', time: '10 mins ago', feedType: 'Webcam feed' },
    { ip: '175.176.117.39', port: '9000', location: 'New York, Russia', type: 'Webcam', status: 'ONLINE', severity: 'HIGH', time: '25 mins ago', feedType: 'Webcam' },
    { ip: '180.144.123.151', port: '8000', location: 'Beijing, United Kingdom', type: 'PTZ Camera', status: 'SCANNING', severity: 'MEDIUM', time: '1 min ago', feedType: 'IoT Camera feed' },
    { ip: '71.239.156.248', port: '1935', location: 'São Paulo, United States', type: 'IoT Camera', status: 'SCANNING', severity: 'MEDIUM', time: '1 min ago', feedType: 'IoT Camera' },
    { ip: '163.110.45.184', port: '9000', location: 'Berlin, South Korea', type: 'Dome Camera', status: 'ONLINE', severity: 'HIGH', time: '104 mins ago' },
    { ip: '150.220.61.154', port: '554', location: 'Tokyo, United States', type: 'Webcam', status: 'ONLINE', severity: 'LOW', time: '66 mins ago' },
    { ip: '104.230.138.136', port: '9000', location: 'London, United Kingdom', type: 'DVR System', status: 'ONLINE', severity: 'CRITICAL', time: '92 mins ago', feedType: 'Security System feed' },
    { ip: '113.39.73.3', port: '8080', location: 'São Paulo, Japan', type: 'Security System', status: 'ONLINE', severity: 'HIGH', time: '1 min ago' },
  ];

  const trendingTargets = [
    { rank: 1, name: 'camera', count: 3 },
    { rank: 2, name: 'apache country:RU', count: 2 },
    { rank: 3, name: 'cdv', count: 1 },
    { rank: 4, name: 'www.salemcybervault.com', count: 1 },
    { rank: 5, name: 'mklm', count: 1 },
    { rank: 6, name: 'webcam', count: 1 },
  ];

  const securityAlerts = [
    { title: 'Exposed Camera Array Detected', severity: 'Critical', source: 'SHODAN-AUTO', devices: 147, time: '2 mins ago' },
    { title: 'Unauth DVR System Found', severity: 'High', source: 'COMMUNITY', feeds: 23, time: '8 mins ago' },
    { title: 'Vulnerable IoT Cameras', severity: 'High', source: 'VIRUSTOTAL', devices: 89, time: '15 mins ago' },
    { title: 'Open RTSP Streams', severity: 'Medium', source: 'CUSTOM-SCAN', streams: 56, time: '20 mins ago' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-900 text-white p-4">
      <header className="flex items-center justify-between pb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-lg">Real-time intelligence overview</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.type === 'time' && <Badge variant="secondary" className="bg-green-500 text-white">LIVE</Badge>}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subValue && <p className="text-xs text-gray-400">{stat.subValue} {stat.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* Left Column: Live Surveillance Feeds */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Live Surveillance Feeds</CardTitle>
              <p className="text-sm text-gray-400">10 ACTIVE</p>
              <p className="text-xs text-gray-500">Real-time monitoring of discovered surveillance systems across 10 countries</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveFeeds.map((feed, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getSeverityColor(feed.severity)} text-white`}>{feed.status}</Badge>
                      <Badge variant="secondary" className="bg-gray-600 text-white">{feed.severity}</Badge>
                    </div>
                    <p className="text-lg font-bold">{feed.ip}:{feed.port}</p>
                    <p className="text-sm text-gray-400">{feed.location}</p>
                    <p className="text-sm text-gray-400">{feed.type} - {feed.time}</p>
                    {feed.feedType && <p className="text-xs text-gray-500">{feed.feedType}</p>}
                    {/* Actual Camera Feed Component */}
                    <CameraFeed ip={feed.ip} port={Number(feed.port)} />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Trending Targets & Security Alerts */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Trending Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {trendingTargets.map((target, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span>{target.rank}. {target.name}</span>
                    <Badge variant="secondary" className="bg-gray-600 text-white">{target.count}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {securityAlerts.map((alert, index) => (
                  <li key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <Badge className={`${getSeverityColor(alert.severity)} text-white`}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">{alert.source} • {alert.devices || alert.feeds || alert.streams} {alert.devices ? 'devices' : alert.feeds ? 'feeds' : 'streams'}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
