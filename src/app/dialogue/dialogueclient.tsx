"use client";

import { useMemo, useState } from "react";
import type { DialogueData } from "./page";

export default function DialogueClient({ data }: { data: DialogueData }) {
  const chapters = useMemo(() => Object.keys(data).sort(), [data]);
  const selectedGame = "Deltarune"; // i cba to add undertale support the strings from data.win are too messy
  const [selectedChapter, setSelectedChapter] = useState(chapters[0] || "ch1");
  const [lang, setLang] = useState<"en" | "ja">("en");

  const lines = data[selectedChapter]?.[lang] ?? [];

  return (
    <div className="flex flex-col items-center ">
      <h1>Dialogues</h1>
      <div className="flex flex-row gap-4 mb-4">

        {selectedGame === "Deltarune" && (
          <>
            <select
              className="border border-gray-300 p-2 bg-white dark:bg-black"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              {chapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch.replace("ch", "Chapter ")}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 p-2 bg-white dark:bg-black"
              value={lang}
              onChange={(e) => setLang(e.target.value as "en" | "ja")}
            >
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </>
        )}
      </div>

      <div className="whitespace-pre-wrap leading-relaxed">
        {lines.length === 0 ? (
          <p className="text-gray-500">No dialogue found.</p>
        ) : (
          <ul className="list-disc ml-6 flex flex-col items-center justify-center text-wrap">
            {lines.map((l, i) => (
              <li key={i} className="text-wrap break-all overflow-hidden">{l}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
