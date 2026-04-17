"use client";

import Image from "next/image";
import { CartLine, cartStore } from "@/lib/store/cartStore";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CartLineItem({ cartLine }: { cartLine: CartLine }) {
  const { service, quantity } = cartLine;
  const cartState = cartStore();

  return (
    <div className="mb-6 flex w-full gap-6 border-b pb-6">
      <div className="relative size-[20vh] flex-shrink-0">
        {service.featuredImage ? (
          <Image
            src={service.featuredImage.url}
            fill={true}
            alt={service.featuredImage.alt}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg bg-gray-100 text-lg">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold">{service.name}</h3>
          <p className="line-clamp-2 text-lg font-thin text-gray-500">{service.description}</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
            <Button
              onClick={() => cartState.decreaseQuantity(service.id)}
              variant="outline"
              className="items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span className="text-xl">-</span>
            </Button>
            <span className="min-w-[24px] text-center text-base font-medium">{quantity}</span>
            <Button
              onClick={() => cartState.increaseQuantity(service.id)}
              variant="outline"
              className="items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span className="text-xl">+</span>
            </Button>
          </div>
          <Button
            className="block flex items-center gap-2 px-3"
            size="normal"
            variant="destructive"
            onClick={() => {
              cartState.removeService(service.id);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Remove
          </Button>
        </div>
      </div>
      <div className="text-2xl font-semibold">${service.price * quantity}</div>
    </div>
  );
}

export default function CartPage() {
  const cartState = cartStore();

  return (
    <div className="px-20 py-10">
      <div className="mb-10">
        <span className="text-primary font-label mb-6 block text-base tracking-widest uppercase">
          Your Sanctuary Selection
        </span>
        <h1 className="mb-8 text-6xl leading-none font-bold md:text-7xl">Shopping Cart</h1>
        <p className="text-xl">
          Review your curated cleaning services and botanical products before finalizing your
          session.
        </p>
      </div>
      <div className="flex gap-10">
        <div className="w-2/3">
          {cartState.cartLines.length > 0 ? (
            cartState.cartLines.map((cartLine) => (
              <CartLineItem
                key={cartLine.service.id}
                cartLine={cartLine}
              />
            ))
          ) : (
            <div className="w-full rounded-xl bg-gray-100 py-10 text-center text-lg">
              No items in cart
            </div>
          )}
        </div>
        <div className="w-1/3">
          <div className="rounded-lg border bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>
            <div className="mb-6 flex justify-between">
              <span className="text-lg">Total Price:</span>
              <span className="text-2xl font-bold">${cartState.getPrice()}</span>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-lg font-medium">Promo Code</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  className="h-10 flex-1 text-base"
                />
                <Button
                  variant="secondary"
                  size="normal"
                  className="h-10"
                >
                  Apply
                </Button>
              </div>
            </div>
            <Button
              className="w-full text-lg"
              size="normal"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
