import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../src/lib/auth";
import { CATEGORIES } from "../src/lib/constants";
import { HOME_FAQS } from "../src/lib/home-faq";
import { projectData } from "./projects-data";
import { COURSES } from "./courses-data";
import { BLOGS } from "./blog-data";
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
      "Zeynep Çeltek Güzellik Akademi; Adana Seyhan Cemalpaşa’da, uygulamalı güzellik eğitimleriyle meslek sahibi olmak veya mevcut becerisini güçlendirmek isteyenlere yönelik bir eğitim kurumudur. Protez tırnak, kalıcı makyaj, cilt bakımı, lazer ve iğneli epilasyon, kirpik-kaş uygulamaları, kafa masajı (head spa) ve kapsamlı güzellik uzmanlığı programlarını; canlı manken üzerinde birebir pratik modeliyle sunarız.\n\nBizim için eğitim, yalnızca teori anlatmak değildir. Doğru tekniği güvenli ve hijyenik ortamda deneyimlemek, ilk uygulamaları eğitmen eşliğinde tamamlamak ve belgelendirme sürecini şeffaf yürütmek temel yaklaşımımızdır. MEB onaylı belge, sertifika veya akademi belgesi programın yapısına göre netleştirilir.\n\nKayıt sürecini sade tutarız: WhatsApp veya iletişim formuyla danışmanlık, sitedeki kayıt sepeti ile talep; ardından PayTR (kart) veya havale ile eğitim ücreti; kontenjan teyidi sonrası eğitime başlangıç. Amacımız, Adana’da güvenilir, uygulamalı ve kariyer odaklı bir güzellik akademisi deneyimi sunmaktır.",
  },
  {
    key: "about_philosophy",
    title: "Çalışma İlkelerimiz",
    content:
      "Eğitim ilkelerimizin özeti: dinlemek, doğru programı önermek, uygulamada yanınızda olmak ve belge sürecini açık yürütmek.\n\nHer programı standart bir “kurs paketi” gibi değil; ölçülebilir bir öğrenme yolu olarak görürüz. Kayıt öncesinde hedefinizi (sıfırdan meslek, ek uzmanlık, salon kurma vb.) dinleriz. Eğitim sırasında teori ile canlı manken uygulamasını aynı akışta birleştiririz. Eğitim sonrasında ise belge / sınav adımlarını ve sektöre geçiş için gerçekçi yönlendirmeyi paylaşırız.\n\nHijyen, meslek etiği ve birebir rehberlik bizim için slogan değil; günlük eğitim disiplinimizin parçasıdır. Böylece mezunlarımız yalnızca bir sertifika değil, sahada kullanabilecekleri özgüven ve teknik birikimle ayrılır.",
  },
  {
    key: "mission",
    title: "Misyon",
    content:
      "Misyonumuz; güzellik sektöründe güvenilir, uygulamalı ve belgelendirilmiş eğitimlerle nitelikli uzmanlar yetiştirmektir.\n\nCanlı manken üzerinde birebir uygulama ile mezunlarımıza mesleki özgüven kazandırmak; hijyenik ortamda doğru teknikleri öğretmek ve kariyer yolculuklarında yanlarında olmak istiyoruz. Kısa vadeli vaatler yerine, ölçülebilir öğrenme çıktıları ve dürüst bilgilendirme ile uzun soluklu başarı hedefleriz.\n\nHer programda önceliğimiz: güvenli uygulama ortamı, uzman eğitmen kontrolü ve net belgelendirme sürecidir.",
  },
  {
    key: "vision",
    title: "Vizyon",
    content:
      "Vizyonumuz; Adana ve çevresinde güzellik eğitiminin referans akademilerinden biri olmak; bilimi sanatla buluşturan standartlar koymak ve mezunlarımızın sektörde tercih edilen uzmanlar olmasını sağlamaktır.\n\nUygulamalı müfredatımızı, güncel teknikleri ve belgelendirme seçeneklerini güçlendirerek hem yeni başlayanlara hem de kendini geliştirmek isteyen profesyonellere tutarlı bir kalite sunmayı amaçlıyoruz.\n\nUzun vadede hedefimiz; “herkese aynı kurs” değil, “hedefinize uygun eğitim yolu” anlayışının Adana’daki en bilinen temsilcilerinden biri olmaktır.",
  },
  {
    key: "values_hygiene",
    title: "Hijyen & Standart",
    content:
      "Eğitim ve uygulama alanlarımızı klinik hijyen anlayışıyla yönetiriz. Canlı manken çalışmalarında yüzey, ekipman ve malzeme düzeni; misafir ve öğrenci güvenliği için temel koşuldur. Temizlik ek bir vaat değil, her dersin parçasıdır.",
  },
  {
    key: "values_team",
    title: "Uzman Eğitmenler",
    content:
      "Alanında deneyimli eğitmen kadromuz birebir rehberlik sunar. Parametre, ürün ve teknik seçimleri rastgele değil; eğitimin hedeflerine ve sizin seviyenize göre yönlendirilir. Küçük grup / yoğun uygulama modeli öğrenmeyi hızlandırır.",
  },
  {
    key: "values_products",
    title: "Uygulamalı Müfredat",
    content:
      "Teori ile canlı manken uygulamasını aynı süreçte birleştiririz. Blok derslerden uzun MEB programlarına kadar müfredat; ilk işlemi doğru teknikle tamamlayabileceğiniz şekilde planlanır. Süre, program ve belge türü eğitim kartında açıkça yazar.",
  },
  {
    key: "values_personal",
    title: "Kariyer Odaklı",
    content:
      "Belgelendirme sonrası sektöre giriş, salon / stüdyo yönelimi ve mesleki özgüven için danışmanlık desteği sunarız. “Garanti iş” vaadi yerine gerçekçi kariyer yönlendirmesi yaparız; hedefinize uygun sonraki adımları birlikte netleştiririz.",
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
    content: "Eğitim Danışmanlığı",
  },
  {
    key: "feature_bar_4_desc",
    title: "Özellik 4 Açıklama",
    content: "Mesai saatlerinde kayıt ve program rehberliği.",
  },
  { key: "stat_1_value", title: "İstatistik 1", content: "8+" },
  { key: "stat_1_label", title: "İstatistik 1 Etiket", content: "Eğitim Programı" },
  { key: "stat_2_value", title: "İstatistik 2", content: "7+" },
  { key: "stat_2_label", title: "İstatistik 2 Etiket", content: "Yıl Tecrübe" },
  { key: "stat_3_value", title: "İstatistik 3", content: "Birebir" },
  {
    key: "stat_3_label",
    title: "İstatistik 3 Etiket",
    content: "Uygulama",
  },
  { key: "stat_4_value", title: "İstatistik 4", content: "MEB" },
  { key: "stat_4_label", title: "İstatistik 4 Etiket", content: "Belge" },
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
  { key: "process_1_title", title: "Süreç 1", content: "Eğitim seç" },
  {
    key: "process_1_desc",
    title: "Süreç 1 Açıklama",
    content: "Programı inceleyin; süre, belge ve içeriği netleştirin.",
  },
  { key: "process_2_title", title: "Süreç 2", content: "Kayıt talebi" },
  {
    key: "process_2_desc",
    title: "Süreç 2 Açıklama",
    content: "Kayıt sepetinden talebinizi gönderin; numaranızı not alın.",
  },
  { key: "process_3_title", title: "Süreç 3", content: "Güvenli ödeme" },
  {
    key: "process_3_desc",
    title: "Süreç 3 Açıklama",
    content: "PayTR kart veya havale ile eğitim ücretini tamamlayın.",
  },
  { key: "process_4_title", title: "Süreç 4", content: "Teyit & belge" },
  {
    key: "process_4_desc",
    title: "Süreç 4 Açıklama",
    content: "Kontenjan netleşir; eğitim ve belgelendirme süreci başlar.",
  },
  {
    key: "faq_eyebrow",
    title: "SSS Üst",
    content: "SSS",
  },
  {
    key: "faq_title",
    title: "SSS Başlık",
    content: "Sık sorulan sorular",
  },
  {
    key: "faq_section_eyebrow",
    title: "SSS Üst (bölüm)",
    content: "SSS",
  },
  {
    key: "faq_section_title",
    title: "SSS Başlık (bölüm)",
    content: "Sık sorulan sorular",
  },
  ...HOME_FAQS.flatMap((item, i) => {
    const n = i + 1;
    return [
      {
        key: `faq_${n}_q`,
        title: `SSS ${n} Soru`,
        content: item.q,
      },
      {
        key: `faq_${n}_a`,
        title: `SSS ${n} Cevap`,
        content: item.a,
      },
    ];
  }),
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
            montaj: course.duration,
            teslimat: course.schedule,
            garanti: course.certificate,
            kayit: "Kayıt / PayTR ödeme",
            konum: "Adana — Cemalpaşa / Seyhan",
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
      { key: "phone", value: "0 (534) 080 98 73" },
      { key: "email", value: "" },
      {
        key: "address",
        value: "Cemalpaşa Mahallesi, Gazipaşa Bulvarı, Adana 01120",
      },
      { key: "location_label", value: "Adana" },
      {
        key: "instagram",
        value: "https://www.instagram.com/zeynepceltek_guzellik.kursu/",
      },
      { key: "whatsapp", value: "905340809873" },
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
    data: BLOGS.map((post, i) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      isPublished: true,
      publishedAt: new Date(Date.now() - i * 86_400_000),
    })),
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
