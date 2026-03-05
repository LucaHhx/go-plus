package model

import "time"

type GameProvider struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"name"`
	Slug       string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"slug"`
	LogoURL    string    `gorm:"type:varchar(500);default:''" json:"logo_url"`
	Status     string    `gorm:"type:varchar(20);default:'active'" json:"status"`
	SortOrder  int       `gorm:"default:0" json:"sort_order"`
	MarketCode string    `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	IsNew      bool      `gorm:"default:false" json:"is_new"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"-"`
}

func (GameProvider) TableName() string {
	return "game_providers"
}

type GameProviderResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Slug    string `json:"slug"`
	LogoURL string `json:"logo_url"`
	IsNew   bool   `json:"is_new"`
}

func (gp *GameProvider) ToResponse() GameProviderResponse {
	return GameProviderResponse{
		ID:      gp.ID,
		Name:    gp.Name,
		Slug:    gp.Slug,
		LogoURL: gp.LogoURL,
		IsNew:   gp.IsNew,
	}
}
