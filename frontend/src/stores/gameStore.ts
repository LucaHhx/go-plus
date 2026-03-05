import { create } from 'zustand';
import type { Game, GameCategory, Provider } from '@/types';
import { gamesApi } from '@/api/games';

interface GameFilters {
  category: string | null;
  provider: string | null;
  search: string;
}

interface GameState {
  categories: GameCategory[];
  providers: Provider[];
  games: Game[];
  filters: GameFilters;
  pagination: { page: number; pageSize: number; total: number };
  loading: boolean;
  loadingMore: boolean;
  initialized: boolean;

  fetchCategories: () => Promise<void>;
  fetchProviders: () => Promise<void>;
  fetchGames: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilter: (key: keyof GameFilters, value: string | null) => void;
  toggleFavorite: (gameId: number) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  categories: [],
  providers: [],
  games: [],
  filters: { category: null, provider: null, search: '' },
  pagination: { page: 1, pageSize: 18, total: 0 },
  loading: false,
  loadingMore: false,
  initialized: false,

  fetchCategories: async () => {
    try {
      const res = await gamesApi.categories();
      if (res.code === 0) {
        set({ categories: res.data });
      }
    } catch {
      // silently ignore
    }
  },

  fetchProviders: async () => {
    try {
      const res = await gamesApi.providers();
      if (res.code === 0) {
        set({ providers: res.data });
      }
    } catch {
      // silently ignore
    }
  },

  fetchGames: async () => {
    const { filters, pagination } = get();
    set({ loading: true });

    try {
      // Special categories that have dedicated APIs
      if (filters.category === 'recent') {
        const res = await gamesApi.recent({ page: 1, page_size: pagination.pageSize });
        if (res.code === 0) {
          set({
            games: res.data.games || [],
            pagination: {
              page: res.data.page,
              pageSize: res.data.page_size,
              total: res.data.total,
            },
            loading: false,
            initialized: true,
          });
        }
        return;
      }

      if (filters.category === 'favorites') {
        const res = await gamesApi.favorites({ page: 1, page_size: pagination.pageSize });
        if (res.code === 0) {
          set({
            games: res.data.games || [],
            pagination: {
              page: res.data.page,
              pageSize: res.data.page_size,
              total: res.data.total,
            },
            loading: false,
            initialized: true,
          });
        }
        return;
      }

      // Normal listing with filters
      const params: Record<string, unknown> = {
        page: 1,
        page_size: pagination.pageSize,
      };
      if (filters.category) params.category = filters.category;
      if (filters.provider) params.provider = filters.provider;
      if (filters.search) params.search = filters.search;

      const res = await gamesApi.list(params);
      if (res.code === 0) {
        set({
          games: res.data.games || [],
          pagination: {
            page: res.data.page,
            pageSize: res.data.page_size,
            total: res.data.total,
          },
          loading: false,
          initialized: true,
        });
      }
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  loadMore: async () => {
    const { filters, pagination, games, loadingMore } = get();
    if (loadingMore) return;
    if (games.length >= pagination.total) return;

    set({ loadingMore: true });

    try {
      const nextPage = pagination.page + 1;
      const pageParams = { page: nextPage, page_size: pagination.pageSize };

      let res;
      if (filters.category === 'recent') {
        res = await gamesApi.recent(pageParams);
      } else if (filters.category === 'favorites') {
        res = await gamesApi.favorites(pageParams);
      } else {
        const params: Record<string, unknown> = { ...pageParams };
        if (filters.category) params.category = filters.category;
        if (filters.provider) params.provider = filters.provider;
        if (filters.search) params.search = filters.search;
        res = await gamesApi.list(params);
      }

      if (res.code === 0) {
        set({
          games: [...games, ...(res.data.games || [])],
          pagination: {
            page: res.data.page,
            pageSize: res.data.page_size,
            total: res.data.total,
          },
          loadingMore: false,
        });
      }
    } catch {
      set({ loadingMore: false });
    }
  },

  setFilter: (key, value) => {
    const { filters } = get();
    const newFilters = { ...filters, [key]: value };

    // Reset page when changing filters
    set({
      filters: newFilters,
      pagination: { ...get().pagination, page: 1 },
      games: [],
    });

    // Fetch new results
    get().fetchGames();
  },

  toggleFavorite: async (gameId: number) => {
    const { games } = get();
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    const wasFavorited = game.is_favorited;

    // Optimistic update
    set({
      games: games.map((g) =>
        g.id === gameId ? { ...g, is_favorited: !wasFavorited } : g
      ),
    });

    try {
      if (wasFavorited) {
        await gamesApi.removeFavorite(gameId);
      } else {
        await gamesApi.addFavorite(gameId);
      }
    } catch {
      // Revert on error
      set({
        games: get().games.map((g) =>
          g.id === gameId ? { ...g, is_favorited: wasFavorited } : g
        ),
      });
    }
  },
}));
