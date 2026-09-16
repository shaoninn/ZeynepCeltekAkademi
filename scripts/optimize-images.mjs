#!/usr/bin/env node
/**
 * Pre-generate WebP (and mobile -sm) assets for LCP / image delivery.
 * Hostinger skips Next.js sharp optimizer at runtime — bake formats at build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

async function writeWebp(inputPath, outputPath, width, quality) {
  if (!fs.existsSync(inputPath)) return false;
  const outAbs = path.join(publicDir, outputPath);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, alphaQuality: 90 })
    .toFile(outAbs);
  const after = fs.statSync(outAbs).size;
  console.log(`✓ ${outputPath} (${Math.round(after / 1024)}KB)`);
  return true;
}

async function bakeDir(relDir, fullW, smW, recursive = false) {
  const dir = path.join(publicDir, relDir);
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const childRel = path.join(relDir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (recursive) await bakeDir(childRel, fullW, smW, true);
      continue;
    }
    if (!/\.(jpe?g|png)$/i.test(entry.name)) continue;
    const base = entry.name.replace(/\.(jpe?g|png)$/i, "");
    const input = path.join(dir, entry.name);
    const webpRel = path.join(relDir, `${base}.webp`).replace(/\\/g, "/");
    const smRel = path.join(relDir, `${base}-sm.webp`).replace(/\\/g, "/");
    await writeWebp(input, webpRel, fullW, 80);
    await writeWebp(input, smRel, smW, 72);
  }
}

async function main() {
  await writeWebp(
    path.join(publicDir, "images/logo/logo-nobg.png"),
    "images/logo/logo-header.webp",
    320,
    82
  );
  await writeWebp(
    path.join(publicDir, "images/hero/hero-academy.jpg"),
    "images/hero/hero-academy.webp",
    1100,
    78
  );
  await writeWebp(
    path.join(publicDir, "images/hero/hero-academy.jpg"),
    "images/hero/hero-academy-sm.webp",
    640,
    68
  );

  for (const d of ["courses", "gallery", "facility", "about", "blog"]) {
    await bakeDir(`images/${d}`, 1200, 640);
  }
  await bakeDir("uploads", 1200, 640, true);

  const ogSrc = path.join(publicDir, "images/about/about-1.jpg");
  const ogJpg = path.join(publicDir, "images/og.jpg");
  const ogWebp = path.join(publicDir, "images/og.webp");
  if (fs.existsSync(ogSrc)) {
    fs.mkdirSync(path.dirname(ogJpg), { recursive: true });
    await sharp(ogSrc)
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82 })
      .toFile(ogJpg);
    await sharp(ogSrc)
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .webp({ quality: 80, effort: 6 })
      .toFile(ogWebp);
    console.log("✓ images/og.jpg + images/og.webp");
  }
}

main().catch((err) => {
  console.error("[optimize-images]", err);
  process.exit(1);
});
