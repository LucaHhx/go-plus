package model

import (
	"time"

	"gorm.io/gorm"
)

type Banner struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Title      string         `gorm:"type:varchar(200);not null" json:"title"`
	ImageURL   string         `gorm:"type:varchar(500);not null" json:"image_url"`
	LinkURL    string         `gorm:"type:varchar(500);default:''" json:"link_url"`
	LinkType   string         `gorm:"type:varchar(20);default:'none'" json:"link_type"` // none / internal / external
	SortOrder  int            `gorm:"default:0" json:"sort_order"`
	Status     string         `gorm:"type:varchar(20);default:'active'" json:"status"` // active / disabled
	MarketCode string         `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	StartAt    *time.Time     `json:"start_at"`
	EndAt      *time.Time     `json:"end_at"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"-"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Banner) TableName() string {
	return "banners"
}

type BannerResponse struct {
	ID       uint   `json:"id"`
	Title    string `json:"title"`
	ImageURL string `json:"image_url"`
	LinkURL  string `json:"link_url"`
	LinkType string `json:"link_type"`
}

func (b *Banner) ToResponse() BannerResponse {
	return BannerResponse{
		ID:       b.ID,
		Title:    b.Title,
		ImageURL: b.ImageURL,
		LinkURL:  b.LinkURL,
		LinkType: b.LinkType,
	}
}
