"use client";

import { PaintBucket, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

const DEFAULT_GRID_SIZE = 16;
const DEFAULT_GRID_COLOR = "#fff";
const DEFAULT_SELECTED_COLOR = "#000000";

// based off this tutorial
// https://www.youtube.com/watch?v=HN7FhKPTohA

export default function SpriteMakerPage() {
  const [gridSize, setGridSize] = React.useState(DEFAULT_GRID_SIZE);
  const [grid, setGrid] = React.useState<string[]>(
    Array(gridSize * gridSize).fill(DEFAULT_GRID_COLOR)
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    DEFAULT_SELECTED_COLOR
  );

  const handleCellClick = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = selectedColor;
    setGrid(newGrid);
  };

  const handleGridChange = (newSize: number) => {
    setGridSize(newSize);
    setGrid(Array(newSize * newSize).fill(DEFAULT_GRID_COLOR));
  };

  // this is a bit laggy but whatever for now

  return (
    <div className="flex flex-col items-center align-middle p-4">
      <h1>Sprite Maker</h1>

      <div
        className="grid w-[30rem] h-[30rem] border select-none"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((color, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={(event) => {
              if (event.buttons === 1) {
                handleCellClick(index);
              }
            }}
            className="border"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center content-center flex-wrap sm:flex-row">
        <div className="mt-4 border p-4 rounded flex items-center">
          <label htmlFor="grid-size">Grid Size: </label>
          <input
            id="grid-size"
            className="border p-1 w-16 rounded"
            type="number"
            min={4}
            max={64}
            value={gridSize}
            onChange={(e) => {
              setGridSize(+e.target.value);
              handleGridChange(+e.target.value);
            }}
          />
        </div>
        <div className="mt-4 border p-4 rounded flex items-center gap-4">
          <span className="ml-2">Selected Color: {selectedColor}</span>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>
        <div
          className="mt-4 border p-4 rounded flex items-center gap-4 cursor-pointer"
          onClick={() => {
            setGrid(Array(gridSize * gridSize).fill(selectedColor));
          }}
        >
          <span className="ml-2">Fill</span>
          <PaintBucket />
        </div>
        <div className="mt-4 border p-4 rounded flex items-center gap-2">
          <span className="mr-2">Grid Lines</span>
          <input
            type="checkbox"
            className="border p-4 rounded cursor-pointer"
            value="Show/Hide Grid Lines"
            onClick={() => {
              const gridElement = document.querySelector(".grid");
              if (gridElement) {
                if (gridElement.classList.contains("border")) {
                  gridElement.classList.remove("border");
                  gridElement
                    .querySelectorAll(".border")
                    .forEach((cell) => cell.classList.remove("border"));
                } else {
                  gridElement.classList.add("border");
                  gridElement
                    .querySelectorAll("div")
                    .forEach((cell) => cell.classList.add("border"));
                }
              }
            }}
          />
        </div>
        <div
          onClick={() => handleGridChange(gridSize)}
          className="mt-4 p-4 flex flex-row border border-red-500 justify-center items-center gap-2 cursor-pointer rounded"
        >
          <Trash2Icon className=" text-red-500 " />
          <span className="text-red-500 ">Clear Grid</span>
        </div>
        <div>
          <button
            className="mt-4 p-4 border border-blue-400 text-white rounded cursor-pointer flex items-center"
            value="Export as PNG"
            onClick={() => {
              const canvas = document.createElement("canvas");
              canvas.width = gridSize;
              canvas.height = gridSize;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                grid.forEach((color, index) => {
                  const x = index % gridSize;
                  const y = Math.floor(index / gridSize);
                  ctx.fillStyle = color;
                  ctx.fillRect(x, y, 1, 1);
                });
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = "sprite.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            Export as PNG
          </button>
        </div>
        <div>
          <button
            className="mt-4 p-4 border border-blue-800 text-white rounded cursor-pointer flex items-center"
            value="Export as PNG"
            onClick={() => {
              const scale = 512 / gridSize;
              const smallCanvas = document.createElement("canvas");
              smallCanvas.width = gridSize;
              smallCanvas.height = gridSize;
              const smallCtx = smallCanvas.getContext("2d");

              if (!smallCtx) return;

              grid.forEach((color, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                smallCtx.fillStyle = color;
                smallCtx.fillRect(x, y, 1, 1);
              });

              const bigCanvas = document.createElement("canvas");
              bigCanvas.width = gridSize * scale;
              bigCanvas.height = gridSize * scale;
              const bigCtx = bigCanvas.getContext("2d");

              if (!bigCtx) return;

              // otherwise will be blurred
              bigCtx.imageSmoothingEnabled = false;

              bigCtx.drawImage(
                smallCanvas,
                0,
                0,
                bigCanvas.width,
                bigCanvas.height
              );

              const image = bigCanvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = image;
              link.download = `sprite_512px.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Export as PNG (512x512)
          </button>
        </div>
      </div>
    </div>
  );
}
