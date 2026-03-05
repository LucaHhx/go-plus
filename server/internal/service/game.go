package service

import (
	"fmt"
	"time"

	"go.uber.org/zap"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
)

// GameLauncher 游戏启动接口 (一期 Mock, 二期替换为真实 SDK)
type GameLauncher interface {
	LaunchGame(userID uint, gameID uint) (*model.GameLaunchResponse, error)
}

// MockGameLauncher Mock 游戏启动
type MockGameLauncher struct{}

func (m *MockGameLauncher) LaunchGame(userID uint, gameID uint) (*model.GameLaunchResponse, error) {
	return &model.GameLaunchResponse{
		GameURL: fmt.Sprintf("https://mock-game.goplus.local/play/%d?user=%d", gameID, userID),
		Token:   fmt.Sprintf("mock-session-%d-%d-%d", userID, gameID, time.Now().Unix()),
	}, nil
}

// GameService 游戏大厅服务
type GameService struct {
	db       *gorm.DB
	logger   *zap.Logger
	launcher GameLauncher
}

func NewGameService(db *gorm.DB, logger *zap.Logger) *GameService {
	return &GameService{
		db:       db,
		logger:   logger,
		launcher: &MockGameLauncher{},
	}
}

// ListGames 游戏列表 (筛选+搜索+分页)
func (s *GameService) ListGames(category, provider, search string, page, pageSize int, userID uint) (*model.GameListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	// 特殊分类处理
	switch category {
	case "recent":
		return s.listRecentGames(page, pageSize, userID)
	case "favorites":
		return s.listFavoriteGames(page, pageSize, userID)
	case "new":
		return s.listNewGames(provider, search, page, pageSize, userID)
	}

	query := s.db.Model(&model.Game{}).Where("games.status = ?", "active")

	// 按分类筛选 (数据库 category slug)
	if category != "" && category != "all" {
		var cat model.GameCategory
		if err := s.db.Where("slug = ? AND status = ?", category, "active").First(&cat).Error; err == nil {
			query = query.Where("games.category_id = ?", cat.ID)
		}
	}

	// 按供应商筛选
	if provider != "" {
		var prov model.GameProvider
		if err := s.db.Where("slug = ? AND status = ?", provider, "active").First(&prov).Error; err == nil {
			query = query.Where("games.provider_id = ?", prov.ID)
		}
	}

	// 搜索
	if search != "" {
		query = query.Where("games.name LIKE ?", "%"+search+"%")
	}

	// 总数
	var total int64
	query.Count(&total)

	// 分页查询
	var games []model.Game
	query.Preload("Provider").Preload("Category").
		Order("games.sort_order ASC, games.created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&games)

	// 获取收藏状态
	favMap := s.getUserFavMap(userID, games)

	items := make([]model.GameListItem, 0, len(games))
	for _, g := range games {
		items = append(items, s.toGameListItem(g, favMap))
	}

	return &model.GameListResponse{
		Games:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

// listNewGames 查询 is_new=true 的游戏
func (s *GameService) listNewGames(provider, search string, page, pageSize int, userID uint) (*model.GameListResponse, error) {
	query := s.db.Model(&model.Game{}).Where("games.status = ? AND games.is_new = ?", "active", true)

	if provider != "" {
		var prov model.GameProvider
		if err := s.db.Where("slug = ? AND status = ?", provider, "active").First(&prov).Error; err == nil {
			query = query.Where("games.provider_id = ?", prov.ID)
		}
	}
	if search != "" {
		query = query.Where("games.name LIKE ?", "%"+search+"%")
	}

	var total int64
	query.Count(&total)

	var games []model.Game
	query.Preload("Provider").Preload("Category").
		Order("games.sort_order ASC, games.created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&games)

	favMap := s.getUserFavMap(userID, games)
	items := make([]model.GameListItem, 0, len(games))
	for _, g := range games {
		items = append(items, s.toGameListItem(g, favMap))
	}

	return &model.GameListResponse{
		Games:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

// listRecentGames 最近游玩
func (s *GameService) listRecentGames(page, pageSize int, userID uint) (*model.GameListResponse, error) {
	if userID == 0 {
		return nil, fmt.Errorf("authentication required")
	}

	var total int64
	s.db.Model(&model.UserRecentGame{}).Where("user_id = ?", userID).Count(&total)

	var recents []model.UserRecentGame
	s.db.Where("user_id = ?", userID).
		Preload("Game").Preload("Game.Provider").Preload("Game.Category").
		Order("played_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&recents)

	favMap := s.getUserFavMapByUserID(userID)
	items := make([]model.GameListItem, 0, len(recents))
	for _, r := range recents {
		if r.Game == nil {
			continue
		}
		item := s.toGameListItem(*r.Game, favMap)
		playedAt := r.PlayedAt
		item.PlayedAt = &playedAt
		items = append(items, item)
	}

	return &model.GameListResponse{
		Games:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

// listFavoriteGames 我的收藏
func (s *GameService) listFavoriteGames(page, pageSize int, userID uint) (*model.GameListResponse, error) {
	if userID == 0 {
		return nil, fmt.Errorf("authentication required")
	}

	var total int64
	s.db.Model(&model.UserFavorite{}).Where("user_id = ?", userID).Count(&total)

	var favs []model.UserFavorite
	s.db.Where("user_id = ?", userID).
		Preload("Game").Preload("Game.Provider").Preload("Game.Category").
		Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&favs)

	items := make([]model.GameListItem, 0, len(favs))
	for _, f := range favs {
		if f.Game == nil {
			continue
		}
		item := s.toGameListItem(*f.Game, nil)
		item.IsFavorited = true
		items = append(items, item)
	}

	return &model.GameListResponse{
		Games:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

// GetGameDetail 游戏详情
func (s *GameService) GetGameDetail(gameID uint, userID uint) (*model.GameDetailResponse, error) {
	var game model.Game
	if err := s.db.Preload("Provider").Preload("Category").First(&game, gameID).Error; err != nil {
		return nil, fmt.Errorf("game not found")
	}

	if game.Status != "active" {
		return nil, fmt.Errorf("game disabled")
	}

	isFav := false
	if userID > 0 {
		var count int64
		s.db.Model(&model.UserFavorite{}).Where("user_id = ? AND game_id = ?", userID, gameID).Count(&count)
		isFav = count > 0
	}

	resp := &model.GameDetailResponse{
		ID:           game.ID,
		Name:         game.Name,
		Slug:         game.Slug,
		ThumbnailURL: game.ThumbnailURL,
		GameURL:      game.GameURL,
		IsNew:        game.IsNew,
		IsHot:        game.IsHot,
		IsFavorited:  isFav,
	}

	if game.Provider != nil {
		resp.Provider = game.Provider.ToResponse()
	}
	if game.Category != nil {
		resp.Category = game.Category.ToResponse()
	}

	return resp, nil
}

// GetCategories 分类列表
func (s *GameService) GetCategories() []model.GameCategoryResponse {
	var categories []model.GameCategory
	s.db.Where("status = ?", "active").Order("sort_order ASC").Find(&categories)

	result := make([]model.GameCategoryResponse, 0, len(categories))
	for _, c := range categories {
		result = append(result, c.ToResponse())
	}
	return result
}

// GetProviders 供应商列表
func (s *GameService) GetProviders() []model.GameProviderResponse {
	var providers []model.GameProvider
	s.db.Where("status = ?", "active").Order("sort_order ASC").Find(&providers)

	result := make([]model.GameProviderResponse, 0, len(providers))
	for _, p := range providers {
		result = append(result, p.ToResponse())
	}
	return result
}

// LaunchGame 启动游戏
func (s *GameService) LaunchGame(userID uint, gameID uint) (*model.GameLaunchResponse, error) {
	var game model.Game
	if err := s.db.First(&game, gameID).Error; err != nil {
		return nil, fmt.Errorf("game not found")
	}
	if game.Status != "active" {
		return nil, fmt.Errorf("game disabled")
	}

	// 记录最近游玩 (UPSERT)
	now := time.Now()
	result := s.db.Where("user_id = ? AND game_id = ?", userID, gameID).
		Assign(model.UserRecentGame{PlayedAt: now}).
		FirstOrCreate(&model.UserRecentGame{
			UserID:   userID,
			GameID:   gameID,
			PlayedAt: now,
		})
	if result.Error != nil {
		s.logger.Warn("Failed to record recent game", zap.Error(result.Error))
	}

	// 限制最近游玩最多 50 条
	s.trimRecentGames(userID, 50)

	return s.launcher.LaunchGame(userID, gameID)
}

// AddFavorite 收藏游戏 (幂等)
func (s *GameService) AddFavorite(userID uint, gameID uint) error {
	var game model.Game
	if err := s.db.First(&game, gameID).Error; err != nil {
		return fmt.Errorf("game not found")
	}

	fav := model.UserFavorite{UserID: userID, GameID: gameID}
	result := s.db.Where("user_id = ? AND game_id = ?", userID, gameID).FirstOrCreate(&fav)
	return result.Error
}

// RemoveFavorite 取消收藏 (幂等)
func (s *GameService) RemoveFavorite(userID uint, gameID uint) error {
	result := s.db.Where("user_id = ? AND game_id = ?", userID, gameID).Delete(&model.UserFavorite{})
	return result.Error
}

// GetFavorites 获取收藏列表
func (s *GameService) GetFavorites(userID uint, page, pageSize int) (*model.GameListResponse, error) {
	return s.listFavoriteGames(page, pageSize, userID)
}

// GetRecentGames 获取最近游玩
func (s *GameService) GetRecentGames(userID uint, page, pageSize int) (*model.GameListResponse, error) {
	return s.listRecentGames(page, pageSize, userID)
}

// --- helpers ---

func (s *GameService) getUserFavMap(userID uint, games []model.Game) map[uint]bool {
	if userID == 0 || len(games) == 0 {
		return nil
	}
	gameIDs := make([]uint, 0, len(games))
	for _, g := range games {
		gameIDs = append(gameIDs, g.ID)
	}

	var favs []model.UserFavorite
	s.db.Where("user_id = ? AND game_id IN ?", userID, gameIDs).Find(&favs)

	m := make(map[uint]bool, len(favs))
	for _, f := range favs {
		m[f.GameID] = true
	}
	return m
}

func (s *GameService) getUserFavMapByUserID(userID uint) map[uint]bool {
	if userID == 0 {
		return nil
	}
	var favs []model.UserFavorite
	s.db.Where("user_id = ?", userID).Find(&favs)

	m := make(map[uint]bool, len(favs))
	for _, f := range favs {
		m[f.GameID] = true
	}
	return m
}

func (s *GameService) toGameListItem(g model.Game, favMap map[uint]bool) model.GameListItem {
	item := model.GameListItem{
		ID:           g.ID,
		Name:         g.Name,
		Slug:         g.Slug,
		ThumbnailURL: g.ThumbnailURL,
		IsNew:        g.IsNew,
		IsHot:        g.IsHot,
		IsFavorited:  favMap[g.ID],
	}

	if g.Provider != nil {
		item.Provider = model.GameProviderBrief{
			ID:   g.Provider.ID,
			Name: g.Provider.Name,
			Slug: g.Provider.Slug,
		}
	}
	if g.Category != nil {
		item.Category = g.Category.ToResponse()
	}

	return item
}

func (s *GameService) trimRecentGames(userID uint, maxCount int) {
	var count int64
	s.db.Model(&model.UserRecentGame{}).Where("user_id = ?", userID).Count(&count)
	if count <= int64(maxCount) {
		return
	}

	// 删除最旧的记录
	var oldest model.UserRecentGame
	s.db.Where("user_id = ?", userID).Order("played_at ASC").First(&oldest)
	s.db.Delete(&oldest)
}

