package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// 游戏模块错误码
const (
	CodeGameNotFound    = 3001
	CodeGameDisabled    = 3002
	CodeGameLaunchFailed = 3003
)

type GameHandler struct {
	gameService *service.GameService
	logger      *zap.Logger
}

func NewGameHandler(gameService *service.GameService, logger *zap.Logger) *GameHandler {
	return &GameHandler{
		gameService: gameService,
		logger:      logger,
	}
}

// ListGames GET /api/v1/games
func (h *GameHandler) ListGames(c *gin.Context) {
	category := c.Query("category")
	provider := c.Query("provider")
	search := c.Query("search")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	// 尝试获取用户 ID (可选, 不要求登录)
	userID := optionalUserID(c)

	// 对于需要认证的特殊分类, 校验登录状态
	if (category == "recent" || category == "favorites") && userID == 0 {
		response.Error(c, response.CodeTokenInvalid, "Authentication required for this category")
		return
	}

	result, err := h.gameService.ListGames(category, provider, search, page, pageSize, userID)
	if err != nil {
		response.Error(c, response.CodeValidationError, err.Error())
		return
	}

	response.Success(c, "success", result)
}

// GetGame GET /api/v1/games/:id
func (h *GameHandler) GetGame(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	userID := optionalUserID(c)
	game, err := h.gameService.GetGameDetail(uint(id), userID)
	if err != nil {
		if err.Error() == "game not found" {
			response.Error(c, CodeGameNotFound, "Game not found")
		} else {
			response.Error(c, CodeGameDisabled, "Game is disabled")
		}
		return
	}

	response.Success(c, "success", game)
}

// GetCategories GET /api/v1/games/categories
func (h *GameHandler) GetCategories(c *gin.Context) {
	categories := h.gameService.GetCategories()
	response.Success(c, "success", categories)
}

// GetProviders GET /api/v1/games/providers
func (h *GameHandler) GetProviders(c *gin.Context) {
	providers := h.gameService.GetProviders()
	response.Success(c, "success", providers)
}

// LaunchGame POST /api/v1/games/:id/launch
func (h *GameHandler) LaunchGame(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "Authentication required")
		return
	}

	result, err := h.gameService.LaunchGame(userID.(uint), uint(id))
	if err != nil {
		if err.Error() == "game not found" {
			response.Error(c, CodeGameNotFound, "Game not found")
		} else if err.Error() == "game disabled" {
			response.Error(c, CodeGameDisabled, "Game is disabled")
		} else {
			response.Error(c, CodeGameLaunchFailed, "Failed to launch game")
		}
		return
	}

	response.Success(c, "success", result)
}

// GetFavorites GET /api/v1/games/favorites
func (h *GameHandler) GetFavorites(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "Authentication required")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.gameService.GetFavorites(userID.(uint), page, pageSize)
	if err != nil {
		response.Error(c, response.CodeValidationError, err.Error())
		return
	}

	response.Success(c, "success", result)
}

// AddFavorite POST /api/v1/games/:id/favorite
func (h *GameHandler) AddFavorite(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "Authentication required")
		return
	}

	if err := h.gameService.AddFavorite(userID.(uint), uint(id)); err != nil {
		if err.Error() == "game not found" {
			response.Error(c, CodeGameNotFound, "Game not found")
		} else {
			response.Error(c, response.CodeValidationError, err.Error())
		}
		return
	}

	response.Success(c, "success", nil)
}

// RemoveFavorite DELETE /api/v1/games/:id/favorite
func (h *GameHandler) RemoveFavorite(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "Authentication required")
		return
	}

	if err := h.gameService.RemoveFavorite(userID.(uint), uint(id)); err != nil {
		response.Error(c, response.CodeValidationError, err.Error())
		return
	}

	response.Success(c, "success", nil)
}

// GetRecentGames GET /api/v1/games/recent
func (h *GameHandler) GetRecentGames(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "Authentication required")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.gameService.GetRecentGames(userID.(uint), page, pageSize)
	if err != nil {
		response.Error(c, response.CodeValidationError, err.Error())
		return
	}

	response.Success(c, "success", result)
}

// optionalUserID 从 context 中尝试获取用户 ID (不要求登录)
func optionalUserID(c *gin.Context) uint {
	if uid, exists := c.Get("user_id"); exists {
		return uid.(uint)
	}
	return 0
}
