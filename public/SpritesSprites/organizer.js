// THIS WILL MOST LIKELY NOT WORK ON VERCEL FREE PLAN
// You will run out of the free plan request limit
// keeping this file for the sake of hackatime

import fs from "fs";
import path from "path";
import { put, del, list } from "@vercel/blob";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Error: BLOB_READ_WRITE_TOKEN environment variable is not set.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ROOT = path.resolve("public/SpritesSprites");
const CHAPTERS = fs.readdirSync(ROOT).filter(d => d.startsWith("Chapter"));

const CONCURRENCY = 10;
const BATCH_LOG_INTERVAL = 100;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1s base for non-429 retries, 429 uses server-provided wait when available

const askQuestion = (question) => new Promise((resolve) => rl.question(question, resolve));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseRetryAfterMs(err) {
  const msg = String(err?.message || "");
  const m = /try again in\s+(\d+)\s*seconds?/i.exec(msg);
  if (m) return Number(m[1]) * 1000;

  // Try standard Retry-After header if present
  const header = err?.response?.headers?.["retry-after"] || err?.headers?.["retry-after"];
  if (header) {
    const secs = Number(header);
    if (!Number.isNaN(secs)) return secs * 1000;
  }
  return null;
}

function isRateLimitError(err) {
  const msg = String(err?.message || "");
  return err?.status === 429 ||
         err?.statusCode === 429 ||
         err?.response?.status === 429 ||
         /Too many requests/i.test(msg);
}

async function deleteWithRetry(url) {
  let attempt = 0;
  for (;;) {
    try {
      await del(url);
      return true;
    } catch (err) {
      if (isRateLimitError(err)) {
        const waitMs = parseRetryAfterMs(err) ?? Math.min(60000, INITIAL_RETRY_DELAY * Math.pow(2, attempt));
        console.warn(`429 deleting ${url}. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        await sleep(waitMs);
        attempt++;
        continue;
      }
      // Consider 404 as already deleted
      if (err?.status === 404 || /Not\s*Found/i.test(String(err?.message || ""))) {
        return true;
      }
      attempt++;
      if (attempt > MAX_RETRIES) {
        console.error(`Failed to delete ${url}: ${err?.message || err}`);
        return false;
      }
      const waitMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      await sleep(waitMs);
    }
  }
}

async function clearExistingSprites() {
  console.log("🗑️  Clearing existing sprites from Blob...");
  let cursor = undefined;
  let deletedCount = 0;

  do {
    const { blobs, hasMore, cursor: next } = await list({ prefix: "sprites/", cursor });

    for (let i = 0; i < blobs.length; i += CONCURRENCY) {
      const batch = blobs.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((b) => deleteWithRetry(b.url)));
      deletedCount += results.filter(Boolean).length;
    }

    cursor = hasMore ? next : undefined;
  } while (cursor);

  console.log(`Deleted ${deletedCount} existing files`);
}

function collectFiles() {
  const files = [];

  function walk(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const blobKey = `sprites/${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(fullPath, `${prefix}/${entry.name}`);
      } else if (/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) {
        files.push({ fullPath, blobKey });
      }
    }
  }

  for (const chapter of CHAPTERS) {
    walk(path.join(ROOT, chapter), chapter);
  }
  return files;
}

async function uploadFileWithRetry(fullPath, blobKey) {
  let attempt = 0;
  for (;;) {
    try {
      const stream = fs.createReadStream(fullPath);
      await put(blobKey, stream, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true
      });
      return { success: true };
    } catch (err) {
      if (isRateLimitError(err)) {
        const waitMs = parseRetryAfterMs(err) ?? Math.min(60000, INITIAL_RETRY_DELAY * Math.pow(2, attempt));
        console.warn(`${blobKey}: 429 rate limited. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        await sleep(waitMs);
        attempt++;
        continue;
      }
      attempt++;
      if (attempt > MAX_RETRIES) {
        return { success: false, error: err?.message || String(err) };
      }
      const waitMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
      console.warn(`${blobKey}: error "${err?.message || err}". Retrying in ${Math.ceil(waitMs / 1000)}s...`);
      await sleep(waitMs);
    }
  }
}

async function uploadSprites() {
  console.log("Scanning filesystem...");
  const files = collectFiles();
  console.log(`Uploading ${files.length} sprites to Blob...`);

  let uploadedCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);

    const uploadPromises = batch.map(async ({ fullPath, blobKey }) => {
      const result = await uploadFileWithRetry(fullPath, blobKey);
      if (result.success) {
        uploadedCount++;
        if (uploadedCount % BATCH_LOG_INTERVAL === 0) {
          const rate = (uploadedCount / (Date.now() - startTime) * 1000).toFixed(1);
          const eta = ((files.length - uploadedCount) / Number(rate || 1)).toFixed(0);
          console.log(`Progress: ${uploadedCount}/${files.length} (${rate}/s, ETA: ${eta}s)`);
        }
      } else {
        failedCount++;
        console.error(`${blobKey}: ${result.error}`);
      }
    });

    await Promise.all(uploadPromises);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Uploaded ${uploadedCount} files in ${totalTime}s`);
  if (failedCount > 0) console.log(`${failedCount} files failed`);
}

async function main() {
  try {
    const doClear = await askQuestion('Clear existing sprites from Blob? (y/N): ');
    if (doClear.toLowerCase() === 'y') {
      await clearExistingSprites();
    }
    rl.close();
    await uploadSprites();
    console.log("Upload complete");
  } catch (err) {
    console.error("Upload failed:", err);
    process.exit(1);
  }
}

main();