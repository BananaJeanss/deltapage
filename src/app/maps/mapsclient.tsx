"use client";

import { useState } from "react";

interface MapFile {
  url: string;
  filename: string;
}

export default function MapsClient({
  data,
}: {
  data: Record<string, MapFile[]>;
}) {
  const chapters = Object.keys(data);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0] || "");

  const maps = selectedChapter ? data[selectedChapter] : [];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Maps</h1>{" "}
      {/* i shouldve called this rooms but whatever might rename later */}
      <div className="flex flex-row gap-4 mb-4">
        <select
          className="border border-gray-300 p-2 bg-white dark:bg-black"
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
        >
          {chapters.map((ch) => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      </div>
      {maps.length === 0 && (
        <div className="text-red-500">No maps found for this chapter.</div>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {maps.map((map) => (
          <div key={map.url} className="flex flex-col items-center gap-2">
            <div
              className={`border border-gray-300`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              title={map.filename}
            >
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={encodeURI(map.url)}
                alt={map.filename}
                loading="lazy"
                onError={() => console.warn("Failed to load map:", map.url)}
                style={{
                  objectFit: "contain",
                  maxWidth: "25vh",
                  maxHeight: "100%",
                }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {map.filename}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
