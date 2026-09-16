import { getSiteSettings } from "@/lib/site";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { loadContactPageData } from "@/lib/page-content";

export const revalidate = 600;


export const metadata = {
  alternates: { canonical: "/iletisim" },
  title: "İletişim",
  description: "Zeynep Çeltek Güzellik Akademi iletişim, kayıt danışmanlığı ve WhatsApp hattı. Adana Cemalpaşa.",
};

export default async function ContactPage() {
  const [settings, data] = await Promise.all([
    getSiteSettings(),
    loadContactPageData(),
  ]);

  return <ContactPageView data={data} settings={settings} />;
}
