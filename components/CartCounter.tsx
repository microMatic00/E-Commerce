"use client";

import { useCart } from "@/context/CartContext";

export default function CartCounter() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  if (itemCount === 0) {
    return null;
  }

  return (
    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
      {itemCount}
    </span>
  );
}
