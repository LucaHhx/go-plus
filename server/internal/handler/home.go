package handler

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// HomeHandler 首页处理器
type HomeHandler struct {
	homeService *service.HomeService
	logger      *zap.Logger
}

func NewHomeHandler(homeService *service.HomeService, logger *zap.Logger) *HomeHandler {
	return &HomeHandler{
		homeService: homeService,
		logger:      logger,
	}
}

// Home GET /api/v1/home
func (h *HomeHandler) Home(c *gin.Context) {
	data := h.homeService.GetHomeData()
	response.Success(c, "success", data)
}

// Banners GET /api/v1/banners
func (h *HomeHandler) Banners(c *gin.Context) {
	banners := h.homeService.GetBanners()
	response.Success(c, "success", banners)
}

// MarketConfig GET /api/v1/config/market
func (h *HomeHandler) MarketConfig(c *gin.Context) {
	market := h.homeService.GetMarketConfig()
	if market == nil {
		response.Error(c, response.CodeValidationError, "Market config not found")
		return
	}
	response.Success(c, "success", market)
}

// NavConfig GET /api/v1/config/nav
func (h *HomeHandler) NavConfig(c *gin.Context) {
	nav := h.homeService.GetNavConfig()
	if nav == nil {
		response.Error(c, response.CodeValidationError, "Nav config not found")
		return
	}
	response.Success(c, "success", nav)
}
