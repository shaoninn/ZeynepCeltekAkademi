import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/gizlilik-politikasi" },
  title: "Gizlilik Politikası | Zeynep Çeltek Güzellik Akademi",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Gizlilik Politikası">
      <p>
        {COMPANY.brand} olarak kişisel verilerinizin güvenliğine önem veriyoruz.
        Bu politika, web sitemizi ziyaret ettiğinizde veya eğitim
        hizmetlerimizden yararlandığınızda toplanan bilgilerin nasıl
        kullanıldığını açıklar.
      </p>
      <h2>Toplanan Bilgiler</h2>
      <p>
        İletişim formu aracılığıyla ad, telefon ve mesaj içeriği toplanabilir.
        Bu bilgiler yalnızca talebinizi yanıtlamak ve eğitim danışmanlığı
        sunmak için kullanılır.
      </p>
      <h2>Çerezler</h2>
      <p>
        Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanabilir.
        Kayıt sepeti bilgileriniz tarayıcınızda yerel olarak saklanır.
      </p>
      <h2>İletişim</h2>
      <p>
        Gizlilik ile ilgili sorularınız için {COMPANY.phone} numarası veya
        WhatsApp hattımız üzerinden bize ulaşabilirsiniz.
        <br />
        {COMPANY.address}
      </p>
    </LegalShell>
  );
}
