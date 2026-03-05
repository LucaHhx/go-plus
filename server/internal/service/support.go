package service

import (
	"encoding/json"

	"go.uber.org/zap"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
)

// SupportService 客服系统服务
type SupportService struct {
	db     *gorm.DB
	logger *zap.Logger
}

func NewSupportService(db *gorm.DB, logger *zap.Logger) *SupportService {
	return &SupportService{db: db, logger: logger}
}

// GetSocialLinks 获取社交媒体客服链接
func (s *SupportService) GetSocialLinks() []model.SocialLinkResponse {
	var links []model.SocialLink
	s.db.Where("status = ? AND market_code = ?", "active", "IN").
		Order("sort_order ASC").
		Find(&links)

	result := make([]model.SocialLinkResponse, 0, len(links))
	for _, l := range links {
		result = append(result, l.ToResponse())
	}
	return result
}

// GetLiveChatConfig 获取在线客服配置
func (s *SupportService) GetLiveChatConfig() *model.LiveSupportConfigResponse {
	var cfg model.LiveSupportConfig
	if err := s.db.Where("status = ? AND market_code = ?", "active", "IN").First(&cfg).Error; err != nil {
		s.logger.Warn("Failed to load live support config", zap.Error(err))
		return nil
	}

	var configData interface{}
	json.Unmarshal([]byte(cfg.Config), &configData)

	return &model.LiveSupportConfigResponse{
		Provider: cfg.Provider,
		Enabled:  cfg.Status == "active",
		Config:   configData,
	}
}
