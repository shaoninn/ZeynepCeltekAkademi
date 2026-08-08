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
import { COURSES } from "./courses-data";
import { projectData } from "./projects-data";

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
  "Güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmek; canlı manken üzerinde birebir uygulama ile mezunlarımıza mesleki özgüven kazandırmak.";
const VISION =
  "Adana ve çevresinde güzellik eğitiminde referans akademi olmak; bilimi sanatla buluşturan standartlar koymak ve mezunlarımızın sektörde tercih edilen uzmanlar olmasını sağlamak.";

const BLOGS = [
  {
    title: "Güzellik Uzmanlığına İlk Adım",
    slug: "guzellik-uzmanligina-ilk-adim",
    excerpt:
      "Uygulamalı eğitim ve belgelendirme ile sektöre nasıl hazırlanırsınız?",
    image: "/images/blog/blog-1.webp",
    content: `<p>Güzellik sektöründe kalıcı bir kariyer için doğru eğitim modeli kritiktir. Canlı manken üzerinde birebir uygulama, teoriyi sahaya taşır.</p>
<p>Zeynep Çeltek Güzellik Akademi’de programlar MEB onaylı belge süreçleri ve uluslararası sertifika seçenekleriyle desteklenir. Kısa atölyelerden güzellik uzmanlığına uzanan yol haritanızı birlikte planlarız.</p>
<p>İlk adım için ücretsiz danışmanlık alın; size uygun programı ve kontenjanı birlikte netleştirelim.</p>`,
  },
  {
    title: "Protez Tırnak Eğitiminde Neler Öğrenilir?",
    slug: "protez-tirnak-egitiminde-neler-ogrenilir",
    excerpt: "3 haftalık müfredat: teori, manikür, nail art ve şablon tırnak.",
    image: "/images/blog/blog-2.webp",
    content: `<p>Protez tırnak eğitiminde kuru manikür, kalıcı oje, nail art, tips ve şablon tırnak teknikleri canlı manken üzerinde işlenir.</p>
<p>Haftanın iki günü, 10:00–17:00 arasında yoğun uygulama yapılır. Eğitim sonunda MEB onaylı belge için sınav süreci vardır.</p>
<p>Detaylı içerik ve güncel kontenjan için Eğitimler sayfasından Protez Tırnak programına göz atın.</p>`,
  },
  {
    title: "Kirpik Lifting ve Kaş Laminasyon: Bir Günde Uzmanlaşın",
    slug: "kirpik-lifting-kas-laminasyon-bir-gunde",
    excerpt:
      "Blok ders modeliyle aynı gün canlı manken uygulaması ve sertifika.",
    image: "/images/courses/kirpik-lifting-kas-laminasyon.webp",
    content: `<p>Kirpik lifting ve kaş laminasyon, salonlarda en çok talep gören hızlı uygulamalardandır. Akademimizde bu eğitim blok ders olarak, bir günde 10:00–17:00 arasında tamamlanır.</p>
<p>Canlı manken üzerinde eğitmen eşliğinde ilk işleminizi uygulayıp sertifikanızı alırsınız. Kısa sürede mesleğe adım atmak isteyenler için ideal bir programdır.</p>`,
  },
  {
    title: "Kalıcı Makyaj Eğitimi Süreci",
    slug: "kalici-makyaj-egitimi-sureci",
    excerpt:
      "2,5–3 aylık programda microblading’den dudak tekniklerine uzanan yolculuk.",
    image: "/images/blog/blog-3.webp",
    content: `<p>Kalıcı makyaj eğitiminde teori, microblading, altın oran, shading, eyeliner ve dudak renklendirme uygulamaları birebir yapılır.</p>
<p>Program Pazartesi günleri 10:00–17:00 arasında ilerler; MEB onaylı belge için sınav süreci vardır. Hijyen, cihaz kullanımı ve müşteri iletişimi müfredatın ayrılmaz parçasıdır.</p>`,
  },
];

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
        specs: JSON.stringify({
          duration: course.duration,
          schedule: course.schedule,
          certificate: course.certificate,
        }),
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
        specs: JSON.stringify({
          duration: course.duration,
          schedule: course.schedule,
          certificate: course.certificate,
        }),
        categoryId: category.id,
        sortOrder: course.sortOrder,
        isActive: true,
        isFeatured: course.sortOrder <= 4,
        inStock: true,
      },
    });
  }

  console.log("[sync] mission / vision…");
  await upsertContent("mission", "Misyon", MISSION);
  await upsertContent("vision", "Vizyon", VISION);
  await upsertContent(
    "about_intro",
    "Hakkımızda Giriş",
    "Zeynep Çeltek Güzellik Akademi, Adana Seyhan Cemalpaşa'da uygulamalı güzellik eğitimleri sunar. Amacımız yalnızca teknik öğretmek değil; canlı manken üzerinde doğru uygulamayı deneyimlemenizi sağlamak ve kariyerinize sağlam bir temel kazandırmaktır.\n\nMEB onaylı belgelendirme süreçleri, uzman eğitmen kadrosu ve birebir uygulama modeli ile mezunlarımızı sektöre hazırlıyoruz."
  );

  console.log("[sync] Instagram…");
  await upsertSetting(
    "instagram",
    "https://www.instagram.com/zeynepceltek_adana/"
  );
  await upsertSetting(
    "instagram_2",
    "https://www.instagram.com/zeynepceltek_t.ozal/"
  );
  await upsertSetting(
    "instagram_3",
    "https://www.instagram.com/zeynepceltek_guzellik.kursu/"
  );
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
