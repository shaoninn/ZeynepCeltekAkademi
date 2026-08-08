"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import { WishlistButton } from "@/components/shop/WishlistButton";
import type { Product } from "@/types";

type ConfigProduct = Product & {
  category?: { name: string };
  salePrice?: number | null;
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
};

interface ProductConfiguratorProps {
  product: ConfigProduct;
}

/** Akademi: sabit fiyatlı eğitim kaydı — ölçü/neon konfigüratör yok. */
export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const unitPrice =
    product.badgeSale && product.salePrice != null
      ? product.salePrice
      : product.price;

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.image,
        quantity,
        categoryName: product.category?.name || "Eğitimler",
        optionsNote: JSON.stringify({ type: "egitim-kaydi" }),
      })
    );
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted mb-1">
            Eğitim ücreti
          </p>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-orange">
            {formatPrice(unitPrice)}
          </p>
        </div>
        <WishlistButton productId={product.id} />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Kişi</span>
        <div className="inline-flex items-center rounded-full border border-border">
          <button
            type="button"
            className="w-10 h-10 inline-flex items-center justify-center text-muted hover:text-orange"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            className="w-10 h-10 inline-flex items-center justify-center text-muted hover:text-orange"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            aria-label="Arttır"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="btn-primary w-full justify-center"
      >
        {added ? (
          <>
            <Check size={18} />
            Sepete eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Kayıt sepetine ekle
          </>
        )}
      </button>
      <p className="text-xs text-muted leading-relaxed">
        Sepet online ödeme değildir. Kayıt talebiniz bize düşer; WhatsApp veya
        telefonla kontenjan ve takvim netleştirilir.
      </p>
    </div>
  );
}
