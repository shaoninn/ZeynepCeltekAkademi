#!/usr/bin/env node
/**
 * Hostinger start — single OS process (no npx / no PM2 / no cluster).
 * Prefers Next.js standalone server when built; falls back to `next start`.
 * Schema sync once: RUN_DB_PUSH=1 npm run start
 *
 * Hostinger: `npm run start -- -p $PORT` — we honor -p/--port and PORT.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
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

function resolvePort() {
  const argv = process.argv;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === "-p" || a === "--port") && argv[i + 1]) {
      return String(argv[i + 1]);
    }
    if (a?.startsWith("--port=")) return a.slice("--port=".length);
  }
  return process.env.PORT || "3000";
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

process.env.NODE_ENV = "production";
const port = resolvePort();
process.env.PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// Soft heap cap — reduces OOM kill → restart loops on shared Hostinger plans.
if (!process.env.NODE_OPTIONS?.includes("max-old-space-size")) {
  const heap = process.env.NODE_MAX_OLD_SPACE_SIZE || "460";
  process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--max-old-space-size=${heap}`]
    .filter(Boolean)
    .join(" ")
    .trim();
}

const cwd = process.cwd();
const standaloneServer = path.join(cwd, ".next", "standalone", "server.js");
const standaloneDir = path.join(cwd, ".next", "standalone");

function ensureStandaloneAssets() {
  const pubSrc = path.join(cwd, "public");
  const pubDst = path.join(standaloneDir, "public");
  const staticSrc = path.join(cwd, ".next", "static");
  const staticDst = path.join(standaloneDir, ".next", "static");

  if (existsSync(pubSrc) && !existsSync(path.join(pubDst, "favicon.ico"))) {
    mkdirSync(pubDst, { recursive: true });
    cpSync(pubSrc, pubDst, { recursive: true, force: true });
  }
  if (existsSync(staticSrc)) {
    mkdirSync(path.dirname(staticDst), { recursive: true });
    cpSync(staticSrc, staticDst, { recursive: true, force: true });
  }
}

if (existsSync(standaloneServer)) {
  ensureStandaloneAssets();
  console.log(
    `[start] standalone server (in-process) ${process.env.HOSTNAME}:${port}`
  );
  process.chdir(standaloneDir);
  await import(pathToFileURL(standaloneServer).href);
} else {
  const nextBin = path.join(cwd, "node_modules", "next", "dist", "bin", "next");
  if (!existsSync(nextBin)) {
    console.error("[start] next binary missing — run npm install / build");
    process.exit(1);
  }
  console.log(`[start] next start (in-process) 0.0.0.0:${port}`);
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
}
