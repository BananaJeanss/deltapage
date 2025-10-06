"use client";

import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";

const DEFAULT_GRID_SIZE = 16;
const DEFAULT_GRID_COLOR = "#fff";
const DEFAULT_SELECTED_COLOR = "#000000";

// based off this tutorial
// https://www.youtube.com/watch?v=HN7FhKPTohA

export default function spriteMakerPage() {
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
    <>
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
      <div className="flex flex-row gap-4 justify-center items-center content-center">
        <div className="mt-4 border p-4 rounded">
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
          onClick={() => handleGridChange(gridSize)}
          className="mt-4 p-4 flex flex-row border border-red-500  justify-center items-center gap-2 cursor-pointer rounded mb-2"
        >
          <Trash2Icon className=" text-red-500 " />
          <span className="text-red-500 ">Clear Grid</span>
        </div>
      </div>
    </>
  );
}
