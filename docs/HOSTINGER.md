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
| Start | `npm run start` |
| Output | `.next` |

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
| `MYSQL_POOL_SIZE` | `2` (process limiti yüksekse `1`) |

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

| Önlem | Ne yapar |
|-------|----------|
| `MYSQL_POOL_SIZE=2` (gerekirse `1`) | Paralel MySQL bekleme ↓ |
| `scripts/start.mjs` in-process Next | `npx` çocuğu yok — site başına 1 Node |
| ISR `revalidate=300` | Pazarlama sayfalarında regenerasyon seyrek |
| Sitemap bellek 30 dk | Bot her hit’te 4 DB sorgusu atmaz |
| Home ölü fetch yok | Instagram / ürün havuzu home’da yok |
| Menü hafif sorgular | Blog/galeri menü `take` + `select` |
| Process memory cache | Tekrar DB’ye gitmez |
| `SiteLink` `prefetch={false}` | Hover’da MySQL fırtınası olmasın |
| Boot warm (`instrumentation`) | Soğuk ilk ziyaret yumuşar |

**Not:** Aynı Hostinger hesabında birden fazla Node sitesi 120 EP kotasını paylaşır. Limit doluyorsa diğer siteleri ayırın veya VPS’e geçin.

## Kontrol listesi

1. Repo `main`’e push edildi mi?
2. Env’ler eklendi mi? (domain + MySQL)
3. Redeploy
4. Site + `/admin` açılıyor mu?
