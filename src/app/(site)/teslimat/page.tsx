import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/teslimat" },
  title: "Eğitim Süreci",
  description:
    "Zeynep Çeltek Güzellik Akademi eğitim süreci, kayıt ve program bilgilendirmesi.",
};

export default function DeliveryPage() {
  return (
    <LegalShell title="Eğitim Süreci ve Kayıt">
      <p>
        {COMPANY.name} Adana’da yüz yüze güzellik eğitimleri sunar. Program
        süreleri, kontenjan ve başlangıç tarihleri her eğitim için ayrıca
        netleştirilir.
      </p>
      <h2>Hizmet bölgesi</h2>
      <p>
        Akademi merkezi: Adana. Seyhan, Çukurova, Yüreğir, Sarıçam ve çevre
        ilçelerden öğrencilerin katılımı mümkündür. Şehir dışından gelen
        katılımcılar için program bilgisi ayrıca paylaşılır.
      </p>
      <h2>Süreç</h2>
      <ol>
        <li>Ön görüşme / ihtiyaç analizi</li>
        <li>Eğitim programı ve kontenjan onayı</li>
        <li>Kayıt ve ödeme planı</li>
        <li>Uygulamalı eğitim ve belgelendirme</li>
      </ol>
      <h2>Süreler</h2>
      <p>
        Eğitim süreleri programa göre değişir (kısa atölyeler ile kapsamlı
        uzmanlık programları farklıdır). Kesin süre kayıt sırasında
        belirtilir.
      </p>
      <h2>Katılım koşulları</h2>
      <p>
        Öğrenci, eğitim günlerinde zamanında katılım, gerekli malzeme / hijyen
        kuralları ve akademi yönergelerine uymayı kabul eder. İptal ve erteleme
        koşulları İade Politikası sayfasındadır.
      </p>
      <h2>İletişim</h2>
      <p>
        {COMPANY.phone} · {COMPANY.email}
      </p>
    </LegalShell>
  );
}
