import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserData {
  userId: string;
  name: string;
  role: string;
  profilePicture: string;
}

interface AuthStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'healthPal',
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ user: state.user }), 
    }
  )
);