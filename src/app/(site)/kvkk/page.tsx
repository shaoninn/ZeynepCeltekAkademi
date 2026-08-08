import { LegalShell } from "@/components/legal/LegalShell";

export const metadata = {
  alternates: { canonical: "/kvkk" },
  title: "KVKK Aydınlatma Metni | Zeynep Çeltek Güzellik Akademi",
};

export default function KVKKPage() {
  return (
    <LegalShell title="KVKK Aydınlatma Metni">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        kapsamında, Zeynep Çeltek Güzellik Akademi olarak veri sorumlusu
        sıfatıyla kişisel verilerinizi aşağıda açıklanan çerçevede
        işlemekteyiz.
      </p>
      <h2>Veri Sorumlusu</h2>
      <p>Zeynep Çeltek Güzellik Akademi — Adana</p>
      <h2>İşlenen Kişisel Veriler</h2>
      <p>
        Kimlik bilgileri (ad, soyad), iletişim bilgileri (telefon, e-posta,
        adres) ve müşteri işlem bilgileri (talep, teklif, sipariş detayları)
        işlenebilir.
      </p>
      <h2>İşleme Amaçları</h2>
      <p>
        Kişisel verileriniz; hizmet sunumu, teklif hazırlama, iletişim, müşteri
        memnuniyeti ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla
        işlenmektedir.
      </p>
      <h2>Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi kapsamında kişisel verilerinizin işlenip
        işlenmediğini öğrenme, düzeltilmesini isteme ve silinmesini talep etme
        haklarına sahipsiniz.
      </p>
    </LegalShell>
  );
}
