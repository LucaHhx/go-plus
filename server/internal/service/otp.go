package service

import (
	"crypto/rand"
	"fmt"
	"time"

	"go.uber.org/zap"
	"gorm.io/gorm"

	"go-plus/server/internal/config"
	"go-plus/server/internal/model"
	"go-plus/server/internal/provider"
)

// OTPService OTP 验证码服务
type OTPService struct {
	db       *gorm.DB
	sms      provider.SMSProvider
	cfg      *config.OTPConfig
	logger   *zap.Logger
}

func NewOTPService(db *gorm.DB, sms provider.SMSProvider, cfg *config.OTPConfig, logger *zap.Logger) *OTPService {
	return &OTPService{
		db:     db,
		sms:    sms,
		cfg:    cfg,
		logger: logger,
	}
}

// SendOTP 发送 OTP 验证码
func (s *OTPService) SendOTP(phone string, purpose string) (int, error) {
	code := s.generateCode()

	record := model.OTPRecord{
		Phone:     phone,
		Code:      code,
		Purpose:   purpose,
		Verified:  false,
		ExpiresAt: time.Now().Add(time.Duration(s.cfg.ExpireMinutes) * time.Minute),
	}

	if err := s.db.Create(&record).Error; err != nil {
		return 0, err
	}

	// 通过 SMS Provider 发送
	if err := s.sms.SendOTP(phone, code); err != nil {
		s.logger.Error("Failed to send OTP via SMS", zap.Error(err))
		return 0, err
	}

	s.logger.Info("OTP sent", zap.String("phone", phone), zap.String("purpose", purpose))

	return s.cfg.ExpireMinutes * 60, nil // 返回秒数
}

// VerifyOTP 验证 OTP
func (s *OTPService) VerifyOTP(phone string, code string, purpose string) bool {
	var record model.OTPRecord
	err := s.db.Where("phone = ? AND purpose = ? AND verified = ? AND expires_at > ?",
		phone, purpose, false, time.Now()).
		Order("created_at DESC").
		First(&record).Error

	if err != nil {
		s.logger.Debug("OTP record not found", zap.String("phone", phone), zap.Error(err))
		return false
	}

	if record.Code != code {
		s.logger.Debug("OTP code mismatch", zap.String("phone", phone))
		return false
	}

	// 标记为已验证
	s.db.Model(&record).Update("verified", true)

	s.logger.Info("OTP verified", zap.String("phone", phone), zap.String("purpose", purpose))
	return true
}

// generateCode 生成 6 位验证码
func (s *OTPService) generateCode() string {
	if s.cfg.Mock {
		return s.cfg.FixedCode
	}

	b := make([]byte, 3)
	_, _ = rand.Read(b)
	code := int(b[0])<<16 | int(b[1])<<8 | int(b[2])
	return fmt.Sprintf("%06d", code%1000000)
}
