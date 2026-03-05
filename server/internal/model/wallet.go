package model

import "time"

type Wallet struct {
	ID           uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID       uint    `gorm:"uniqueIndex;not null" json:"user_id"`
	Balance      float64 `gorm:"type:decimal(12,2);default:0" json:"balance"`
	BonusBalance float64 `gorm:"type:decimal(12,2);default:0" json:"bonus_balance"`
	FrozenAmount float64 `gorm:"type:decimal(12,2);default:0" json:"frozen_amount"`
	Currency     string  `gorm:"type:varchar(10);default:'INR'" json:"currency"`
	MarketCode   string  `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (Wallet) TableName() string {
	return "wallets"
}

type Transaction struct {
	ID            uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        uint    `gorm:"not null;index:idx_transactions_user" json:"user_id"`
	WalletID      uint    `gorm:"not null" json:"wallet_id"`
	Type          string  `gorm:"type:varchar(20);not null;index:idx_transactions_type" json:"type"`
	Amount        float64 `gorm:"type:decimal(12,2);not null" json:"amount"`
	BalanceBefore float64 `gorm:"type:decimal(12,2);not null" json:"balance_before"`
	BalanceAfter  float64 `gorm:"type:decimal(12,2);not null" json:"balance_after"`
	Status        string  `gorm:"type:varchar(20);default:'pending';index:idx_transactions_type" json:"status"`
	PaymentMethod string  `gorm:"type:varchar(50);default:''" json:"payment_method"`
	PaymentRef    string  `gorm:"type:varchar(200);default:''" json:"payment_ref"`
	Remark        string  `gorm:"type:varchar(500);default:''" json:"remark"`
	MarketCode    string  `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (Transaction) TableName() string {
	return "transactions"
}

type PaymentMethod struct {
	ID         uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string  `gorm:"type:varchar(100);not null" json:"name"`
	Code       string  `gorm:"type:varchar(50);not null;uniqueIndex" json:"code"`
	IconURL    string  `gorm:"type:varchar(500);default:''" json:"icon_url"`
	Type       string  `gorm:"type:varchar(20);not null" json:"type"`
	MinAmount  float64 `gorm:"type:decimal(12,2);default:100" json:"min_amount"`
	MaxAmount  float64 `gorm:"type:decimal(12,2);default:100000" json:"max_amount"`
	MarketCode string  `gorm:"type:varchar(10);default:'IN'" json:"market_code"`
	Status     string  `gorm:"type:varchar(20);default:'active'" json:"status"`
	SortOrder  int     `gorm:"default:0" json:"sort_order"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (PaymentMethod) TableName() string {
	return "payment_methods"
}
