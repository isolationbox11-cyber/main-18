export const SERVER_API_KEYS = {
  SHODAN: process.env.SHODAN_API_KEY,
  VIRUSTOTAL: process.env.VIRUSTOTAL_API_KEY,
  ABUSEIPDB: process.env.ABUSEIPDB_API_KEY,
  GREYNOISE: process.env.GREYNOISE_API_KEY,
  GOOGLE: process.env.GOOGLE_API_KEY,
  GOOGLE_CSE: process.env.GOOGLE_CSE_ID,
} as const;

if (process.env.NODE_ENV !== 'production') {
  for (const [name, value] of Object.entries(SERVER_API_KEYS)) {
    if (!value) {
      console.warn(`⚠️  ${name} is not set – any API routes that need it will error`);
    }
  }
}
