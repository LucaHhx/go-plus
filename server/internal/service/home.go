package service

import (
	"encoding/json"
	"sync"
	"time"

	"go.uber.org/zap"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
)

// HomeService 首页数据服务
type HomeService struct {
	db     *gorm.DB
	logger *zap.Logger
	cache  *homeCache
}

type homeCache struct {
	mu            sync.RWMutex
	banners       []model.BannerResponse
	market        *model.MarketResponse
	navConfig     *NavConfigResponse
	providers     []model.GameProviderResponse
	gameSections  []GameSectionResponse
	paymentIcons  []IconItem
	socialLinks   []SocialLinkItem
	lastRefreshed time.Time
}

// GameSectionResponse 游戏分类区
type GameSectionResponse struct {
	Category model.GameCategoryResponse `json:"category"`
	Games    []model.GameResponse       `json:"games"`
}

// NavConfigResponse 导航配置
type NavConfigResponse struct {
	BottomTabs  []NavItem `json:"bottom_tabs"`
	SidebarMenu []NavItem `json:"sidebar_menu"`
}

// NavItem 导航项
type NavItem struct {
	ID      string `json:"id"`
	Label   string `json:"label"`
	Icon    string `json:"icon"`
	Route   string `json:"route"`
	Enabled *bool  `json:"enabled,omitempty"`
	Tag     string `json:"tag,omitempty"`
}

// IconItem 图标项（支付方式等）
type IconItem struct {
	Name    string `json:"name"`
	IconURL string `json:"icon_url"`
}

// SocialLinkItem 社交链接
type SocialLinkItem struct {
	Name    string `json:"name"`
	URL     string `json:"url"`
	IconURL string `json:"icon_url"`
}

// === 二期 mock 数据类型 ===

// JackpotPot 奖池项
type JackpotPot struct {
	Type        string  `json:"type"`
	Label       string  `json:"label"`
	Amount      float64 `json:"amount"`
	Countdown   string  `json:"countdown,omitempty"`
	WinnerCount int     `json:"winner_count,omitempty"`
}

// JackpotChampion 上一位冠军
type JackpotChampion struct {
	AvatarURL string  `json:"avatar_url"`
	Username  string  `json:"username"`
	BetAmount float64 `json:"bet_amount"`
	WinAmount float64 `json:"win_amount"`
	Currency  string  `json:"currency"`
}

// JackpotData 奖池区数据
type JackpotData struct {
	Pots         []JackpotPot    `json:"pots"`
	LastChampion JackpotChampion `json:"last_champion"`
	MyTurnover   float64         `json:"my_turnover"`
}

// TrendingGame 热门游戏
type TrendingGame struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	ThumbnailURL string `json:"thumbnail_url"`
	ProviderName string `json:"provider_name"`
}

// BigWinner 大赢家
type BigWinner struct {
	GameName     string  `json:"game_name"`
	ThumbnailURL string  `json:"thumbnail_url"`
	Multiplier   float64 `json:"multiplier"`
}

// PromoBanner 活动 Banner
type PromoBanner struct {
	ID      uint   `json:"id"`
	Title   string `json:"title"`
	LinkURL string `json:"link_url"`
}

// OneGoSelection 1GO 精选
type OneGoSelection struct {
	Tabs      []string       `json:"tabs"`
	ActiveTab string         `json:"active_tab"`
	Games     []TrendingGame `json:"games"`
}

// BetRecord 投注记录
type BetRecord struct {
	Game        string  `json:"game"`
	GameInitial string  `json:"game_initial"`
	Player      string  `json:"player"`
	Profit      float64 `json:"profit"`
	Currency    string  `json:"currency"`
}

// LatestBetsData 实时投注数据
type LatestBetsData struct {
	LatestBet      []BetRecord `json:"latest_bet"`
	HighRoller     []BetRecord `json:"high_roller"`
	HighMultiplier []BetRecord `json:"high_multiplier"`
}

// HomeResponse 首页聚合响应
type HomeResponse struct {
	// 一期全功能字段
	Banners      []model.BannerResponse       `json:"banners"`
	GameSections []GameSectionResponse        `json:"game_sections"`
	PaymentIcons []IconItem                   `json:"payment_icons"`
	Providers    []model.GameProviderResponse `json:"providers"`
	SocialLinks  []SocialLinkItem             `json:"social_links"`

	// 二期 mock 字段
	Jackpot        JackpotData    `json:"jackpot"`
	TrendingGames  []TrendingGame `json:"trending_games"`
	BigWinners     []BigWinner    `json:"big_winners"`
	PromoBanners   []PromoBanner  `json:"promo_banners"`
	OneGoSelection OneGoSelection `json:"one_go_selection"`
	LatestBets     LatestBetsData `json:"latest_bets"`
}

func NewHomeService(db *gorm.DB, logger *zap.Logger) *HomeService {
	svc := &HomeService{
		db:     db,
		logger: logger,
		cache:  &homeCache{},
	}
	svc.RefreshCache()
	return svc
}

// RefreshCache 刷新所有缓存数据
func (s *HomeService) RefreshCache() {
	s.cache.mu.Lock()
	defer s.cache.mu.Unlock()

	s.loadBanners()
	s.loadMarket()
	s.loadNavConfig()
	s.loadProviders()
	s.loadGameSections()
	s.loadPaymentIcons()
	s.loadSocialLinks()
	s.cache.lastRefreshed = time.Now()

	s.logger.Info("Home cache refreshed")
}

func (s *HomeService) loadBanners() {
	var banners []model.Banner
	now := time.Now()
	s.db.Where("status = ? AND (start_at IS NULL OR start_at <= ?) AND (end_at IS NULL OR end_at >= ?)",
		"active", now, now).
		Order("sort_order ASC").
		Find(&banners)

	result := make([]model.BannerResponse, 0, len(banners))
	for _, b := range banners {
		result = append(result, b.ToResponse())
	}
	s.cache.banners = result
}

func (s *HomeService) loadMarket() {
	var market model.Market
	if err := s.db.Where("code = ? AND status = ?", "IN", "active").First(&market).Error; err != nil {
		s.logger.Warn("Failed to load market config", zap.Error(err))
		return
	}
	resp := market.ToResponse()
	s.cache.market = &resp
}

func (s *HomeService) loadNavConfig() {
	// 从 system_configs 加载导航配置
	var configs []model.SystemConfig
	s.db.Where("config_key IN ? AND market_code = ?",
		[]string{"nav_bottom_tabs", "nav_sidebar_menu"}, "IN").
		Find(&configs)

	nav := &NavConfigResponse{}
	for _, cfg := range configs {
		switch cfg.ConfigKey {
		case "nav_bottom_tabs":
			json.Unmarshal([]byte(cfg.ConfigValue), &nav.BottomTabs)
		case "nav_sidebar_menu":
			json.Unmarshal([]byte(cfg.ConfigValue), &nav.SidebarMenu)
		}
	}

	// 如果没有配置，使用默认值
	if len(nav.BottomTabs) == 0 {
		nav.BottomTabs = defaultBottomTabs()
	}
	if len(nav.SidebarMenu) == 0 {
		nav.SidebarMenu = defaultSidebarMenu()
	}

	s.cache.navConfig = nav
}

func (s *HomeService) loadProviders() {
	var providers []model.GameProvider
	s.db.Where("status = ?", "active").Order("sort_order ASC").Find(&providers)

	result := make([]model.GameProviderResponse, 0, len(providers))
	for _, p := range providers {
		result = append(result, p.ToResponse())
	}
	s.cache.providers = result
}

func (s *HomeService) loadGameSections() {
	// 分类顺序: Table Game > Slots > Live > Fishing > Crash > Lotto
	slugOrder := []string{"table-game", "slots", "live", "fishing", "crash", "lotto"}

	var categories []model.GameCategory
	s.db.Where("status = ? AND slug IN ?", "active", slugOrder).
		Order("sort_order ASC").Find(&categories)

	// 按照指定顺序排列
	categoryMap := make(map[string]model.GameCategory)
	for _, cat := range categories {
		categoryMap[cat.Slug] = cat
	}

	sections := make([]GameSectionResponse, 0, len(slugOrder))
	for _, slug := range slugOrder {
		cat, ok := categoryMap[slug]
		if !ok {
			continue
		}

		var games []model.Game
		s.db.Where("category_id = ? AND status = ?", cat.ID, "active").
			Order("sort_order ASC").
			Limit(10).
			Find(&games)

		gameResponses := make([]model.GameResponse, 0, len(games))
		for _, g := range games {
			gameResponses = append(gameResponses, g.ToResponse())
		}

		sections = append(sections, GameSectionResponse{
			Category: cat.ToResponse(),
			Games:    gameResponses,
		})
	}
	s.cache.gameSections = sections
}

func (s *HomeService) loadPaymentIcons() {
	var cfg model.SystemConfig
	if err := s.db.Where("config_key = ? AND market_code = ?", "payment_icons", "IN").First(&cfg).Error; err != nil {
		s.cache.paymentIcons = []IconItem{}
		return
	}
	var icons []IconItem
	json.Unmarshal([]byte(cfg.ConfigValue), &icons)
	s.cache.paymentIcons = icons
}

func (s *HomeService) loadSocialLinks() {
	var cfg model.SystemConfig
	if err := s.db.Where("config_key = ? AND market_code = ?", "social_links", "IN").First(&cfg).Error; err != nil {
		s.cache.socialLinks = []SocialLinkItem{}
		return
	}
	var links []SocialLinkItem
	json.Unmarshal([]byte(cfg.ConfigValue), &links)
	s.cache.socialLinks = links
}

// GetHomeData 获取首页聚合数据
func (s *HomeService) GetHomeData() HomeResponse {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()

	return HomeResponse{
		// 一期全功能
		Banners:      s.cache.banners,
		GameSections: s.cache.gameSections,
		PaymentIcons: s.cache.paymentIcons,
		Providers:    s.cache.providers,
		SocialLinks:  s.cache.socialLinks,

		// 二期 mock
		Jackpot:        mockJackpot(),
		TrendingGames:  mockTrendingGames(),
		BigWinners:     mockBigWinners(),
		PromoBanners:   mockPromoBanners(),
		OneGoSelection: mockOneGoSelection(),
		LatestBets:     mockLatestBets(),
	}
}

// === 二期 mock 数据生成 ===

func mockJackpot() JackpotData {
	return JackpotData{
		Pots: []JackpotPot{
			{Type: "vip_money_pot", Label: "VIP Money Pot", Amount: 15000000.00, Countdown: "23:59:59"},
			{Type: "daily_jackpot", Label: "Daily Jackpot", Amount: 500000.00, WinnerCount: 128},
		},
		LastChampion: JackpotChampion{
			AvatarURL: "/assets/avatars/default.png",
			Username:  "Player***89",
			BetAmount: 1000.00,
			WinAmount: 50000.00,
			Currency:  "Rp",
		},
		MyTurnover: 0.00,
	}
}

func mockTrendingGames() []TrendingGame {
	return []TrendingGame{
		{ID: 10, Name: "Aviator", Slug: "aviator", ThumbnailURL: "https://1goplus.com/static/game/icon/others/img_v0.0.03_aviator_1.png", ProviderName: "Spribe"},
		{ID: 11, Name: "Fortune Gems 3", Slug: "fortune-gems-3", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/156.png", ProviderName: "JILI"},
		{ID: 12, Name: "TeenPatti", Slug: "teenpatti", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/158.png", ProviderName: "JILI"},
		{ID: 13, Name: "All-Star Fishing", Slug: "all-star-fishing", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/541.png", ProviderName: "JILI"},
		{ID: 14, Name: "Lightning Ball", Slug: "lightning-ball", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/OR_480x630_GameID076_en-US.png", ProviderName: "JILI"},
	}
}

func mockBigWinners() []BigWinner {
	return []BigWinner{
		{GameName: "Sugar Rush", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/156.png", Multiplier: 80.0},
		{GameName: "Fortune Gems 3", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/156.png", Multiplier: 65.5},
		{GameName: "Aviator", ThumbnailURL: "https://1goplus.com/static/game/icon/others/img_v0.0.03_aviator_1.png", Multiplier: 120.0},
		{GameName: "TeenPatti", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/158.png", Multiplier: 45.2},
		{GameName: "Cash Mania", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/448.png", Multiplier: 92.8},
	}
}

func mockPromoBanners() []PromoBanner {
	return []PromoBanner{
		{ID: 1, Title: "37% First Deposit Cash Back", LinkURL: "/wallet/deposit"},
	}
}

func mockOneGoSelection() OneGoSelection {
	return OneGoSelection{
		Tabs:      []string{"1GO", "Deposit", "Cashier", "Pay", "Mega"},
		ActiveTab: "1GO",
		Games: []TrendingGame{
			{ID: 30, Name: "Fortune Gems 3", Slug: "fortune-gems-3", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/156.png", ProviderName: "JILI"},
			{ID: 31, Name: "Color Prediction", Slug: "color-prediction", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/OR_480x630_GameID067_en-US.png", ProviderName: "JILI"},
			{ID: 32, Name: "Aviator", Slug: "aviator", ThumbnailURL: "https://1goplus.com/static/game/icon/others/img_v0.0.03_aviator_1.png", ProviderName: "Spribe"},
			{ID: 33, Name: "Cash Mania", Slug: "cash-mania", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/448.png", ProviderName: "JILI"},
			{ID: 34, Name: "Ludo Quick", Slug: "ludo-quick", ThumbnailURL: "https://1goplus.com/static/game/icon/jili/OR_480x630_GameID049_en-US.png", ProviderName: "JILI"},
		},
	}
}

func mockLatestBets() LatestBetsData {
	return LatestBetsData{
		LatestBet: []BetRecord{
			{Game: "Blackjack", GameInitial: "B", Player: "Player***12", Profit: 3.20, Currency: "Rp"},
			{Game: "Aviator", GameInitial: "A", Player: "Player***34", Profit: 15.50, Currency: "Rp"},
			{Game: "Fortune Gems 3", GameInitial: "F", Player: "Player***56", Profit: -5.00, Currency: "Rp"},
			{Game: "TeenPatti", GameInitial: "T", Player: "Player***78", Profit: 8.00, Currency: "Rp"},
			{Game: "Rummy", GameInitial: "R", Player: "Player***90", Profit: -2.30, Currency: "Rp"},
			{Game: "Dragon Tiger", GameInitial: "D", Player: "Player***11", Profit: 12.00, Currency: "Rp"},
			{Game: "Mines", GameInitial: "M", Player: "Player***22", Profit: 25.00, Currency: "Rp"},
			{Game: "Baccarat", GameInitial: "B", Player: "Player***33", Profit: -10.00, Currency: "Rp"},
			{Game: "Plinko", GameInitial: "P", Player: "Player***44", Profit: 7.50, Currency: "Rp"},
			{Game: "Sic Bo", GameInitial: "S", Player: "Player***55", Profit: 4.00, Currency: "Rp"},
		},
		HighRoller: []BetRecord{
			{Game: "Roulette", GameInitial: "R", Player: "Player***45", Profit: 150.00, Currency: "Rp"},
			{Game: "Blackjack", GameInitial: "B", Player: "Player***67", Profit: 280.00, Currency: "Rp"},
			{Game: "Baccarat", GameInitial: "B", Player: "Player***89", Profit: -120.00, Currency: "Rp"},
			{Game: "Dragon Tiger", GameInitial: "D", Player: "Player***01", Profit: 450.00, Currency: "Rp"},
			{Game: "TeenPatti", GameInitial: "T", Player: "Player***23", Profit: 320.00, Currency: "Rp"},
			{Game: "Aviator", GameInitial: "A", Player: "Player***45", Profit: 580.00, Currency: "Rp"},
			{Game: "Fortune Gems 3", GameInitial: "F", Player: "Player***67", Profit: -200.00, Currency: "Rp"},
			{Game: "Andar Bahar", GameInitial: "A", Player: "Player***89", Profit: 175.00, Currency: "Rp"},
			{Game: "Sic Bo", GameInitial: "S", Player: "Player***01", Profit: 95.00, Currency: "Rp"},
			{Game: "Rummy", GameInitial: "R", Player: "Player***23", Profit: 210.00, Currency: "Rp"},
		},
		HighMultiplier: []BetRecord{
			{Game: "Aviator", GameInitial: "A", Player: "Player***78", Profit: 0, Currency: "Rp"},
			{Game: "Plinko", GameInitial: "P", Player: "Player***90", Profit: 500.00, Currency: "Rp"},
			{Game: "Mines", GameInitial: "M", Player: "Player***12", Profit: 350.00, Currency: "Rp"},
			{Game: "JetX", GameInitial: "J", Player: "Player***34", Profit: 420.00, Currency: "Rp"},
			{Game: "Chicken Road 2", GameInitial: "C", Player: "Player***56", Profit: 280.00, Currency: "Rp"},
			{Game: "Hi-Lo", GameInitial: "H", Player: "Player***78", Profit: 150.00, Currency: "Rp"},
			{Game: "Dice", GameInitial: "D", Player: "Player***90", Profit: 620.00, Currency: "Rp"},
			{Game: "Goal", GameInitial: "G", Player: "Player***12", Profit: 180.00, Currency: "Rp"},
			{Game: "Fortune Gems 3", GameInitial: "F", Player: "Player***34", Profit: 750.00, Currency: "Rp"},
			{Game: "Cash Mania", GameInitial: "C", Player: "Player***56", Profit: 310.00, Currency: "Rp"},
		},
	}
}

// GetBanners 获取 Banner 列表
func (s *HomeService) GetBanners() []model.BannerResponse {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()
	return s.cache.banners
}

// GetMarketConfig 获取市场配置
func (s *HomeService) GetMarketConfig() *model.MarketResponse {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()
	return s.cache.market
}

// GetNavConfig 获取导航配置
func (s *HomeService) GetNavConfig() *NavConfigResponse {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()
	return s.cache.navConfig
}

func boolPtr(b bool) *bool {
	return &b
}

func defaultBottomTabs() []NavItem {
	return []NavItem{
		{ID: "menu", Label: "Menu", Icon: "menu", Route: "/menu", Enabled: boolPtr(true)},
		{ID: "explore", Label: "Explore", Icon: "explore", Route: "/explore", Enabled: boolPtr(true)},
		{ID: "get1700", Label: "GET 1700", Icon: "gift", Route: "/lucky-wheel", Enabled: boolPtr(false)},
		{ID: "raffle", Label: "Raffle", Icon: "raffle", Route: "/raffle", Enabled: boolPtr(false)},
		{ID: "quest", Label: "Quest", Icon: "quest", Route: "/quest", Enabled: boolPtr(false)},
	}
}

func defaultSidebarMenu() []NavItem {
	return []NavItem{
		// 游戏分类 8 项
		{ID: "favourite", Label: "Favourite", Icon: "heart", Route: "/explore?category=favorites"},
		{ID: "weekly-raffle", Label: "Weekly Raffle", Icon: "raffle", Route: "/raffle", Tag: "Hot"},
		{ID: "crash", Label: "Crash", Icon: "crash", Route: "/explore?category=crash", Tag: "Hot"},
		{ID: "live", Label: "Live", Icon: "live", Route: "/explore?category=live"},
		{ID: "slots", Label: "Slots", Icon: "slots", Route: "/explore?category=slots"},
		{ID: "table-game", Label: "Table Game", Icon: "table", Route: "/explore?category=table-game"},
		{ID: "fishing", Label: "Fishing", Icon: "fishing", Route: "/explore?category=fishing"},
		{ID: "lotto", Label: "Lotto", Icon: "lotto", Route: "/explore?category=lotto"},
		// 功能入口 7 项
		{ID: "notifications", Label: "Notifications", Icon: "bell", Route: "/notifications"},
		{ID: "hot-event", Label: "Hot Event", Icon: "fire", Route: "/events"},
		{ID: "gift-code", Label: "Gift Code", Icon: "gift-code", Route: "/gift-code"},
		{ID: "vip-club", Label: "VIP Club", Icon: "vip", Route: "/vip"},
		{ID: "affiliate", Label: "Affiliate", Icon: "affiliate", Route: "/affiliate"},
		{ID: "get-1700", Label: "GET 1700", Icon: "gift", Route: "/lucky-wheel"},
		{ID: "live-support", Label: "Live Support", Icon: "support", Route: "/support"},
	}
}
