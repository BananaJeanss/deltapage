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

export default function textboxGenerator() {
  const [text, setText] = React.useState("");
  const [sprite, setSprite] = React.useState("Kris");
  const [style, setStyle] = React.useState("Light World");
  const [imageSrc, setImageSrc] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [charsLeft, setCharsLeft] = React.useState(90);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateTextbox(
        text,
        sprite as keyof typeof choices,
        style
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
            <img src={imageSrc} alt="Generated Textbox" />
          ) : (
            <p>No image generated yet.</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/4 h-50">
          <p>Text</p>
            <p className="text-sm text-gray-500">{charsLeft} characters left</p>
          <textarea
            value={text}
            className="border border-gray-300 rounded p-2 h-full "
            onChange={(e) => { setText(e.target.value); setCharsLeft(90 - e.target.value.length); }}
          />
        </div>
        <div className="flex flex-row gap-2 w-1/4">
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
          >
            Generate
          </button>
        </div>
      </div>
    </>
  );
}
