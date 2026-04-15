import Image from "next/image";
import Link from "next/link";
import { CartLine, cartStore } from "@/lib/store/cartStore";
import { Delete02Icon, ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CartLineItem({ cartLine }: { cartLine: CartLine }) {
  const { service, quantity } = cartLine;
  const cartState = cartStore();

  return (
    <div
      className="flex w-full gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative size-[10vh] flex-shrink-0">
        {service.featuredImage ? (
          <Image
            src={service.featuredImage.url}
            fill={true}
            alt={service.featuredImage.alt}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg bg-gray-100 text-sm">
            No image ;(
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold">{service.name}</h3>
          <p className="line-clamp-2 font-thin text-gray-500">{service.description}</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
            <Button
              onClick={() => cartState.decreaseQuantity(service.id)}
              variant="outline"
              className="items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span className="text-lg">-</span>
            </Button>
            <span className="min-w-[20px] text-center text-sm font-medium">{quantity}</span>
            <Button
              onClick={() => cartState.increaseQuantity(service.id)}
              variant="outline"
              className="items-center justify-center rounded-full bg-white shadow-sm"
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
          <Button
            className="block px-2"
            size="normal"
            variant="destructive"
            onClick={() => {
              cartState.removeService(service.id);
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </Button>
        </div>
      </div>
      <div>${service.price}</div>
    </div>
  );
}

export default function CartPopup() {
  const cartState = cartStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <HugeiconsIcon icon={ShoppingCart02Icon} />
          <div className="absolute -top-2 -right-2 flex size-[2vh] items-center justify-center rounded-full bg-red-500 text-white">
            <span className="text-sm">{cartState.cartLines.length}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[25vw] p-4">
        <DropdownMenuGroup className="flex flex-col gap-3">
          {cartState.cartLines.length > 0 ? (
            cartState.cartLines.map((cartLine) => (
              <CartLineItem
                key={cartLine.service.id}
                cartLine={cartLine}
              />
            ))
          ) : (
            <div>No itesm :((((</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <h3 className="mt-3 mb-4 font-bold">Total price: ${cartState.getPrice()}</h3>
          <div className="flex gap-2">
            <Link
              href=""
              className="flex-1"
            >
              <Button
                size="normal"
                className="w-full"
              >
                Go to cart
              </Button>
            </Link>
            <Button
              size="normal"
              variant="secondary"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
