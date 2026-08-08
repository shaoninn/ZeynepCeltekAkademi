/** Eğitim programları — fiyat, içerik ve görseller. */

export type CourseSeed = {
  slug: string;
  name: string;
  price: number;
  shortDesc: string;
  description: string;
  duration: string;
  schedule: string;
  certificate: "MEB" | "Sertifika" | "Belge";
  sortOrder: number;
  image: string;
};

export const COURSES: CourseSeed[] = [
  {
    slug: "protez-tirnak",
    name: "Protez Tırnak Eğitimi",
    price: 15000,
    sortOrder: 1,
    duration: "3 hafta",
    schedule: "Haftanın 2 günü, 10:00–17:00",
    certificate: "MEB",
    image: "/images/courses/protez-tirnak.webp",
    shortDesc:
      "Teori, kuru manikür, kalıcı oje, nail art, tips ve şablon tırnak — canlı manken üzerinde birebir uygulama.",
    description: `Protez Tırnak eğitimimiz 3 hafta sürüyor. Haftanın 2 günü 10.00-17.00 saatleri arasında eğitim alınır.

Eğitim içeriği: Teori, kuru manikür, kalıcı oje, nail art, tips tırnak, şablon tırnak, ıslak manikür.

Tüm eğitimler canlı manken üzerinde eğitmen ile birebir uygulama yapılarak işlenir. Eğitim sürecinde ilk işlemlerinizi doğru tekniklerle uygulamış olursunuz.

Eğitim tamamlandıktan sonra MEB onaylı belgeniz olacağı için sınav olacaksınız. Artık Protez Tırnak Uzmanısınız.`,
  },
  {
    slug: "kirpik-lifting-kas-laminasyon",
    name: "Kirpik Lifting - Kaş Laminasyon Eğitimi",
    price: 3000,
    sortOrder: 2,
    duration: "1 gün (blok ders)",
    schedule: "10:00–17:00",
    certificate: "Sertifika",
    image: "/images/courses/kirpik-lifting-kas-laminasyon.webp",
    shortDesc:
      "Blok ders: bir günde canlı manken üzerinde ilk işleminizi eğitmen eşliğinde tamamlayın.",
    description: `Kirpik lifting - kaş laminasyon eğitimimiz blok ders olarak yapılır.

1 günde 10.00-17.00 saatleri arasında eğitim alınır. Canlı manken üzerinde eğitmen eşliğinde ilk işleminizi yapmış olursunuz.

Eğitim bitiminde sertifikanızı alırsınız. Artık Kirpik Lifting - Kaş Laminasyon Uzmanısınız.`,
  },
  {
    slug: "ipek-kirpik",
    name: "İpek Kirpik Eğitimi",
    price: 5000,
    sortOrder: 3,
    duration: "1 ders (blok)",
    schedule: "10:00–17:00",
    certificate: "Sertifika",
    image: "/images/courses/ipek-kirpik.webp",
    shortDesc:
      "Teori, sünger üzerinde pratik ve canlı manken uygulaması — aynı gün sertifika.",
    description: `İpek kirpik eğitimimiz blok ders olarak yapılır.

1 ders 10.00-17.00 saatleri arasında eğitim alınır.

Eğitim içeriği: Teori eğitimi, sünger üzerinde pratik ve canlı manken üzerinde uygulama.

Eğitim bitiminde sertifikanızı alırsınız. Artık İpek Kirpik Uzmanısınız.`,
  },
  {
    slug: "kalici-makyaj",
    name: "Kalıcı Makyaj Eğitimi",
    price: 20000,
    sortOrder: 4,
    duration: "2,5–3 ay",
    schedule: "Pazartesi günleri, 10:00–17:00",
    certificate: "MEB",
    image: "/images/courses/kalici-makyaj.webp",
    shortDesc:
      "Microblading, shading, eyeliner ve dudak teknikleri — canlı manken ile birebir uygulama.",
    description: `Kalıcı makyaj eğitimimiz 2,5-3 ay sürüyor. Pazartesi günleri 10.00-17.00 saatleri içerisinde eğitim alınır.

Eğitim içeriği: Teori, microblading, altın oran çalışması, shading pudralama, babyliner, eyeliner, dipliner, dudak renklendirme, çerçevelendirme, ruj efekti.

Tüm eğitimler canlı manken üzerinde eğitmen ile birebir uygulama yapılarak işlenir. Eğitim sürecinde ilk işlemlerinizi doğru tekniklerle uygulamış olursunuz.

Eğitim tamamlandıktan sonra MEB onaylı belgeniz olacağı için sınav olacaksınız. Artık Kalıcı Makyaj Uzmanısınız.`,
  },
  {
    slug: "cilt-bakimi",
    name: "Cilt Bakımı Eğitimi",
    price: 10000,
    sortOrder: 5,
    duration: "3 ders",
    schedule: "10:00–17:00",
    certificate: "Sertifika",
    image: "/images/courses/cilt-bakimi.webp",
    shortDesc:
      "Yüz temizleme masajı, klasik / medikal / hydrafacial bakım — uygulamalı eğitim.",
    description: `Cilt bakımı eğitimimiz 3 ders halinde, 10.00-17.00 saatleri arasında yapılır.

Eğitim içeriği: Teori, yüz temizleme masajı, mini - klasik - medikal - hydrafacial bakım.

Tüm eğitimler canlı manken üzerinde eğitmen ile birebir uygulama yapılarak işlenir. Eğitim sürecinde ilk işlemlerinizi doğru tekniklerle uygulamış olursunuz.

Eğitim tamamlandıktan sonra eğitim sertifikanızı alırsınız. Artık Cilt Bakımı Uzmanısınız.`,
  },
  {
    slug: "lazer-igneli-epilasyon",
    name: "Lazer Epilasyon - İğneli Epilasyon Eğitimi",
    price: 15000,
    sortOrder: 6,
    duration: "3 ders",
    schedule: "10:00–17:00",
    certificate: "MEB",
    image: "/images/courses/lazer-igneli-epilasyon.webp",
    shortDesc:
      "Teori, lazer epilasyon ve iğneli epilasyon — canlı manken ile uygulamalı MEB belgeli eğitim.",
    description: `Lazer epilasyon - iğneli epilasyon eğitimimiz 3 ders halinde, 10.00-17.00 saatleri arasında yapılır.

Eğitim içeriği: Teori, lazer epilasyon, iğneli epilasyon.

Tüm eğitimler canlı manken üzerinde eğitmen ile birebir uygulama yapılarak işlenir. Eğitim sürecinde ilk işlemlerinizi doğru tekniklerle uygulamış olursunuz.

Eğitim tamamlandıktan sonra MEB onaylı belgeniz olacağı için sınav olacaksınız. Artık Lazer Epilasyon Uzmanısınız.`,
  },
  {
    slug: "kafa-masaji",
    name: "Kafa Masajı (Head Spa) Eğitimi",
    price: 10000,
    sortOrder: 7,
    duration: "2 ders",
    schedule: "10:00–17:00",
    certificate: "Belge",
    image: "/images/courses/kafa-masaji.webp",
    shortDesc:
      "Canlı manken üzerinde birebir head spa uygulaması — 2 derslik yoğun program.",
    description: `Kafa masajı eğitimimiz 2 ders halinde, 10.00-17.00 saatleri arasında yapılır.

Tüm eğitimler canlı manken üzerinde eğitmen ile birebir uygulama yapılarak işlenir. Eğitim sürecinde ilk işlemlerinizi doğru tekniklerle uygulamış olursunuz.

Eğitim tamamlandıktan sonra belgenizi teslim alırsınız. Artık Kafa Masajı Head Spa Uzmanısınız.`,
  },
  {
    slug: "guzellik-uzmanligi",
    name: "Güzellik Uzmanlığı Eğitimi",
    price: 40000,
    sortOrder: 8,
    duration: "4 ay",
    schedule: "Haftanın 2 günü, 10:00–17:00",
    certificate: "MEB",
    image: "/images/courses/guzellik-uzmanligi.webp",
    shortDesc:
      "Kapsamlı meslek eğitimi: cilt bakımı, epilasyon, masaj, makyaj ve medikal uygulamalar.",
    description: `Güzellik uzmanlığı eğitimimiz 4 ay sürmektedir. Haftanın 2 günü 10.00-17.00 saatleri arasında eğitim alınır.

Eğitim içeriği: Teori dersleri, yüz temizleme masajı, cilt bakımı (klasik / medikal), karbon peeling, dermapen, hydrafacial, heykeltraş, G5, lazer epilasyon, iğneli epilasyon, temel masaj, temel makyaj eğitimleri canlı manken üzerinde uygulamalı olarak işlenir.

Eğitim sürecinde ilk işlemlerinizi yapmış olursunuz. MEB onaylı belge için sınav olacaksınız. Artık Güzellik Uzmanısınız.`,
  },
];
