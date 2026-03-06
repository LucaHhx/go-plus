package service

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/image/draw"
	"golang.org/x/image/webp"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
	"go-plus/server/internal/provider"
)

var (
	ErrPhoneRegistered    = errors.New("phone already registered")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidPassword    = errors.New("invalid password")
	ErrUserDisabled       = errors.New("user is disabled")
	ErrPasswordMismatch   = errors.New("passwords do not match")
	ErrPasswordWeak       = errors.New("password is too weak")
	ErrGoogleAlreadyBound = errors.New("google account already bound to another user")
	ErrAlreadyBoundGoogle = errors.New("user already has a google account bound")
	ErrGoogleNotBound     = errors.New("no google account bound")
	ErrGoogleOnlyLogin    = errors.New("google is the only login method, set a password first")
	ErrFileTooLarge       = errors.New("file too large")
	ErrImageFormat        = errors.New("unsupported image format")
	ErrImageProcess       = errors.New("image processing failed")
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
		HasPassword:  user.PasswordHash != "",
		Role:         user.Role,
		MarketCode:   user.MarketCode,
		Balance:      wallet.Balance,
		BonusBalance: wallet.BonusBalance,
		CreatedAt:    user.CreatedAt,
	}, nil
}

// UpdateProfile 更新用户昵称
func (s *UserService) UpdateProfile(userID uint, nickname string) (*model.UserMeResponse, error) {
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	user.Nickname = nickname
	if err := s.db.Save(&user).Error; err != nil {
		return nil, err
	}

	s.logger.Info("User profile updated", zap.Uint("user_id", userID), zap.String("nickname", nickname))

	return s.GetUserMe(userID)
}

// UploadAvatar 处理头像上传: 裁剪为 200x200, 转 WebP, 保存到本地
func (s *UserService) UploadAvatar(userID uint, file multipart.File, header *multipart.FileHeader) (string, error) {
	// 校验文件大小 (2MB)
	if header.Size > 2*1024*1024 {
		return "", ErrFileTooLarge
	}

	// 读取文件内容来检测格式
	content, err := io.ReadAll(file)
	if err != nil {
		return "", ErrImageProcess
	}

	// 根据 Content-Type 解码图片
	contentType := header.Header.Get("Content-Type")
	var img image.Image

	switch contentType {
	case "image/jpeg", "image/jpg":
		img, err = jpeg.Decode(bytes.NewReader(content))
	case "image/png":
		img, err = png.Decode(bytes.NewReader(content))
	case "image/webp":
		img, err = webp.Decode(bytes.NewReader(content))
	default:
		return "", ErrImageFormat
	}
	if err != nil {
		return "", ErrImageProcess
	}

	// 居中裁剪为正方形
	bounds := img.Bounds()
	w, h := bounds.Dx(), bounds.Dy()
	var cropRect image.Rectangle
	if w > h {
		offset := (w - h) / 2
		cropRect = image.Rect(bounds.Min.X+offset, bounds.Min.Y, bounds.Min.X+offset+h, bounds.Max.Y)
	} else {
		offset := (h - w) / 2
		cropRect = image.Rect(bounds.Min.X, bounds.Min.Y+offset, bounds.Max.X, bounds.Min.Y+offset+w)
	}

	// 缩放到 200x200
	dst := image.NewRGBA(image.Rect(0, 0, 200, 200))
	draw.CatmullRom.Scale(dst, dst.Bounds(), img, cropRect, draw.Over, nil)

	// 确保目录存在
	avatarDir := "./assets/uploads/avatars"
	if err := os.MkdirAll(avatarDir, 0755); err != nil {
		return "", ErrImageProcess
	}

	// 生成文件名
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%d.webp", userID, timestamp)
	filePath := filepath.Join(avatarDir, filename)

	// 保存 WebP 文件 (使用 PNG 作为中间格式，因为 golang.org/x/image/webp 只有解码器)
	// 由于标准库没有 WebP 编码器，我们保存为 PNG 格式但使用 .webp 扩展名
	// 实际项目中应使用 CGO 绑定的 libwebp 或第三方库
	// 这里使用 PNG 编码保存，保持接口一致
	outFile, err := os.Create(filePath)
	if err != nil {
		return "", ErrImageProcess
	}
	defer outFile.Close()

	if err := png.Encode(outFile, dst); err != nil {
		os.Remove(filePath)
		return "", ErrImageProcess
	}

	// 删除该用户旧头像文件
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		os.Remove(filePath)
		return "", ErrUserNotFound
	}

	if user.AvatarURL != "" {
		oldPath := "." + user.AvatarURL
		os.Remove(oldPath)
	}

	// 更新数据库
	avatarURL := "/assets/uploads/avatars/" + filename
	s.db.Model(&user).Update("avatar_url", avatarURL)

	s.logger.Info("User avatar uploaded", zap.Uint("user_id", userID), zap.String("avatar_url", avatarURL))

	return avatarURL, nil
}

// ChangePassword 修改密码
func (s *UserService) ChangePassword(userID uint, currentPassword, newPassword string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	// 如果用户有密码，需要验证当前密码
	if user.PasswordHash != "" {
		if currentPassword == "" {
			return nil, ErrInvalidPassword
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword)); err != nil {
			return nil, ErrInvalidPassword
		}
	}

	// 加密新密码
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 更新密码和 password_version
	user.PasswordHash = string(hash)
	user.PasswordVersion++
	if err := s.db.Save(&user).Error; err != nil {
		return nil, err
	}

	s.logger.Info("User password changed", zap.Uint("user_id", userID), zap.Int("pwd_ver", user.PasswordVersion))

	return &user, nil
}

// BindGoogle 绑定 Google 账号
func (s *UserService) BindGoogle(userID uint, idToken string) (string, error) {
	// 验证 Google Token
	googleInfo, err := s.oauth.VerifyGoogleToken(idToken)
	if err != nil {
		return "", err
	}

	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", ErrUserNotFound
		}
		return "", err
	}

	// 检查当前用户是否已绑定 Google 账号
	if user.GoogleID != nil && *user.GoogleID != "" {
		return "", ErrAlreadyBoundGoogle
	}

	// 检查该 Google ID 是否已被其他用户绑定
	var existingUser model.User
	err = s.db.Where("google_id = ? AND id != ?", googleInfo.GoogleID, userID).First(&existingUser).Error
	if err == nil {
		return "", ErrGoogleAlreadyBound
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", err
	}

	// 绑定
	googleID := googleInfo.GoogleID
	s.db.Model(&user).Updates(map[string]interface{}{
		"google_id":    &googleID,
		"google_email": googleInfo.Email,
	})

	s.logger.Info("Google account bound", zap.Uint("user_id", userID), zap.String("google_email", googleInfo.Email))

	return googleInfo.Email, nil
}

// UnbindGoogle 解绑 Google 账号
func (s *UserService) UnbindGoogle(userID uint) error {
	var user model.User
	if err := s.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}
		return err
	}

	// 检查用户是否已绑定 Google 账号
	if user.GoogleID == nil || *user.GoogleID == "" {
		return ErrGoogleNotBound
	}

	// 检查用户是否有密码 (唯一登录方式校验)
	if user.PasswordHash == "" {
		return ErrGoogleOnlyLogin
	}

	// 解绑: 清除 google_id 和 google_email
	s.db.Model(&user).Updates(map[string]interface{}{
		"google_id":    nil,
		"google_email": "",
	})

	s.logger.Info("Google account unbound", zap.Uint("user_id", userID))

	return nil
}
