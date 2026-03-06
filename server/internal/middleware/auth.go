package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// OptionalAuthMiddleware 可选认证中间件 (解析 JWT 但不强制要求登录)
func OptionalAuthMiddleware(jwtService *service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		claims, err := jwtService.ParseToken(parts[1])
		if err != nil {
			c.Next()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Set("market_code", claims.MarketCode)
		c.Next()
	}
}

// AuthMiddleware JWT 认证中间件 (含 password_version 校验)
func AuthMiddleware(jwtService *service.JWTService, db ...*gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, response.CodeTokenInvalid, "Authorization header is required")
			c.Abort()
			return
		}

		// Bearer token
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(c, response.CodeTokenInvalid, "Invalid authorization format, expected: Bearer <token>")
			c.Abort()
			return
		}

		claims, err := jwtService.ParseToken(parts[1])
		if err != nil {
			response.Error(c, response.CodeTokenInvalid, "Token is invalid or expired")
			c.Abort()
			return
		}

		// pwd_ver 校验: 当有 db 可用且 token 中 pwd_ver > 0 或用户已修改过密码时校验
		if len(db) > 0 && db[0] != nil {
			var user model.User
			if err := db[0].Select("password_version").Where("id = ?", claims.UserID).First(&user).Error; err == nil {
				if user.PasswordVersion > 0 && claims.PasswordVersion != user.PasswordVersion {
					response.Error(c, response.CodeTokenInvalid, "Token is invalid, password has been changed")
					c.Abort()
					return
				}
			}
		}

		// 将用户信息存入 context
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Set("market_code", claims.MarketCode)

		c.Next()
	}
}
