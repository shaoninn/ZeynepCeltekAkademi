import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Images,
  Pencil,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    products,
    orders,
    unreadMessages,
    projects,
    pendingOrders,
    todayQuotes,
    confirmed,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.project.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, orderNo: true, name: true, total: true, status: true, createdAt: true },
    }),
  ]);

  const conversion =
    orders > 0 ? Math.round((confirmed / orders) * 100) : 0;

  return {
    products,
    orders,
    unreadMessages,
    projects,
    pendingOrders,
    todayQuotes,
    conversion,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Bugün kayıt",
      value: stats.todayQuotes,
      href: "/admin/siparisler",
      icon: Clock,
      hint: "Bugün gelen kayıt talepleri",
    },
    {
      label: "Bekleyen",
      value: stats.pendingOrders,
      href: "/admin/siparisler",
      icon: ShoppingBag,
      hint: "Onay bekleyen kayıtlar",
    },
    {
      label: "Dönüşüm %",
      value: stats.conversion,
      href: "/admin/siparisler/kanban",
      icon: TrendingUp,
      hint: "Onaylanan / tüm kayıtlar",
    },
    {
      label: "Eğitimler",
      value: stats.products,
      href: "/admin/urunler",
      icon: Package,
      hint: "Programlar",
    },
    {
      label: "Mesajlar",
      value: stats.unreadMessages,
      href: "/admin/mesajlar",
      icon: MessageSquare,
      hint: "Okunmamış",
    },
    {
      label: "Galeri",
      value: stats.projects,
      href: "/admin/projeler",
      icon: Images,
      hint: "Atölye görselleri",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Hoş Geldiniz</h1>
      <p className="text-muted mb-8">
        KPI özeti: bugünkü kayıtlar ve dönüşüm.
      </p>

      <Link
        href="/duzenle"
        className="admin-card mb-8 p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-orange/40 hover:border-orange transition-colors"
      >
        <div className="w-12 h-12 rounded-lg bg-orange/15 text-orange flex items-center justify-center shrink-0">
          <Pencil size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl font-bold text-white mb-1">
            Siteyi Düzenle
          </p>
          <p className="text-sm text-[#888] leading-relaxed">
            Canlı sayfada metin ve görsellere tıklayarak düzenleyin.
          </p>
        </div>
      </Link>

      <div className="admin-card p-5 mb-8">
        <h2 className="font-semibold mb-3">Başlangıç kontrol listesi</h2>
        <ul className="text-sm text-[#aaa] space-y-2">
          <li>
            WhatsApp numarası —{" "}
            <Link href="/admin/ayarlar" className="text-orange hover:underline">
              Ayarlar
            </Link>
          </li>
          <li>
            Google yorum linki —{" "}
            <Link href="/admin/ayarlar" className="text-orange hover:underline">
              Ayarlar
            </Link>
          </li>
          <li>
            Galeri görselleri —{" "}
            <Link href="/admin/projeler" className="text-orange hover:underline">
              Galeri
            </Link>
          </li>
          <li>
            İstatistik metinleri —{" "}
            <Link href="/duzenle" className="text-orange hover:underline">
              Siteyi düzenle
            </Link>
          </li>
          <li>
            İçerik için her zaman{" "}
            <Link href="/duzenle" className="text-orange hover:underline">
              Siteyi Düzenle
            </Link>{" "}
            kullanın
          </li>
          <li>
            Gerçek mezun yorumu yazmak için ana sayfa referans kartlarındaki
            isim alanını düzenleyin
          </li>
          <li>
            Lead e-postası —{" "}
            <Link href="/admin/ayarlar" className="text-orange hover:underline">
              Ayarlar → Bildirim e-postası
            </Link>
          </li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-card p-5 hover:border-orange/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-xs text-[#888] uppercase tracking-wider">
                {card.label}
              </p>
              <card.icon size={18} className="text-orange shrink-0" />
            </div>
            <p className="font-display text-3xl font-bold text-white">
              {card.value}
            </p>
            <p className="text-xs text-[#666] mt-2">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="font-semibold">Son kayıtlar</h2>
          <div className="flex items-center gap-3">
            <Link href="/admin/crm" className="text-xs text-orange hover:underline">
              CRM hatırlatma →
            </Link>
            <Link href="/admin/siparisler" className="text-xs text-orange hover:underline">
              Kayıtlar →
            </Link>
          </div>
        </div>
        {stats.todayQuotes > 0 && (
          <p className="text-xs text-[#888] mb-3">
            Bugün {stats.todayQuotes} yeni kayıt talebi.
          </p>
        )}
        <ul className="space-y-2 text-sm">
          {stats.recentOrders.length === 0 && (
            <li className="text-[#888]">Henüz kayıt yok.</li>
          )}
          {stats.recentOrders.map((o) => (
            <li
              key={o.id}
              className="flex justify-between gap-3 border-b border-[#222] pb-2"
            >
              <Link
                href={`/admin/siparisler/${o.id}`}
                className="text-orange hover:underline"
              >
                {o.orderNo}
              </Link>
              <span className="text-[#aaa] truncate">{o.name}</span>
              <span className="text-white shrink-0">{formatPrice(o.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
