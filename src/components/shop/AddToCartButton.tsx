"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product & { category?: { name: string } };
}

/** Akademi: ölçü/RAL yok — ProductConfigurator ile aynı mantık. */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        categoryName: product.category?.name || "Eğitimler",
        optionsNote: JSON.stringify({ type: "egitim-kaydi" }),
      })
    );
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">Kişi:</span>
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange transition-colors"
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(20, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-orange transition-colors"
            aria-label="Artır"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-full flex items-center justify-center gap-2 py-4 bg-orange text-white font-semibold uppercase tracking-wider hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check size={20} />
            Kayıt sepetine eklendi
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Kayıt sepetine ekle — {formatPrice(product.price * quantity)}
          </>
        )}
      </button>

      {added && (
        <p className="text-sm text-center text-muted">
          Sağ üstte özet görünecek — oradan sepete gidebilirsiniz.
        </p>
      )}

      {!product.inStock && (
        <p className="text-sm text-red-400 text-center">
          Şu an kayda kapalı — iletişime geçin
        </p>
      )}
    </div>
  );
}
