const pageUrl = "https://moewalls.com/abstract/abstract-organic-lines-live-wallpaper/";
const response = await fetch(pageUrl, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36",
    "accept-language": "en-US,en;q=0.9",
  },
});

if (!response.ok) throw new Error(`MoeWalls page returned ${response.status}`);
const html = (await response.text()).replaceAll("\\/", "/").replaceAll("&amp;", "&");
const matches = [...html.matchAll(/https?:\/\/[^\s"'<>]+\.mp4(?:\?[^\s"'<>]*)?/gi)].map((m) => m[0]);
console.log("FOOTER_WALLPAPER_CANDIDATES", JSON.stringify([...new Set(matches)]));
