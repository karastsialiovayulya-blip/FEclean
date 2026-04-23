"use client";

import { useState } from "react";
import { cartStore } from "@/lib/store/cartStore";
import { Service } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "./ui/input";

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
  const [area, serArea] = useState([service.depedensOnArea ?? 0]);

  const calculatePrice = (selectedArea = area[0], selectedQuantity = quantity) => {
    if (service.depedensOnArea) {
      const basePrice = service.price;
      const baseArea = service.depedensOnArea;
      const additionalArea = selectedArea - baseArea;
      const additionalPrice = service.priceForAdditionalMeter
        ? additionalArea * service.priceForAdditionalMeter
        : 0;
      const calculatedPrice = basePrice + additionalPrice;
      setIPrice(calculatedPrice);
    } else {
      setIPrice(price * selectedQuantity);
    }
  };

  return (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-on-surface-variant text-sm font-medium">Starting from</span>
        <span className="text-primary font-headline text-4xl font-bold tracking-tight">
          ${iPrice}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {service.depedensOnArea ? (
          <div className="w-[10vw]">
            <Slider
              id="slider-demo-temperature"
              value={area}
              onValueChange={(area) => {
                serArea(area);
                calculatePrice(area[0]);
              }}
              min={service.depedensOnArea}
              max={200}
              step={1}
            />
            <div className="mt-2 flex gap-3">
              <Input
                type="number"
                min={service.depedensOnArea ?? 0}
                max={200}
                value={area[0]}
                onChange={(e) => {
                  const newarea = Number(e.target.value);
                  if (!Number.isNaN(newarea) && newarea <= 200) {
                    serArea([newarea]);
                    calculatePrice(newarea);
                  }
                }}
              />
              <p className="w-full">Max 200</p>
            </div>
          </div>
        ) : (
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
        )}
        <Button
          size="normal"
          onClick={() => {
            if (service.depedensOnArea) {
              addCartLine({ service: service, area: area[0] });
            } else {
              addCartLine({ service: service, quantity: quantity });
            }
          }}
        >
          Add to cart
        </Button>
      </div>
    </>
  );
}
