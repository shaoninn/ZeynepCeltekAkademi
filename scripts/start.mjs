#!/usr/bin/env node
/**
 * Hostinger start — single OS process (no npx wrapper).
 * Do NOT run prisma db push on every boot.
 * Schema sync once: RUN_DB_PUSH=1 npm run start
 *
 * DB warm happens in src/instrumentation.ts (same process).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  return result.status ?? 1;
}

if (process.env.RUN_DB_PUSH === "1") {
  console.log("[start] RUN_DB_PUSH=1 → prisma db push…");
  const prismaCli = path.join(
    process.cwd(),
    "node_modules",
    "prisma",
    "build",
    "index.js"
  );
  const code = existsSync(prismaCli)
    ? run(process.execPath, [prismaCli, "db", "push"])
    : run("npx", ["prisma", "db", "push"]);
  if (code !== 0) {
    console.error("[start] prisma db push failed — continuing to boot Next");
  }
} else {
  console.log("[start] skipping db push (set RUN_DB_PUSH=1 to sync schema once)");
}

const port = process.env.PORT || "3000";
const nextBin = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

if (!existsSync(nextBin)) {
  console.error("[start] next binary missing — run npm install / build");
  process.exit(1);
}

process.env.NODE_ENV = "production";
console.log(`[start] next start (in-process) 0.0.0.0:${port}`);

// Run Next in this process — no parent+npx+child tree (Hostinger EP friendly).
process.argv = [
  process.execPath,
  nextBin,
  "start",
  "--hostname",
  "0.0.0.0",
  "--port",
  String(port),
];

await import(pathToFileURL(nextBin).href);
