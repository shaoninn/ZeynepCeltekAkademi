import { CartPage } from "@/components/shop/CartPage";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/sepet" },
  title: "Kayıt Sepeti | Zeynep Çeltek Güzellik Akademi",
  description: "Eğitim kayıt listeniz",
  robots: { index: false, follow: false },
};

export default async function SepetPage() {
  const settings = await getSiteSettings();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          Kayıt Sepeti
        </h1>
        <CartPage whatsappUrl={settings.whatsappUrl} />
      </div>
    </section>
  );
}
