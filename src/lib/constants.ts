export const SITE_NAME = "Zeynep Çeltek Güzellik Akademi";
export const SITE_OWNER = "Zeynep Çeltek";
/** Ticaret unvanı — vitrinde gösterilmez; yasal sayfalarda satıcı kimliği için */
export const LEGAL_ENTITY_NAME =
  "ASDEKRA Eğitim Kurumu Güzellik Salonu Otomotiv İnşaat Sanayi Ticaret Limited Şirketi";
export const SITE_TAGLINE = "Güzelliği bilimle, sanata dönüştürüyoruz.";
export const PHONE = "0 (534) 080 98 73";
export const PHONE_RAW = "905340809873";
export const PHONE_ALT = "";
export const WHATSAPP_URL = `https://wa.me/${PHONE_RAW}`;
export const EMAIL = "";
export const ADDRESS =
  "Cemalpaşa Mahallesi, Gazipaşa Bulvarı, Adana 01120";
export const LOCATION_LABEL = "Adana";
/** Ana Instagram */
export const INSTAGRAM =
  "https://www.instagram.com/zeynepceltek_guzellik.kursu/";
export const INSTAGRAM_ACCOUNTS = [
  {
    handle: "@zeynepceltek_guzellik.kursu",
    href: "https://www.instagram.com/zeynepceltek_guzellik.kursu/",
  },
] as const;
/** Google İşletme Profili */
export const GOOGLE_BUSINESS_URL = "https://share.google/URWo0MWX0f2nTAswo";
/** Harita gömme — işletme adı + adres araması */
export const GOOGLE_MAPS_EMBED_QUERY =
  "Zeynep Çeltek Güzellik Akademi, Cemalpaşa Mahallesi Gazipaşa Bulvarı, Adana 01120";
/** Eski vitrin — yok */
export const LEGACY_SITE_URL = "";
export const WORK_HOURS = {
  weekdays: "Pazartesi - Cumartesi 09:00-19:00",
  sunday: "Pazar: Kapalı",
};

export const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış" },
  { href: "/iade-politikasi", label: "İade Politikası" },
  { href: "/teslimat", label: "Eğitim Süreci" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
] as const;

/** Üst barda her zaman görünen ana linkler (sıra önemli). */
export const PRIMARY_NAV_HREFS = [
  "/",
  "/hakkimizda",
  "/hizmetler",
  "/projeler",
  "/blog",
  "/iletisim",
] as const;

export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Akademi" },
  { href: "/hizmetler", label: "Eğitimler" },
  { href: "/projeler", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Akademi" },
  { href: "/hizmetler", label: "Eğitimler" },
  { href: "/projeler", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sepet", label: "Kayıt Sepeti" },
  { href: "/tekliflerim", label: "Kayıtlarım" },
] as const;

export const VALUE_PROPS = [
  {
    icon: "quality",
    title: "MEB Onaylı Belge",
    desc: "Eğitim sonunda resmi belgelendirme desteği",
  },
  {
    icon: "design",
    title: "Canlı Manken Uygulaması",
    desc: "Gerçek modeller üzerinde pratik eğitim",
  },
  {
    icon: "clock",
    title: "Birebir Uygulama",
    desc: "Küçük gruplarda yoğun uygulama süresi",
  },
  {
    icon: "support",
    title: "Kariyer Desteği",
    desc: "Sektöre giriş ve iş kurma danışmanlığı",
  },
] as const;

export const FEATURE_BAR = [
  {
    icon: "search",
    title: "Uzman Eğitmen Kadrosu",
    desc: "Alanında deneyimli eğitmenlerle eğitim.",
  },
  {
    icon: "design",
    title: "Uluslararası Sertifika",
    desc: "Geçerliliği yüksek sertifika programları.",
  },
  {
    icon: "production",
    title: "Uygulamalı Eğitim Modeli",
    desc: "Teori + canlı uygulama odaklı müfredat.",
  },
  {
    icon: "support",
    title: "Eğitim Danışmanlığı",
    desc: "Mesai saatlerinde kayıt ve program rehberliği.",
  },
] as const;

export const STATS = [
  { value: "8+", label: "Eğitim Programı" },
  { value: "7+", label: "Yıl Tecrübe" },
  { value: "Birebir", label: "Uygulama" },
  { value: "MEB", label: "Belge" },
] as const;

export const WHY_US = [
  "MEB Onaylı Belge",
  "Canlı Manken Uygulaması",
  "Birebir Pratik Eğitim",
  "Uluslararası Sertifika",
  "Uzman Eğitmen Kadrosu",
  "Kariyer Danışmanlığı",
] as const;

/** Katalog — akademi eğitim kategorileri */
export const CATEGORIES = [
  { name: "Protez Tırnak Eğitimi", slug: "protez-tirnak", icon: "design" },
  {
    name: "Kirpik Lifting - Kaş Laminasyon",
    slug: "kirpik-lifting-kas-laminasyon",
    icon: "design",
  },
  { name: "İpek Kirpik Eğitimi", slug: "ipek-kirpik", icon: "design" },
  { name: "Kalıcı Makyaj Eğitimi", slug: "kalici-makyaj", icon: "design" },
  { name: "Cilt Bakımı Eğitimi", slug: "cilt-bakimi", icon: "quality" },
  {
    name: "Lazer & İğneli Epilasyon",
    slug: "lazer-igneli-epilasyon",
    icon: "production",
  },
  { name: "Kafa Masajı Eğitimi", slug: "kafa-masaji", icon: "support" },
  {
    name: "Güzellik Uzmanlığı Eğitimi",
    slug: "guzellik-uzmanligi",
    icon: "quality",
  },
] as const;

export const SERVICE_GRID = [
  { name: "Protez Tırnak", slug: "protez-tirnak", icon: "design" },
  {
    name: "Kirpik & Kaş",
    slug: "kirpik-lifting-kas-laminasyon",
    icon: "design",
  },
  { name: "İpek Kirpik", slug: "ipek-kirpik", icon: "design" },
  { name: "Kalıcı Makyaj", slug: "kalici-makyaj", icon: "design" },
  { name: "Cilt Bakımı", slug: "cilt-bakimi", icon: "quality" },
  { name: "Epilasyon", slug: "lazer-igneli-epilasyon", icon: "production" },
  { name: "Kafa Masajı", slug: "kafa-masaji", icon: "support" },
  { name: "Güzellik Uzmanlığı", slug: "guzellik-uzmanligi", icon: "quality" },
] as const;
