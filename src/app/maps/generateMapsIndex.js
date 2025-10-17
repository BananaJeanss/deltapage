// this shouldn't be necessary to run yourself since maps.json already exists
// generates index of all maps in public/Maps for usage with the cdn
// clone of generateSpritesIndex.js pretty much

import fs from "fs";
import path from "path";

const CDN_BASE =
  process.env.SPRITES_CDN_BASE ||
  "https://deltapagemaps.bnajns.hackclub.app";
const rootDir = path.join(process.cwd(), "public", "Maps");

try {
  function collect(dir, urlBase) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const result = [];
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      const url = `${urlBase}/${e.name}`;
      if (e.isDirectory()) result.push(...collect(abs, url));
      else if (/\.(png|jpg|jpeg|webp)$/i.test(e.name)) {
        result.push({
          url: url,
          filename: e.name
        });
      }
    }
    return result;
  }

  const chapters = fs
    .readdirSync(rootDir)
    .filter((d) => d.toLowerCase().startsWith("chapter"))
    .sort();

  const data = {};

  for (const chapter of chapters) {
    const chapterPath = path.join(rootDir, chapter);
    const files = collect(chapterPath, `${CDN_BASE}/${chapter}`);
    data[chapter] = files;
  }

  fs.writeFileSync(
    process.cwd() + "/src/app/maps/maps.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
  console.log("maps.json generated successfully");
} catch (error) {
  console.error("Error generating maps.json:", error);
  process.exit(1);
}