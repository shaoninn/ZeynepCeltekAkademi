/**
 * Production-safe upsert: categories + course products + mission/vision +
 * gallery projects + sample blogs + Instagram settings.
 * Does NOT wipe existing orders/admin.
 *
 * Run (Hostinger or local with MYSQL_*):
 *   npx tsx prisma/sync-public-content.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { resolveMysqlPoolConfig } from "../src/lib/db-url";
import { CATEGORIES } from "../src/lib/constants";
import { HOME_FAQS } from "../src/lib/home-faq";
import { COURSES } from "./courses-data";
import { projectData } from "./projects-data";
import { BLOGS } from "./blog-data";

const cfg = resolveMysqlPoolConfig();
const adapter = new PrismaMariaDb({
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  password: cfg.password,
  database: cfg.database,
  connectionLimit: 2,
});
const prisma = new PrismaClient({ adapter });

const MISSION =
  "Misyonumuz; güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmektir.\n\nCanlı manken üzerinde birebir uygulama ile mezunlarımıza mesleki özgüven kazandırmak; hijyenik ortamda doğru teknikleri öğretmek ve kariyer yolculuklarında yanlarında olmak istiyoruz. Kısa vadeli vaatler yerine, ölçülebilir öğrenme çıktıları ve dürüst bilgilendirme ile uzun soluklu başarı hedefleriz.\n\nHer programda önceliğimiz: güvenli uygulama ortamı, uzman eğitmen kontrolü ve net belgelendirme sürecidir.";
const VISION =
  "Vizyonumuz; Adana ve çevresinde güzellik eğitiminin referans akademilerinden biri olmak; bilimi sanatla buluşturan standartlar koymak ve mezunlarımızın sektörde tercih edilen uzmanlar olmasını sağlamaktır.\n\nUygulamalı müfredatımızı, güncel teknikleri ve belgelendirme seçeneklerini güçlendirerek hem yeni başlayanlara hem de kendini geliştirmek isteyen profesyonellere tutarlı bir kalite sunmayı amaçlıyoruz.\n\nUzun vadede hedefimiz; “herkese aynı kurs” değil, “hedefinize uygun eğitim yolu” anlayışının Adana’daki en bilinen temsilcilerinden biri olmaktır.";
const ABOUT_INTRO =
  "Zeynep Çeltek Güzellik Akademi; Adana Seyhan Cemalpaşa’da, uygulamalı güzellik eğitimleriyle meslek sahibi olmak veya mevcut becerisini güçlendirmek isteyenlere yönelik bir eğitim kurumudur. Protez tırnak, kalıcı makyaj, cilt bakımı, lazer ve iğneli epilasyon, kirpik-kaş uygulamaları, kafa masajı (head spa) ve kapsamlı güzellik uzmanlığı programlarını; canlı manken üzerinde birebir pratik modeliyle sunarız.\n\nBizim için eğitim, yalnızca teori anlatmak değildir. Doğru tekniği güvenli ve hijyenik ortamda deneyimlemek, ilk uygulamaları eğitmen eşliğinde tamamlamak ve belgelendirme sürecini şeffaf yürütmek temel yaklaşımımızdır. MEB onaylı belge, sertifika veya akademi belgesi programın yapısına göre netleştirilir.\n\nKayıt sürecini sade tutarız: WhatsApp veya iletişim formuyla danışmanlık, sitedeki kayıt sepeti ile talep; ardından PayTR (kart) veya havale ile eğitim ücreti; kontenjan teyidi sonrası eğitime başlangıç. Amacımız, Adana’da güvenilir, uygulamalı ve kariyer odaklı bir güzellik akademisi deneyimi sunmaktır.";
const ABOUT_PHILOSOPHY =
  "Eğitim ilkelerimizin özeti: dinlemek, doğru programı önermek, uygulamada yanınızda olmak ve belge sürecini açık yürütmek.\n\nHer programı standart bir “kurs paketi” gibi değil; ölçülebilir bir öğrenme yolu olarak görürüz. Kayıt öncesinde hedefinizi (sıfırdan meslek, ek uzmanlık, salon kurma vb.) dinleriz. Eğitim sırasında teori ile canlı manken uygulamasını aynı akışta birleştiririz. Eğitim sonrasında ise belge / sınav adımlarını ve sektöre geçiş için gerçekçi yönlendirmeyi paylaşırız.\n\nHijyen, meslek etiği ve birebir rehberlik bizim için slogan değil; günlük eğitim disiplinimizin parçasıdır. Böylece mezunlarımız yalnızca bir sertifika değil, sahada kullanabilecekleri özgüven ve teknik birikimle ayrılır.";

function courseSpecs(course: (typeof COURSES)[number]) {
  return JSON.stringify({
    montaj: course.duration,
    teslimat: course.schedule,
    garanti: course.certificate,
    kayit: "Kayıt / PayTR ödeme",
    konum: "Adana — Cemalpaşa / Seyhan",
    uygulama: "Canlı manken — birebir",
  });
}

async function upsertContent(key: string, title: string, content: string) {
  await prisma.siteContent.upsert({
    where: { key },
    create: { key, title, content },
    update: { title, content },
  });
}

async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

async function main() {
  console.log("[sync] categories + products…");
  const courseBySlug = Object.fromEntries(COURSES.map((c) => [c.slug, c]));

  for (const [index, cat] of CATEGORIES.entries()) {
    const course = courseBySlug[cat.slug];
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: course?.shortDesc || `${cat.name} eğitim programı`,
        icon: cat.icon,
        image: course?.image || null,
        sortOrder: index + 1,
        isActive: true,
      },
      update: {
        name: cat.name,
        description: course?.shortDesc || `${cat.name} eğitim programı`,
        icon: cat.icon,
        image: course?.image || null,
        sortOrder: index + 1,
        isActive: true,
      },
    });

    if (!course) continue;

    await prisma.product.upsert({
      where: { slug: course.slug },
      create: {
        name: course.name,
        slug: course.slug,
        description: course.description,
        shortDesc: course.shortDesc,
        price: course.price,
        image: course.image,
        images: JSON.stringify([course.image]),
        specs: courseSpecs(course),
        categoryId: category.id,
        sortOrder: course.sortOrder,
        isActive: true,
        isFeatured: course.sortOrder <= 4,
        inStock: true,
      },
      update: {
        name: course.name,
        description: course.description,
        shortDesc: course.shortDesc,
        price: course.price,
        image: course.image,
        images: JSON.stringify([course.image]),
        specs: courseSpecs(course),
        categoryId: category.id,
        sortOrder: course.sortOrder,
        isActive: true,
        isFeatured: course.sortOrder <= 4,
        inStock: true,
      },
    });
  }

  console.log("[sync] about / FAQ…");
  await upsertContent("mission", "Misyon", MISSION);
  await upsertContent("vision", "Vizyon", VISION);
  await upsertContent("about_intro", "Hakkımızda Giriş", ABOUT_INTRO);
  await upsertContent(
    "about_philosophy",
    "Çalışma İlkelerimiz",
    ABOUT_PHILOSOPHY
  );
  await upsertContent(
    "values_hygiene",
    "Hijyen & Standart",
    "Eğitim ve uygulama alanlarımızı klinik hijyen anlayışıyla yönetiriz. Canlı manken çalışmalarında yüzey, ekipman ve malzeme düzeni; misafir ve öğrenci güvenliği için temel koşuldur. Temizlik ek bir vaat değil, her dersin parçasıdır."
  );
  await upsertContent(
    "values_team",
    "Uzman Eğitmenler",
    "Alanında deneyimli eğitmen kadromuz birebir rehberlik sunar. Parametre, ürün ve teknik seçimleri rastgele değil; eğitimin hedeflerine ve sizin seviyenize göre yönlendirilir. Küçük grup / yoğun uygulama modeli öğrenmeyi hızlandırır."
  );
  await upsertContent(
    "values_products",
    "Uygulamalı Müfredat",
    "Teori ile canlı manken uygulamasını aynı süreçte birleştiririz. Blok derslerden uzun MEB programlarına kadar müfredat; ilk işlemi doğru teknikle tamamlayabileceğiniz şekilde planlanır. Süre, program ve belge türü eğitim kartında açıkça yazar."
  );
  await upsertContent(
    "values_personal",
    "Kariyer Odaklı",
    "Belgelendirme sonrası sektöre giriş, salon / stüdyo yönelimi ve mesleki özgüven için danışmanlık desteği sunarız. “Garanti iş” vaadi yerine gerçekçi kariyer yönlendirmesi yaparız; hedefinize uygun sonraki adımları birlikte netleştiririz."
  );
  await upsertContent("faq_section_eyebrow", "SSS Üst (bölüm)", "SSS");
  await upsertContent(
    "faq_section_title",
    "SSS Başlık (bölüm)",
    "Sık sorulan sorular"
  );

  for (let i = 0; i < HOME_FAQS.length; i++) {
    const n = i + 1;
    const item = HOME_FAQS[i]!;
    await upsertContent(`faq_${n}_q`, `SSS ${n} Soru`, item.q);
    await upsertContent(`faq_${n}_a`, `SSS ${n} Cevap`, item.a);
  }

  console.log("[sync] process steps…");
  await upsertContent("process_1_title", "Süreç 1", "Eğitim seç");
  await upsertContent(
    "process_1_desc",
    "Süreç 1 Açıklama",
    "Programı inceleyin; süre, belge ve içeriği netleştirin."
  );
  await upsertContent("process_2_title", "Süreç 2", "Kayıt talebi");
  await upsertContent(
    "process_2_desc",
    "Süreç 2 Açıklama",
    "Kayıt sepetinden talebinizi gönderin; numaranızı not alın."
  );
  await upsertContent("process_3_title", "Süreç 3", "Güvenli ödeme");
  await upsertContent(
    "process_3_desc",
    "Süreç 3 Açıklama",
    "PayTR kart veya havale ile eğitim ücretini tamamlayın."
  );
  await upsertContent("process_4_title", "Süreç 4", "Teyit & belge");
  await upsertContent(
    "process_4_desc",
    "Süreç 4 Açıklama",
    "Kontenjan netleşir; eğitim ve belgelendirme süreci başlar."
  );

  console.log("[sync] Instagram…");
  await upsertSetting(
    "instagram",
    "https://www.instagram.com/zeynepceltek_guzellik.kursu/"
  );
  await upsertSetting("instagram_2", "");
  await upsertSetting("instagram_3", "");
  await upsertSetting("email", "");

  console.log("[sync] gallery projects…");
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  for (const [i, p] of projectData.entries()) {
    const categoryId = catId[p.categorySlug];
    if (!categoryId) continue;
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: {
        title: p.title,
        slug: p.slug,
        location: p.location,
        description: p.description,
        image: p.image,
        images: JSON.stringify(p.images),
        categoryId,
        sortOrder: i + 1,
        isActive: true,
        isFeatured: i < 6,
      },
      update: {
        title: p.title,
        location: p.location,
        description: p.description,
        image: p.image,
        images: JSON.stringify(p.images),
        categoryId,
        sortOrder: i + 1,
        isActive: true,
        isFeatured: i < 6,
      },
    });
  }

  console.log("[sync] blog…");
  for (const post of BLOGS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        ...post,
        isPublished: true,
        publishedAt: new Date(),
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("[sync] stats + feature bar…");
  const STAT_KEYS = [
    ["stat_1_value", "İstatistik 1", "8+"],
    ["stat_1_label", "İstatistik 1 Etiket", "Eğitim Programı"],
    ["stat_2_value", "İstatistik 2", "7+"],
    ["stat_2_label", "İstatistik 2 Etiket", "Yıl Tecrübe"],
    ["stat_3_value", "İstatistik 3", "Birebir"],
    ["stat_3_label", "İstatistik 3 Etiket", "Uygulama"],
    ["stat_4_value", "İstatistik 4", "MEB"],
    ["stat_4_label", "İstatistik 4 Etiket", "Belge"],
    ["feature_bar_4_title", "Özellik 4", "Eğitim Danışmanlığı"],
    [
      "feature_bar_4_desc",
      "Özellik 4 Açıklama",
      "Mesai saatlerinde kayıt ve program rehberliği.",
    ],
  ] as const;
  for (const [key, title, content] of STAT_KEYS) {
    await upsertContent(key, title, content);
  }

  console.log("[sync] done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
