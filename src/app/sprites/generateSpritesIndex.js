// this shouldn't be necessary to run yourself since sprites.json already exists
// generates index of all sprites in public/SpritesSprites for usage with the cdn

import fs from "fs";
import path from "path";

const CDN_BASE =
  process.env.SPRITES_CDN_BASE ||
  "https://deltapagesprites.bnajns.hackclub.app";
const rootDir = path.join(process.cwd(), "public", "SpritesSprites");

try {
  function collect(dir, urlBase) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const result = [];
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      const url = `${urlBase}/${e.name}`;
      if (e.isDirectory()) result.push(...collect(abs, url));
      else if (/\.(png|jpg|jpeg|webp)$/i.test(e.name)) result.push(url);
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
    const charFolders = fs
      .readdirSync(chapterPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    data[chapter] = {};
    for (const char of charFolders) {
      const files = collect(
        path.join(chapterPath, char),
        `${CDN_BASE}/${chapter}/${char}`
      );
      data[chapter][char] = files;
    }
  }

  fs.writeFileSync(
    process.cwd() + "/src/app/sprites/sprites.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
  console.log("sprites.json generated successfully");
} catch (error) {
  console.error("Error generating sprites.json:", error);
  process.exit(1);
}
