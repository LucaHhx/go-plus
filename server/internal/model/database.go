package model

import (
	"os"
	"path/filepath"

	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDB(dbPath string, log *zap.Logger) (*gorm.DB, error) {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Enable WAL mode for better concurrent read performance
	db.Exec("PRAGMA journal_mode=WAL")
	db.Exec("PRAGMA foreign_keys=ON")

	log.Info("Database connected", zap.String("path", dbPath))

	// Auto-migrate tables
	if err := db.AutoMigrate(
		&User{},
		&OTPRecord{},
		&UserBonus{},
		&Wallet{},
		&Transaction{},
		&PaymentMethod{},
		&Banner{},
		&Market{},
		&GameCategory{},
		&GameProvider{},
		&SystemConfig{},
		&Game{},
		&UserFavorite{},
		&UserRecentGame{},
		&SocialLink{},
		&LiveSupportConfig{},
		&AdminUser{},
		&AdminOperationLog{},
	); err != nil {
		return nil, err
	}

	log.Info("Database migration completed")

	return db, nil
}
