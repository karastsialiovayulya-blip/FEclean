"use client";

import { cartStore } from "@/lib/store/cartStore";
import { Service } from "@/lib/types/types";
import { Button } from "@/components/ui/button";

export default function ServicePageInteractive({ service }: { service: Service }) {
  const { addCartLine } = cartStore();

  return (
    <Button
      size="normal"
      onClick={() => addCartLine({ service: service, quantity: 1 })}
    >
      Add to cart
    </Button>
  );
}
