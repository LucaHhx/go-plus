package model

import "time"

type SystemConfig struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	ConfigKey   string    `gorm:"type:varchar(100);not null;uniqueIndex:idx_config_key_market" json:"config_key"`
	ConfigValue string    `gorm:"type:text;not null" json:"config_value"`
	Description string    `gorm:"type:varchar(500);default:''" json:"description"`
	MarketCode  string    `gorm:"type:varchar(10);default:'IN';uniqueIndex:idx_config_key_market" json:"market_code"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"-"`
}

func (SystemConfig) TableName() string {
	return "system_configs"
}
