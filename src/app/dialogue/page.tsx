import DialogueClient from "./dialogueclient";

import fs from "fs";
import path from "path";

export type DialogueData = Record<string, { en: string[]; ja: string[] }>;

function normalizeDialogue(s: string) {
  return s.replaceAll("&", "\n").trim();
}

function isMeta(line: string) {
  const l = line.trim();
  if (!l) return true;
  if (l.startsWith("obj_")) return true;
  if (l.startsWith("scr_")) return true;
  if (l.startsWith("gml_")) return true;
  if (l.startsWith("snd_")) return true;
  if (l.toLowerCase() === "dialogue") return true;

  if (l === "prototype") return true;
  if (l === "arguments") return true;
  if (l === "ConsolePS4") return true;
  if (l === "ConsoleSwitch") return true;
  if (l === "Console") return true;
  if (l === "Default") return true;
  if (l === "undefined") return true;
  if (l === "method") return true;
  if (l === "struct") return true;
  if (l.startsWith("@@")) return true;
  if (l.startsWith("argument")) return true;
  if (l.includes(".win")) return true;
  if (l.includes(".sav")) return true;
  if (l.startsWith("rom:")) return true;
  if (l.startsWith("-game")) return true;
  if (l.startsWith("/..")) return true;
  if (l.startsWith("../")) return true;
  if (l.startsWith("/../")) return true;
  if (l.startsWith("/app0/")) return true;
  if (l === "gamepad lost") return true;
  if (l === "gamepad discovered") return true;
  if (l === "focus state changed") return true;
  if (l === "load in progress") return true;
  if (l === "DELTARUNE Save Data") return true;
  if (
    l.includes("_ps4/") ||
    l.includes("_ps5/") ||
    l.includes("_switch/") ||
    l.includes("_mac/") ||
    l.includes("_windows/")
  )
    return true;
  if (l === "Attempting to launch Chapter") return true;
  if (/^_[a-z]+$/.test(l)) return true; // _switch, _ps4, etc.
  if (l === "1" || l === "0") return true;

  if (/^[a-z_][a-z0-9_]*$/i.test(l) && !l.includes(" ")) return true;

  if (l === "texture_groups") return true;
  if (l === "audio_groups") return true;

  if (l.startsWith("***")) return true;
  if (l.includes("#define")) return true;

  return false;
}
function extractEnglishDialogues(lines: string[]) {
  let out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] ?? "").trim();
    if (!line || line === "%") continue;

    if (isMeta(line)) {
      // advance to next non-meta
      let j = i + 1;
      while (j < lines.length && isMeta(String(lines[j] ?? ""))) j++;
      if (j < lines.length) {
        out.push(normalizeDialogue(String(lines[j])));
        i = j; // jump to the consumed dialogue line
      }
    } else {
      // Chapter 1 (no obj_) or any non-meta line
      out.push(normalizeDialogue(line));
    }
  }
  return out
    .map(ParseUnicodeEscapeSequences)
    .filter((s) => s.trim().length > 0);
}

function extractJapaneseDialogues(lines: string[]) {
  let temp1 = lines.map(String).map(normalizeDialogue).filter(Boolean);
  return temp1
    .map(ParseUnicodeEscapeSequences)
    .filter((s) => s.trim().length > 0);
}

function ParseUnicodeEscapeSequences(str: string): string {
  str = cleanupControlChars(str);
  return str
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
}

function cleanupControlChars(str: string): string {
  // cleans up control chars, irrelevant outside of game engine pretty much
  return str
    .replace(/\^\d+/g, "")
    .replace(/\\M\d+/g, "")
    .replace(/%%/g, "")
    .replace(/\\[ECFTS]\d+/g, "") // \E0 \C1 \F2 \T3 \S4 etc
    .replace(/\\[FTEc][a-zA-Z]/g, "") // \Fa \Fc \Fe \Ft \TE etc
    .replace(/%/g, "")
    .replace(/~1./g, "...")
    .replace(/#Yes/g, "Yes")
    .replace(/#No/g, "No")
    .replace(/\s+/g, " ")
    .replace(/\/$/, "")
    .trim();
}

function parseJsonFile(filePath: string): string[] {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (Array.isArray(raw)) {
      return raw.map(String);
    }

    if (raw && typeof raw === "object") {
      const entries = Object.entries(raw as Record<string, unknown>);
      const stringsEntry = entries.find(
        ([k, v]) => k.toLowerCase() === "strings" && Array.isArray(v)
      );
      if (stringsEntry && Array.isArray(stringsEntry[1])) {
        return (stringsEntry[1] as unknown[]).map(String);
      }
      const flat: string[] = [];
      for (const v of Object.values(raw as Record<string, unknown>)) {
        if (typeof v === "string") {
          flat.push(v);
        } else if (Array.isArray(v)) {
          for (const item of v) {
            if (typeof item === "string") flat.push(item);
          }
        }
      }
      return flat;
    }
  } catch (e) {
    console.error("Failed to parse JSON:", filePath, e);
  }
  return [];
}

export function getDialogueData(): DialogueData {
  const root = path.join(process.cwd(), "src", "app", "dialogue", "lang");

  if (!fs.existsSync(root)) {
    console.error(`Directory not found: ${root}`);
    return {};
  }

  // Read actual directories in the lang folder
  const allEntries = fs.readdirSync(root, { withFileTypes: true });
  const chapters = allEntries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("ch"))
    .map((entry) => entry.name)
    .sort();

  console.log(`Found chapters: ${chapters.join(", ")}`);

  const data: DialogueData = {};
  
  // the lang files are stupid because they contain lines from previous chapters too
  const seenEnLines = new Set<string>();
  const seenJaLines = new Set<string>();

  for (const ch of chapters) {
    const dir = path.join(root, ch);
    const enPath = path.join(dir, "lang_en.json");
    const jaPath = path.join(dir, "lang_ja.json");

    const enRaw: string[] = fs.existsSync(enPath) ? parseJsonFile(enPath) : [];
    const jaRaw: string[] = fs.existsSync(jaPath) ? parseJsonFile(jaPath) : [];

    const enExtracted = extractEnglishDialogues(enRaw);
    const jaExtracted = extractJapaneseDialogues(jaRaw);

    // Filter out lines that appeared in previous chapters
    const enUnique = enExtracted.filter(line => {
      if (seenEnLines.has(line)) return false;
      seenEnLines.add(line);
      return true;
    });

    const jaUnique = jaExtracted.filter(line => {
      if (seenJaLines.has(line)) return false;
      seenJaLines.add(line);
      return true;
    });

    data[ch] = {
      en: enUnique,
      ja: jaUnique,
    };

    console.log(
      `Loaded ${ch}: ${data[ch].en.length} EN lines, ${data[ch].ja.length} JA lines (deduplicated)`
    );
  }

  return data;
}

export default function DialoguePage() {
  const data = getDialogueData();
  console.log("Chapters data loaded for chapters:", Object.keys(data));
  return <DialogueClient data={data} />;
}
