import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/mesafeli-satis" },
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Zeynep Çeltek Güzellik Akademi mesafeli satış ve kayıt süreci bilgilendirmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalShell title="Mesafeli Satış Sözleşmesi">
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği kapsamında bilgilendirme metnidir.{" "}
        {COMPANY.name} öncelikle eğitim kaydı / program teklifi ile çalışır;
        site üzerinden anlık kart ödemesi alınmayabilir.
      </p>
      <h2>Satıcı / hizmet sağlayıcı</h2>
      <p>
        {COMPANY.name}
        <br />
        {COMPANY.address}
        <br />
        {COMPANY.email} · {COMPANY.phone}
      </p>
      <h2>Sözleşmenin konusu</h2>
      <p>
        Güzellik eğitimi programları, atölye / kurs kayıtları, danışmanlık ve
        belgelendirme hizmetleridir. Program özellikleri kayıt formunda ve
        onaylanan teklifte belirtilir.
      </p>
      <h2>Sipariş ve ödeme</h2>
      <p>
        Katılımcı kayıt sepeti veya iletişim formu ile talep iletir.{" "}
        {COMPANY.name} görüşme sonrası yazılı program ve ödeme bilgisi sunar.
        Ödeme yöntemleri (havale, kapora vb.) teklifte yer alır; web sitesi kart
        ödemesi almayabilir.
      </p>
      <h2>Eğitim süreci</h2>
      <p>
        Program, kontenjan ve başlangıç tarihine göre teklifte yazılan süre
        içinde yürütülür. Detaylar Eğitim Süreci sayfasındadır.
      </p>
      <h2>Cayma hakkı</h2>
      <p>
        Kişiye özel planlanan veya başlamış eğitim hizmetlerinde cayma hakkı
        sınırlı olabilir. Standart kayıtlarda yasal süreler teklif ve fatura
        koşullarına göre uygulanır. Ayrıntı için İade Politikası sayfasına
        bakın.
      </p>
      <h2>Uyuşmazlık</h2>
      <p>
        Tüketici uyuşmazlıklarında Tüketici Hakem Heyetleri ve Tüketici
        Mahkemeleri yetkilidir.
      </p>
    </LegalShell>
  );
}
