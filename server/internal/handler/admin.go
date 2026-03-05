package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

type AdminHandler struct {
	adminService *service.AdminService
	jwtService   *service.JWTService
	logger       *zap.Logger
}

func NewAdminHandler(adminService *service.AdminService, jwtService *service.JWTService, logger *zap.Logger) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
		jwtService:   jwtService,
		logger:       logger,
	}
}

func (h *AdminHandler) getAdminID(c *gin.Context) uint {
	id, _ := c.Get("admin_id")
	return id.(uint)
}

func (h *AdminHandler) getAdminRole(c *gin.Context) string {
	role, _ := c.Get("admin_role")
	return role.(string)
}

// --- Auth ---

type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	admin, err := h.adminService.Login(req.Username, req.Password)
	if err != nil {
		response.Error(c, response.CodeAdminInvalidCredentials, "Invalid username or password")
		return
	}

	token, err := h.jwtService.GenerateToken(admin.ID, admin.Role, "")
	if err != nil {
		h.logger.Error("Failed to generate admin token", zap.Error(err))
		response.Error(c, response.CodeAdminTokenInvalid, "Failed to generate token")
		return
	}

	h.adminService.LogOperation(admin.ID, "auth.login", "admin_user", admin.ID, nil, c.ClientIP())

	response.Success(c, "Login successful", service.AdminLoginResponse{
		Token: token,
		Admin: service.AdminInfoResponse{
			ID:       admin.ID,
			Username: admin.Username,
			Nickname: admin.Nickname,
			Role:     admin.Role,
		},
	})
}

func (h *AdminHandler) Me(c *gin.Context) {
	adminID := h.getAdminID(c)
	admin, err := h.adminService.GetAdminByID(adminID)
	if err != nil {
		response.Error(c, response.CodeAdminTokenInvalid, "Admin not found")
		return
	}

	response.Success(c, "success", service.AdminInfoResponse{
		ID:       admin.ID,
		Username: admin.Username,
		Nickname: admin.Nickname,
		Role:     admin.Role,
	})
}

// --- Dashboard ---

func (h *AdminHandler) DashboardStats(c *gin.Context) {
	stats, err := h.adminService.GetDashboardStats()
	if err != nil {
		h.logger.Error("Failed to get dashboard stats", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get stats")
		return
	}
	response.Success(c, "success", stats)
}

// --- User Management ---

func (h *AdminHandler) ListUsers(c *gin.Context) {
	search := c.Query("search")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.adminService.ListUsers(search, page, pageSize)
	if err != nil {
		h.logger.Error("Failed to list users", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list users")
		return
	}
	response.Success(c, "success", result)
}

func (h *AdminHandler) GetUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid user ID")
		return
	}

	result, err := h.adminService.GetUserDetail(uint(id))
	if err != nil {
		if err == service.ErrAdminUserNotFound {
			response.Error(c, response.CodeAdminUserNotFound, "User not found")
			return
		}
		h.logger.Error("Failed to get user detail", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get user")
		return
	}
	response.Success(c, "success", result)
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=active disabled"`
}

func (h *AdminHandler) UpdateUserStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid user ID")
		return
	}

	var req UpdateUserStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	if err := h.adminService.UpdateUserStatus(uint(id), req.Status); err != nil {
		if err == service.ErrAdminUserNotFound {
			response.Error(c, response.CodeAdminUserNotFound, "User not found")
			return
		}
		h.logger.Error("Failed to update user status", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update user")
		return
	}

	action := "user.enable"
	if req.Status == "disabled" {
		action = "user.disable"
	}
	h.adminService.LogOperation(h.getAdminID(c), action, "user", uint(id), req, c.ClientIP())

	response.Success(c, "User status updated", nil)
}

// --- Game Management ---

func (h *AdminHandler) ListGames(c *gin.Context) {
	search := c.Query("search")
	providerID, _ := strconv.ParseUint(c.DefaultQuery("provider_id", "0"), 10, 64)
	categoryID, _ := strconv.ParseUint(c.DefaultQuery("category_id", "0"), 10, 64)
	status := c.Query("status")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.adminService.ListGames(search, uint(providerID), uint(categoryID), status, page, pageSize)
	if err != nil {
		h.logger.Error("Failed to list games", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list games")
		return
	}
	response.Success(c, "success", result)
}

type UpdateGameRequest struct {
	Name         *string `json:"name"`
	ThumbnailURL *string `json:"thumbnail_url"`
	IsNew        *bool   `json:"is_new"`
	IsHot        *bool   `json:"is_hot"`
	SortOrder    *int    `json:"sort_order"`
}

func (h *AdminHandler) UpdateGame(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	var req UpdateGameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.ThumbnailURL != nil {
		updates["thumbnail_url"] = *req.ThumbnailURL
	}
	if req.IsNew != nil {
		updates["is_new"] = *req.IsNew
	}
	if req.IsHot != nil {
		updates["is_hot"] = *req.IsHot
	}
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}

	if err := h.adminService.UpdateGame(uint(id), updates); err != nil {
		if err == service.ErrAdminGameNotFound {
			response.Error(c, response.CodeAdminGameNotFound, "Game not found")
			return
		}
		h.logger.Error("Failed to update game", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update game")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "game.update", "game", uint(id), req, c.ClientIP())
	response.Success(c, "Game updated", nil)
}

type UpdateGameStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=active disabled"`
}

func (h *AdminHandler) UpdateGameStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid game ID")
		return
	}

	var req UpdateGameStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	if err := h.adminService.UpdateGameStatus(uint(id), req.Status); err != nil {
		if err == service.ErrAdminGameNotFound {
			response.Error(c, response.CodeAdminGameNotFound, "Game not found")
			return
		}
		h.logger.Error("Failed to update game status", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update game")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "game.status", "game", uint(id), req, c.ClientIP())
	response.Success(c, "Game status updated", nil)
}

// --- Provider Management ---

func (h *AdminHandler) ListProviders(c *gin.Context) {
	result, err := h.adminService.ListProviders()
	if err != nil {
		h.logger.Error("Failed to list providers", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list providers")
		return
	}
	response.Success(c, "success", result)
}

type CreateProviderRequest struct {
	Name    string `json:"name" binding:"required"`
	Slug    string `json:"slug" binding:"required"`
	LogoURL string `json:"logo_url"`
}

func (h *AdminHandler) CreateProvider(c *gin.Context) {
	var req CreateProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	provider, err := h.adminService.CreateProvider(req.Name, req.Slug, req.LogoURL)
	if err != nil {
		h.logger.Error("Failed to create provider", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to create provider")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "provider.create", "game_provider", provider.ID, req, c.ClientIP())
	response.Success(c, "Provider created", provider)
}

type UpdateProviderRequest struct {
	Name    *string `json:"name"`
	LogoURL *string `json:"logo_url"`
	IsNew   *bool   `json:"is_new"`
}

func (h *AdminHandler) UpdateProvider(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid provider ID")
		return
	}

	var req UpdateProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.LogoURL != nil {
		updates["logo_url"] = *req.LogoURL
	}
	if req.IsNew != nil {
		updates["is_new"] = *req.IsNew
	}

	if err := h.adminService.UpdateProvider(uint(id), updates); err != nil {
		if err == service.ErrAdminGameNotFound {
			response.Error(c, response.CodeAdminGameNotFound, "Provider not found")
			return
		}
		h.logger.Error("Failed to update provider", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update provider")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "provider.update", "game_provider", uint(id), req, c.ClientIP())
	response.Success(c, "Provider updated", nil)
}

type UpdateProviderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=active disabled"`
}

func (h *AdminHandler) UpdateProviderStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid provider ID")
		return
	}

	var req UpdateProviderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	if err := h.adminService.UpdateProviderStatus(uint(id), req.Status); err != nil {
		if err == service.ErrAdminGameNotFound {
			response.Error(c, response.CodeAdminGameNotFound, "Provider not found")
			return
		}
		h.logger.Error("Failed to update provider status", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update provider")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "provider.status", "game_provider", uint(id), req, c.ClientIP())
	response.Success(c, "Provider status updated", nil)
}

// --- Transaction Management ---

func (h *AdminHandler) ListTransactions(c *gin.Context) {
	txType := c.Query("type")
	status := c.Query("status")
	userID, _ := strconv.ParseUint(c.DefaultQuery("user_id", "0"), 10, 64)
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.adminService.ListTransactions(txType, status, uint(userID), page, pageSize)
	if err != nil {
		h.logger.Error("Failed to list transactions", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list transactions")
		return
	}
	response.Success(c, "success", result)
}

// --- Withdrawal Review ---

func (h *AdminHandler) PendingWithdrawals(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.adminService.ListTransactions("withdrawal", "pending", 0, page, pageSize)
	if err != nil {
		h.logger.Error("Failed to list pending withdrawals", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list withdrawals")
		return
	}
	response.Success(c, "success", result)
}

type WithdrawalReviewRequest struct {
	Remark string `json:"remark"`
}

func (h *AdminHandler) ApproveWithdrawal(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid withdrawal ID")
		return
	}

	var req WithdrawalReviewRequest
	c.ShouldBindJSON(&req)

	result, err := h.adminService.ApproveWithdrawal(uint(id), req.Remark)
	if err != nil {
		if err == service.ErrAdminTxNotFound {
			response.Error(c, response.CodeAdminTxNotFound, "Transaction not found")
			return
		}
		if err == service.ErrAdminWithdrawalStatus {
			response.Error(c, response.CodeAdminWithdrawalStatus, "Withdrawal status does not allow approval")
			return
		}
		h.logger.Error("Failed to approve withdrawal", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to approve withdrawal")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "withdrawal.approve", "transaction", uint(id), req, c.ClientIP())
	response.Success(c, "Withdrawal approved", result)
}

func (h *AdminHandler) RejectWithdrawal(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid withdrawal ID")
		return
	}

	var req WithdrawalReviewRequest
	c.ShouldBindJSON(&req)

	result, err := h.adminService.RejectWithdrawal(uint(id), req.Remark)
	if err != nil {
		if err == service.ErrAdminTxNotFound {
			response.Error(c, response.CodeAdminTxNotFound, "Transaction not found")
			return
		}
		if err == service.ErrAdminWithdrawalStatus {
			response.Error(c, response.CodeAdminWithdrawalStatus, "Withdrawal status does not allow rejection")
			return
		}
		h.logger.Error("Failed to reject withdrawal", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to reject withdrawal")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "withdrawal.reject", "transaction", uint(id), req, c.ClientIP())
	response.Success(c, "Withdrawal rejected", result)
}

// --- Banner Management ---

func (h *AdminHandler) ListBanners(c *gin.Context) {
	result, err := h.adminService.ListBanners()
	if err != nil {
		h.logger.Error("Failed to list banners", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to list banners")
		return
	}
	response.Success(c, "success", result)
}

type CreateBannerRequest struct {
	Title      string `json:"title" binding:"required"`
	ImageURL   string `json:"image_url" binding:"required"`
	LinkURL    string `json:"link_url"`
	LinkType   string `json:"link_type"`
	SortOrder  int    `json:"sort_order"`
	MarketCode string `json:"market_code"`
}

func (h *AdminHandler) CreateBanner(c *gin.Context) {
	var req CreateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	banner, err := h.adminService.CreateBanner(req.Title, req.ImageURL, req.LinkURL, req.LinkType, req.MarketCode, req.SortOrder)
	if err != nil {
		h.logger.Error("Failed to create banner", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to create banner")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "banner.create", "banner", banner.ID, req, c.ClientIP())
	response.Success(c, "Banner created", banner)
}

type UpdateBannerRequest struct {
	Title     *string `json:"title"`
	ImageURL  *string `json:"image_url"`
	LinkURL   *string `json:"link_url"`
	LinkType  *string `json:"link_type"`
	SortOrder *int    `json:"sort_order"`
	Status    *string `json:"status"`
}

func (h *AdminHandler) UpdateBanner(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid banner ID")
		return
	}

	var req UpdateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.ImageURL != nil {
		updates["image_url"] = *req.ImageURL
	}
	if req.LinkURL != nil {
		updates["link_url"] = *req.LinkURL
	}
	if req.LinkType != nil {
		updates["link_type"] = *req.LinkType
	}
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}

	if err := h.adminService.UpdateBanner(uint(id), updates); err != nil {
		if err == service.ErrAdminBannerNotFound {
			response.Error(c, response.CodeAdminBannerNotFound, "Banner not found")
			return
		}
		h.logger.Error("Failed to update banner", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update banner")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "banner.update", "banner", uint(id), req, c.ClientIP())
	response.Success(c, "Banner updated", nil)
}

func (h *AdminHandler) DeleteBanner(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid banner ID")
		return
	}

	if err := h.adminService.DeleteBanner(uint(id)); err != nil {
		if err == service.ErrAdminBannerNotFound {
			response.Error(c, response.CodeAdminBannerNotFound, "Banner not found")
			return
		}
		h.logger.Error("Failed to delete banner", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to delete banner")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "banner.delete", "banner", uint(id), nil, c.ClientIP())
	response.Success(c, "Banner deleted", nil)
}

// --- System Config ---

func (h *AdminHandler) GetConfig(c *gin.Context) {
	result, err := h.adminService.GetConfigs()
	if err != nil {
		h.logger.Error("Failed to get configs", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get configs")
		return
	}
	response.Success(c, "success", result)
}

type UpdateConfigRequest struct {
	Configs map[string]string `json:"configs" binding:"required"`
}

func (h *AdminHandler) UpdateConfig(c *gin.Context) {
	var req UpdateConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request: "+err.Error())
		return
	}

	if err := h.adminService.UpdateConfigs(req.Configs); err != nil {
		h.logger.Error("Failed to update configs", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update configs")
		return
	}

	h.adminService.LogOperation(h.getAdminID(c), "config.update", "system_config", 0, req, c.ClientIP())
	response.Success(c, "Config updated", nil)
}
