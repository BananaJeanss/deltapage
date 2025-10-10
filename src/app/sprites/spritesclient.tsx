"use client";

import { useState } from "react";

export default function SpritesClient({
  data,
}: {
  data: Record<string, Record<string, string[]>>;
}) {
  const chapters = Object.keys(data);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0] || "");
  const [selectedSprite, setSelectedSprite] = useState("");
  const [currentBg, setCurrentBg] = useState("squaredbg");

  const spriteNames = selectedChapter ? Object.keys(data[selectedChapter]) : [];
  const images =
    selectedChapter && selectedSprite
      ? data[selectedChapter][selectedSprite]
      : [];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Sprites</h1>
      <div className="flex flex-row gap-4 mb-4">
        <select
          className="border border-gray-300 p-2 bg-white dark:bg-black"
          value={selectedChapter}
          onChange={(e) => {
            setSelectedChapter(e.target.value);
            setSelectedSprite("");
          }}
        >
          {chapters.map((ch) => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 p-2 bg-white dark:bg-black"
          value={selectedSprite}
          onChange={(e) => setSelectedSprite(e.target.value)}
        >
          <option value="">Select Sprite</option>
          {spriteNames.map((sp) => (
            <option key={sp} value={sp}>
              {sp}
            </option>
          ))}
        </select>

        <div>
          <button
            className="border border-gray-300 p-2 w-10 h-10 squaredbg cursor-pointer"
            onClick={() => setCurrentBg("squaredbg")}
          ></button>
          <button
            className="border border-gray-300 p-2 w-10 h-10 whitebg cursor-pointer"
            onClick={() => setCurrentBg("whitebg")}
          ></button>
          <button
            className="border border-gray-300 p-2 w-10 h-10 darkbg cursor-pointer"
            onClick={() => setCurrentBg("darkbg")}
          ></button>
        </div>
      </div>

      {selectedSprite && images.length === 0 && (
        <div className="text-red-500">No images found for this selection.</div>
      )}

      <div className="flex flex-wrap gap-4">
        {images.map((img) => (
          <div
            key={img}
            className={`border border-gray-300 ${currentBg}`}
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
            title={img}
          >
            <img
              src={encodeURI(img)}
              alt={img}
              width={96}
              height={96}
              loading="lazy"
              onError={() => console.warn("Failed to load image:", img)}
              style={{
                imageRendering: "pixelated",
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
