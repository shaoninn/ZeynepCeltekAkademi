#!/usr/bin/env node
/**
 * Hostinger often injects NODE_ENV=development into the build job.
 * next build must run as production — force it here.
 * After standalone build, copy public + static into .next/standalone.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

process.env.NODE_ENV = "production";

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
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

let code = run("node", ["scripts/optimize-images.mjs"]);
if (code !== 0) process.exit(code);

code = run("npx", ["prisma", "generate"]);
if (code !== 0) process.exit(code);

code = run("npx", ["next", "build"]);
if (code !== 0) process.exit(code);

copyStandaloneAssets();
process.exit(0);
