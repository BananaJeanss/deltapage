"use server";

import {
  createCanvas,
  loadImage,
  registerFont,
  type CanvasRenderingContext2D,
} from "canvas";
import fs from "fs";
import path from "path";

// custom font registration
const fontPath = path.join(process.cwd(), "public", "determination-mono.ttf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "DeterminationMono" });
}

type choices = "Kris" | "Susie" | "Ralsei" | "None";

// copied over from bananajeanss/ralseibot
export async function generateTextbox(text: string, sprite: choices) {
  // values
  const width = 640;
  const height = 155;
  const spriteSize = 100;
  const spriteX = 20;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // White border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 8;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  const spriteY = (height - spriteSize) / 2;

  // Load and draw character sprite
  const spritePath = path.join(
    process.cwd(),
    "public",
    "sprites",
    `${sprite}.png`
  );
  // if this bullshit does not work im done with vercel
  try {
    const spriteImage = await loadImage(spritePath);
    // calc aspect ratio to prevent stretching for some sprites
    // (calc is short for calculator)
    const aspectRatio = spriteImage.width / spriteImage.height;
    const drawWidth = spriteSize * aspectRatio;
    const drawHeight = spriteSize;

    ctx.drawImage(spriteImage, spriteX, spriteY, drawWidth, drawHeight);
  } catch (error) {
    console.log(`Could not load sprite for ${sprite}:`, error);
    // Draw a placeholder if sprite doesn't exist
    drawPlaceholderSprite(ctx, sprite);
  }

  // font settings
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "28px DeterminationMono, monospace";

  // Word wrap and draw text
  const maxWidth = width - 140;
  const lineHeight = 25;
  const startX = 125;
  const startY = 50;

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  // draw text
  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // break any lines that are still too long
  const wrappedLines: string[] = [];
  for (const line of lines) {
    let remainingText = line;

    while (remainingText.length > 0) {
      const lineMetrics = ctx.measureText(remainingText);

      if (lineMetrics.width <= maxWidth) {
        wrappedLines.push(remainingText);
        break;
      }

      let fit = "";
      for (let i = 1; i <= remainingText.length; i++) {
        const test = remainingText.substring(0, i);
        if (ctx.measureText(test).width > maxWidth) {
          break;
        }
        fit = test;
      }

      if (fit.length === 0) {
        fit = remainingText.substring(0, 1);
      }

      wrappedLines.push(fit);
      remainingText = remainingText.substring(fit.length);
    }
  }

  // Draw each line of text
  wrappedLines.forEach((line, index) => {
    if (index < 4) {
      // Limit to 4 lines to fit in textbox
      ctx.fillText(line, startX, startY + index * lineHeight);
    }
  });

  return canvas.toDataURL();

  function drawPlaceholderSprite(
    ctx: CanvasRenderingContext2D,
    character: string
  ) {
    if (character === "None") return; // dont draw anything if None
    // Draw a colored placeholder rectangle
    const colors: { [key: string]: string } = {
      kris: "#4A90E2",
      susie: "#9013FE",
      ralsei: "#4CAF50",
    };

    const spriteY = (155 - spriteSize) / 2;

    ctx.fillStyle = colors[character] || "#444444";
    ctx.fillRect(spriteX, spriteY, spriteSize, spriteSize);
    ctx.fillStyle = colors[character] || "#444444";
    ctx.fillRect(spriteX, spriteY, spriteSize, spriteSize);

    // placeholder text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px DeterminationMono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      character.toUpperCase(),
      spriteX + spriteSize / 2,
      spriteY + spriteSize / 2 + 6
    );
    ctx.textAlign = "left";
  }
}
