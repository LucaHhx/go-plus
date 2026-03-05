package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

var adminRoles = map[string]bool{
	"super_admin": true,
	"admin":       true,
	"operator":    true,
}

// AdminAuthMiddleware 管理员 JWT 认证中间件
func AdminAuthMiddleware(jwtService *service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, response.CodeAdminTokenInvalid, "Authorization header is required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(c, response.CodeAdminTokenInvalid, "Invalid authorization format")
			c.Abort()
			return
		}

		claims, err := jwtService.ParseToken(parts[1])
		if err != nil {
			response.Error(c, response.CodeAdminTokenInvalid, "Token is invalid or expired")
			c.Abort()
			return
		}

		if !adminRoles[claims.Role] {
			response.Error(c, response.CodeAdminForbidden, "Insufficient permissions")
			c.Abort()
			return
		}

		c.Set("admin_id", claims.UserID)
		c.Set("admin_role", claims.Role)
		c.Next()
	}
}
