import { prisma } from "@/lib/db";
import { CategoriesClient } from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Kategoriler</h1>
      <p className="text-sm text-[#888] mb-6">
        Eğitim kategorileri (protez tırnak, kalıcı makyaj vb.). Eğitimleri
        silmeden kategori silemezsiniz.
      </p>
      <div className="admin-warning mb-6">
        İçinde eğitim olan kategori silinemez. Önce eğitimleri başka kategoriye taşıyın
        veya silin. <strong>Slug</strong> = adres eki (örn. /hizmetler/kutu-harf).
        Değiştirmek eski linkleri bozabilir.
      </div>
      <CategoriesClient initial={categories} />
    </div>
  );
}
