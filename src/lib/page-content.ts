import { getContentMap, getContentTitles } from "@/lib/site-content";
import { VALUE_PROPS, STATS } from "@/lib/constants";
import type { AboutPageData } from "@/components/about/AboutPageView";
import type { ContactPageData } from "@/components/contact/ContactPageView";
import type { StatItem } from "@/components/home/StatsBar";

const ABOUT_KEYS = [
  "about_headline",
  "about_intro",
  "about_philosophy",
  "mission",
  "vision",
  "values_hygiene",
  "values_team",
  "values_products",
  "values_personal",
  "about_image_1",
  "about_image_2",
  "about_image_3",
  "about_image_4",
  "stat_1_value",
  "stat_1_label",
  "stat_2_value",
  "stat_2_label",
  "stat_3_value",
  "stat_3_label",
  "stat_4_value",
  "stat_4_label",
];

const VALUE_DEFS = [
  { key: "values_hygiene", fallbackTitle: "Hijyen Odaklı Eğitim" },
  { key: "values_products", fallbackTitle: "Uygulamalı Müfredat" },
  { key: "values_team", fallbackTitle: "Uzman Eğitmenler" },
  { key: "values_personal", fallbackTitle: "Kariyer Desteği" },
] as const;

const DEFAULT_ABOUT_IMAGES = [
  "/images/about/about-1.webp",
  "/images/about/about-2.webp",
  "/images/about/about-3.webp",
  "/images/about/about-4.webp",
];

export async function loadAboutPageData(): Promise<AboutPageData> {
  const [map, titles] = await Promise.all([
    getContentMap(ABOUT_KEYS),
    getContentTitles(VALUE_DEFS.map((v) => v.key)),
  ]);

  const stats: StatItem[] = STATS.map((fallback, i) => {
    const n = i + 1;
    return {
      value: map[`stat_${n}_value`] || fallback.value,
      label: map[`stat_${n}_label`] || fallback.label,
    };
  });

  return {
    headline:
      map.about_headline ||
      "GÜZELLİĞİ BİLİMLE,\nSANATA DÖNÜŞTÜRÜYORUZ",
    intro:
      map.about_intro ||
      "Zeynep Çeltek Güzellik Akademi; Adana Seyhan Cemalpaşa’da, uygulamalı güzellik eğitimleriyle meslek sahibi olmak veya mevcut becerisini güçlendirmek isteyenlere yönelik bir eğitim kurumudur. Protez tırnak, kalıcı makyaj, cilt bakımı, lazer ve iğneli epilasyon, kirpik-kaş uygulamaları, kafa masajı (head spa) ve kapsamlı güzellik uzmanlığı programlarını; canlı manken üzerinde birebir pratik modeliyle sunarız.\n\nBizim için eğitim, yalnızca teori anlatmak değildir. Doğru tekniği güvenli ve hijyenik ortamda deneyimlemek, ilk uygulamaları eğitmen eşliğinde tamamlamak ve belgelendirme sürecini şeffaf yürütmek temel yaklaşımımızdır. MEB onaylı belge, sertifika veya akademi belgesi programın yapısına göre netleştirilir.\n\nKayıt sürecini sade tutarız: WhatsApp veya iletişim formuyla danışmanlık, sitedeki kayıt sepeti ile talep; ardından PayTR (kart) veya havale ile eğitim ücreti; kontenjan teyidi sonrası eğitime başlangıç. Amacımız, Adana’da güvenilir, uygulamalı ve kariyer odaklı bir güzellik akademisi deneyimi sunmaktır.",
    philosophy:
      map.about_philosophy ||
      "Eğitim ilkelerimizin özeti: dinlemek, doğru programı önermek, uygulamada yanınızda olmak ve belge sürecini açık yürütmek.\n\nHer programı standart bir “kurs paketi” gibi değil; ölçülebilir bir öğrenme yolu olarak görürüz. Kayıt öncesinde hedefinizi (sıfırdan meslek, ek uzmanlık, salon kurma vb.) dinleriz. Eğitim sırasında teori ile canlı manken uygulamasını aynı akışta birleştiririz. Eğitim sonrasında ise belge / sınav adımlarını ve sektöre geçiş için gerçekçi yönlendirmeyi paylaşırız.\n\nHijyen, meslek etiği ve birebir rehberlik bizim için slogan değil; günlük eğitim disiplinimizin parçasıdır. Böylece mezunlarımız yalnızca bir sertifika değil, sahada kullanabilecekleri özgüven ve teknik birikimle ayrılır.",
    mission:
      map.mission ||
      "Misyonumuz; güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmektir.\n\nCanlı manken üzerinde birebir uygulama ile mezunlarımıza mesleki özgüven kazandırmak; hijyenik ortamda doğru teknikleri öğretmek ve kariyer yolculuklarında yanlarında olmak istiyoruz. Kısa vadeli vaatler yerine, ölçülebilir öğrenme çıktıları ve dürüst bilgilendirme ile uzun soluklu başarı hedefleriz.\n\nHer programda önceliğimiz: güvenli uygulama ortamı, uzman eğitmen kontrolü ve net belgelendirme sürecidir.",
    vision:
      map.vision ||
      "Vizyonumuz; Adana ve çevresinde güzellik eğitiminin referans akademilerinden biri olmak; bilimi sanatla buluşturan standartlar koymak ve mezunlarımızın sektörde tercih edilen uzmanlar olmasını sağlamaktır.\n\nUygulamalı müfredatımızı, güncel teknikleri ve belgelendirme seçeneklerini güçlendirerek hem yeni başlayanlara hem de kendini geliştirmek isteyen profesyonellere tutarlı bir kalite sunmayı amaçlıyoruz.\n\nUzun vadede hedefimiz; “herkese aynı kurs” değil, “hedefinize uygun eğitim yolu” anlayışının Adana’daki en bilinen temsilcilerinden biri olmaktır.",
    values: VALUE_DEFS.map((v) => ({
      key: v.key,
      title: titles[v.key] || v.fallbackTitle,
      desc:
        map[v.key] ||
        (v.key === "values_hygiene"
          ? "Eğitim ve uygulama alanlarımızı klinik hijyen anlayışıyla yönetiriz. Canlı manken çalışmalarında yüzey, ekipman ve malzeme düzeni; misafir ve öğrenci güvenliği için temel koşuldur. Temizlik ek bir vaat değil, her dersin parçasıdır."
          : v.key === "values_products"
            ? "Teori ile canlı manken uygulamasını aynı süreçte birleştiririz. Blok derslerden uzun MEB programlarına kadar müfredat; ilk işlemi doğru teknikle tamamlayabileceğiniz şekilde planlanır. Süre, program ve belge türü eğitim kartında açıkça yazar."
            : v.key === "values_team"
              ? "Alanında deneyimli eğitmen kadromuz birebir rehberlik sunar. Parametre, ürün ve teknik seçimleri rastgele değil; eğitimin hedeflerine ve sizin seviyenize göre yönlendirilir. Küçük grup / yoğun uygulama modeli öğrenmeyi hızlandırır."
              : "Belgelendirme sonrası sektöre giriş, salon / stüdyo yönelimi ve mesleki özgüven için danışmanlık desteği sunarız. “Garanti iş” vaadi yerine gerçekçi kariyer yönlendirmesi yaparız; hedefinize uygun sonraki adımları birlikte netleştiririz."),
    })),
    images: DEFAULT_ABOUT_IMAGES.map(
      (fallback, i) => map[`about_image_${i + 1}`] || fallback
    ),
    stats,
  };
}

export async function loadContactPageData(): Promise<ContactPageData> {
  const map = await getContentMap([
    "contact_eyebrow",
    "contact_title",
    "contact_intro",
    "contact_card_title",
    "contact_call_prefix",
    "contact_whatsapp_link",
    "contact_whatsapp_cta",
    "contact_whatsapp_prefill",
    "contact_submit_label",
    "contact_kvkk_suffix",
    "contact_map_label",
    "contact_map_open",
    "contact_success",
  ]);
  return {
    eyebrow: map.contact_eyebrow || "İletişim",
    title: map.contact_title || "Bize Ulaşın",
    intro:
      map.contact_intro ||
      "Eğitim programları, kayıt ve danışmanlık hakkında aklınıza takılan her şeyi sorabilirsiniz. En hızlı yanıt WhatsApp üzerinden gelir.",
    formCopy: {
      cardTitle: map.contact_card_title || "Zeynep Çeltek Güzellik Akademi",
      callPrefix: map.contact_call_prefix || "Ara:",
      whatsappLink: map.contact_whatsapp_link || "WhatsApp ile yaz",
      whatsappCta: map.contact_whatsapp_cta || "WhatsApp ile Yazın",
      whatsappPrefill:
        map.contact_whatsapp_prefill ||
        "Merhaba, eğitim programlarınız hakkında bilgi almak istiyorum.",
      submitLabel: map.contact_submit_label || "Mesaj Gönder",
      kvkkSuffix:
        map.contact_kvkk_suffix ||
        "okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum.",
      mapLabel: map.contact_map_label || "Konum — Google Haritalar",
      mapOpen: map.contact_map_open || "Google'da aç",
      success:
        map.contact_success ||
        "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
    },
  };
}

export function buildValueProps(map: Record<string, string>) {
  return VALUE_PROPS.map((fallback, i) => {
    const n = i + 1;
    const sizeRaw = map[`value_prop_${n}_icon_size`];
    const iconSize = sizeRaw ? Number(sizeRaw) : undefined;
    return {
      icon: fallback.icon,
      title: map[`value_prop_${n}_title`] || fallback.title,
      desc: map[`value_prop_${n}_desc`] || fallback.desc,
      iconUrl: map[`value_prop_${n}_icon`] || undefined,
      iconSize:
        iconSize && Number.isFinite(iconSize) ? iconSize : undefined,
    };
  });
}

export function buildStats(map: Record<string, string>): StatItem[] {
  return STATS.map((fallback, i) => {
    const n = i + 1;
    return {
      value: map[`stat_${n}_value`] || fallback.value,
      label: map[`stat_${n}_label`] || fallback.label,
    };
  });
}
