import { Service } from "@/lib/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  cartLines: CartLine[];
  addCartLine: (newLine: CartLine) => void;
  removeService: (serviceId: number) => void;
  increaseQuantity: (serviceId: number) => void;
  decreaseQuantity: (serviceId: number) => void;
  clearCart: () => void;
  getPrice: () => number;
}

export interface CartLine {
  service: Service;
  quantity: number;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartLines: [],
      addCartLine: (newLine) =>
        set((state) => {
          const isAlreadyInCart = state.cartLines.some(
            (line) => line.service.id === newLine.service.id,
          );

          if (isAlreadyInCart) {
            return {
              cartLines: state.cartLines.map((line) =>
                line.service.id === newLine.service.id
                  ? { ...line, quantity: line.quantity + newLine.quantity }
                  : line,
              ),
            };
          }

          return {
            cartLines: [...state.cartLines, newLine],
          };
        }),
      removeService: (serviceToRemove) =>
        set((state) => ({
          cartLines: state.cartLines.filter((cartLine) => cartLine.service.id !== serviceToRemove),
        })),
      increaseQuantity: (serviceId) =>
        set((state) => ({
          cartLines: state.cartLines.map((line) =>
            line.service.id === serviceId ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        })),
      decreaseQuantity: (serviceId) =>
        set((state) => ({
          cartLines: state.cartLines.map((line) =>
            line.service.id === serviceId && line.quantity > 1
              ? { ...line, quantity: line.quantity - 1 }
              : line,
          ),
        })),
      clearCart: () =>
        set(() => ({
          cartLines: [],
        })),
      getPrice: () => {
        const { cartLines } = get();
        const totalPrice = cartLines.reduce((acc, cartLine) => {
          return acc + cartLine.service.price * cartLine.quantity;
        }, 0);

        return totalPrice;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
