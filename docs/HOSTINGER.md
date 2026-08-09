# Hostinger’da yayınlama (Zeynep Çeltek Güzellik Akademi)

## Build hatası: `@tailwindcss/postcss`

Hostinger production install’da `devDependencies` kurulmaz. Tailwind/PostCSS/`prisma`/`typescript` **`dependencies`** içinde olmalı.

## Doğru ürün

hPanel → **Websites → Add website → Node.js Web App**

## Ayarlar

| Ayar | Değer |
|------|--------|
| Framework | Next.js |
| Branch | `main` |
| Root | `./` |
| Node | 20 veya 22 |
| Build | `npm run build` |
| Start | `npm run start` (Hostinger PORT için: `npm run start -- -p $PORT`) |
| Output | `.next` (standalone `server.js` start.mjs ile) |
| **Max Processes** | **`1`** (Deployments → Settings — zorunlu) |

**Kritik:** `npm run dev` asla canlıda çalıştırmayın. Sadece `build` + `start`.  
Hostinger Business’ta **Maksimum işlem (120)** ve **Giriş işlemi / Entry (60)** hesap genelinde 3 site ile ortaktır; hPanel site bazında ayırmaz.

## Ortam değişkenleri (Hostinger paneli)

**Önemli:** `DATABASE_URL` satırını Hostinger’dan **sil**. Şifredeki `?` URL’yi böler ve P1000 verir.

| Anahtar | Değer |
|---------|--------|
| `NODE_ENV` | **`production`** |
| `JWT_SECRET` | ≥32 karakter rastgele secret |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-DOMAIN` (sonradan) |
| `MYSQL_USER` | hPanel MySQL kullanıcı |
| `MYSQL_PASSWORD` | MySQL kullanıcı şifresi |
| `MYSQL_HOST` | Remote MySQL hostname (`srv….hstgr.io`, `localhost` değil) |
| `MYSQL_PORT` | `3306` |
| `MYSQL_DATABASE` | hPanel veritabanı adı |
| `MYSQL_POOL_SIZE` | `1` (zorunlu öneri; max `2`) |

Remote MySQL’de kullanıcı için `%` (Any Host) izni açık olmalı.

### `NODE_ENV` uyarısı

Logda *non-standard NODE_ENV* görürsen değeri `production` yapıp redeploy et. `npm run build` ayrıca `scripts/build.mjs` ile `production` zorlar.

İlk kurulumda bir kez şema senkronu:

```bash
RUN_DB_PUSH=1 npm run start
# veya:
npx prisma db push
```

## DB bağlantı testi

Deploy sonrası: `https://YOUR-DOMAIN/api/health`

1. hPanel → **Veritabanları** → **Remote MySQL**
2. Hostname’i `MYSQL_HOST` yap
3. Any Host (`%`) izni
4. Restart → `"database":"up"`

### `database: up` sonrası

```bash
npx prisma db push
ALLOW_PROD_SEED=true ADMIN_PASSWORD='GucluSifre123!' npm run db:seed
```

## Performans (Entry Process / Maksimum İşlem)

### P0 — Hostinger platform (koddan önce)

Grafikte **~106/120** çoğu zaman **3 Node sitesinin ortak kotası** + Hostinger’ın eski Next.js process spawn davranışıdır; “106 HTTP bağlantısı” değildir.

1. **Her Node sitesi** (`zeynepceltekakademi`, `zeynepceltek`, `minnaguzelliksalonu`):  
   hPanel → Website → **Deployments → Settings → Save and Redeploy**  
   Hostinger’ın Next.js process optimizasyonu mevcut app’lere böyle uygulanır ([resmi rehber](https://www.hostinger.com/support/1583532-what-to-do-if-your-hosting-plan-limits-are-reached-in-hostinger/)).
2. Aynı Settings’te **Max Processes = 1**
3. Uptime/monitoring: kök `/?nocache=` yerine **`/api/health`**, aralık ≥ 5 dk
4. Hangi site şişiriyor: diğer Node app’leri geçici kapatıp Resources grafiğine bak  
   Ayrıntılı audit: [`HOSTINGER-PROCESS-AUDIT.md`](./HOSTINGER-PROCESS-AUDIT.md)

| Önlem | Ne yapar |
|-------|----------|
| `MYSQL_POOL_SIZE=1` (varsayılan) | Paralel MySQL bekleme ↓ |
| `scripts/start.mjs` in-process Next | `npx` çocuğu yok — site başına 1 Node |
| ISR `revalidate=600` | Pazarlama regenerasyonu seyrek (admin revalidatePath anında) |
| Sitemap bellek 30 dk | Bot her hit’te 4 DB sorgusu atmaz |
| Home ölü fetch yok | Instagram / ürün havuzu home’da yok |
| Menü hafif sorgular | Blog/galeri menü `take` + `select` |
| Process memory cache | Tekrar DB’ye gitmez |
| `SiteLink` `prefetch={false}` | Hover’da MySQL fırtınası olmasın |
| Middleware probe/scanner short-circuit | `/?nocache` + wp-scanner Node+DB’ye düşmez |
| Boot warm (`instrumentation`) | Soğuk ilk ziyaret yumuşar |

**Not:** Aynı Hostinger hesabında birden fazla Node sitesi 120 EP kotasını paylaşır. Limit doluyorsa diğer siteleri ayırın veya VPS’e geçin.

**503 / uptime probe:** hPanel’de `/?nocache=…` (Guzzle) ve harici monitoring sık istek atıyorsa Entry Process kotası dolup 503 üretir. Uptime aralığını gevşetin; mümkünse `/api/health` kullanın.

### Hostinger destek checklist (hPanel)

1. **Üç site:** Deployments → Settings → **Save and Redeploy** (Next.js process optimization)  
2. Bu site: **Max Processes = 1** → redeploy  
3. Env: `NODE_ENV=production`, `MYSQL_POOL_SIZE=1`  
4. Start komutu: `npm run start` (dev değil)  
5. Kullanılmayan Node deployment / eski preview / cron’ları durdur  
6. Hangi site şişiriyor: diğer 2 siteyi geçici kapatıp Resources grafiğine bak  
7. PHP sitelerde cache açık tut; gereksiz eklenti/cron azalt  

Kod tarafında (bu repo): in-process `start`, prefetch kapalı, ISR 300s, sitemap cache, ölü home DB yok, probe short-circuit — sonsuz polling / cluster / PM2 yok.

## Kontrol listesi

1. Repo `main`’e push edildi mi?
2. Env’ler eklendi mi? (domain + MySQL)
3. Redeploy
4. Site + `/admin` açılıyor mu?
