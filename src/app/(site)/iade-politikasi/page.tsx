import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/iade-politikasi" },
  title: "İade Politikası",
  description: "Zeynep Çeltek Güzellik Akademi iade, iptal ve değişiklik koşulları.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalShell title="İade Politikası">
      <p>
        {COMPANY.name} hizmetleri çoğunlukla kişiye özel planlanan eğitim
        programlarıdır. Bu nedenle iade ve iptal kuralları standart
        e-ticaretten farklıdır.
      </p>
      <h2>Eğitim kaydı</h2>
      <p>
        Onaylanan program ve kontenjan ile eğitime alınan kayıtlarda; eğitim
        başladıktan sonra iade kabul edilmez. Eğitim öncesi iptalde yapılan
        kapora / avans kesintisi teklifte belirtilen oranda uygulanabilir.
      </p>
      <h2>Akademi kaynaklı aksaklık</h2>
      <p>
        Firmamızdan kaynaklanan program iptali veya ciddi aksaklıklarda ücret
        iadesi veya alternatif tarih sunulur. Katılımcı kaynaklı gecikme /
        devamsızlıklarda ek düzenleme teklif edilebilir.
      </p>
      <h2>Standart ürün / paketler</h2>
      <p>
        Stoktan verilen (varsa) standart ürün veya eğitim paketlerinde,
        kullanılmamış hallerde iade talepleri yazılı olarak {COMPANY.email}{" "}
        adresine iletilmelidir. İnceleme sonrası süreç netleştirilir.
      </p>
      <h2>Başvuru</h2>
      <p>
        İade / iptal taleplerinizi kayıt veya teklif referansınızla birlikte{" "}
        {COMPANY.email} veya {COMPANY.phone} üzerinden iletin.
      </p>
    </LegalShell>
  );
}
