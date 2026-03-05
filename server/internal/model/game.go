package model

import "time"

type Game struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string    `gorm:"type:varchar(200);not null" json:"name"`
	Slug         string    `gorm:"type:varchar(200);uniqueIndex;not null" json:"slug"`
	ProviderID   uint      `gorm:"not null" json:"provider_id"`
	CategoryID   uint      `gorm:"not null" json:"category_id"`
	ThumbnailURL string    `gorm:"type:varchar(500);default:''" json:"thumbnail_url"`
	GameURL      string    `gorm:"type:varchar(500);default:''" json:"game_url"`
	IsNew        bool      `gorm:"default:false" json:"is_new"`
	IsHot        bool      `gorm:"default:false" json:"is_hot"`
	Status       string    `gorm:"type:varchar(20);default:'active';index:idx_games_category;index:idx_games_provider" json:"status"`
	SortOrder    int       `gorm:"default:0" json:"sort_order"`
	MarketCode   string    `gorm:"type:varchar(10);default:'IN';index:idx_games_market" json:"market_code"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"-"`

	Provider *GameProvider `gorm:"foreignKey:ProviderID" json:"-"`
	Category *GameCategory `gorm:"foreignKey:CategoryID" json:"-"`
}

func (Game) TableName() string {
	return "games"
}

type GameResponse struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	ThumbnailURL string `json:"thumbnail_url"`
	IsNew        bool   `json:"is_new"`
	IsHot        bool   `json:"is_hot"`
}

func (g *Game) ToResponse() GameResponse {
	return GameResponse{
		ID:           g.ID,
		Name:         g.Name,
		Slug:         g.Slug,
		ThumbnailURL: g.ThumbnailURL,
		IsNew:        g.IsNew,
		IsHot:        g.IsHot,
	}
}

// GameListItem 游戏列表项 (包含 provider/category/is_favorited)
type GameListItem struct {
	ID           uint                 `json:"id"`
	Name         string               `json:"name"`
	Slug         string               `json:"slug"`
	Provider     GameProviderBrief    `json:"provider"`
	Category     GameCategoryResponse `json:"category"`
	ThumbnailURL string               `json:"thumbnail_url"`
	IsNew        bool                 `json:"is_new"`
	IsHot        bool                 `json:"is_hot"`
	IsFavorited  bool                 `json:"is_favorited"`
	PlayedAt     *time.Time           `json:"played_at,omitempty"`
}

// GameProviderBrief 游戏列表中的供应商简要信息
type GameProviderBrief struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// GameDetailResponse 游戏详情响应
type GameDetailResponse struct {
	ID           uint                 `json:"id"`
	Name         string               `json:"name"`
	Slug         string               `json:"slug"`
	Provider     GameProviderResponse `json:"provider"`
	Category     GameCategoryResponse `json:"category"`
	ThumbnailURL string               `json:"thumbnail_url"`
	GameURL      string               `json:"game_url"`
	IsNew        bool                 `json:"is_new"`
	IsHot        bool                 `json:"is_hot"`
	IsFavorited  bool                 `json:"is_favorited"`
}

// GameListResponse 游戏列表分页响应
type GameListResponse struct {
	Games    []GameListItem `json:"games"`
	Total    int64          `json:"total"`
	Page     int            `json:"page"`
	PageSize int            `json:"page_size"`
}

// GameLaunchResponse 游戏启动响应
type GameLaunchResponse struct {
	GameURL string `json:"game_url"`
	Token   string `json:"token"`
}

// UserFavorite 用户收藏
type UserFavorite struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"uniqueIndex:idx_user_game_fav;not null" json:"user_id"`
	GameID    uint      `gorm:"uniqueIndex:idx_user_game_fav;not null" json:"game_id"`
	CreatedAt time.Time `json:"created_at"`

	Game *Game `gorm:"foreignKey:GameID" json:"-"`
}

func (UserFavorite) TableName() string {
	return "user_favorites"
}

// UserRecentGame 用户最近游玩
type UserRecentGame struct {
	ID       uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID   uint      `gorm:"uniqueIndex:idx_user_game_recent;not null" json:"user_id"`
	GameID   uint      `gorm:"uniqueIndex:idx_user_game_recent;not null" json:"game_id"`
	PlayedAt time.Time `gorm:"index:idx_recent_user_played,priority:2;not null" json:"played_at"`

	Game *Game `gorm:"foreignKey:GameID" json:"-"`
}

func (UserRecentGame) TableName() string {
	return "user_recent_games"
}
