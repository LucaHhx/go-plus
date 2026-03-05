import { get, post, del } from './client';
import type {
  GameCategory,
  Provider,
  Game,
  GameListParams,
  GameListResponse,
} from '@/types';

export const gamesApi = {
  list: (params: GameListParams) =>
    get<GameListResponse>('/games', { params: params as Record<string, unknown> }),

  detail: (id: number) => get<Game>(`/games/${id}`),

  categories: () => get<GameCategory[]>('/games/categories'),

  providers: () => get<Provider[]>('/games/providers'),

  launch: (id: number) => post<{ game_url: string }>(`/games/${id}/launch`),

  favorites: (params?: GameListParams) =>
    get<GameListResponse>('/games/favorites', { params: params as Record<string, unknown> }),

  addFavorite: (id: number) => post<null>(`/games/${id}/favorite`),

  removeFavorite: (id: number) => del<null>(`/games/${id}/favorite`),

  recent: (params?: GameListParams) =>
    get<GameListResponse>('/games/recent', { params: params as Record<string, unknown> }),
};
