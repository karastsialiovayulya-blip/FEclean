import { Service } from "@/lib/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MAX_AVAILABLE_CLEANERS = 10;
export const MIN_ORDER_TIME_MINUTES = 30;

interface CartState {
  cartLines: CartLine[];
  requestedCleanerCount: number;
  addCartLine: (newLine: CartLine) => void;
  removeService: (serviceId: number) => void;
  increaseQuantity: (serviceId: number) => void;
  decreaseQuantity: (serviceId: number) => void;
  increaseRequestedCleanerCount: () => void;
  decreaseRequestedCleanerCount: () => void;
  setRequestedCleanerCount: (count: number) => void;
  clearCart: () => void;
  getPrice: () => number;
  getBasePrice: () => number;
  getBaseTime: () => number;
  getEstimatedTime: () => number;
  getAdjustedTotalPrice: () => number;
}

export interface CartLine {
  service: Service;
  quantity: number;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartLines: [],
      requestedCleanerCount: 1,
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
      increaseRequestedCleanerCount: () =>
        set((state) => ({
          requestedCleanerCount: Math.min(state.requestedCleanerCount + 1, MAX_AVAILABLE_CLEANERS),
        })),
      decreaseRequestedCleanerCount: () =>
        set((state) => ({
          requestedCleanerCount: Math.max(state.requestedCleanerCount - 1, 1),
        })),
      setRequestedCleanerCount: (count) =>
        set(() => ({
          requestedCleanerCount: Math.min(
            Math.max(Math.floor(count) || 1, 1),
            MAX_AVAILABLE_CLEANERS,
          ),
        })),
      clearCart: () =>
        set(() => ({
          cartLines: [],
          requestedCleanerCount: 1,
        })),
      getBasePrice: () => {
        const { cartLines } = get();
        const totalPrice = cartLines.reduce((acc, cartLine) => {
          return acc + cartLine.service.price * cartLine.quantity;
        }, 0);

        return totalPrice;
      },
      getBaseTime: () => {
        const { cartLines } = get();
        return cartLines.reduce((acc, cartLine) => {
          return acc + cartLine.service.time * cartLine.quantity;
        }, 0);
      },
      getEstimatedTime: () => {
        const { requestedCleanerCount, getBaseTime } = get();
        const baseTime = getBaseTime();

        if (baseTime === 0) {
          return 0;
        }

        return Math.max(Math.ceil(baseTime / requestedCleanerCount), MIN_ORDER_TIME_MINUTES);
      },
      getAdjustedTotalPrice: () => {
        const { getBasePrice, getBaseTime, getEstimatedTime } = get();
        const basePrice = getBasePrice();
        const baseTime = getBaseTime();

        if (basePrice === 0 || baseTime === 0) {
          return 0;
        }

        if (baseTime >= MIN_ORDER_TIME_MINUTES) {
          return basePrice;
        }

        const adjustedPrice = (basePrice / baseTime) * getEstimatedTime();
        return Math.ceil(adjustedPrice);
      },
      getPrice: () => {
        const { getAdjustedTotalPrice } = get();
        return getAdjustedTotalPrice();
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
