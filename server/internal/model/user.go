package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Phone        string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"phone"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	Nickname     string         `gorm:"type:varchar(50);default:''" json:"nickname"`
	AvatarURL    string         `gorm:"type:varchar(500);default:''" json:"avatar_url"`
	GoogleID     *string        `gorm:"type:varchar(100);uniqueIndex" json:"-"`
	GoogleEmail  string         `gorm:"type:varchar(255);default:''" json:"google_email,omitempty"`
	Role         string         `gorm:"type:varchar(20);default:'user'" json:"role"`
	Status       string         `gorm:"type:varchar(20);default:'active'" json:"status,omitempty"`
	MarketCode   string         `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	LastLoginAt  *time.Time     `json:"last_login_at,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"-"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (User) TableName() string {
	return "users"
}

// UserResponse 返回给前端的用户信息
type UserResponse struct {
	ID         uint      `json:"id"`
	Phone      string    `json:"phone"`
	Nickname   string    `json:"nickname"`
	AvatarURL  string    `json:"avatar_url"`
	Role       string    `json:"role"`
	MarketCode string    `json:"market_code"`
	CreatedAt  time.Time `json:"created_at"`
}

// UserMeResponse GET /auth/me 的响应
type UserMeResponse struct {
	ID           uint      `json:"id"`
	Phone        string    `json:"phone"`
	Nickname     string    `json:"nickname"`
	AvatarURL    string    `json:"avatar_url"`
	GoogleEmail  string    `json:"google_email"`
	Role         string    `json:"role"`
	MarketCode   string    `json:"market_code"`
	Balance      float64   `json:"balance"`
	BonusBalance float64   `json:"bonus_balance"`
	CreatedAt    time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:         u.ID,
		Phone:      u.Phone,
		Nickname:   u.Nickname,
		AvatarURL:  u.AvatarURL,
		Role:       u.Role,
		MarketCode: u.MarketCode,
		CreatedAt:  u.CreatedAt,
	}
}
