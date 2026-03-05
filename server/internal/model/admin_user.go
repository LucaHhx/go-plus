package model

import "time"

type AdminUser struct {
	ID           uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	Username     string     `gorm:"type:varchar(50);not null;uniqueIndex" json:"username"`
	PasswordHash string     `gorm:"type:varchar(255);not null" json:"-"`
	Nickname     string     `gorm:"type:varchar(50);default:''" json:"nickname"`
	Role         string     `gorm:"type:varchar(20);default:'operator'" json:"role"` // super_admin / admin / operator
	Status       string     `gorm:"type:varchar(20);default:'active'" json:"status"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"-"`
}

func (AdminUser) TableName() string {
	return "admin_users"
}

type AdminOperationLog struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	AdminID    uint      `gorm:"not null;index:idx_admin_logs_admin" json:"admin_id"`
	Action     string    `gorm:"type:varchar(100);not null" json:"action"`
	TargetType string    `gorm:"type:varchar(50);default:''" json:"target_type"`
	TargetID   uint      `gorm:"default:0" json:"target_id"`
	Detail     string    `gorm:"type:text;default:''" json:"detail"`
	IPAddress  string    `gorm:"type:varchar(50);default:''" json:"ip_address"`
	CreatedAt  time.Time `gorm:"index:idx_admin_logs_admin" json:"created_at"`
}

func (AdminOperationLog) TableName() string {
	return "admin_operation_logs"
}
