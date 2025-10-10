import fs from "fs";
import path from "path";
import { distance } from "fastest-levenshtein";

const ROOT = path.resolve("public/SpritesSprites");
const CHAPTERS = fs.readdirSync(ROOT).filter(d => d.startsWith("Chapter"));

const SIMILARITY_THRESHOLD = 2;

for (const chapter of CHAPTERS) {
  const chapterPath = path.join(ROOT, chapter);
  const entries = fs.readdirSync(chapterPath, { withFileTypes: true });
  const folders = entries
    .filter(e => e.isDirectory() && e.name.startsWith("spr_")) // only sprite folders
    .map(e => e.name);

  const groups = {};

  for (const folder of folders) {
    const base = folder.replace(/^spr_/, "").split("_")[0];
    let match = Object.keys(groups).find(
      key => distance(key, base) <= SIMILARITY_THRESHOLD
    );

    if (!match) {
      match = base;
      groups[match] = [];
    }
    groups[match].push(folder);
  }

  for (const [group, subfolders] of Object.entries(groups)) {
    const groupDir = path.join(chapterPath, group);
    fs.mkdirSync(groupDir, { recursive: true });

    for (const sub of subfolders) {
      const src = path.join(chapterPath, sub);
      const dest = path.join(groupDir, sub);

      // skip self-moves
      if (src === dest || src.startsWith(dest)) continue;

      try {
        fs.renameSync(src, dest);
        console.log(`Moved ${sub} → ${group}/`);
      } catch (err) {
        console.error(`!! Failed to move ${sub}:`, err.message);
      }
    }
  }

  console.log(`${chapter} grouped ${folders.length} folders into ${Object.keys(groups).length} groups.`);
}
