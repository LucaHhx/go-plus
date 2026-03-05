package model

import "time"

type UserBonus struct {
	ID         uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint    `gorm:"not null" json:"user_id"`
	BonusType  string  `gorm:"type:varchar(50);not null" json:"bonus_type"` // welcome / free_spin
	Amount     float64 `gorm:"type:decimal(10,2);default:0" json:"amount"`
	GameSlug   string  `gorm:"type:varchar(100);default:''" json:"game_slug"` // aviator / money-coming
	Status     string  `gorm:"type:varchar(20);default:'pending'" json:"status"` // pending / claimed / expired
	MarketCode string  `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (UserBonus) TableName() string {
	return "user_bonuses"
}
