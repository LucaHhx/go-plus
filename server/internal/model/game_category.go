package model

import "time"

type GameCategory struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	Slug      string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"slug"`
	IconURL   string    `gorm:"type:varchar(500);default:''" json:"icon_url"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	Status    string    `gorm:"type:varchar(20);default:'active'" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"-"`
}

func (GameCategory) TableName() string {
	return "game_categories"
}

type GameCategoryResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Slug    string `json:"slug"`
	IconURL string `json:"icon_url"`
}

func (gc *GameCategory) ToResponse() GameCategoryResponse {
	return GameCategoryResponse{
		ID:      gc.ID,
		Name:    gc.Name,
		Slug:    gc.Slug,
		IconURL: gc.IconURL,
	}
}
