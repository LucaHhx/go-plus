package model

import "time"

type OTPRecord struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Phone     string    `gorm:"type:varchar(20);not null;index:idx_otp_phone_purpose" json:"phone"`
	Code      string    `gorm:"type:varchar(10);not null" json:"code"`
	Purpose   string    `gorm:"type:varchar(20);not null;index:idx_otp_phone_purpose" json:"purpose"` // register / login
	Verified  bool      `gorm:"default:false" json:"verified"`
	ExpiresAt time.Time `gorm:"not null" json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

func (OTPRecord) TableName() string {
	return "otp_records"
}
