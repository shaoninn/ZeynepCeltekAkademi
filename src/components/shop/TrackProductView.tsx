"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/ads";
import { addRecent } from "@/lib/local-lists";

export function TrackProductView({
  productId,
  name,
  price,
}: {
  productId: string;
  name: string;
  price: number;
}) {
  useEffect(() => {
    addRecent(productId);
    trackViewContent({ id: productId, name, price });
  }, [productId, name, price]);
  return null;
}
