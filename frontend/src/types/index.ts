export interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar_url: string;
  google_email: string;
  role: string;
  market_code: string;
  balance: number;
  bonus_balance: number;
  created_at: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  otp: string;
  gift_game?: 'aviator' | 'money-coming';
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginOTPRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface ApiError {
  code: number;
  message: string;
}

// Home page types -- matches backend JSON exactly

export interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  link_type: string;
}

export interface GameProvider {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  thumbnail_url: string;
  is_new: boolean;
  is_hot: boolean;
  is_favorited?: boolean;
  provider: GameProvider;
  category: GameCategory;
  played_at?: string;
}

export interface GameCategory {
  id: number;
  name: string;
  slug: string;
}

export interface GameSection {
  category: GameCategory;
  games: Game[];
}

export interface Provider {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  is_new: boolean;
}

export interface PaymentIcon {
  name: string;
  icon_url: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon_url: string;
}

// Phase 2 mock types -- matches backend JSON exactly

export interface JackpotPot {
  type: string;
  label: string;
  amount: number;
  countdown?: string;
  winner_count?: number;
}

export interface JackpotChampion {
  avatar_url: string;
  username: string;
  bet_amount: number;
  win_amount: number;
  currency: string;
}

export interface JackpotData {
  pots: JackpotPot[];
  last_champion: JackpotChampion;
  my_turnover: number;
}

export interface TrendingGame {
  id: number;
  name: string;
  slug: string;
  thumbnail_url: string;
  provider_name: string;
}

export interface BigWinner {
  game_name: string;
  thumbnail_url: string;
  multiplier: number;
}

export interface OneGoSelectionData {
  tabs: string[];
  active_tab: string;
  games: TrendingGame[];
}

export interface BetRecord {
  game: string;
  game_initial: string;
  player: string;
  profit: number;
  currency: string;
}

export interface LatestBetsData {
  latest_bet: BetRecord[];
  high_roller: BetRecord[];
  high_multiplier: BetRecord[];
}

export interface PromoBannerData {
  id: number;
  title: string;
  link_url: string;
}

export interface HomeData {
  banners: Banner[];
  game_sections: GameSection[];
  providers: Provider[];
  payment_icons: PaymentIcon[];
  social_links: SocialLink[];
  // Phase 2 mock fields
  jackpot: JackpotData | null;
  trending_games: TrendingGame[];
  big_winners: BigWinner[];
  promo_banners: PromoBannerData[];
  one_go_selection: OneGoSelectionData | null;
  latest_bets: LatestBetsData | null;
}

// Game Lobby types -- matches backend game API responses

export interface GameListParams {
  category?: string;
  provider?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface GameListResponse {
  games: Game[];
  total: number;
  page: number;
  page_size: number;
}

// Navigation config -- matches backend NavItem / NavConfigResponse

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  enabled?: boolean;
  tag?: string;
}

export interface NavConfig {
  bottom_tabs: NavItem[];
  sidebar_menu: NavItem[];
}

// Wallet & Payment types

export interface WalletData {
  balance: number;
  bonus_balance: number;
  frozen_amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  icon_url: string;
  type: 'deposit' | 'withdrawal' | 'both';
  min_amount: number;
  max_amount: number;
}

export interface DepositRequest {
  amount: number;
  payment_method: string;
}

export interface DepositResult {
  transaction_id: number;
  amount: number;
  status: string;
  balance: number;
}

export interface WithdrawRequest {
  amount: number;
  payment_method: string;
  account_info: {
    upi_id?: string;
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
  };
}

export interface WithdrawResult {
  transaction_id: number;
  amount: number;
  status: string;
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'bet' | 'cashback' | 'bonus' | 'win';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  payment_method: string;
  balance_after: number;
  balance_before?: number;
  payment_ref?: string;
  remark?: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  page_size: number;
}

export interface TransactionParams {
  type?: string;
  page?: number;
  page_size?: number;
}
