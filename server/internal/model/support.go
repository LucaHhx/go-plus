package model

import (
	"time"

	"gorm.io/gorm"
)

// SocialLink 社交媒体客服链接
type SocialLink struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string         `gorm:"type:varchar(100);not null" json:"name"`
	Platform   string         `gorm:"type:varchar(50);not null" json:"platform"` // telegram, whatsapp, facebook, instagram, youtube
	URL        string         `gorm:"type:varchar(500);not null" json:"url"`
	IconURL    string         `gorm:"type:varchar(500);default:''" json:"icon_url"`
	SortOrder  int            `gorm:"default:0" json:"sort_order"`
	Status     string         `gorm:"type:varchar(20);default:'active'" json:"status"` // active / disabled
	MarketCode string         `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"-"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (SocialLink) TableName() string {
	return "social_links"
}

// SocialLinkResponse API 响应结构
type SocialLinkResponse struct {
	Name     string `json:"name"`
	Platform string `json:"platform"`
	URL      string `json:"url"`
	IconURL  string `json:"icon_url"`
}

func (s *SocialLink) ToResponse() SocialLinkResponse {
	return SocialLinkResponse{
		Name:     s.Name,
		Platform: s.Platform,
		URL:      s.URL,
		IconURL:  s.IconURL,
	}
}

// LiveSupportConfig 在线客服配置
type LiveSupportConfig struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Provider   string         `gorm:"type:varchar(50);not null" json:"provider"` // mock / tawk / livechat
	Config     string         `gorm:"type:text;default:'{}'" json:"config"`      // JSON 配置
	Status     string         `gorm:"type:varchar(20);default:'active'" json:"status"`
	MarketCode string         `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"-"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (LiveSupportConfig) TableName() string {
	return "live_support_config"
}

// LiveSupportConfigResponse API 响应结构
type LiveSupportConfigResponse struct {
	Provider string      `json:"provider"`
	Enabled  bool        `json:"enabled"`
	Config   interface{} `json:"config"`
}
