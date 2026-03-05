package handler

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// SupportHandler 客服系统处理器
type SupportHandler struct {
	supportService *service.SupportService
	logger         *zap.Logger
}

func NewSupportHandler(supportService *service.SupportService, logger *zap.Logger) *SupportHandler {
	return &SupportHandler{
		supportService: supportService,
		logger:         logger,
	}
}

// GetSocialLinks GET /api/v1/support/links
func (h *SupportHandler) GetSocialLinks(c *gin.Context) {
	links := h.supportService.GetSocialLinks()
	response.Success(c, "success", links)
}

// GetLiveChat GET /api/v1/support/live-chat
func (h *SupportHandler) GetLiveChat(c *gin.Context) {
	config := h.supportService.GetLiveChatConfig()
	if config == nil {
		response.Success(c, "success", map[string]interface{}{
			"provider": "mock",
			"enabled":  false,
			"config":   map[string]interface{}{},
		})
		return
	}
	response.Success(c, "success", config)
}
