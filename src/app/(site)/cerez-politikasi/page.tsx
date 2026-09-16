import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/cerez-politikasi" },
  title: "Çerez Politikası",
  description: "Zeynep Çeltek Güzellik Akademi çerez ve yerel depolama kullanımı.",
};

export default function CookiePolicyPage() {
  return (
    <LegalShell title="Çerez Politikası">
      <p>
        Bu politika, {COMPANY.name} web sitesinde çerez ve benzeri teknolojilerin
        nasıl kullanıldığını açıklar.
      </p>
      <h2>Çerez nedir?</h2>
      <p>
        Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır. Site
        işlevselliği, güvenlik ve (varsa) analitik için kullanılır.
      </p>
      <h2>Kullandığımız teknolojiler</h2>
      <ul>
        <li>
          <strong>Zorunlu / işlevsel:</strong> Oturum ve güvenlik için gerekli
          çerezler.
        </li>
        <li>
          <strong>Yerel depolama (localStorage):</strong> Kayıt listeniz
          (sepet) tarayıcınızda saklanır; sunucuya otomatik gönderilmez.
        </li>
        <li>
          <strong>Analitik (opsiyonel):</strong> Google Analytics, onayınızla
          kullanım istatistikleri toplanabilir.
        </li>
        <li>
          <strong>Pazarlama (opsiyonel):</strong> Google Ads ve Meta Pixel,
          reklam dönüşümlerini ölçmek için yalnızca onayınızla yüklenir.
        </li>
      </ul>
      <h2>Yönetim</h2>
      <p>
        Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
        Engelleme bazı özelliklerin (ör. kayıt sepeti) çalışmasını
        etkileyebilir.
      </p>
      <h2>İletişim</h2>
      <p>Sorularınız için {COMPANY.phone}</p>
    </LegalShell>
  );
}
