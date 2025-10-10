import fs from "fs";
import path from "path";
import SpritesClient from "./spritesclient";

export const dynamic = "force-static";

function getSpritesData() {
  const rootDir = path.join(process.cwd(), "public", "SpritesSprites");
  const chapters = fs
    .readdirSync(rootDir)
    .filter((dir) => dir.toLowerCase().startsWith("chapter"));

  const data: Record<string, Record<string, string[]>> = {};

  function collectImagesRecursively(dirAbsPath: string, urlBase: string): string[] {
    const entries = fs.readdirSync(dirAbsPath, { withFileTypes: true });
    const results: string[] = [];
    for (const entry of entries) {
      const abs = path.join(dirAbsPath, entry.name);
      const url = `${urlBase}/${entry.name}`;
      if (entry.isDirectory()) {
        results.push(...collectImagesRecursively(abs, url));
      } else if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        results.push(url);
      }
    }
    return results;
  }

  for (const chapter of chapters) {
    const chapterPath = path.join(rootDir, chapter);
    const charFolders = fs
      .readdirSync(chapterPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    data[chapter] = {};

    for (const charFolder of charFolders) {
      const charPath = path.join(chapterPath, charFolder);
      const urlBase = `/SpritesSprites/${chapter}/${charFolder}`;
      const files = collectImagesRecursively(charPath, urlBase);

      data[chapter][charFolder] = files;
    }
  }

  return data;
}

export default function SpritesPage() {
  const data = getSpritesData();
  return <SpritesClient data={data} />;
}