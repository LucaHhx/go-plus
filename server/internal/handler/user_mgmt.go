package handler

import (
	"errors"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// UserMgmtHandler 用户管理处理器
type UserMgmtHandler struct {
	userService *service.UserService
	jwtService  *service.JWTService
	logger      *zap.Logger
}

func NewUserMgmtHandler(
	userService *service.UserService,
	jwtService *service.JWTService,
	logger *zap.Logger,
) *UserMgmtHandler {
	return &UserMgmtHandler{
		userService: userService,
		jwtService:  jwtService,
		logger:      logger,
	}
}

// UpdateProfile PUT /api/v1/user/profile
func (h *UserMgmtHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Nickname must be 2-20 characters")
		return
	}

	// 校验昵称格式: 字母、数字、下划线
	for _, ch := range req.Nickname {
		if !((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch == '_') {
			response.Error(c, response.CodeValidationError, "Nickname can only contain letters, numbers, and underscores")
			return
		}
	}

	meResponse, err := h.userService.UpdateProfile(userID.(uint), req.Nickname)
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			response.Error(c, response.CodeTokenInvalid, "User not found")
			return
		}
		h.logger.Error("Failed to update profile", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to update profile")
		return
	}

	response.Success(c, "Profile updated successfully", meResponse)
}

// UploadAvatar POST /api/v1/user/avatar
func (h *UserMgmtHandler) UploadAvatar(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	file, header, err := c.Request.FormFile("avatar")
	if err != nil {
		response.Error(c, response.CodeValidationError, "Avatar file is required")
		return
	}
	defer file.Close()

	avatarURL, err := h.userService.UploadAvatar(userID.(uint), file, header)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrFileTooLarge):
			response.Error(c, response.CodeFileTooLarge, "File size exceeds 2MB limit")
		case errors.Is(err, service.ErrImageFormat):
			response.Error(c, response.CodeValidationError, "Only JPEG, PNG, and WebP formats are supported")
		case errors.Is(err, service.ErrImageProcess):
			response.Error(c, response.CodeImageProcessFailed, "Failed to process image")
		case errors.Is(err, service.ErrUserNotFound):
			response.Error(c, response.CodeTokenInvalid, "User not found")
		default:
			h.logger.Error("Failed to upload avatar", zap.Error(err))
			response.Error(c, response.CodeImageProcessFailed, "Failed to upload avatar")
		}
		return
	}

	response.Success(c, "Avatar uploaded successfully", gin.H{
		"avatar_url": avatarURL,
	})
}

// ChangePassword PUT /api/v1/user/password
func (h *UserMgmtHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	// 校验 new_password 与 confirm_password 一致
	if req.NewPassword != req.ConfirmPassword {
		response.Error(c, response.CodePasswordMismatch, "New password and confirm password do not match")
		return
	}

	// 校验密码强度
	if !validatePassword(req.NewPassword) {
		response.Error(c, response.CodePasswordWeak, "Password must be at least 6 characters and contain both letters and numbers")
		return
	}

	user, err := h.userService.ChangePassword(userID.(uint), req.CurrentPassword, req.NewPassword)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			response.Error(c, response.CodeTokenInvalid, "User not found")
		case errors.Is(err, service.ErrInvalidPassword):
			response.Error(c, response.CodeInvalidCredentials, "Current password is incorrect")
		default:
			h.logger.Error("Failed to change password", zap.Error(err))
			response.Error(c, response.CodeValidationError, "Failed to change password")
		}
		return
	}

	// 签发新 JWT
	token, err := h.jwtService.GenerateToken(user.ID, user.Role, user.MarketCode, user.PasswordVersion)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to generate token")
		return
	}

	response.Success(c, "Password updated successfully", gin.H{
		"token": token,
	})
}

// BindGoogle POST /api/v1/user/google/bind
func (h *UserMgmtHandler) BindGoogle(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	var req BindGoogleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	googleEmail, err := h.userService.BindGoogle(userID.(uint), req.IDToken)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			response.Error(c, response.CodeTokenInvalid, "User not found")
		case errors.Is(err, service.ErrAlreadyBoundGoogle):
			response.Error(c, response.CodeAlreadyBoundGoogle, "You have already bound a Google account")
		case errors.Is(err, service.ErrGoogleAlreadyBound):
			response.Error(c, response.CodeGoogleAlreadyBound, "This Google account is already bound to another user")
		default:
			h.logger.Error("Failed to bind Google account", zap.Error(err))
			response.Error(c, response.CodeGoogleAuthFailed, "Google token verification failed")
		}
		return
	}

	response.Success(c, "Google account bound successfully", gin.H{
		"google_email": googleEmail,
	})
}

// UnbindGoogle POST /api/v1/user/google/unbind
func (h *UserMgmtHandler) UnbindGoogle(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	err := h.userService.UnbindGoogle(userID.(uint))
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			response.Error(c, response.CodeTokenInvalid, "User not found")
		case errors.Is(err, service.ErrGoogleNotBound):
			response.Error(c, response.CodeGoogleNotBound, "No Google account is bound")
		case errors.Is(err, service.ErrGoogleOnlyLogin):
			response.Error(c, response.CodeGoogleOnlyLogin, "Google is your only login method, please set a password first")
		default:
			h.logger.Error("Failed to unbind Google account", zap.Error(err))
			response.Error(c, response.CodeValidationError, "Failed to unbind Google account")
		}
		return
	}

	response.Success(c, "Google account unbound successfully", nil)
}
