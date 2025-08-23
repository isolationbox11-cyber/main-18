import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Server-side translation using LibreTranslate (free, open source)
export async function translateToEnglish(text: string): Promise<string> {
  if (!text) { return ""; }
  // LibreTranslate public endpoint (rate-limited, for demo)
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target: "en",
      format: "text"
    })
  });
  if (!res.ok) { return text; }
  const data = await res.json();
  return data.translatedText || text;
}
