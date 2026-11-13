// ai-happy-01 — "Make the AI judge happy"
//
// This program's whole job is to deliver the entry image to the
// grader's output directory. The picture itself lives in this repo
// as entry.png (a laughing girl in a yellow raincoat sharing a big
// red umbrella with a golden retriever puppy, in warm golden-hour
// rain), and all we do here is copy it to /output/entry.png.
//
// It runs with plain Node 22 and the standard library only, so it
// needs no install step and no network at all.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The image that ships with this repository, next to this file.
const here = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(here, "entry.png");

// The grader tells us where to write through MAKEFUN_OUTPUT_DIR;
// when it is not set we fall back to /output, the documented
// default for this competition.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetImage = join(resolve(outputDir), "entry.png");

// The output directory may not exist yet in a fresh container,
// so create it (and any missing parents) before copying.
mkdirSync(outputDir, { recursive: true });

if (!existsSync(sourceImage)) {
  throw new Error(`entry image not found: ${sourceImage}`);
}

copyFileSync(sourceImage, targetImage);

// Guard: the grader runs this program twice and expects the same
// bytes both times, so confirm the copy actually landed intact
// before we report success. A short or missing file is a failure
// here, not something to silently leave behind.
const written = readFileSync(targetImage);
const original = readFileSync(sourceImage);
if (!written.equals(original)) {
  throw new Error(`copy mismatch: ${targetImage} differs from ${sourceImage}`);
}

console.log(`Wrote ${targetImage} (${written.length} bytes)`);
