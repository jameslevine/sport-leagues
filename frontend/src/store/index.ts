import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
  } | null;
  setUser: (user: AuthState['user']) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

interface AppState {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const useAppStore = create<AppState>((set) => ({
  selectedSport: 'GOLF',
  setSelectedSport: (sport) => set({ selectedSport: sport }),
}));
