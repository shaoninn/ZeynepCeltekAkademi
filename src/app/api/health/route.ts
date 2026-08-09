import { NextResponse } from "next/server";
import { mysqlConnectionSummary } from "@/lib/db-url";
import { pingDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight uptime probe — uses process Prisma pool (no extra TCP connection).
 * Prefer this over `/?nocache=` in Hostinger / Guzzle monitors.
 * Open: https://example.com/api/health
 */
export async function GET() {
  let target = "unresolved";
  try {
    target = mysqlConnectionSummary();
  } catch (error) {
    return NextResponse.json(
      {
        database: "down",
        error: error instanceof Error ? error.message : String(error),
        hint: "MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE eksik olabilir.",
      },
      { status: 503 }
    );
  }

  const result = await pingDatabase();
  if (result.ok) {
    return NextResponse.json({
      ok: true,
      database: "up",
      latencyMs: result.ms,
      target,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      database: "down",
      latencyMs: result.ms,
      target,
      error: result.error?.slice(0, 300),
      hint:
        "hPanel → Veritabanları → Remote MySQL hostname’i MYSQL_HOST yapın (srv….hstgr.io). Any Host (%) + Restart.",
    },
    { status: 503 }
  );
}

export async function HEAD() {
  const result = await pingDatabase();
  return new NextResponse(null, {
    status: result.ok ? 204 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
