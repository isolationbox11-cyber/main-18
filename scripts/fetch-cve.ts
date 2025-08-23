import fs from "fs";
import fetch from "node-fetch";

const FEED_URL = "https://raw.githubusercontent.com/CVEProject/cve-datafeeds/main/feed.json";
const OUT_PATH = "./public/cve-feed.json";

async function fetchCVEFeed() {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Failed to fetch CVE feed: ${res.status}`);
  const data = await res.json();
  fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));
  console.log(`CVE feed written to ${OUT_PATH}`);
}

fetchCVEFeed().catch((e) => {
  console.error(e);
  process.exit(1);
});
