"use client";

import { useState } from "react";
import { cartStore } from "@/lib/store/cartStore";
import { Service } from "@/lib/types/types";
import { Button } from "@/components/ui/button";

export default function ServicePageInteractive({
  service,
  price,
}: {
  service: Service;
  price: number;
}) {
  const { addCartLine } = cartStore();
  const [quantity, setQuantity] = useState(1);
  const [iPrice, setIPrice] = useState(price);

  return (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-on-surface-variant text-sm font-medium">Starting from</span>
        <span className="text-primary font-headline text-4xl font-bold tracking-tight">
          ${iPrice}
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
          <Button
            onClick={() => {
              setQuantity(Math.max(1, quantity - 1));
              setIPrice(price * Math.max(1, quantity - 1));
            }}
            variant="outline"
            className="items-center justify-center rounded-full bg-white shadow-sm"
          >
            <span className="text-lg">-</span>
          </Button>
          <span className="min-w-[20px] text-center text-sm font-medium">{quantity}</span>
          <Button
            onClick={() => {
              setQuantity(quantity + 1);
              setIPrice(price * (quantity + 1));
            }}
            variant="outline"
            className="items-center justify-center rounded-full bg-white shadow-sm"
          >
            <span className="text-lg">+</span>
          </Button>
        </div>
        <Button
          size="normal"
          onClick={() => addCartLine({ service: service, quantity: quantity })}
        >
          Add to cart
        </Button>
      </div>
    </>
  );
}
