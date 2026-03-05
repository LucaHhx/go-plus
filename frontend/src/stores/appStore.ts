import { create } from 'zustand';
import type { NavConfig } from '@/types';
import { homeApi } from '@/api/home';

interface AppState {
  sideDrawerOpen: boolean;
  liveChatOpen: boolean;
  navConfig: NavConfig | null;

  toggleSideDrawer: () => void;
  closeSideDrawer: () => void;
  openLiveChat: () => void;
  closeLiveChat: () => void;
  fetchNavConfig: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  sideDrawerOpen: false,
  liveChatOpen: false,
  navConfig: null,

  toggleSideDrawer: () =>
    set((state) => ({ sideDrawerOpen: !state.sideDrawerOpen })),

  closeSideDrawer: () => set({ sideDrawerOpen: false }),

  openLiveChat: () => set({ liveChatOpen: true, sideDrawerOpen: false }),

  closeLiveChat: () => set({ liveChatOpen: false }),

  fetchNavConfig: async () => {
    try {
      const res = await homeApi.getNavConfig();
      if (res.code === 0) {
        set({ navConfig: res.data });
      }
    } catch {
      // silently ignore - nav will use fallback config
    }
  },
}));
