"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  slug: string;
  name: string;
  price: number;
  imagePath?: string | null;
  className?: string;
  label?: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  slug,
  name,
  price,
  imagePath,
  className = "btn btn-primary",
  label = "Add to basket",
  disabled = false,
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={() => {
        addItem({ slug, name, price, imagePath });
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
    >
      {disabled ? "Sold out" : added ? "Added ✓" : label}
    </button>
  );
}
