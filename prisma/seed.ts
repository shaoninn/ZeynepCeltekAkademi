import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../src/lib/auth";
import { CATEGORIES } from "../src/lib/constants";
import { projectData } from "./projects-data";
import { COURSES } from "./courses-data";
import { resolveMysqlDatabaseUrl } from "../src/lib/db-url";

if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PROD_SEED !== "true"
) {
  throw new Error(
    "Production'da seed yasak (tüm tabloları siler). Gerçekten gerekliyse ALLOW_PROD_SEED=true verin."
  );
}

const adapter = new PrismaMariaDb(resolveMysqlDatabaseUrl());
const prisma = new PrismaClient({ adapter });

const courseBySlug = Object.fromEntries(COURSES.map((c) => [c.slug, c]));

const siteContent = [
  {
    key: "hero_title",
    title: "Hero Başlık",
    content: "Güzelliği bilimle, sanata dönüştürüyoruz.",
  },
  {
    key: "hero_subtitle",
    title: "Hero Alt Başlık",
    content: "",
  },
  {
    key: "hero_body",
    title: "Hero Açıklama",
    content:
      "Uluslararası standartlarda uygulamalı güzellik eğitimleri. Canlı manken üzerinde birebir pratik, MEB onaylı belge ve kariyer desteği.",
  },
  {
    key: "hero_image",
    title: "Hero Görsel",
    content: "/images/hero/hero-academy.webp",
  },
  {
    key: "about_intro",
    title: "Hakkımızda Giriş",
    content:
      "Zeynep Çeltek Güzellik Akademi, Adana Seyhan Cemalpaşa'da uygulamalı güzellik eğitimleri sunar. Amacımız yalnızca teknik öğretmek değil; canlı manken üzerinde doğru uygulamayı deneyimlemenizi sağlamak ve kariyerinize sağlam bir temel kazandırmaktır.\n\nMEB onaylı belgelendirme süreçleri, uzman eğitmen kadrosu ve birebir uygulama modeli ile mezunlarımızı sektöre hazırlıyoruz.",
  },
  {
    key: "about_philosophy",
    title: "Çalışma İlkelerimiz",
    content:
      "Uygulamalı öğrenme, hijyen ve meslek etiği; her eğitim programımızın ortak zeminidir.",
  },
  {
    key: "mission",
    title: "Misyon",
    content:
      "Güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmek.",
  },
  {
    key: "vision",
    title: "Vizyon",
    content:
      "Adana ve çevresinde güzellik eğitiminde referans akademi olmak; bilimi sanatla buluşturan standartlar koymak.",
  },
  {
    key: "values_hygiene",
    title: "Hijyen & Standart",
    content:
      "Eğitim ve uygulama alanlarımızda klinik hijyen standartlarına bağlı kalırız.",
  },
  {
    key: "values_team",
    title: "Uzman Eğitmenler",
    content:
      "Alanında deneyimli eğitmen kadromuz birebir rehberlik sunar.",
  },
  {
    key: "values_products",
    title: "Uygulamalı Müfredat",
    content:
      "Teori ile canlı manken uygulamasını aynı süreçte birleştiririz.",
  },
  {
    key: "values_personal",
    title: "Kariyer Odaklı",
    content:
      "Belgelendirme ve sektöre geçişte danışmanlık desteği sağlarız.",
  },
  {
    key: "cta_title",
    title: "CTA Başlık",
    content: "Kariyerinize bir adım önde başlayın",
  },
  {
    key: "cta_button_label",
    title: "CTA Buton",
    content: "Ücretsiz Danışmanlık Al",
  },
  {
    key: "services_section_title",
    title: "Eğitimler Başlık",
    content: "Kariyerinizi güzelleştiren eğitimler",
  },
  {
    key: "featured_products_title",
    title: "Öne Çıkan Eğitimler",
    content: "Öne çıkan eğitim programları",
  },
  {
    key: "shipping_banner_title",
    title: "Bilgi Bandı",
    content: "Canlı manken üzerinde birebir uygulamalı eğitim",
  },
  {
    key: "why_us_title",
    title: "Neden Biz Başlık",
    content: "Neden Zeynep Çeltek Akademi?",
  },
  { key: "why_us_1", title: "Neden Biz 1", content: "MEB Onaylı Belge" },
  { key: "why_us_2", title: "Neden Biz 2", content: "Canlı Manken Uygulaması" },
  { key: "why_us_3", title: "Neden Biz 3", content: "Birebir Pratik Eğitim" },
  { key: "why_us_4", title: "Neden Biz 4", content: "Uluslararası Sertifika" },
  { key: "why_us_5", title: "Neden Biz 5", content: "Uzman Eğitmen Kadrosu" },
  { key: "why_us_6", title: "Neden Biz 6", content: "Kariyer Danışmanlığı" },
  {
    key: "feature_bar_1_title",
    title: "Özellik 1",
    content: "Uzman Eğitmen Kadrosu",
  },
  {
    key: "feature_bar_1_desc",
    title: "Özellik 1 Açıklama",
    content: "Alanında deneyimli eğitmenlerle eğitim.",
  },
  {
    key: "feature_bar_2_title",
    title: "Özellik 2",
    content: "Uluslararası Sertifika",
  },
  {
    key: "feature_bar_2_desc",
    title: "Özellik 2 Açıklama",
    content: "Geçerliliği yüksek sertifika programları.",
  },
  {
    key: "feature_bar_3_title",
    title: "Özellik 3",
    content: "Uygulamalı Eğitim Modeli",
  },
  {
    key: "feature_bar_3_desc",
    title: "Özellik 3 Açıklama",
    content: "Teori + canlı uygulama odaklı müfredat.",
  },
  {
    key: "feature_bar_4_title",
    title: "Özellik 4",
    content: "7/24 Destek & Danışmanlık",
  },
  {
    key: "feature_bar_4_desc",
    title: "Özellik 4 Açıklama",
    content: "Eğitim öncesi ve sonrası rehberlik.",
  },
  { key: "stat_1_value", title: "İstatistik 1", content: "114K+" },
  { key: "stat_1_label", title: "İstatistik 1 Etiket", content: "Mutlu Öğrenci" },
  { key: "stat_2_value", title: "İstatistik 2", content: "60+" },
  { key: "stat_2_label", title: "İstatistik 2 Etiket", content: "Uzman Eğitmen" },
  { key: "stat_3_value", title: "İstatistik 3", content: "30+" },
  {
    key: "stat_3_label",
    title: "İstatistik 3 Etiket",
    content: "Eğitim Programı",
  },
  { key: "stat_4_value", title: "İstatistik 4", content: "7" },
  { key: "stat_4_label", title: "İstatistik 4 Etiket", content: "Yıl Tecrübe" },
  {
    key: "stats_script",
    title: "İstatistik Script",
    content: "Başarıya giden yolculuğunuzdan anlar",
  },
  {
    key: "facility_title",
    title: "Ortam Başlık",
    content: "Modern, konforlu ve profesyonel ortam",
  },
  {
    key: "facility_body",
    title: "Ortam Açıklama",
    content:
      "Uygulamalı eğitimlerimizi modern sınıflarda, hijyenik ve konforlu bir akademi atmosferinde gerçekleştiriyoruz. Canlı manken uygulamaları ve birebir eğitmen desteğiyle kariyerinize sağlam bir temel atın.",
  },
  {
    key: "facility_image_1",
    title: "Ortam Görsel 1",
    content: "/images/facility/facility-1.webp",
  },
  {
    key: "about_image_1",
    title: "Hakkımızda Görsel 1",
    content: "/images/about/about-1.webp",
  },
  {
    key: "about_image_2",
    title: "Hakkımızda Görsel 2",
    content: "/images/about/about-2.webp",
  },
  {
    key: "about_image_3",
    title: "Hakkımızda Görsel 3",
    content: "/images/about/about-3.webp",
  },
  {
    key: "about_image_4",
    title: "Hakkımızda Görsel 4",
    content: "/images/about/about-4.webp",
  },
  {
    key: "cta_banner_1",
    title: "CTA Banner 1",
    content: "/images/gallery/gallery-1.webp",
  },
  {
    key: "cta_banner_2",
    title: "CTA Banner 2",
    content: "/images/gallery/gallery-2.webp",
  },
  {
    key: "cta_banner_3",
    title: "CTA Banner 3",
    content: "/images/gallery/gallery-3.webp",
  },
  {
    key: "cta_banner_4",
    title: "CTA Banner 4",
    content: "/images/gallery/gallery-4.webp",
  },
  {
    key: "process_eyebrow",
    title: "Süreç Üst Başlık",
    content: "Eğitim süreci",
  },
  {
    key: "process_title",
    title: "Süreç Başlık",
    content: "Kayıttan belgelendirmeye",
  },
  {
    key: "process_desc",
    title: "Süreç Açıklama",
    content: "Şeffaf adımlarla ilerleyen, uygulamalı bir eğitim yolculuğu.",
  },
  { key: "process_1_title", title: "Süreç 1", content: "Danışmanlık" },
  {
    key: "process_1_desc",
    title: "Süreç 1 Açıklama",
    content: "Size uygun programı birlikte seçeriz.",
  },
  { key: "process_2_title", title: "Süreç 2", content: "Kayıt" },
  {
    key: "process_2_desc",
    title: "Süreç 2 Açıklama",
    content: "Kontenjan ve takvim netleşir.",
  },
  { key: "process_3_title", title: "Süreç 3", content: "Uygulamalı Eğitim" },
  {
    key: "process_3_desc",
    title: "Süreç 3 Açıklama",
    content: "Canlı manken üzerinde birebir pratik.",
  },
  { key: "process_4_title", title: "Süreç 4", content: "Belgelendirme" },
  {
    key: "process_4_desc",
    title: "Süreç 4 Açıklama",
    content: "Sertifika / MEB onaylı belge süreci.",
  },
  {
    key: "faq_eyebrow",
    title: "SSS Üst",
    content: "Sıkça sorulanlar",
  },
  {
    key: "faq_title",
    title: "SSS Başlık",
    content: "Eğitimler hakkında",
  },
  {
    key: "faq_1_q",
    title: "SSS 1 Soru",
    content: "Eğitimler uygulamalı mı?",
  },
  {
    key: "faq_1_a",
    title: "SSS 1 Cevap",
    content:
      "Evet. Tüm eğitimlerde canlı manken üzerinde eğitmen ile birebir uygulama yapılır.",
  },
  {
    key: "faq_2_q",
    title: "SSS 2 Soru",
    content: "MEB onaylı belge hangi programlarda var?",
  },
  {
    key: "faq_2_a",
    title: "SSS 2 Cevap",
    content:
      "Protez tırnak, kalıcı makyaj, lazer-iğneli epilasyon ve güzellik uzmanlığı programlarında MEB onaylı belge için sınav süreci uygulanır.",
  },
  {
    key: "faq_3_q",
    title: "SSS 3 Soru",
    content: "Kayıt için nasıl ilerlemeliyim?",
  },
  {
    key: "faq_3_a",
    title: "SSS 3 Cevap",
    content:
      "WhatsApp veya iletişim formundan danışmanlık alın; uygun programı seçip kayıt sepetine ekleyebilirsiniz.",
  },
  {
    key: "faq_4_q",
    title: "SSS 4 Soru",
    content: "Eğitim saatleri nedir?",
  },
  {
    key: "faq_4_a",
    title: "SSS 4 Cevap",
    content:
      "Programlara göre değişmekle birlikte dersler genellikle 10:00–17:00 arasındadır. Detaylar her eğitimin sayfasında yer alır.",
  },
  {
    key: "testimonial_section_title",
    title: "Yorumlar Başlık",
    content: "Öğrencilerimizin deneyimi",
  },
  {
    key: "testimonial_section_desc",
    title: "Yorumlar Açıklama",
    content:
      "Uygulamalı eğitim ve birebir rehberlikle kariyerine adım atan mezunlarımızdan notlar.",
  },
  {
    key: "testimonial_1_quote",
    title: "Yorum 1",
    content:
      "Protez tırnak eğitiminde ilk işlemimi canlı manken üzerinde yaptım. Eğitmen çok ilgiliydi.",
  },
  {
    key: "testimonial_1_name",
    title: "Yorum 1 İsim",
    content: "Mezun öğrenci",
  },
  {
    key: "testimonial_1_place",
    title: "Yorum 1 Konum",
    content: "Adana",
  },
  {
    key: "testimonial_2_quote",
    title: "Yorum 2",
    content:
      "Kalıcı makyaj programı kapsamlıydı. Microblading'den dudak tekniklerine kadar adım adım ilerledik.",
  },
  {
    key: "testimonial_2_name",
    title: "Yorum 2 İsim",
    content: "Mezun öğrenci",
  },
  {
    key: "testimonial_2_place",
    title: "Yorum 2 Konum",
    content: "Adana",
  },
  {
    key: "testimonial_3_quote",
    title: "Yorum 3",
    content:
      "Kirpik lifting blok dersi tek günde bitti; aynı gün sertifikamı aldım.",
  },
  {
    key: "testimonial_3_name",
    title: "Yorum 3 İsim",
    content: "Mezun öğrenci",
  },
  {
    key: "testimonial_3_place",
    title: "Yorum 3 Konum",
    content: "Adana",
  },
  {
    key: "footer_blurb",
    title: "Footer Açıklama",
    content:
      "Adana'da uygulamalı güzellik eğitimleri. Canlı manken, birebir pratik ve belgelendirme.",
  },
  {
    key: "value_prop_1_title",
    title: "Değer 1",
    content: "MEB Onaylı Belge",
  },
  {
    key: "value_prop_1_desc",
    title: "Değer 1 Açıklama",
    content: "Eğitim sonunda resmi belgelendirme desteği",
  },
  {
    key: "value_prop_2_title",
    title: "Değer 2",
    content: "Canlı Manken Uygulaması",
  },
  {
    key: "value_prop_2_desc",
    title: "Değer 2 Açıklama",
    content: "Gerçek modeller üzerinde pratik eğitim",
  },
  {
    key: "value_prop_3_title",
    title: "Değer 3",
    content: "Birebir Uygulama",
  },
  {
    key: "value_prop_3_desc",
    title: "Değer 3 Açıklama",
    content: "Küçük gruplarda yoğun uygulama süresi",
  },
  {
    key: "value_prop_4_title",
    title: "Değer 4",
    content: "Kariyer Desteği",
  },
  {
    key: "value_prop_4_desc",
    title: "Değer 4 Açıklama",
    content: "Sektöre giriş ve iş kurma danışmanlığı",
  },
];

const navItems = [
  { label: "Ana Sayfa", href: "/", sortOrder: 0 },
  { label: "Akademi", href: "/hakkimizda", sortOrder: 1 },
  { label: "Eğitimler", href: "/hizmetler", sortOrder: 2 },
  { label: "Galeri", href: "/projeler", sortOrder: 3 },
  { label: "Blog", href: "/blog", sortOrder: 4 },
  { label: "İletişim", href: "/iletisim", sortOrder: 5 },
];

async function main() {
  console.log("Seeding Zeynep Çeltek Akademi...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.project.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.navItem.deleteMany();
  await prisma.adminUser.deleteMany();

  const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (plainPassword.length < 6) {
    throw new Error("ADMIN_PASSWORD en az 6 karakter olmalı");
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "⚠ ADMIN_PASSWORD tanımlı değil — geliştirme şifresi admin123 kullanılıyor. Canlıda değiştirin."
    );
  }
  const adminPassword = await hashPassword(plainPassword);
  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@zeynepceltekakademi.local",
      passwordHash: adminPassword,
      name: "Zeynep Çeltek Admin",
      role: "SUPER",
    },
  });

  for (const [index, cat] of CATEGORIES.entries()) {
    const course = courseBySlug[cat.slug];
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: course?.shortDesc || "",
        icon: cat.icon,
        image: course?.image || null,
        sortOrder: course?.sortOrder ?? index,
        isActive: true,
      },
    });

    if (course) {
      await prisma.product.create({
        data: {
          name: course.name,
          slug: course.slug,
          shortDesc: course.shortDesc,
          description: course.description,
          price: course.price,
          image: course.image,
          images: JSON.stringify([course.image]),
          categoryId: category.id,
          sortOrder: 0,
          isActive: true,
          inStock: true,
          specs: JSON.stringify({
            sure: course.duration,
            program: course.schedule,
            belge: course.certificate,
            uygulama: "Canlı manken — birebir",
          }),
        },
      });
    }
  }

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  for (const [index, project] of projectData.entries()) {
    await prisma.project.create({
      data: {
        title: project.title,
        slug: project.slug,
        location: project.location,
        description: project.description,
        image: project.image,
        images: JSON.stringify([...project.images]),
        categoryId: categoryMap[project.categorySlug] || null,
        sortOrder: index,
        isActive: true,
        isFeatured: index < 10,
      },
    });
  }

  for (const content of siteContent) {
    await prisma.siteContent.create({ data: content });
  }

  await prisma.navItem.createMany({
    data: navItems.map((n) => ({ ...n, isActive: true })),
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "phone", value: "0 (850) 550 35 40" },
      { key: "email", value: "info@zeynepceltekakademi.local" },
      {
        key: "address",
        value:
          "Cemalpaşa Mah. Gazipaşa Bulvarı Çelik Apartmanı Kat 4 No 7, Seyhan / Adana",
      },
      { key: "location_label", value: "Seyhan / Adana" },
      {
        key: "instagram",
        value: "https://www.instagram.com/zeynepceltekakademi/",
      },
      { key: "whatsapp", value: "908505503540" },
      {
        key: "google_reviews_url",
        value: "https://share.google/URWo0MWX0f2nTAswo",
      },
      {
        key: "work_hours_weekdays",
        value: "Pazartesi - Cumartesi 09:00-19:00",
      },
      { key: "work_hours_sunday", value: "Pazar: Kapalı" },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Güzellik Uzmanlığına İlk Adım",
        slug: "guzellik-uzmanligina-ilk-adim",
        excerpt:
          "Uygulamalı eğitim ve belgelendirme ile sektöre nasıl hazırlanırsınız?",
        content:
          "Güzellik sektöründe kalıcı bir kariyer için doğru eğitim modeli kritiktir. Canlı manken üzerinde birebir uygulama, teoriyi sahaya taşır. Zeynep Çeltek Güzellik Akademi'de programlar MEB onaylı belge süreçleriyle desteklenir.",
        image: "/images/blog/blog-1.webp",
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "Protez Tırnak Eğitiminde Neler Öğrenilir?",
        slug: "protez-tirnak-egitiminde-neler-ogrenilir",
        excerpt: "3 haftalık müfredat: teori, manikür, nail art ve şablon tırnak.",
        content:
          "Protez tırnak eğitiminde kuru manikür, kalıcı oje, nail art, tips ve şablon tırnak teknikleri canlı manken üzerinde işlenir. Eğitim sonunda MEB onaylı belge için sınav yapılır.",
        image: "/images/blog/blog-2.webp",
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "Kalıcı Makyaj Eğitimi Süreci",
        slug: "kalici-makyaj-egitimi-sureci",
        excerpt:
          "2,5–3 aylık programda microblading'den dudak tekniklerine uzanan yolculuk.",
        content:
          "Kalıcı makyaj eğitiminde teori, microblading, altın oran, shading, eyeliner ve dudak renklendirme uygulamaları birebir yapılır. MEB onaylı belge için sınav süreci vardır.",
        image: "/images/blog/blog-3.webp",
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
  });

  console.log("Seed completed — 8 eğitim programı yüklendi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
