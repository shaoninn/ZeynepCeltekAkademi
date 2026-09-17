# Güzellik → Akademi aktarım checklisti

Kaynak: `ZeynepCeltekGuzellik` iyileştirmeleri  
Hedef: `ZeynepCeltekAkademi`  
Kural: Kör kopya yok. Aynı UX kalıbı, akademi dili (eğitim / kayıt / sertifika).

## Eşleme

| Güzellik | Akademi | Not |
|---|---|---|
| Hizmet / randevu sepeti | Eğitim / kayıt sepeti | “randevu” → “kayıt / eğitim” |
| `/kampanyalar` → Galeriler | `/projeler` = Galeri | Nav rename **uygulanmaz** |
| 2 Instagram | Genelde 1 hesap | İkon+isim: 2+ ise zorunlu; 1 ise tutarlılık için önerilir |
| PayTR | Online ödeme yoksa atla | Sadece varsa / istenirse |
| Lazer / Epilyum metinleri | Kurs müfredatı | Yeniden yazılır |

## Maddeler

### 1. SSS (UX + içerik)
- [x] Kontrol: `FaqSection` düz liste mi?
- [x] Evet → dışta tek satır SSS; içinde sorular açılır
- [x] `home-faq.ts` çoğalt; eğitim odaklı detaylı cevaplar
- [x] CMS `faq_N_q` / `faq_N_a` senkron

### 2. Hakkımızda
- [x] Kontrol: intro / misyon / vizyon / değerler kısa veya boş mu?
- [x] Evet → uzun profesyonel akademi metni (MEB, uygulama, Adana)
- [x] CMS upsert; salon metnini yapıştırma

### 3. Eğitim metinleri + özellik label
- [x] Kontrol: kategori / ürün `shortDesc` tek cümle mi?
- [x] Evet → detaylı kopya
- [x] Özellik anahtarları küçük harf görünüyorsa → büyük harfli label (`Kayıt`, `Konum`, `Süre`…)

### 4. Paket / kampanya kartları
- [x] Kontrol: paket veya `campaignOffer` var mı?
- [x] Varsa → profesyonel açıklama; yoksa atla

### 5. Galeri görselleri
- [x] Kontrol: kartlar aşırı büyük mü?
- [x] Evet → hafif küçült (`aspect` / genişlik)
- [x] “Kampanyalar” rename → yapma

### 6. Footer Instagram
- [x] Kontrol: hesap sayısı
- [x] ≥2 → ikon yanında `@handle`
- [x] =1 → ikon+isim tek satır (tutarlılık)

### 7. Stat / tecrübe
- [x] Kontrol: yanlış “10+” veya güncel olmayan stat (kod + CMS)
- [x] Akademi metriğini koru (program sayısı, yıl, MEB…); kör “30+” basma
- [x] Gerekirse CMS düzelt

### 8. PayTR
- [x] Kontrol: online kart ödemesi isteniyor mu?
- [x] Hayır → atla (mevcut: kayıt sepeti ön kayıt)
- [ ] Evet → Güzellik PayTR kalıbı

### 9. Facility / adres / IG
- [x] Kontrol: eski IG, yanlış adres
- [x] Evet → akademi sabitleri (`zeynepceltek_guzellik.kursu`, Cemalpaşa…)

### 10. CMS senkron
- [x] Her metin değişiminde: kod fallback + `siteContent` upsert

## Bilinçli atlananlar
- Epilyum Alex / salon lazer paket fiyatı
- `KAMPANYALAR` → `GALERİLER` nav rename
- Salon 2 şube IG (`_adana` / `_ozal`)
- “Randevu sepeti” ifadesinin aynen taşınması

## Uygulama sırası
1. SSS → 2. Hakkımızda → 3. Eğitim metinleri → 4. Galeri boyutu → 5. Footer IG → 6. Stat/CMS → 7. PayTR (yalnızca gerekirse)

## Deploy notu
Mevcut DB’deki eski CMS satırlarını güncellemek için: `npx tsx prisma/sync-public-content.ts`  
(`upsert-editor-content.ts` yalnızca eksik anahtar ekler; üzerine yazmaz.)
