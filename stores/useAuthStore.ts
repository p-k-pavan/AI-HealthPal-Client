import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {jwtDecode} from 'jwt-decode';

interface UserData {
  userId: string;
  name: string;
  role: string;
  profilePicture: string;
  token?: string;
}

interface AuthStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
  isExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isExpired: () => {
        const { user } = get();
        if (!user?.token) return true;
        
        try {
          const decoded: { exp: number } = jwtDecode(user.token);
          return decoded.exp < Date.now() / 1000;
        } catch {
          return true;
        }
      }
    }),
    {
      name: 'healthPal',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);