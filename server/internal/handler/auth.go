package handler

import (
	"errors"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// AuthHandler 认证处理器
type AuthHandler struct {
	userService *service.UserService
	otpService  *service.OTPService
	jwtService  *service.JWTService
	logger      *zap.Logger
}

func NewAuthHandler(
	userService *service.UserService,
	otpService *service.OTPService,
	jwtService *service.JWTService,
	logger *zap.Logger,
) *AuthHandler {
	return &AuthHandler{
		userService: userService,
		otpService:  otpService,
		jwtService:  jwtService,
		logger:      logger,
	}
}

// SendOTP POST /api/v1/auth/send-otp
func (h *AuthHandler) SendOTP(c *gin.Context) {
	var req SendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	if !validatePhone(req.Phone) {
		response.Error(c, response.CodeValidationError, "Phone number must be in +91XXXXXXXXXX format")
		return
	}

	expiresIn, err := h.otpService.SendOTP(req.Phone, req.Purpose)
	if err != nil {
		h.logger.Error("Failed to send OTP", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to send OTP")
		return
	}

	response.Success(c, "OTP sent successfully", gin.H{
		"expires_in": expiresIn,
	})
}

// Register POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	// 校验手机号格式
	if !validatePhone(req.Phone) {
		response.Error(c, response.CodeValidationError, "Phone number must be in +91XXXXXXXXXX format")
		return
	}

	// 校验密码强度
	if !validatePassword(req.Password) {
		response.Error(c, response.CodeValidationError, "Password must be at least 6 characters and contain both letters and numbers")
		return
	}

	// 校验 OTP
	if !h.otpService.VerifyOTP(req.Phone, req.OTP, "register") {
		response.Error(c, response.CodeOTPFailed, "OTP verification failed")
		return
	}

	// 注册用户
	user, bonusInfo, err := h.userService.Register(req.Phone, req.Password, req.GiftGame)
	if err != nil {
		if errors.Is(err, service.ErrPhoneRegistered) {
			response.Error(c, response.CodePhoneRegistered, "Phone number is already registered")
			return
		}
		h.logger.Error("Registration failed", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Registration failed")
		return
	}

	// 签发 JWT
	token, err := h.jwtService.GenerateToken(user.ID, user.Role, user.MarketCode)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to generate token")
		return
	}

	responseData := gin.H{
		"token": token,
		"user":  user.ToResponse(),
		"welcome_bonus": gin.H{
			"amount":    bonusInfo.Amount,
			"gift_game": bonusInfo.GiftGame,
		},
	}

	response.Success(c, "Registration successful", responseData)
}

// Login POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	if !validatePhone(req.Phone) {
		response.Error(c, response.CodeValidationError, "Phone number must be in +91XXXXXXXXXX format")
		return
	}

	user, err := h.userService.LoginByPassword(req.Phone, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidPassword) {
			response.Error(c, response.CodeInvalidCredentials, "Invalid phone number or password")
			return
		}
		if errors.Is(err, service.ErrUserDisabled) {
			response.Error(c, response.CodeUserDisabled, "Account has been disabled")
			return
		}
		h.logger.Error("Login failed", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Login failed")
		return
	}

	token, err := h.jwtService.GenerateToken(user.ID, user.Role, user.MarketCode)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to generate token")
		return
	}

	response.Success(c, "Login successful", gin.H{
		"token": token,
		"user":  user.ToResponse(),
	})
}

// LoginOTP POST /api/v1/auth/login-otp
func (h *AuthHandler) LoginOTP(c *gin.Context) {
	var req LoginOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	if !validatePhone(req.Phone) {
		response.Error(c, response.CodeValidationError, "Phone number must be in +91XXXXXXXXXX format")
		return
	}

	// 校验 OTP
	if !h.otpService.VerifyOTP(req.Phone, req.OTP, "login") {
		response.Error(c, response.CodeOTPFailed, "OTP verification failed")
		return
	}

	user, err := h.userService.LoginByOTP(req.Phone)
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			response.Error(c, response.CodeInvalidCredentials, "User not found")
			return
		}
		if errors.Is(err, service.ErrUserDisabled) {
			response.Error(c, response.CodeUserDisabled, "Account has been disabled")
			return
		}
		h.logger.Error("OTP login failed", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Login failed")
		return
	}

	token, err := h.jwtService.GenerateToken(user.ID, user.Role, user.MarketCode)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to generate token")
		return
	}

	response.Success(c, "Login successful", gin.H{
		"token": token,
		"user":  user.ToResponse(),
	})
}

// GoogleLogin POST /api/v1/auth/google
func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	var req GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	user, bonusInfo, isNew, err := h.userService.LoginByGoogle(req.IDToken)
	if err != nil {
		if errors.Is(err, service.ErrUserDisabled) {
			response.Error(c, response.CodeUserDisabled, "Account has been disabled")
			return
		}
		h.logger.Error("Google login failed", zap.Error(err))
		response.Error(c, response.CodeGoogleAuthFailed, "Google login verification failed")
		return
	}

	token, err := h.jwtService.GenerateToken(user.ID, user.Role, user.MarketCode)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to generate token")
		return
	}

	data := gin.H{
		"token": token,
		"user":  user.ToResponse(),
	}

	if isNew && bonusInfo != nil {
		data["welcome_bonus"] = gin.H{
			"amount":    bonusInfo.Amount,
			"gift_game": bonusInfo.GiftGame,
		}
	}

	response.Success(c, "Login successful", data)
}

// Me GET /api/v1/auth/me
func (h *AuthHandler) Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, response.CodeTokenInvalid, "User identity not found")
		return
	}

	meResponse, err := h.userService.GetUserMe(userID.(uint))
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			response.Error(c, response.CodeTokenInvalid, "User not found")
			return
		}
		h.logger.Error("Failed to get user info", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get user info")
		return
	}

	response.Success(c, "success", meResponse)
}

// Logout POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	// 前端清除 Token，后端仅返回成功
	response.Success(c, "Logout successful", nil)
}
