import { LegalShell } from "@/components/legal/LegalShell";

export const metadata = {
  alternates: { canonical: "/gizlilik-politikasi" },
  title: "Gizlilik Politikası | Zeynep Çeltek Güzellik Akademi",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Gizlilik Politikası">
      <p>
        Zeynep Çeltek Güzellik Akademi olarak kişisel verilerinizin güvenliğine
        önem veriyoruz. Bu politika, web sitemizi ziyaret ettiğinizde veya
        hizmetlerimizden yararlandığınızda toplanan bilgilerin nasıl
        kullanıldığını açıklar.
      </p>
      <h2>Toplanan Bilgiler</h2>
      <p>
        İletişim formu aracılığıyla ad, telefon, e-posta ve mesaj içeriği
        toplanabilir. Bu bilgiler yalnızca talebinizi yanıtlamak için
        kullanılır.
      </p>
      <h2>Çerezler</h2>
      <p>
        Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanabilir.
        Sepet bilgileriniz tarayıcınızda yerel olarak saklanır.
      </p>
      <h2>İletişim</h2>
      <p>
        Gizlilik ile ilgili sorularınız için info@zeynepceltekakademi.local
        adresinden bize ulaşabilirsiniz.
      </p>
    </LegalShell>
  );
}
