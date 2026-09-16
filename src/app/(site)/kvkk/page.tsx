import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata = {
  alternates: { canonical: "/kvkk" },
  title: "KVKK Aydınlatma Metni",
};

export default function KVKKPage() {
  return (
    <LegalShell title="KVKK Aydınlatma Metni">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        kapsamında, {COMPANY.brand} olarak veri sorumlusu sıfatıyla kişisel
        verilerinizi aşağıda açıklanan çerçevede işlemekteyiz.
      </p>
      <h2>Veri Sorumlusu</h2>
      <p>
        {COMPANY.name}
        <br />
        {COMPANY.address}
        <br />
        Tel: {COMPANY.phone}
      </p>
      <h2>İşlenen Kişisel Veriler</h2>
      <p>
        Kimlik bilgileri (ad, soyad), iletişim bilgileri (telefon, e-posta,
        adres) ve öğrenci işlem bilgileri (talep, kayıt talebi detayları)
        işlenebilir.
      </p>
      <h2>İşleme Amaçları</h2>
      <p>
        Kişisel verileriniz; hizmet sunumu, kayıt talebi hazırlama, iletişim,
        öğrenci memnuniyeti ve yasal yükümlülüklerin yerine getirilmesi
        amaçlarıyla işlenmektedir.
      </p>
      <h2>Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi kapsamında kişisel verilerinizin işlenip
        işlenmediğini öğrenme, düzeltilmesini isteme ve silinmesini talep etme
        haklarına sahipsiniz. Başvurularınız için {COMPANY.phone} veya{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>{" "}
        hattımızdan bize ulaşabilirsiniz.
      </p>
    </LegalShell>
  );
}
