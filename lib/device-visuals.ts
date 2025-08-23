// Device visuals and fingerprint helpers for Censys results
// Uses free APIs and static mappings for demo purposes

export async function getGeoData(ip: string): Promise<{ country: string; countryCode: string; countryFlagUrl: string; city?: string }> {
  // Use ip-api.com for free geolocation
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  if (!res.ok) { return { country: "Unknown", countryCode: "", countryFlagUrl: "" }; }
  const data = await res.json();
  return {
    country: data.country || "Unknown",
    countryCode: data.countryCode || "",
    countryFlagUrl: data.countryCode ? `https://flagcdn.com/48x36/${data.countryCode.toLowerCase()}.png` : "",
    city: data.city || undefined,
  };
}

export function getDeviceFingerprint(host: any): string {
  // Combine key fields for a simple fingerprint
  const parts = [host.device_type, host.os, host.product, host.version, host.ip];
  return parts.filter(Boolean).join(" | ");
}

export function getDeviceImage(host: any): string {
  // Use static images for common device types
  const type = (host.device_type || "").toLowerCase();
  if (type.includes("camera")) { return "/placeholder-camera.jpg"; }
  if (type.includes("router")) { return "/placeholder-router.jpg"; }
  if (type.includes("server")) { return "/placeholder-server.jpg"; }
  if (type.includes("phone")) { return "/placeholder-phone.jpg"; }
  if (type.includes("printer")) { return "/placeholder-printer.jpg"; }
  if (type.includes("workstation")) { return "/placeholder-workstation.jpg"; }
  // Default generic device
  return "/placeholder-device.jpg";
}
