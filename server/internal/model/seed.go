package model

import (
	"encoding/json"

	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// seedVersion 用于标识 seed 数据版本，版本变化时重建数据
const seedVersion = "10"

// SeedData 初始化种子数据
func SeedData(db *gorm.DB, logger *zap.Logger) {
	// 检查 seed 版本
	var versionCfg SystemConfig
	err := db.Where("config_key = ? AND market_code = ?", "seed_version", "SYSTEM").First(&versionCfg).Error
	if err == nil && versionCfg.ConfigValue == seedVersion {
		logger.Info("Seed data is up to date", zap.String("version", seedVersion))
		return
	}

	logger.Info("Seeding data", zap.String("version", seedVersion))

	// 清除旧数据并重新 seed (Unscoped 绕过软删除)
	db.Unscoped().Where("1=1").Delete(&UserRecentGame{})
	db.Unscoped().Where("1=1").Delete(&UserFavorite{})
	db.Unscoped().Where("1=1").Delete(&Game{})
	db.Unscoped().Where("1=1").Delete(&Banner{})
	db.Unscoped().Where("1=1").Delete(&GameCategory{})
	db.Unscoped().Where("1=1").Delete(&GameProvider{})
	db.Unscoped().Where("1=1").Delete(&Market{})
	db.Unscoped().Where("1=1").Delete(&SystemConfig{})
	db.Unscoped().Where("1=1").Delete(&PaymentMethod{})
	db.Unscoped().Where("1=1").Delete(&SocialLink{})
	db.Unscoped().Where("1=1").Delete(&LiveSupportConfig{})
	db.Unscoped().Where("1=1").Delete(&AdminOperationLog{})
	db.Unscoped().Where("1=1").Delete(&AdminUser{})

	seedAdminUsers(db, logger)
	seedMarket(db, logger)
	seedBanners(db, logger)
	seedGameCategories(db, logger)
	seedGameProviders(db, logger)
	seedGames(db, logger)
	seedSystemConfigs(db, logger)
	seedPaymentMethods(db, logger)
	seedSocialLinks(db, logger)
	seedLiveSupportConfig(db, logger)

	// 迁移已有数据的货币从 INR 到 IDR
	db.Model(&Wallet{}).Where("currency = ?", "INR").Updates(map[string]interface{}{"currency": "IDR", "market_code": "ID"})
	db.Model(&Transaction{}).Where("market_code = ?", "IN").Update("market_code", "ID")
	db.Model(&PaymentMethod{}).Where("market_code = ?", "IN").Update("market_code", "ID")
	logger.Info("Migrated existing data currency from INR to IDR")

	// 更新版本号
	db.Where("config_key = ? AND market_code = ?", "seed_version", "SYSTEM").Delete(&SystemConfig{})
	db.Create(&SystemConfig{ConfigKey: "seed_version", ConfigValue: seedVersion, Description: "Seed data version", MarketCode: "SYSTEM"})
}

func seedMarket(db *gorm.DB, logger *zap.Logger) {
	market := Market{
		Code:           "ID",
		Name:           "Indonesia",
		Currency:       "IDR",
		CurrencySymbol: "Rp",
		PhonePrefix:    "+62",
		Locale:         "id",
		Timezone:       "Asia/Jakarta",
		Status:         "active",
	}
	db.Create(&market)
	logger.Info("Seeded market data")
}

func seedBanners(db *gorm.DB, logger *zap.Logger) {
	banners := []Banner{
		{Title: "Sign Up & Get 100 Bonuses", ImageURL: "https://1goplus.com/png/login-fWVrBuNX.png", LinkURL: "/register", LinkType: "internal", SortOrder: 1, Status: "active", MarketCode: "IN"},
		{Title: "First Deposit 37% Cashback", ImageURL: "https://1goplus.com/png/login-fWVrBuNX.png", LinkURL: "/deposit", LinkType: "internal", SortOrder: 2, Status: "active", MarketCode: "IN"},
		{Title: "Weekly Raffle - Win Big Prizes", ImageURL: "https://1goplus.com/png/login-fWVrBuNX.png", LinkURL: "/raffle", LinkType: "internal", SortOrder: 3, Status: "active", MarketCode: "IN"},
	}
	db.Create(&banners)
	logger.Info("Seeded banner data", zap.Int("count", len(banners)))
}

func seedGameCategories(db *gorm.DB, logger *zap.Logger) {
	categories := []GameCategory{
		{Name: "Table Game", Slug: "table-game", IconURL: "/assets/icons/table-game.svg", SortOrder: 1, Status: "active"},
		{Name: "Slots", Slug: "slots", IconURL: "/assets/icons/slots.svg", SortOrder: 2, Status: "active"},
		{Name: "Live", Slug: "live", IconURL: "/assets/icons/live.svg", SortOrder: 3, Status: "active"},
		{Name: "Fishing", Slug: "fishing", IconURL: "/assets/icons/fishing.svg", SortOrder: 4, Status: "active"},
		{Name: "Crash", Slug: "crash", IconURL: "/assets/icons/crash.svg", SortOrder: 5, Status: "active"},
		{Name: "Lotto", Slug: "lotto", IconURL: "/assets/icons/lotto.svg", SortOrder: 6, Status: "active"},
	}
	db.Create(&categories)
	logger.Info("Seeded game categories", zap.Int("count", len(categories)))
}

func seedGameProviders(db *gorm.DB, logger *zap.Logger) {
	// 供应商列表与设计稿 merge.html 完全对齐 (4列网格, 19个供应商)
	providers := []GameProvider{
		// Row 1
		{Name: "JILI", Slug: "jili", LogoURL: "", SortOrder: 1, Status: "active"},
		{Name: "Spribe", Slug: "spribe", LogoURL: "", SortOrder: 2, Status: "active"},
		{Name: "JDB", Slug: "jdb", LogoURL: "", SortOrder: 3, Status: "active"},
		{Name: "Evolution", Slug: "evolution", LogoURL: "", SortOrder: 4, Status: "active"},
		// Row 2
		{Name: "iNOUT", Slug: "inout", LogoURL: "", SortOrder: 5, Status: "active"},
		{Name: "HACKSAW GAMING", Slug: "hacksaw", LogoURL: "", SortOrder: 6, Status: "active"},
		{Name: "PG", Slug: "pg", LogoURL: "", SortOrder: 7, Status: "active"},
		{Name: "Playtech", Slug: "playtech", LogoURL: "", SortOrder: 8, Status: "active"},
		// Row 3
		{Name: "TurboGames", Slug: "turbogames", LogoURL: "", SortOrder: 9, Status: "active"},
		{Name: "MG", Slug: "mg", LogoURL: "", SortOrder: 10, Status: "active"},
		{Name: "HABANERO", Slug: "habanero", LogoURL: "", SortOrder: 11, Status: "active"},
		{Name: "SA GAMING", Slug: "sa-gaming", LogoURL: "", SortOrder: 12, Status: "active"},
		// Row 4 - NEW
		{Name: "NETENT", Slug: "netent", LogoURL: "", IsNew: true, SortOrder: 13, Status: "active"},
		{Name: "NOLIMIT CITY", Slug: "nolimit-city", LogoURL: "", IsNew: true, SortOrder: 14, Status: "active"},
		{Name: "RED TIGER", Slug: "red-tiger", LogoURL: "", IsNew: true, SortOrder: 15, Status: "active"},
		{Name: "Big Time Gaming", Slug: "big-time-gaming", LogoURL: "", IsNew: true, SortOrder: 16, Status: "active"},
		// Row 5 - NEW
		{Name: "TAP-A-ROO", Slug: "tap-a-roo", LogoURL: "", IsNew: true, SortOrder: 17, Status: "active"},
		{Name: "Ezugi", Slug: "ezugi", LogoURL: "", IsNew: true, SortOrder: 18, Status: "active"},
		{Name: "EENI", Slug: "eeni", LogoURL: "", IsNew: true, SortOrder: 19, Status: "active"},
	}
	db.Create(&providers)
	logger.Info("Seeded game providers", zap.Int("count", len(providers)))
}

func seedGames(db *gorm.DB, logger *zap.Logger) {
	var categories []GameCategory
	db.Find(&categories)
	catMap := make(map[string]uint)
	for _, c := range categories {
		catMap[c.Slug] = c.ID
	}

	// 获取供应商 ID
	var providers []GameProvider
	db.Find(&providers)
	provMap := make(map[string]uint)
	for _, p := range providers {
		provMap[p.Slug] = p.ID
	}

	// 缩略图 URL 复用池 (UI 资源到位前临时使用)
	thumbs := []string{
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID049_en-US.png",
		"https://1goplus.com/static/game/icon/jili/158.png",
		"https://1goplus.com/static/game/icon/jili/545.png",
		"https://1goplus.com/static/game/icon/jili/57.png",
		"https://1goplus.com/static/game/icon/jili/523.png",
		"https://1goplus.com/static/game/icon/jili/156.png",
		"https://1goplus.com/static/game/icon/jili/448.png",
		"https://1goplus.com/static/game/icon/jili/504.png",
		"https://1goplus.com/static/game/icon/jili/33.png",
		"https://1goplus.com/static/game/icon/jili/20.png",
		"https://1goplus.com/static/game/icon/jili/505.png",
		"https://1goplus.com/static/game/icon/jili/541.png",
		"https://1goplus.com/static/game/icon/jili/543.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID076_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID045_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID067_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID137_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID153_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID223_en-US.png",
		"https://1goplus.com/static/game/icon/jili/OR_480x630_GameID400_pt-BR.png",
		"https://1goplus.com/static/game/icon/jdb/349.png",
		"https://1goplus.com/static/game/icon/jdb/351.png",
		"https://1goplus.com/static/game/icon/jdb/6001.png",
		"https://1goplus.com/static/game/icon/others/img_v0.0.03_aviator_1.png",
		"https://1goplus.com/static/game/icon/others/chicken-road2.png",
	}
	t := func(i int) string { return thumbs[i%len(thumbs)] }

	games := []Game{
		// === Table Game (20) ===
		{Name: "Ludo Quick", Slug: "ludo-quick", ThumbnailURL: t(0), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 1, Status: "active"},
		{Name: "TeenPatti", Slug: "teenpatti", ThumbnailURL: t(1), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 2, Status: "active"},
		{Name: "Rummy", Slug: "rummy", ThumbnailURL: t(2), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 3, Status: "active"},
		{Name: "Andar Bahar", Slug: "andar-bahar", ThumbnailURL: t(3), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 4, Status: "active"},
		{Name: "Dragon Tiger", Slug: "dragon-tiger", ThumbnailURL: t(4), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 5, Status: "active"},
		{Name: "Blackjack", Slug: "blackjack", ThumbnailURL: t(20), CategoryID: catMap["table-game"], ProviderID: provMap["jdb"], SortOrder: 6, Status: "active"},
		{Name: "Baccarat", Slug: "baccarat", ThumbnailURL: t(18), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 7, Status: "active"},
		{Name: "Sic Bo", Slug: "sic-bo", ThumbnailURL: t(8), CategoryID: catMap["table-game"], ProviderID: provMap["jili"], SortOrder: 8, Status: "active"},
		{Name: "Casino Hold'em", Slug: "casino-holdem", ThumbnailURL: t(9), CategoryID: catMap["table-game"], ProviderID: provMap["evolution"], SortOrder: 9, Status: "active"},
		{Name: "Red Dog", Slug: "red-dog", ThumbnailURL: t(10), CategoryID: catMap["table-game"], ProviderID: provMap["habanero"], SortOrder: 10, Status: "active"},
		{Name: "Pai Gow Poker", Slug: "pai-gow-poker", ThumbnailURL: t(11), CategoryID: catMap["table-game"], ProviderID: provMap["pg"], SortOrder: 11, Status: "active"},
		{Name: "Caribbean Stud", Slug: "caribbean-stud", ThumbnailURL: t(12), CategoryID: catMap["table-game"], ProviderID: provMap["playtech"], SortOrder: 12, Status: "active"},
		{Name: "Three Card Poker", Slug: "three-card-poker", ThumbnailURL: t(13), CategoryID: catMap["table-game"], ProviderID: provMap["mg"], SortOrder: 13, Status: "active"},
		{Name: "Casino War", Slug: "casino-war", ThumbnailURL: t(14), CategoryID: catMap["table-game"], ProviderID: provMap["netent"], IsNew: true, SortOrder: 14, Status: "active"},
		{Name: "Fan Tan", Slug: "fan-tan", ThumbnailURL: t(15), CategoryID: catMap["table-game"], ProviderID: provMap["sa-gaming"], SortOrder: 15, Status: "active"},
		{Name: "Poker Deluxe", Slug: "poker-deluxe", ThumbnailURL: t(16), CategoryID: catMap["table-game"], ProviderID: provMap["inout"], SortOrder: 16, Status: "active"},
		{Name: "Pontoon", Slug: "pontoon", ThumbnailURL: t(17), CategoryID: catMap["table-game"], ProviderID: provMap["red-tiger"], IsNew: true, SortOrder: 17, Status: "active"},
		{Name: "Texas Hold'em Bonus", Slug: "texas-holdem-bonus", ThumbnailURL: t(0), CategoryID: catMap["table-game"], ProviderID: provMap["ezugi"], SortOrder: 18, Status: "active"},
		{Name: "Baccarat Supreme", Slug: "baccarat-supreme", ThumbnailURL: t(1), CategoryID: catMap["table-game"], ProviderID: provMap["hacksaw"], SortOrder: 19, Status: "active"},
		{Name: "Speed Rummy", Slug: "speed-rummy", ThumbnailURL: t(2), CategoryID: catMap["table-game"], ProviderID: provMap["turbogames"], SortOrder: 20, Status: "active"},

		// === Slots (25) ===
		{Name: "Fortune Gems 3", Slug: "fortune-gems-3", ThumbnailURL: t(5), CategoryID: catMap["slots"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 1, Status: "active"},
		{Name: "Tower Rush", Slug: "tower-rush", ThumbnailURL: t(21), CategoryID: catMap["slots"], ProviderID: provMap["jdb"], SortOrder: 2, Status: "active"},
		{Name: "Cash Mania", Slug: "cash-mania", ThumbnailURL: t(6), CategoryID: catMap["slots"], ProviderID: provMap["jili"], SortOrder: 3, Status: "active"},
		{Name: "Ganesha Gold", Slug: "ganesha-gold", ThumbnailURL: t(7), CategoryID: catMap["slots"], ProviderID: provMap["jili"], IsNew: true, SortOrder: 4, Status: "active"},
		{Name: "Treasure Chest", Slug: "treasure-chest", ThumbnailURL: t(17), CategoryID: catMap["slots"], ProviderID: provMap["jili"], SortOrder: 5, Status: "active"},
		{Name: "Lucky Neko", Slug: "lucky-neko", ThumbnailURL: t(19), CategoryID: catMap["slots"], ProviderID: provMap["jili"], SortOrder: 6, Status: "active"},
		{Name: "Boxing King", Slug: "boxing-king", ThumbnailURL: t(9), CategoryID: catMap["slots"], ProviderID: provMap["jili"], SortOrder: 7, Status: "active"},
		{Name: "Opera Dynasty", Slug: "opera-dynasty", ThumbnailURL: t(10), CategoryID: catMap["slots"], ProviderID: provMap["jili"], SortOrder: 8, Status: "active"},
		{Name: "Starburst XXXtreme", Slug: "starburst-xxxtreme", ThumbnailURL: t(11), CategoryID: catMap["slots"], ProviderID: provMap["netent"], IsHot: true, SortOrder: 9, Status: "active"},
		{Name: "Book of Dead", Slug: "book-of-dead", ThumbnailURL: t(12), CategoryID: catMap["slots"], ProviderID: provMap["pg"], SortOrder: 10, Status: "active"},
		{Name: "Gonzo's Quest", Slug: "gonzos-quest", ThumbnailURL: t(13), CategoryID: catMap["slots"], ProviderID: provMap["netent"], SortOrder: 11, Status: "active"},
		{Name: "San Quentin", Slug: "san-quentin", ThumbnailURL: t(14), CategoryID: catMap["slots"], ProviderID: provMap["nolimit-city"], IsNew: true, SortOrder: 12, Status: "active"},
		{Name: "Mental", Slug: "mental", ThumbnailURL: t(15), CategoryID: catMap["slots"], ProviderID: provMap["nolimit-city"], SortOrder: 13, Status: "active"},
		{Name: "Dragon Hero", Slug: "dragon-hero", ThumbnailURL: t(16), CategoryID: catMap["slots"], ProviderID: provMap["red-tiger"], SortOrder: 14, Status: "active"},
		{Name: "Bonanza Megaways", Slug: "bonanza-megaways", ThumbnailURL: t(17), CategoryID: catMap["slots"], ProviderID: provMap["big-time-gaming"], IsHot: true, SortOrder: 15, Status: "active"},
		{Name: "Age of the Gods", Slug: "age-of-the-gods", ThumbnailURL: t(18), CategoryID: catMap["slots"], ProviderID: provMap["playtech"], SortOrder: 16, Status: "active"},
		{Name: "Immortal Romance", Slug: "immortal-romance", ThumbnailURL: t(19), CategoryID: catMap["slots"], ProviderID: provMap["mg"], SortOrder: 17, Status: "active"},
		{Name: "Hot Hot Fruit", Slug: "hot-hot-fruit", ThumbnailURL: t(0), CategoryID: catMap["slots"], ProviderID: provMap["habanero"], SortOrder: 18, Status: "active"},
		{Name: "Chaos Crew", Slug: "chaos-crew", ThumbnailURL: t(1), CategoryID: catMap["slots"], ProviderID: provMap["hacksaw"], SortOrder: 19, Status: "active"},
		{Name: "Wanted Dead or Wild", Slug: "wanted-dead-or-wild", ThumbnailURL: t(2), CategoryID: catMap["slots"], ProviderID: provMap["hacksaw"], IsNew: true, SortOrder: 20, Status: "active"},
		{Name: "Turbo Reel", Slug: "turbo-reel", ThumbnailURL: t(3), CategoryID: catMap["slots"], ProviderID: provMap["turbogames"], SortOrder: 21, Status: "active"},
		{Name: "Gold Rush", Slug: "gold-rush-slots", ThumbnailURL: t(4), CategoryID: catMap["slots"], ProviderID: provMap["inout"], SortOrder: 22, Status: "active"},
		{Name: "Fruit Party", Slug: "fruit-party", ThumbnailURL: t(5), CategoryID: catMap["slots"], ProviderID: provMap["tap-a-roo"], SortOrder: 23, Status: "active"},
		{Name: "Royal Seven", Slug: "royal-seven", ThumbnailURL: t(6), CategoryID: catMap["slots"], ProviderID: provMap["eeni"], SortOrder: 24, Status: "active"},
		{Name: "Crystal Caverns", Slug: "crystal-caverns", ThumbnailURL: t(7), CategoryID: catMap["slots"], ProviderID: provMap["big-time-gaming"], IsNew: true, SortOrder: 25, Status: "active"},

		// === Live (20) ===
		{Name: "Lightning Ball", Slug: "lightning-ball", ThumbnailURL: t(13), CategoryID: catMap["live"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 1, Status: "active"},
		{Name: "Bingo", Slug: "bingo-live", ThumbnailURL: t(14), CategoryID: catMap["live"], ProviderID: provMap["jili"], SortOrder: 2, Status: "active"},
		{Name: "Color Game", Slug: "color-game", ThumbnailURL: t(15), CategoryID: catMap["live"], ProviderID: provMap["jili"], SortOrder: 3, Status: "active"},
		{Name: "Sic Bo Live", Slug: "sic-bo-live", ThumbnailURL: t(16), CategoryID: catMap["live"], ProviderID: provMap["jili"], SortOrder: 4, Status: "active"},
		{Name: "TeenPatti Live", Slug: "teenpatti-live", ThumbnailURL: t(1), CategoryID: catMap["live"], ProviderID: provMap["jili"], SortOrder: 5, Status: "active"},
		{Name: "Andar Bahar Live", Slug: "andar-bahar-live", ThumbnailURL: t(3), CategoryID: catMap["live"], ProviderID: provMap["jili"], SortOrder: 6, Status: "active"},
		{Name: "Dragon Tiger Live", Slug: "dragon-tiger-live", ThumbnailURL: t(4), CategoryID: catMap["live"], ProviderID: provMap["evolution"], SortOrder: 7, Status: "active"},
		{Name: "Roulette Live", Slug: "roulette-live", ThumbnailURL: t(18), CategoryID: catMap["live"], ProviderID: provMap["evolution"], IsNew: true, SortOrder: 8, Status: "active"},
		{Name: "Blackjack Live VIP", Slug: "blackjack-live-vip", ThumbnailURL: t(20), CategoryID: catMap["live"], ProviderID: provMap["evolution"], SortOrder: 9, Status: "active"},
		{Name: "Crazy Time", Slug: "crazy-time", ThumbnailURL: t(0), CategoryID: catMap["live"], ProviderID: provMap["evolution"], IsHot: true, SortOrder: 10, Status: "active"},
		{Name: "Dream Catcher", Slug: "dream-catcher", ThumbnailURL: t(1), CategoryID: catMap["live"], ProviderID: provMap["evolution"], SortOrder: 11, Status: "active"},
		{Name: "Baccarat Live SA", Slug: "baccarat-live-sa", ThumbnailURL: t(2), CategoryID: catMap["live"], ProviderID: provMap["sa-gaming"], SortOrder: 12, Status: "active"},
		{Name: "Sicbo Live SA", Slug: "sicbo-live-sa", ThumbnailURL: t(3), CategoryID: catMap["live"], ProviderID: provMap["sa-gaming"], SortOrder: 13, Status: "active"},
		{Name: "Speed Baccarat", Slug: "speed-baccarat", ThumbnailURL: t(4), CategoryID: catMap["live"], ProviderID: provMap["ezugi"], SortOrder: 14, Status: "active"},
		{Name: "Unlimited Blackjack", Slug: "unlimited-blackjack", ThumbnailURL: t(5), CategoryID: catMap["live"], ProviderID: provMap["ezugi"], SortOrder: 15, Status: "active"},
		{Name: "Live Roulette PT", Slug: "live-roulette-pt", ThumbnailURL: t(6), CategoryID: catMap["live"], ProviderID: provMap["playtech"], SortOrder: 16, Status: "active"},
		{Name: "Quantum Blackjack", Slug: "quantum-blackjack", ThumbnailURL: t(7), CategoryID: catMap["live"], ProviderID: provMap["playtech"], IsNew: true, SortOrder: 17, Status: "active"},
		{Name: "Casino Marina Baccarat", Slug: "casino-marina-baccarat", ThumbnailURL: t(8), CategoryID: catMap["live"], ProviderID: provMap["mg"], SortOrder: 18, Status: "active"},
		{Name: "Cricket War", Slug: "cricket-war", ThumbnailURL: t(9), CategoryID: catMap["live"], ProviderID: provMap["inout"], SortOrder: 19, Status: "active"},
		{Name: "Fan Tan Live", Slug: "fan-tan-live", ThumbnailURL: t(10), CategoryID: catMap["live"], ProviderID: provMap["habanero"], SortOrder: 20, Status: "active"},

		// === Fishing (15) ===
		{Name: "All-Star Fishing", Slug: "all-star-fishing", ThumbnailURL: t(11), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 1, Status: "active"},
		{Name: "Mega Fishing", Slug: "mega-fishing", ThumbnailURL: t(12), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], SortOrder: 2, Status: "active"},
		{Name: "Dragon Fishing", Slug: "dragon-fishing", ThumbnailURL: t(22), CategoryID: catMap["fishing"], ProviderID: provMap["jdb"], SortOrder: 3, Status: "active"},
		{Name: "Jackpot Fishing", Slug: "jackpot-fishing", ThumbnailURL: t(8), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], SortOrder: 4, Status: "active"},
		{Name: "Boom Legend", Slug: "boom-legend", ThumbnailURL: t(0), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], IsNew: true, SortOrder: 5, Status: "active"},
		{Name: "Royal Fishing", Slug: "royal-fishing", ThumbnailURL: t(2), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], SortOrder: 6, Status: "active"},
		{Name: "Ocean King", Slug: "ocean-king", ThumbnailURL: t(5), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], SortOrder: 7, Status: "active"},
		{Name: "Fishing God", Slug: "fishing-god", ThumbnailURL: t(7), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], SortOrder: 8, Status: "active"},
		{Name: "Happy Fishing", Slug: "happy-fishing", ThumbnailURL: t(15), CategoryID: catMap["fishing"], ProviderID: provMap["jdb"], SortOrder: 9, Status: "active"},
		{Name: "Cai Shen Fishing", Slug: "cai-shen-fishing", ThumbnailURL: t(16), CategoryID: catMap["fishing"], ProviderID: provMap["jdb"], SortOrder: 10, Status: "active"},
		{Name: "Dinosaur Tycoon", Slug: "dinosaur-tycoon", ThumbnailURL: t(17), CategoryID: catMap["fishing"], ProviderID: provMap["jili"], IsNew: true, SortOrder: 11, Status: "active"},
		{Name: "Treasure Bowl Fishing", Slug: "treasure-bowl-fishing", ThumbnailURL: t(18), CategoryID: catMap["fishing"], ProviderID: provMap["pg"], SortOrder: 12, Status: "active"},
		{Name: "Fishing War", Slug: "fishing-war", ThumbnailURL: t(19), CategoryID: catMap["fishing"], ProviderID: provMap["spribe"], SortOrder: 13, Status: "active"},
		{Name: "Monster Fishing", Slug: "monster-fishing", ThumbnailURL: t(20), CategoryID: catMap["fishing"], ProviderID: provMap["habanero"], SortOrder: 14, Status: "active"},
		{Name: "Golden Toad Fishing", Slug: "golden-toad-fishing", ThumbnailURL: t(21), CategoryID: catMap["fishing"], ProviderID: provMap["inout"], SortOrder: 15, Status: "active"},

		// === Crash (20) ===
		{Name: "Aviator", Slug: "aviator", ThumbnailURL: t(23), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], IsHot: true, SortOrder: 1, Status: "active"},
		{Name: "Chicken Road 2", Slug: "chicken-road-2", ThumbnailURL: t(24), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 2, Status: "active"},
		{Name: "Mines", Slug: "mines", ThumbnailURL: t(7), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 3, Status: "active"},
		{Name: "JetX", Slug: "jetx", ThumbnailURL: t(6), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 4, Status: "active"},
		{Name: "Plinko", Slug: "plinko", ThumbnailURL: t(13), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], IsNew: true, SortOrder: 5, Status: "active"},
		{Name: "Goal", Slug: "goal", ThumbnailURL: t(14), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 6, Status: "active"},
		{Name: "Hi-Lo", Slug: "hi-lo", ThumbnailURL: t(15), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 7, Status: "active"},
		{Name: "Dice", Slug: "dice", ThumbnailURL: t(16), CategoryID: catMap["crash"], ProviderID: provMap["spribe"], SortOrder: 8, Status: "active"},
		{Name: "Crash X", Slug: "crash-x", ThumbnailURL: t(0), CategoryID: catMap["crash"], ProviderID: provMap["turbogames"], IsHot: true, SortOrder: 9, Status: "active"},
		{Name: "Balloon", Slug: "balloon", ThumbnailURL: t(1), CategoryID: catMap["crash"], ProviderID: provMap["turbogames"], SortOrder: 10, Status: "active"},
		{Name: "Hilo Turbo", Slug: "hilo-turbo", ThumbnailURL: t(2), CategoryID: catMap["crash"], ProviderID: provMap["turbogames"], SortOrder: 11, Status: "active"},
		{Name: "Limbo Cat", Slug: "limbo-cat", ThumbnailURL: t(3), CategoryID: catMap["crash"], ProviderID: provMap["hacksaw"], IsNew: true, SortOrder: 12, Status: "active"},
		{Name: "Rocket Blast", Slug: "rocket-blast", ThumbnailURL: t(4), CategoryID: catMap["crash"], ProviderID: provMap["inout"], SortOrder: 13, Status: "active"},
		{Name: "Spaceman", Slug: "spaceman", ThumbnailURL: t(5), CategoryID: catMap["crash"], ProviderID: provMap["pg"], SortOrder: 14, Status: "active"},
		{Name: "Lucky Crash", Slug: "lucky-crash", ThumbnailURL: t(6), CategoryID: catMap["crash"], ProviderID: provMap["jili"], SortOrder: 15, Status: "active"},
		{Name: "Color Prediction", Slug: "color-prediction", ThumbnailURL: t(7), CategoryID: catMap["crash"], ProviderID: provMap["jili"], SortOrder: 16, Status: "active"},
		{Name: "Tower Legend", Slug: "tower-legend", ThumbnailURL: t(8), CategoryID: catMap["crash"], ProviderID: provMap["jdb"], SortOrder: 17, Status: "active"},
		{Name: "Money Coming", Slug: "money-coming", ThumbnailURL: t(9), CategoryID: catMap["crash"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 18, Status: "active"},
		{Name: "Cricket Crash", Slug: "cricket-crash", ThumbnailURL: t(10), CategoryID: catMap["crash"], ProviderID: provMap["tap-a-roo"], IsNew: true, SortOrder: 19, Status: "active"},
		{Name: "Penalty Shootout", Slug: "penalty-shootout", ThumbnailURL: t(11), CategoryID: catMap["crash"], ProviderID: provMap["eeni"], SortOrder: 20, Status: "active"},

		// === Lotto (20) ===
		{Name: "Ludo Quick Lotto", Slug: "ludo-quick-lotto", ThumbnailURL: t(0), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 1, Status: "active"},
		{Name: "Bingo Ball", Slug: "bingo-ball", ThumbnailURL: t(18), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], IsHot: true, SortOrder: 2, Status: "active"},
		{Name: "Color Game Lotto", Slug: "color-game-lotto", ThumbnailURL: t(15), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 3, Status: "active"},
		{Name: "Lucky 3", Slug: "lucky-3", ThumbnailURL: t(13), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 4, Status: "active"},
		{Name: "Keno", Slug: "keno", ThumbnailURL: t(14), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 5, Status: "active"},
		{Name: "Number Game", Slug: "number-game", ThumbnailURL: t(16), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], IsNew: true, SortOrder: 6, Status: "active"},
		{Name: "Fortune Wheel", Slug: "fortune-wheel", ThumbnailURL: t(5), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 7, Status: "active"},
		{Name: "Scratch Card", Slug: "scratch-card", ThumbnailURL: t(9), CategoryID: catMap["lotto"], ProviderID: provMap["jili"], SortOrder: 8, Status: "active"},
		{Name: "Super Bingo", Slug: "super-bingo", ThumbnailURL: t(1), CategoryID: catMap["lotto"], ProviderID: provMap["jdb"], SortOrder: 9, Status: "active"},
		{Name: "Mega Keno", Slug: "mega-keno", ThumbnailURL: t(2), CategoryID: catMap["lotto"], ProviderID: provMap["pg"], SortOrder: 10, Status: "active"},
		{Name: "Lucky Wheel Pro", Slug: "lucky-wheel-pro", ThumbnailURL: t(3), CategoryID: catMap["lotto"], ProviderID: provMap["turbogames"], SortOrder: 11, Status: "active"},
		{Name: "Lotto Royale", Slug: "lotto-royale", ThumbnailURL: t(4), CategoryID: catMap["lotto"], ProviderID: provMap["habanero"], SortOrder: 12, Status: "active"},
		{Name: "Treasure Hunt Lotto", Slug: "treasure-hunt-lotto", ThumbnailURL: t(5), CategoryID: catMap["lotto"], ProviderID: provMap["playtech"], SortOrder: 13, Status: "active"},
		{Name: "Instant Win", Slug: "instant-win", ThumbnailURL: t(6), CategoryID: catMap["lotto"], ProviderID: provMap["mg"], SortOrder: 14, Status: "active"},
		{Name: "Scratch Match", Slug: "scratch-match", ThumbnailURL: t(7), CategoryID: catMap["lotto"], ProviderID: provMap["inout"], SortOrder: 15, Status: "active"},
		{Name: "Bingo Blast", Slug: "bingo-blast", ThumbnailURL: t(8), CategoryID: catMap["lotto"], ProviderID: provMap["hacksaw"], IsNew: true, SortOrder: 16, Status: "active"},
		{Name: "Golden Ball", Slug: "golden-ball", ThumbnailURL: t(10), CategoryID: catMap["lotto"], ProviderID: provMap["red-tiger"], SortOrder: 17, Status: "active"},
		{Name: "Magic Numbers", Slug: "magic-numbers", ThumbnailURL: t(11), CategoryID: catMap["lotto"], ProviderID: provMap["nolimit-city"], SortOrder: 18, Status: "active"},
		{Name: "Diamond Scratch", Slug: "diamond-scratch", ThumbnailURL: t(12), CategoryID: catMap["lotto"], ProviderID: provMap["big-time-gaming"], SortOrder: 19, Status: "active"},
		{Name: "Power Ball", Slug: "power-ball", ThumbnailURL: t(13), CategoryID: catMap["lotto"], ProviderID: provMap["sa-gaming"], SortOrder: 20, Status: "active"},
	}
	db.Create(&games)
	logger.Info("Seeded games data", zap.Int("count", len(games)))
}

func seedPaymentMethods(db *gorm.DB, logger *zap.Logger) {
	methods := []PaymentMethod{
		{Name: "BHIM UPI", Code: "upi", IconURL: "/assets/payment/upi.svg", Type: "both", MinAmount: 100, MaxAmount: 100000, MarketCode: "IN", Status: "active", SortOrder: 1},
		{Name: "Paytm", Code: "paytm", IconURL: "/assets/payment/paytm.svg", Type: "deposit", MinAmount: 100, MaxAmount: 50000, MarketCode: "IN", Status: "active", SortOrder: 2},
		{Name: "Google Pay", Code: "gpay", IconURL: "/assets/payment/gpay.svg", Type: "deposit", MinAmount: 100, MaxAmount: 50000, MarketCode: "IN", Status: "active", SortOrder: 3},
		{Name: "Amazon Pay", Code: "amazon_pay", IconURL: "/assets/payment/amazon.svg", Type: "deposit", MinAmount: 100, MaxAmount: 50000, MarketCode: "IN", Status: "active", SortOrder: 4},
	}
	db.Create(&methods)
	logger.Info("Seeded payment methods", zap.Int("count", len(methods)))
}

func seedSystemConfigs(db *gorm.DB, logger *zap.Logger) {
	// 支付方式图标 - 前端用图标名称标识，内联 SVG 渲染
	paymentIcons, _ := json.Marshal([]map[string]string{
		{"name": "UPI", "icon_url": "upi"},
		{"name": "Paytm", "icon_url": "paytm"},
		{"name": "PhonePe", "icon_url": "phonepe"},
		{"name": "GPay", "icon_url": "gpay"},
		{"name": "IMPS", "icon_url": "imps"},
		{"name": "USDT", "icon_url": "usdt"},
	})

	// 社交链接 - 前端用图标名称标识
	socialLinks, _ := json.Marshal([]map[string]string{
		{"name": "Telegram", "url": "https://t.me/goplus", "icon_url": "telegram"},
		{"name": "facebook", "url": "https://facebook.com/goplus", "icon_url": "facebook"},
		{"name": "Instagram", "url": "https://instagram.com/goplus", "icon_url": "instagram"},
		{"name": "WhatsApp", "url": "https://wa.me/goplus", "icon_url": "whatsapp"},
		{"name": "YouTube", "url": "https://youtube.com/@goplus", "icon_url": "youtube"},
	})

	// 导航 - 底部 Tab
	bottomTabs, _ := json.Marshal([]map[string]interface{}{
		{"id": "menu", "label": "Menu", "icon": "menu", "route": "/menu", "enabled": true},
		{"id": "explore", "label": "Explore", "icon": "explore", "route": "/explore", "enabled": true},
		{"id": "get1700", "label": "GET 1700", "icon": "gift", "route": "/lucky-wheel", "enabled": false},
		{"id": "raffle", "label": "Raffle", "icon": "raffle", "route": "/raffle", "enabled": false},
		{"id": "quest", "label": "Quest", "icon": "quest", "route": "/quest", "enabled": false},
	})

	// 导航 - 侧边菜单（完整15项）
	sidebarMenu, _ := json.Marshal([]map[string]interface{}{
		// 游戏分类 8 项
		{"id": "favourite", "label": "Favourite", "icon": "heart", "route": "/explore?category=favorites"},
		{"id": "weekly-raffle", "label": "Weekly Raffle", "icon": "raffle", "route": "/raffle", "tag": "Hot"},
		{"id": "crash", "label": "Crash", "icon": "crash", "route": "/explore?category=crash", "tag": "Hot"},
		{"id": "live", "label": "Live", "icon": "live", "route": "/explore?category=live"},
		{"id": "slots", "label": "Slots", "icon": "slots", "route": "/explore?category=slots"},
		{"id": "table-game", "label": "Table Game", "icon": "table", "route": "/explore?category=table-game"},
		{"id": "fishing", "label": "Fishing", "icon": "fishing", "route": "/explore?category=fishing"},
		{"id": "lotto", "label": "Lotto", "icon": "lotto", "route": "/explore?category=lotto"},
		// 功能入口 7 项
		{"id": "notifications", "label": "Notifications", "icon": "bell", "route": "/notifications"},
		{"id": "hot-event", "label": "Hot Event", "icon": "fire", "route": "/events"},
		{"id": "gift-code", "label": "Gift Code", "icon": "gift-code", "route": "/gift-code"},
		{"id": "vip-club", "label": "VIP Club", "icon": "vip", "route": "/vip"},
		{"id": "affiliate", "label": "Affiliate", "icon": "affiliate", "route": "/affiliate"},
		{"id": "get-1700", "label": "GET 1700", "icon": "gift", "route": "/lucky-wheel"},
		{"id": "live-support", "label": "Live Support", "icon": "support", "route": "/support"},
	})

	configs := []SystemConfig{
		{ConfigKey: "payment_icons", ConfigValue: string(paymentIcons), Description: "Payment method icons", MarketCode: "IN"},
		{ConfigKey: "social_links", ConfigValue: string(socialLinks), Description: "Social media links", MarketCode: "IN"},
		{ConfigKey: "nav_bottom_tabs", ConfigValue: string(bottomTabs), Description: "Bottom tab navigation", MarketCode: "IN"},
		{ConfigKey: "nav_sidebar_menu", ConfigValue: string(sidebarMenu), Description: "Sidebar menu navigation", MarketCode: "IN"},
	}
	db.Create(&configs)
	logger.Info("Seeded system configs", zap.Int("count", len(configs)))
}

func seedSocialLinks(db *gorm.DB, logger *zap.Logger) {
	links := []SocialLink{
		{Name: "Telegram", Platform: "telegram", URL: "https://t.me/goplus_support", IconURL: "/assets/social/telegram.svg", SortOrder: 1, Status: "active", MarketCode: "IN"},
		{Name: "WhatsApp", Platform: "whatsapp", URL: "https://wa.me/919999999999", IconURL: "/assets/social/whatsapp.svg", SortOrder: 2, Status: "active", MarketCode: "IN"},
		{Name: "Facebook", Platform: "facebook", URL: "https://facebook.com/goplus", IconURL: "/assets/social/facebook.svg", SortOrder: 3, Status: "active", MarketCode: "IN"},
		{Name: "Instagram", Platform: "instagram", URL: "https://instagram.com/goplus", IconURL: "/assets/social/instagram.svg", SortOrder: 4, Status: "active", MarketCode: "IN"},
		{Name: "YouTube", Platform: "youtube", URL: "https://youtube.com/@goplus", IconURL: "/assets/social/youtube.svg", SortOrder: 5, Status: "active", MarketCode: "IN"},
	}
	db.Create(&links)
	logger.Info("Seeded social links", zap.Int("count", len(links)))
}

func seedLiveSupportConfig(db *gorm.DB, logger *zap.Logger) {
	cfg := LiveSupportConfig{
		Provider:   "mock",
		Config:     "{}",
		Status:     "active",
		MarketCode: "IN",
	}
	db.Create(&cfg)
	logger.Info("Seeded live support config")
}

func seedAdminUsers(db *gorm.DB, logger *zap.Logger) {
	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("Failed to hash admin password", zap.Error(err))
		return
	}

	admins := []AdminUser{
		{Username: "admin", PasswordHash: string(hash), Nickname: "Super Admin", Role: "super_admin", Status: "active"},
	}
	db.Create(&admins)
	logger.Info("Seeded admin users", zap.Int("count", len(admins)))
}
