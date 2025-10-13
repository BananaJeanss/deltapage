"use client";

import { useMemo, useState } from "react";
import type { DialogueData } from "./page";

export default function DialogueClient({ data }: { data: DialogueData }) {
  const [selectedGame, setSelectedGame] = useState("Deltarune");
  const chapters = useMemo(() => Object.keys(data).sort(), [data]);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0] || "ch1");
  const [lang, setLang] = useState<"en" | "ja">("en");

  const lines = data[selectedChapter]?.[lang] ?? [];

  return (
    <div>
      <h1>Dialogues</h1>
      <div className="flex flex-row gap-4 mb-4">
        <select
          className="border border-gray-300 p-2 bg-white dark:bg-black"
          onChange={(e) => setSelectedGame(e.target.value)}
          value={selectedGame}
        >
          <option value="Deltarune">Deltarune</option>
          <option value="Undertale">Undertale</option>
        </select>

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
          <ul className="list-disc ml-6">
            {lines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
