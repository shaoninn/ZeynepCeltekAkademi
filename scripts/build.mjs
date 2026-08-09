#!/usr/bin/env node
/**
 * Hostinger often injects NODE_ENV=development into the build job.
 * next build must run as production — force it here.
 *
 * CRITICAL: Panel NODE_OPTIONS=--max-old-space-size=460 kills `next build`
 * (TypeScript phase). Build always raises the heap for child processes.
 * After standalone build, copy public + static into .next/standalone.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

process.env.NODE_ENV = "production";

/** Strip low heap caps from panel env; Next build needs ~1–2GB peak. */
function withBuildHeap(env = process.env) {
  const heap = process.env.BUILD_MAX_OLD_SPACE_SIZE || "2048";
  const withoutCap = (env.NODE_OPTIONS || "")
    .split(/\s+/)
    .filter((p) => p && !p.includes("max-old-space-size"))
    .join(" ")
    .trim();
  return {
    ...env,
    NODE_ENV: "production",
    NODE_OPTIONS: [withoutCap, `--max-old-space-size=${heap}`]
      .filter(Boolean)
      .join(" "),
  };
}

function run(cmd, args, env = process.env) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

function copyStandaloneAssets() {
  const cwd = process.cwd();
  const standaloneDir = path.join(cwd, ".next", "standalone");
  if (!existsSync(path.join(standaloneDir, "server.js"))) {
    console.log("[build] standalone server.js missing — skip asset copy");
    return;
  }

  const pubSrc = path.join(cwd, "public");
  const pubDst = path.join(standaloneDir, "public");
  const staticSrc = path.join(cwd, ".next", "static");
  const staticDst = path.join(standaloneDir, ".next", "static");

  if (existsSync(pubSrc)) {
    mkdirSync(pubDst, { recursive: true });
    cpSync(pubSrc, pubDst, { recursive: true, force: true });
    console.log("[build] copied public → .next/standalone/public");
  }
  if (existsSync(staticSrc)) {
    mkdirSync(path.dirname(staticDst), { recursive: true });
    cpSync(staticSrc, staticDst, { recursive: true, force: true });
    console.log("[build] copied .next/static → .next/standalone/.next/static");
  }
}

const buildEnv = withBuildHeap();
console.log(`[build] NODE_OPTIONS=${buildEnv.NODE_OPTIONS}`);

// Images already run via npm prebuild when present — skip duplicate under RAM pressure.
const skipOptimize = process.env.SKIP_OPTIMIZE_IMAGES === "1";
if (!skipOptimize && !process.env.npm_lifecycle_event) {
  // direct `node scripts/build.mjs`
  let code = run(process.execPath, ["scripts/optimize-images.mjs"], buildEnv);
  if (code !== 0) process.exit(code);
} else if (!skipOptimize) {
  console.log("[build] skip optimize-images here (npm prebuild already ran, or set SKIP_OPTIMIZE_IMAGES=1)");
}

const prismaCli = path.join(
  process.cwd(),
  "node_modules",
  "prisma",
  "build",
  "index.js"
);
let code = existsSync(prismaCli)
  ? run(process.execPath, [prismaCli, "generate"], buildEnv)
  : run("npx", ["prisma", "generate"], buildEnv);
if (code !== 0) process.exit(code);

const nextBin = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);
code = existsSync(nextBin)
  ? run(process.execPath, [nextBin, "build"], buildEnv)
  : run("npx", ["next", "build"], buildEnv);
if (code !== 0) process.exit(code);

copyStandaloneAssets();
process.exit(0);
