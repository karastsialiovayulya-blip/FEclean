import { Service } from "@/lib/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MAX_AVAILABLE_CLEANERS = 10;
export const MIN_ORDER_TIME_MINUTES = 30;

interface CartState {
  cartLines: CartLine[];
  requestedCleanerCount: number;
  addCartLine: (newLine: Omit<CartLine, "id">) => void;
  removeService: (cartLineId: string) => void;
  increaseQuantity: (cartLineId: string) => void;
  decreaseQuantity: (cartLineId: string) => void;
  increaseRequestedCleanerCount: () => void;
  decreaseRequestedCleanerCount: () => void;
  setRequestedCleanerCount: (count: number) => void;
  changeArea: (cartLineId: string, area: number) => void;
  clearCart: () => void;
  getPrice: () => number;
  getBasePrice: () => number;
  getCartLinePrice: (cartLineId: string) => number;
  getBaseTime: () => number;
  getEstimatedTime: () => number;
  getAdjustedTotalPrice: () => number;
}

export interface CartLine {
  id: string;
  service: Service;
  quantity?: number;
  area?: number;
}

const createCartLineId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const withCartLineId = (line: CartLine | Omit<CartLine, "id">): CartLine => ({
  ...line,
  id: "id" in line && line.id ? line.id : createCartLineId(),
});

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartLines: [],
      requestedCleanerCount: 1,
      addCartLine: (newLine) =>
        set((state) => {
          const nextLine = withCartLineId(newLine);
          const isAlreadyInCart = state.cartLines.some(
            (line) => line.service.id === nextLine.service.id,
          );

          if (isAlreadyInCart && nextLine.quantity) {
            return {
              cartLines: state.cartLines.map((line) =>
                line.service.id === nextLine.service.id && line.quantity && nextLine.quantity
                  ? { ...line, quantity: line.quantity + nextLine.quantity }
                  : line,
              ),
            };
          }

          return {
            cartLines: [...state.cartLines, nextLine],
          };
        }),
      removeService: (cartLineId) =>
        set((state) => ({
          cartLines: state.cartLines.filter((cartLine) => cartLine.id !== cartLineId),
        })),
      increaseQuantity: (cartLineId) =>
        set((state) => ({
          cartLines: state.cartLines.map((line) =>
            line.id === cartLineId && line.quantity !== undefined
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        })),
      decreaseQuantity: (cartLineId) =>
        set((state) => ({
          cartLines: state.cartLines.map((line) =>
            line.id === cartLineId && line.quantity !== undefined && line.quantity > 1
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
      changeArea: (cartLineId, area) =>
        set((state) => ({
          cartLines: state.cartLines.map((line) =>
            line.id === cartLineId ? { ...line, area } : line,
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
          if (cartLine.quantity !== undefined) {
            return acc + cartLine.service.price * cartLine.quantity;
          } else if (cartLine.area !== undefined) {
            const areaPrice =
              cartLine.service.depedensOnArea && cartLine.service.priceForAdditionalMeter
                ? cartLine.service.price +
                  Math.max(0, cartLine.area - cartLine.service.depedensOnArea) *
                    cartLine.service.priceForAdditionalMeter
                : cartLine.service.price;
            return acc + areaPrice;
          }
          return acc;
        }, 0);

        return totalPrice;
      },
      getBaseTime: () => {
        const { cartLines } = get();
        return cartLines.reduce((acc, cartLine) => {
          if (cartLine.quantity !== undefined) {
            return acc + cartLine.service.time * cartLine.quantity;
          } else if (cartLine.area !== undefined) {
            const time =
              cartLine.service.depedensOnArea && cartLine.service.priceForAdditionalMeter
                ? cartLine.service.time +
                  Math.max(0, cartLine.area - cartLine.service.depedensOnArea) *
                    (cartLine.service.time / cartLine.service.depedensOnArea)
                : cartLine.service.time;
            return acc + time;
          }
          return acc;
        }, 0);
      },
      getCartLinePrice: (cartLineId) => {
        const { cartLines } = get();
        const cartLine = cartLines.find((line) => line.id === cartLineId);

        if (!cartLine) {
          return 0;
        }

        if (cartLine.quantity !== undefined) {
          return cartLine.service.price * cartLine.quantity;
        } else if (cartLine.area !== undefined) {
          return cartLine.service.depedensOnArea && cartLine.service.priceForAdditionalMeter
            ? cartLine.service.price +
                Math.max(0, cartLine.area - cartLine.service.depedensOnArea) *
                  cartLine.service.priceForAdditionalMeter
            : cartLine.service.price;
        }

        return 0;
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
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<CartState> | undefined;

        if (!typedPersistedState) {
          return currentState;
        }

        return {
          ...currentState,
          ...typedPersistedState,
          cartLines: (typedPersistedState.cartLines ?? currentState.cartLines).map(withCartLineId),
        };
      },
    },
  ),
);
