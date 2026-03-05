package service

import (
	"errors"
	"fmt"
	"time"

	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
	"go-plus/server/internal/provider"
)

var (
	ErrPhoneRegistered  = errors.New("phone already registered")
	ErrUserNotFound     = errors.New("user not found")
	ErrInvalidPassword  = errors.New("invalid password")
	ErrUserDisabled     = errors.New("user is disabled")
)

// UserService 用户业务服务
type UserService struct {
	db     *gorm.DB
	oauth  provider.OAuthProvider
	logger *zap.Logger
}

func NewUserService(db *gorm.DB, oauth provider.OAuthProvider, logger *zap.Logger) *UserService {
	return &UserService{
		db:     db,
		oauth:  oauth,
		logger: logger,
	}
}

// Register 注册新用户
func (s *UserService) Register(phone, password, giftGame string) (*model.User, *WelcomeBonusInfo, error) {
	// 检查手机号是否已注册
	var count int64
	s.db.Model(&model.User{}).Where("phone = ?", phone).Count(&count)
	if count > 0 {
		return nil, nil, ErrPhoneRegistered
	}

	// bcrypt 加密密码
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, nil, err
	}

	user := model.User{
		Phone:        phone,
		PasswordHash: string(hash),
		Role:         "user",
		Status:       "active",
		MarketCode:   "IN",
	}

	// 开始事务
	tx := s.db.Begin()

	// 创建用户
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return nil, nil, err
	}

	// 创建钱包 (balance=0, bonus_balance=100)
	wallet := model.Wallet{
		UserID:       user.ID,
		Balance:      0,
		BonusBalance: 100,
		MarketCode:   "IN",
	}
	if err := tx.Create(&wallet).Error; err != nil {
		tx.Rollback()
		return nil, nil, err
	}

	// 创建 welcome bonus 记录
	welcomeBonus := model.UserBonus{
		UserID:     user.ID,
		BonusType:  "welcome",
		Amount:     100,
		Status:     "pending",
		MarketCode: "IN",
	}
	if err := tx.Create(&welcomeBonus).Error; err != nil {
		tx.Rollback()
		return nil, nil, err
	}

	// 如果选择了 gift_game，创建 free_spin 记录
	if giftGame != "" {
		freeSpinBonus := model.UserBonus{
			UserID:     user.ID,
			BonusType:  "free_spin",
			Amount:     0,
			GameSlug:   giftGame,
			Status:     "pending",
			MarketCode: "IN",
		}
		if err := tx.Create(&freeSpinBonus).Error; err != nil {
			tx.Rollback()
			return nil, nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		return nil, nil, err
	}

	bonusInfo := &WelcomeBonusInfo{
		Amount:   100,
		GiftGame: giftGame,
	}

	s.logger.Info("User registered", zap.Uint("user_id", user.ID), zap.String("phone", phone))

	return &user, bonusInfo, nil
}

// WelcomeBonusInfo 注册欢迎奖励信息
type WelcomeBonusInfo struct {
	Amount   float64 `json:"amount"`
	GiftGame string  `json:"gift_game"`
}

// LoginByPassword 手机号+密码登录
func (s *UserService) LoginByPassword(phone, password string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("phone = ?", phone).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidPassword
		}
		return nil, err
	}

	if user.Status == "disabled" {
		return nil, ErrUserDisabled
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidPassword
	}

	// 更新 last_login_at
	now := time.Now()
	s.db.Model(&user).Update("last_login_at", now)

	s.logger.Info("User logged in by password", zap.Uint("user_id", user.ID))

	return &user, nil
}

// LoginByOTP OTP 快捷登录
func (s *UserService) LoginByOTP(phone string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("phone = ?", phone).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if user.Status == "disabled" {
		return nil, ErrUserDisabled
	}

	// 更新 last_login_at
	now := time.Now()
	s.db.Model(&user).Update("last_login_at", now)

	s.logger.Info("User logged in by OTP", zap.Uint("user_id", user.ID))

	return &user, nil
}

// LoginByGoogle Google 登录/注册
func (s *UserService) LoginByGoogle(idToken string) (*model.User, *WelcomeBonusInfo, bool, error) {
	// 验证 Google Token
	googleInfo, err := s.oauth.VerifyGoogleToken(idToken)
	if err != nil {
		return nil, nil, false, err
	}

	// 查找是否有关联用户
	var user model.User
	err = s.db.Where("google_id = ?", googleInfo.GoogleID).First(&user).Error

	if err == nil {
		// 已有用户，直接登录
		if user.Status == "disabled" {
			return nil, nil, false, ErrUserDisabled
		}
		now := time.Now()
		s.db.Model(&user).Update("last_login_at", now)
		s.logger.Info("User logged in by Google", zap.Uint("user_id", user.ID))
		return &user, nil, false, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil, false, err
	}

	// 新用户，自动创建账户
	googleID := googleInfo.GoogleID
	user = model.User{
		Phone:        fmt.Sprintf("google_%s", googleID),
		PasswordHash: "",
		Nickname:     googleInfo.Name,
		AvatarURL:    googleInfo.Picture,
		GoogleID:     &googleID,
		GoogleEmail:  googleInfo.Email,
		Role:         "user",
		Status:       "active",
		MarketCode:   "IN",
	}

	tx := s.db.Begin()

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return nil, nil, false, err
	}

	// 创建钱包
	wallet := model.Wallet{
		UserID:       user.ID,
		Balance:      0,
		BonusBalance: 100,
		MarketCode:   "IN",
	}
	if err := tx.Create(&wallet).Error; err != nil {
		tx.Rollback()
		return nil, nil, false, err
	}

	// 创建 welcome bonus
	welcomeBonus := model.UserBonus{
		UserID:     user.ID,
		BonusType:  "welcome",
		Amount:     100,
		Status:     "pending",
		MarketCode: "IN",
	}
	if err := tx.Create(&welcomeBonus).Error; err != nil {
		tx.Rollback()
		return nil, nil, false, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, nil, false, err
	}

	bonusInfo := &WelcomeBonusInfo{
		Amount:   100,
		GiftGame: "",
	}

	s.logger.Info("New user created via Google", zap.Uint("user_id", user.ID), zap.String("google_id", googleID))

	return &user, bonusInfo, true, nil
}

// GetUserByID 根据 ID 获取用户
func (s *UserService) GetUserByID(userID uint) (*model.User, error) {
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

// GetUserMe 获取用户完整信息 (含钱包余额)
func (s *UserService) GetUserMe(userID uint) (*model.UserMeResponse, error) {
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	var wallet model.Wallet
	if err := s.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 钱包不存在时返回 0
			wallet = model.Wallet{Balance: 0, BonusBalance: 0}
		} else {
			return nil, err
		}
	}

	return &model.UserMeResponse{
		ID:           user.ID,
		Phone:        user.Phone,
		Nickname:     user.Nickname,
		AvatarURL:    user.AvatarURL,
		GoogleEmail:  user.GoogleEmail,
		Role:         user.Role,
		MarketCode:   user.MarketCode,
		Balance:      wallet.Balance,
		BonusBalance: wallet.BonusBalance,
		CreatedAt:    user.CreatedAt,
	}, nil
}
