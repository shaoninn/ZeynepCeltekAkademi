# Hostinger Max Processes — zeynepceltekakademi.com audit

Kaynaklar:
- `Hostinger_NodeJS_Process_Diagnosis_Cursor_Checklist.docx`
- [Hostinger plan limits / Next.js process optimization](https://www.hostinger.com/support/1583532-what-to-do-if-your-hosting-plan-limits-are-reached-in-hostinger/)
- [Hostinger Next.js docs (standalone)](https://docs.hostinger.com/node.js/overview-1/next)
- [hostinger/deploy-nextjs](https://github.com/hostinger/deploy-nextjs) (`npm run start -- -p $PORT`)

Metrik: hesap geneli ~106/120 “Maksimum İşlem” = PHP + PHP olmayan (**tek site HTTP sayısı değil**).  
Siteler: `zeynepceltekakademi.com`, `zeynepceltek.com`, `minnaguzelliksalonu.com.tr` **aynı kotayı paylaşır**.

## P0 — Panel (koddan önce / ile birlikte)

| Adım | Aksiyon |
|------|---------|
| 1 | **3 site** Deployments → Settings → **Save and Redeploy** (Next.js process optimization) |
| 2 | Max Processes = **1** |
| 3 | Env: `.env` içeriğini içe aktar (`DATABASE_URL` yok) |
| 4 | Uptime: **`/api/health`** (kök `/?nocache` değil) |
| 5 | İzolasyon: diğer Node app’leri kapatıp grafiği izle |

## Kod denetimi (checklist)

| Bulgu | Sınıf | Durum |
|-------|--------|--------|
| PM2 / cluster / worker | — | Yok (eklenmedi) |
| `npm run dev` production | — | Yok |
| `start.mjs` in-process + `$PORT` / `-p` | Doğrudan | Uygulandı |
| `output: 'standalone'` (Hostinger önerisi) | Doğrudan | Uygulandı |
| Server-side setInterval/cron | — | Yok |
| WebSocket/SSE | — | Yok |
| Prisma singleton + pool=1 | Dolaylı | Uygulandı |
| Health ayrı TCP connection | Dolaylı | Prisma ping’e alındı |
| Layout DB fan-out | Dolaylı | Cache TTL 5 dk |
| ISR 5 dk | Dolaylı | **10 dk** |
| Bot/scanner / nocache probe | Dolaylı | Middleware 404/204 |
| Static `output: 'export'` | — | Uygulanamaz (admin/Prisma/ISR) |
| OOM → restart loop | Dolaylı | `NODE_OPTIONS=--max-old-space-size=460` |

## Static export engelleri

Prisma, admin, JWT middleware, sepet/ödeme, `/duzenle`, ISR, API routes.

## Doğrulama

1. Redeploy 3 site + Max Processes=1  
2. 30–60 dk Max Processes ortalaması  
3. Runtime Logs: restart / OOM / DB timeout  
4. `GET /api/health` → `{"database":"up"}`  
