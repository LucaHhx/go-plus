package model

import "time"

type Market struct {
	ID             uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Code           string    `gorm:"type:varchar(10);uniqueIndex;not null" json:"code"`
	Name           string    `gorm:"type:varchar(100);not null" json:"name"`
	Currency       string    `gorm:"type:varchar(10);not null" json:"currency"`
	CurrencySymbol string    `gorm:"type:varchar(10);not null" json:"currency_symbol"`
	PhonePrefix    string    `gorm:"type:varchar(10);not null" json:"phone_prefix"`
	Locale         string    `gorm:"type:varchar(20);default:'en'" json:"locale"`
	Timezone       string    `gorm:"type:varchar(50);default:'Asia/Kolkata'" json:"timezone"`
	Status         string    `gorm:"type:varchar(20);default:'active'" json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"-"`
}

func (Market) TableName() string {
	return "markets"
}

type MarketResponse struct {
	Code           string `json:"code"`
	Name           string `json:"name"`
	Currency       string `json:"currency"`
	CurrencySymbol string `json:"currency_symbol"`
	PhonePrefix    string `json:"phone_prefix"`
	Locale         string `json:"locale"`
}

func (m *Market) ToResponse() MarketResponse {
	return MarketResponse{
		Code:           m.Code,
		Name:           m.Name,
		Currency:       m.Currency,
		CurrencySymbol: m.CurrencySymbol,
		PhonePrefix:    m.PhonePrefix,
		Locale:         m.Locale,
	}
}
