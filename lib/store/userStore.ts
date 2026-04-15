import { checkAuthtoken } from "@/lib/api/utils";
import { AnyUser } from "@/lib/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: AnyUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AnyUser | null) => void;
  logout: () => void;
  checkSession: () => void;
}

export const userStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      checkSession: async () => {
        try {
          const session = await checkAuthtoken();
          console.log(session);

          if (!session) {
            set({ user: null, isAuthenticated: false });
            return false;
          }
          const { user } = get();
          set({ user: user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
