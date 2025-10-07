"use client";

import { useEffect } from "react";
import { generateTextbox } from "./generateTextbox";
import React from "react";

const choices = {
  ["Kris"]: "/sprites/kris.png",
  ["Susie"]: "/sprites/susie.png",
  ["Ralsei"]: "/sprites/ralsei.png",
  ["None"]: null,
};

export default function TextboxGenerator() {
  const [text, setText] = React.useState("");
  const [sprite, setSprite] = React.useState("Kris");
  const [style, setStyle] = React.useState("Light World");
  const [imageSrc, setImageSrc] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const charLimit = 116;
  const [charsLeft, setCharsLeft] = React.useState(charLimit);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateTextbox(
        text,
        sprite as keyof typeof choices,
      );
      setImageSrc(result);
    } catch (error) {
      console.error("Error generating textbox:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // set sprite choices
  useEffect(() => {
    function setSpriteOptions() {
      const select = document.getElementById(
        "sprite-select"
      ) as HTMLSelectElement;
      // clear existing options if any
      if (select && select.innerHTML) {
        select.innerHTML = "";
      }
      if (select) {
        Object.keys(choices).forEach((key) => {
          const option = document.createElement("option");
          option.value = key;
          option.text = key;
          select.appendChild(option);
        });
      }
    }

    setSpriteOptions();
  }, []);

  return (
    <>
      <h1>Textbox Generator</h1>
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <div>
          {imageSrc ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Generated Textbox" />
              <p
                className="text-sm text-blue-400 cursor-pointer"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imageSrc;
                  link.download = "textbox.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download as PNG
              </p>
            </div>
          ) : (
            <p>No image generated yet.</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full h-50 items-center">
          <p className="flex items-center gap-2">
            Text
            <span className="text-sm text-gray-500">
              {charsLeft} characters left
            </span>
          </p>
          <textarea
            value={text}
            className="border border-gray-300 rounded p-2 h-full max-w-lg w-3/4"
            maxLength={charLimit}
            onChange={(e) => {
              setText(e.target.value);
              setCharsLeft(charLimit - e.target.value.length);
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-2 w-1/4 justify-center sm:flex-row">
          <div>
            <p>Sprite</p>
            <select
              className="border border-gray-300 p-2 bg-black"
              style={{ fontFamily: "Deltarune" }}
              id="sprite-select"
              onChange={(e) => setSprite(e.target.value)}
              value={sprite}
            ></select>
          </div>
          <div>
            <p>Style</p>
            <select
              className="border border-gray-300 p-2 bg-black"
              style={{ fontFamily: "Deltarune" }}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option>Light World</option>
              <option>Dark World</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            className="bg-gray-800 text-white p-2 rounded self-end cursor-pointer transition hover:bg-gray-600"
            style={{ fontFamily: "Deltarune" }}
            disabled={isGenerating}
          >
            Generate
          </button>
        </div>
      </div>
    </>
  );
}
