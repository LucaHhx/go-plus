import { get } from './client';
import type { HomeData, NavConfig } from '@/types';

export const homeApi = {
  getHomeData: () => get<HomeData>('/home'),
  getNavConfig: () => get<NavConfig>('/config/nav'),
};
