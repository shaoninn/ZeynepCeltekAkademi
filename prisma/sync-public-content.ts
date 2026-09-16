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
  "Güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmek; canlı manken üzerinde birebir uygulama ile mezunlarımıza mesleki özgüven kazandırmak.";
const VISION =
  "Adana ve çevresinde güzellik eğitiminde referans akademi olmak; bilimi sanatla buluşturan standartlar koymak ve mezunlarımızın sektörde tercih edilen uzmanlar olmasını sağlamak.";

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
          montaj: course.duration,
          teslimat: course.schedule,
          garanti: course.certificate,
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
          montaj: course.duration,
          teslimat: course.schedule,
          garanti: course.certificate,
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
