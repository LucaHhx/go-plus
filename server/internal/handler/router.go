package handler

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"go-plus/server/internal/middleware"
	"go-plus/server/internal/service"
)

// SetupRouter 配置路由
func SetupRouter(
	mode string,
	authHandler *AuthHandler,
	homeHandler *HomeHandler,
	gameHandler *GameHandler,
	walletHandler *WalletHandler,
	supportHandler *SupportHandler,
	adminHandler *AdminHandler,
	userMgmtHandler *UserMgmtHandler,
	jwtService *service.JWTService,
	db *gorm.DB,
) *gin.Engine {
	if mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())

	// 静态资源
	r.Static("/assets", "./assets")

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1
	v1 := r.Group("/api/v1")
	{
		// 首页公开端点
		v1.GET("/home", homeHandler.Home)
		v1.GET("/banners", homeHandler.Banners)

		// 配置公开端点
		configGroup := v1.Group("/config")
		{
			configGroup.GET("/market", homeHandler.MarketConfig)
			configGroup.GET("/nav", homeHandler.NavConfig)
		}

		// 游戏大厅 -- 所有路由使用 OptionalAuth，需要强认证的在 handler 内部校验
		// 注意: 静态路径必须在参数路径 /:id 之前注册，避免 Gin 路由冲突
		games := v1.Group("/games")
		games.Use(middleware.OptionalAuthMiddleware(jwtService))
		{
			// 公开端点
			games.GET("", gameHandler.ListGames)
			games.GET("/categories", gameHandler.GetCategories)
			games.GET("/providers", gameHandler.GetProviders)

			// 需认证端点 (静态路径 -- 必须在 /:id 之前注册)
			games.GET("/favorites", gameHandler.GetFavorites)
			games.GET("/recent", gameHandler.GetRecentGames)

			// 参数路径 (在所有静态路径之后注册)
			games.GET("/:id", gameHandler.GetGame)
			games.POST("/:id/launch", gameHandler.LaunchGame)
			games.POST("/:id/favorite", gameHandler.AddFavorite)
			games.DELETE("/:id/favorite", gameHandler.RemoveFavorite)
		}

		auth := v1.Group("/auth")
		{
			// 公开端点
			auth.POST("/send-otp", authHandler.SendOTP)
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/login-otp", authHandler.LoginOTP)
			auth.POST("/google", authHandler.GoogleLogin)

			// 需要认证的端点
			authRequired := auth.Group("")
			authRequired.Use(middleware.AuthMiddleware(jwtService, db))
			{
				authRequired.GET("/me", authHandler.Me)
				authRequired.POST("/logout", authHandler.Logout)
			}
		}

		// 用户管理端点 (全部需要认证)
		user := v1.Group("/user")
		user.Use(middleware.AuthMiddleware(jwtService, db))
		{
			user.PUT("/profile", userMgmtHandler.UpdateProfile)
			user.POST("/avatar", userMgmtHandler.UploadAvatar)
			user.PUT("/password", userMgmtHandler.ChangePassword)
			user.POST("/google/bind", userMgmtHandler.BindGoogle)
			user.POST("/google/unbind", userMgmtHandler.UnbindGoogle)
		}

		// 客服端点 (公开)
		support := v1.Group("/support")
		{
			support.GET("/links", supportHandler.GetSocialLinks)
			support.GET("/live-chat", supportHandler.GetLiveChat)
		}

		// 钱包端点 (全部需要认证)
		wallet := v1.Group("/wallet")
		wallet.Use(middleware.AuthMiddleware(jwtService, db))
		{
			wallet.GET("", walletHandler.GetBalance)
			wallet.GET("/payment-methods", walletHandler.GetPaymentMethods)
			wallet.POST("/deposit", walletHandler.Deposit)
			wallet.POST("/withdraw", walletHandler.Withdraw)
			wallet.GET("/transactions", walletHandler.GetTransactions)
			wallet.GET("/transactions/:id", walletHandler.GetTransactionDetail)
		}
	}

	// Admin API
	admin := r.Group("/api/admin")
	{
		// 公开端点
		admin.POST("/auth/login", adminHandler.Login)

		// 需要管理员认证的端点
		adminAuth := admin.Group("")
		adminAuth.Use(middleware.AdminAuthMiddleware(jwtService))
		{
			adminAuth.GET("/auth/me", adminHandler.Me)

			// Dashboard
			adminAuth.GET("/dashboard/stats", adminHandler.DashboardStats)

			// User Management
			adminAuth.GET("/users", adminHandler.ListUsers)
			adminAuth.GET("/users/:id", adminHandler.GetUser)
			adminAuth.PUT("/users/:id/status", adminHandler.UpdateUserStatus)

			// Game Management
			adminAuth.GET("/games", adminHandler.ListGames)
			adminAuth.PUT("/games/:id", adminHandler.UpdateGame)
			adminAuth.PUT("/games/:id/status", adminHandler.UpdateGameStatus)

			// Provider Management
			adminAuth.GET("/providers", adminHandler.ListProviders)
			adminAuth.POST("/providers", adminHandler.CreateProvider)
			adminAuth.PUT("/providers/:id", adminHandler.UpdateProvider)
			adminAuth.PUT("/providers/:id/status", adminHandler.UpdateProviderStatus)

			// Transaction Management
			adminAuth.GET("/transactions", adminHandler.ListTransactions)

			// Withdrawal Review
			adminAuth.GET("/withdrawals/pending", adminHandler.PendingWithdrawals)
			adminAuth.PUT("/withdrawals/:id/approve", adminHandler.ApproveWithdrawal)
			adminAuth.PUT("/withdrawals/:id/reject", adminHandler.RejectWithdrawal)

			// Banner Management
			adminAuth.GET("/banners", adminHandler.ListBanners)
			adminAuth.POST("/banners", adminHandler.CreateBanner)
			adminAuth.PUT("/banners/:id", adminHandler.UpdateBanner)
			adminAuth.DELETE("/banners/:id", adminHandler.DeleteBanner)

			// System Config
			adminAuth.GET("/config", adminHandler.GetConfig)
			adminAuth.PUT("/config", adminHandler.UpdateConfig)
		}
	}

	return r
}
