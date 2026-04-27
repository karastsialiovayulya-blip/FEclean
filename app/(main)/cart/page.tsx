"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CartLine,
  MAX_AVAILABLE_CLEANERS,
  MIN_ORDER_TIME_MINUTES,
  cartStore,
} from "@/lib/store/cartStore";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CartLineItem({ cartLine }: { cartLine: CartLine }) {
  const { id, service, quantity, area } = cartLine;
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
          {quantity ? (
            <div className="flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
              <Button
                onClick={() => cartState.decreaseQuantity(id)}
                variant="outline"
                className="items-center justify-center rounded-full bg-white shadow-sm"
              >
                <span className="text-xl">-</span>
              </Button>
              <span className="min-w-[24px] text-center text-base font-medium">{quantity}</span>
              <Button
                onClick={() => cartState.increaseQuantity(id)}
                variant="outline"
                className="items-center justify-center rounded-full bg-white shadow-sm"
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          ) : (
            <div>
              <Input
                value={area}
                onChange={(e) => {
                  let newArea = Number(e.target.value);
                  if (!Number.isNaN(newArea) && service.depedensOnArea) {
                    if (newArea < service.depedensOnArea) newArea = service.depedensOnArea;
                    if (newArea > 200) newArea = 200;
                    cartState.changeArea(id, newArea);
                  }
                }}
              />
            </div>
          )}
          <Button
            className="block flex items-center gap-2 px-3"
            size="normal"
            variant="destructive"
            onClick={() => {
              cartState.removeService(id);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Remove
          </Button>
        </div>
      </div>
      <div className="text-2xl font-semibold">${cartState.getCartLinePrice(id).toFixed(2)}</div>
    </div>
  );
}

export default function CartPage() {
  const cartState = cartStore();
  const basePrice = cartState.getBasePrice();
  const totalPrice = cartState.getAdjustedTotalPrice();
  const baseTime = cartState.getBaseTime();
  const estimatedTime = cartState.getEstimatedTime();

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes} min`;
  };

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
                key={cartLine.id}
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
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-500 uppercase">Requested Cleaners</p>
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full bg-white"
                  onClick={() => cartState.decreaseRequestedCleanerCount()}
                  disabled={cartState.requestedCleanerCount <= 1}
                >
                  <span className="text-xl">-</span>
                </Button>
                <div className="text-center">
                  <p className="text-3xl font-bold">{cartState.requestedCleanerCount}</p>
                  <p className="text-sm text-gray-500">max {MAX_AVAILABLE_CLEANERS} cleaners</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full bg-white"
                  onClick={() => cartState.increaseRequestedCleanerCount()}
                  disabled={cartState.requestedCleanerCount >= MAX_AVAILABLE_CLEANERS}
                >
                  <span className="text-xl">+</span>
                </Button>
              </div>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="text-lg">Services Total:</span>
              <span className="text-xl font-semibold">${basePrice}</span>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="text-lg">Base Time:</span>
              <span className="text-xl font-semibold">{formatMinutes(baseTime)}</span>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="text-lg">Estimated Order Time:</span>
              <span className="text-xl font-semibold">{formatMinutes(estimatedTime)}</span>
            </div>
            <div className="mb-6 flex justify-between border-t pt-4">
              <span className="text-lg">Total Price:</span>
              <span className="text-2xl font-bold">${totalPrice}</span>
            </div>
            <p className="mb-6 text-sm leading-6 text-gray-500">
              Orders have a minimum duration of {formatMinutes(MIN_ORDER_TIME_MINUTES)}. More
              cleaners can shorten the visit, but the booking cannot go below that floor.
            </p>
            <Link href="/checkout">
              <Button
                className="w-full text-lg"
                size="normal"
                disabled={cartState.cartLines.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
