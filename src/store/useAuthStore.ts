import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, TeamMember } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  team: Team | null;
  currentMember: TeamMember | null;
  login: (team: Team, member: TeamMember) => void;
  adminLogin: () => void;
  logout: () => void;
  updateTeam: (team: Team) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      team: null,
      currentMember: null,
      
      login: (team, member) => set({ isAuthenticated: true, isAdmin: false, team, currentMember: member }),
      
      adminLogin: () => set({ isAuthenticated: true, isAdmin: true, team: null, currentMember: null }),
      
      logout: () => set({ isAuthenticated: false, isAdmin: false, team: null, currentMember: null }),
      
      updateTeam: (team) => set({ team }),
    }),
    {
      name: 'glec_auth_storage',
    }
  )
);
