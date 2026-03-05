package service

import (
	"encoding/json"
	"errors"
	"time"

	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
)

var (
	ErrAdminInvalidCredentials = errors.New("invalid username or password")
	ErrAdminUserNotFound       = errors.New("user not found")
	ErrAdminGameNotFound       = errors.New("game not found")
	ErrAdminTxNotFound         = errors.New("transaction not found")
	ErrAdminWithdrawalStatus   = errors.New("withdrawal status does not allow review")
	ErrAdminBannerNotFound     = errors.New("banner not found")
)

type AdminService struct {
	db     *gorm.DB
	logger *zap.Logger
}

func NewAdminService(db *gorm.DB, logger *zap.Logger) *AdminService {
	return &AdminService{db: db, logger: logger}
}

// --- Auth ---

type AdminLoginResponse struct {
	Token string            `json:"token"`
	Admin AdminInfoResponse `json:"admin"`
}

type AdminInfoResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Nickname string `json:"nickname"`
	Role     string `json:"role"`
}

func (s *AdminService) Login(username, password string) (*model.AdminUser, error) {
	var admin model.AdminUser
	if err := s.db.Where("username = ? AND status = ?", username, "active").First(&admin).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAdminInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)); err != nil {
		return nil, ErrAdminInvalidCredentials
	}

	now := time.Now()
	s.db.Model(&admin).Update("last_login_at", now)

	return &admin, nil
}

func (s *AdminService) GetAdminByID(id uint) (*model.AdminUser, error) {
	var admin model.AdminUser
	if err := s.db.First(&admin, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAdminInvalidCredentials
		}
		return nil, err
	}
	return &admin, nil
}

// --- Dashboard ---

type DashboardStats struct {
	Today TodayStats `json:"today"`
	Week  WeekStats  `json:"week"`
	Total TotalStats `json:"total"`
}

type TodayStats struct {
	NewUsers           int64   `json:"new_users"`
	ActiveUsers        int64   `json:"active_users"`
	TotalDeposits      float64 `json:"total_deposits"`
	TotalWithdrawals   float64 `json:"total_withdrawals"`
	PendingWithdrawals int64   `json:"pending_withdrawals"`
}

type WeekStats struct {
	NewUsers         int64   `json:"new_users"`
	ActiveUsers      int64   `json:"active_users"`
	TotalDeposits    float64 `json:"total_deposits"`
	TotalWithdrawals float64 `json:"total_withdrawals"`
}

type TotalStats struct {
	Users     int64 `json:"users"`
	Games     int64 `json:"games"`
	Providers int64 `json:"providers"`
}

func (s *AdminService) GetDashboardStats() (*DashboardStats, error) {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	weekStart := todayStart.AddDate(0, 0, -7)

	stats := &DashboardStats{}

	// Today
	s.db.Model(&model.User{}).Where("created_at >= ?", todayStart).Count(&stats.Today.NewUsers)
	s.db.Model(&model.User{}).Where("last_login_at >= ?", todayStart).Count(&stats.Today.ActiveUsers)

	var todayDeposits, todayWithdrawals *float64
	s.db.Model(&model.Transaction{}).
		Where("type = ? AND status = ? AND created_at >= ?", "deposit", "completed", todayStart).
		Select("COALESCE(SUM(amount), 0)").Scan(&todayDeposits)
	if todayDeposits != nil {
		stats.Today.TotalDeposits = *todayDeposits
	}

	s.db.Model(&model.Transaction{}).
		Where("type = ? AND status = ? AND created_at >= ?", "withdrawal", "completed", todayStart).
		Select("COALESCE(SUM(amount), 0)").Scan(&todayWithdrawals)
	if todayWithdrawals != nil {
		stats.Today.TotalWithdrawals = *todayWithdrawals
	}

	s.db.Model(&model.Transaction{}).
		Where("type = ? AND status = ?", "withdrawal", "pending").
		Count(&stats.Today.PendingWithdrawals)

	// Week
	s.db.Model(&model.User{}).Where("created_at >= ?", weekStart).Count(&stats.Week.NewUsers)
	s.db.Model(&model.User{}).Where("last_login_at >= ?", weekStart).Count(&stats.Week.ActiveUsers)

	var weekDeposits, weekWithdrawals *float64
	s.db.Model(&model.Transaction{}).
		Where("type = ? AND status = ? AND created_at >= ?", "deposit", "completed", weekStart).
		Select("COALESCE(SUM(amount), 0)").Scan(&weekDeposits)
	if weekDeposits != nil {
		stats.Week.TotalDeposits = *weekDeposits
	}

	s.db.Model(&model.Transaction{}).
		Where("type = ? AND status = ? AND created_at >= ?", "withdrawal", "completed", weekStart).
		Select("COALESCE(SUM(amount), 0)").Scan(&weekWithdrawals)
	if weekWithdrawals != nil {
		stats.Week.TotalWithdrawals = *weekWithdrawals
	}

	// Total
	s.db.Model(&model.User{}).Count(&stats.Total.Users)
	s.db.Model(&model.Game{}).Where("status = ?", "active").Count(&stats.Total.Games)
	s.db.Model(&model.GameProvider{}).Where("status = ?", "active").Count(&stats.Total.Providers)

	return stats, nil
}

// --- User Management ---

type AdminUserListResponse struct {
	Users    []AdminUserItem `json:"users"`
	Total    int64           `json:"total"`
	Page     int             `json:"page"`
	PageSize int             `json:"page_size"`
}

type AdminUserItem struct {
	ID           uint       `json:"id"`
	Phone        string     `json:"phone"`
	Nickname     string     `json:"nickname"`
	Role         string     `json:"role"`
	Status       string     `json:"status"`
	Balance      float64    `json:"balance"`
	BonusBalance float64    `json:"bonus_balance"`
	MarketCode   string     `json:"market_code"`
	LastLoginAt  *time.Time `json:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at"`
}

func (s *AdminService) ListUsers(search string, page, pageSize int) (*AdminUserListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	query := s.db.Model(&model.User{})
	if search != "" {
		query = query.Where("phone LIKE ? OR nickname LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	var users []model.User
	offset := (page - 1) * pageSize
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		return nil, err
	}

	// batch fetch wallets
	userIDs := make([]uint, len(users))
	for i, u := range users {
		userIDs[i] = u.ID
	}
	var wallets []model.Wallet
	s.db.Where("user_id IN ?", userIDs).Find(&wallets)
	walletMap := make(map[uint]model.Wallet)
	for _, w := range wallets {
		walletMap[w.UserID] = w
	}

	items := make([]AdminUserItem, len(users))
	for i, u := range users {
		w := walletMap[u.ID]
		items[i] = AdminUserItem{
			ID:           u.ID,
			Phone:        u.Phone,
			Nickname:     u.Nickname,
			Role:         u.Role,
			Status:       u.Status,
			Balance:      w.Balance,
			BonusBalance: w.BonusBalance,
			MarketCode:   u.MarketCode,
			LastLoginAt:  u.LastLoginAt,
			CreatedAt:    u.CreatedAt,
		}
	}

	return &AdminUserListResponse{Users: items, Total: total, Page: page, PageSize: pageSize}, nil
}

type AdminUserDetailResponse struct {
	User               AdminUserDetailUser         `json:"user"`
	Wallet             AdminUserDetailWallet       `json:"wallet"`
	RecentTransactions []AdminUserDetailTransaction `json:"recent_transactions"`
}

type AdminUserDetailUser struct {
	ID          uint       `json:"id"`
	Phone       string     `json:"phone"`
	Nickname    string     `json:"nickname"`
	AvatarURL   string     `json:"avatar_url"`
	GoogleEmail string     `json:"google_email"`
	Role        string     `json:"role"`
	Status      string     `json:"status"`
	MarketCode  string     `json:"market_code"`
	LastLoginAt *time.Time `json:"last_login_at"`
	CreatedAt   time.Time  `json:"created_at"`
}

type AdminUserDetailWallet struct {
	Balance      float64 `json:"balance"`
	BonusBalance float64 `json:"bonus_balance"`
	FrozenAmount float64 `json:"frozen_amount"`
}

type AdminUserDetailTransaction struct {
	ID        uint    `json:"id"`
	Type      string  `json:"type"`
	Amount    float64 `json:"amount"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"created_at"`
}

func (s *AdminService) GetUserDetail(userID uint) (*AdminUserDetailResponse, error) {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAdminUserNotFound
		}
		return nil, err
	}

	var wallet model.Wallet
	s.db.Where("user_id = ?", userID).First(&wallet)

	var txns []model.Transaction
	s.db.Where("user_id = ?", userID).Order("created_at DESC").Limit(10).Find(&txns)

	recentTxns := make([]AdminUserDetailTransaction, len(txns))
	for i, t := range txns {
		recentTxns[i] = AdminUserDetailTransaction{
			ID:        t.ID,
			Type:      t.Type,
			Amount:    t.Amount,
			Status:    t.Status,
			CreatedAt: t.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
	}

	return &AdminUserDetailResponse{
		User: AdminUserDetailUser{
			ID:          user.ID,
			Phone:       user.Phone,
			Nickname:    user.Nickname,
			AvatarURL:   user.AvatarURL,
			GoogleEmail: user.GoogleEmail,
			Role:        user.Role,
			Status:      user.Status,
			MarketCode:  user.MarketCode,
			LastLoginAt: user.LastLoginAt,
			CreatedAt:   user.CreatedAt,
		},
		Wallet: AdminUserDetailWallet{
			Balance:      wallet.Balance,
			BonusBalance: wallet.BonusBalance,
			FrozenAmount: wallet.FrozenAmount,
		},
		RecentTransactions: recentTxns,
	}, nil
}

func (s *AdminService) UpdateUserStatus(userID uint, status string) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminUserNotFound
		}
		return err
	}
	return s.db.Model(&user).Update("status", status).Error
}

// --- Game Management ---

type AdminGameListResponse struct {
	Games    []AdminGameItem `json:"games"`
	Total    int64           `json:"total"`
	Page     int             `json:"page"`
	PageSize int             `json:"page_size"`
}

type AdminGameItem struct {
	ID           uint      `json:"id"`
	Name         string    `json:"name"`
	Slug         string    `json:"slug"`
	ProviderID   uint      `json:"provider_id"`
	ProviderName string    `json:"provider_name"`
	CategoryID   uint      `json:"category_id"`
	CategoryName string    `json:"category_name"`
	ThumbnailURL string    `json:"thumbnail_url"`
	IsNew        bool      `json:"is_new"`
	IsHot        bool      `json:"is_hot"`
	Status       string    `json:"status"`
	SortOrder    int       `json:"sort_order"`
	CreatedAt    time.Time `json:"created_at"`
}

func (s *AdminService) ListGames(search string, providerID, categoryID uint, status string, page, pageSize int) (*AdminGameListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	query := s.db.Model(&model.Game{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}
	if providerID > 0 {
		query = query.Where("provider_id = ?", providerID)
	}
	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	var games []model.Game
	offset := (page - 1) * pageSize
	if err := query.Preload("Provider").Preload("Category").Order("sort_order ASC").Offset(offset).Limit(pageSize).Find(&games).Error; err != nil {
		return nil, err
	}

	items := make([]AdminGameItem, len(games))
	for i, g := range games {
		items[i] = AdminGameItem{
			ID:           g.ID,
			Name:         g.Name,
			Slug:         g.Slug,
			ProviderID:   g.ProviderID,
			CategoryID:   g.CategoryID,
			ThumbnailURL: g.ThumbnailURL,
			IsNew:        g.IsNew,
			IsHot:        g.IsHot,
			Status:       g.Status,
			SortOrder:    g.SortOrder,
			CreatedAt:    g.CreatedAt,
		}
		if g.Provider != nil {
			items[i].ProviderName = g.Provider.Name
		}
		if g.Category != nil {
			items[i].CategoryName = g.Category.Name
		}
	}

	return &AdminGameListResponse{Games: items, Total: total, Page: page, PageSize: pageSize}, nil
}

func (s *AdminService) UpdateGame(gameID uint, updates map[string]interface{}) error {
	var game model.Game
	if err := s.db.First(&game, gameID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminGameNotFound
		}
		return err
	}
	return s.db.Model(&game).Updates(updates).Error
}

func (s *AdminService) UpdateGameStatus(gameID uint, status string) error {
	var game model.Game
	if err := s.db.First(&game, gameID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminGameNotFound
		}
		return err
	}
	return s.db.Model(&game).Update("status", status).Error
}

// --- Provider Management ---

type AdminProviderListResponse struct {
	Providers []AdminProviderItem `json:"providers"`
	Total     int64               `json:"total"`
}

type AdminProviderItem struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	LogoURL   string    `json:"logo_url"`
	Status    string    `json:"status"`
	SortOrder int       `json:"sort_order"`
	IsNew     bool      `json:"is_new"`
	GameCount int64     `json:"game_count"`
	CreatedAt time.Time `json:"created_at"`
}

func (s *AdminService) ListProviders() (*AdminProviderListResponse, error) {
	var providers []model.GameProvider
	if err := s.db.Order("sort_order ASC").Find(&providers).Error; err != nil {
		return nil, err
	}

	items := make([]AdminProviderItem, len(providers))
	for i, p := range providers {
		var count int64
		s.db.Model(&model.Game{}).Where("provider_id = ?", p.ID).Count(&count)
		items[i] = AdminProviderItem{
			ID:        p.ID,
			Name:      p.Name,
			Slug:      p.Slug,
			LogoURL:   p.LogoURL,
			Status:    p.Status,
			SortOrder: p.SortOrder,
			IsNew:     p.IsNew,
			GameCount: count,
			CreatedAt: p.CreatedAt,
		}
	}

	return &AdminProviderListResponse{Providers: items, Total: int64(len(providers))}, nil
}

func (s *AdminService) CreateProvider(name, slug, logoURL string) (*model.GameProvider, error) {
	provider := model.GameProvider{
		Name:    name,
		Slug:    slug,
		LogoURL: logoURL,
		Status:  "active",
	}
	if err := s.db.Create(&provider).Error; err != nil {
		return nil, err
	}
	return &provider, nil
}

func (s *AdminService) UpdateProvider(id uint, updates map[string]interface{}) error {
	var provider model.GameProvider
	if err := s.db.First(&provider, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminGameNotFound
		}
		return err
	}
	return s.db.Model(&provider).Updates(updates).Error
}

func (s *AdminService) UpdateProviderStatus(id uint, status string) error {
	var provider model.GameProvider
	if err := s.db.First(&provider, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminGameNotFound
		}
		return err
	}
	return s.db.Model(&provider).Update("status", status).Error
}

// --- Transaction Management ---

type AdminTransactionListResponse struct {
	Transactions []AdminTransactionItem `json:"transactions"`
	Total        int64                  `json:"total"`
	Page         int                    `json:"page"`
	PageSize     int                    `json:"page_size"`
}

type AdminTransactionItem struct {
	ID            uint    `json:"id"`
	UserID        uint    `json:"user_id"`
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	Status        string  `json:"status"`
	PaymentMethod string  `json:"payment_method"`
	CreatedAt     string  `json:"created_at"`
}

func (s *AdminService) ListTransactions(txType, status string, userID uint, page, pageSize int) (*AdminTransactionListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	query := s.db.Model(&model.Transaction{})
	if txType != "" {
		query = query.Where("type = ?", txType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if userID > 0 {
		query = query.Where("user_id = ?", userID)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	var txns []model.Transaction
	offset := (page - 1) * pageSize
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&txns).Error; err != nil {
		return nil, err
	}

	items := make([]AdminTransactionItem, len(txns))
	for i, t := range txns {
		items[i] = AdminTransactionItem{
			ID:            t.ID,
			UserID:        t.UserID,
			Type:          t.Type,
			Amount:        t.Amount,
			Status:        t.Status,
			PaymentMethod: t.PaymentMethod,
			CreatedAt:     t.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
	}

	return &AdminTransactionListResponse{Transactions: items, Total: total, Page: page, PageSize: pageSize}, nil
}

// --- Withdrawal Review ---

type AdminWithdrawalReviewResponse struct {
	TransactionID uint   `json:"transaction_id"`
	Status        string `json:"status"`
}

func (s *AdminService) ApproveWithdrawal(txID uint, remark string) (*AdminWithdrawalReviewResponse, error) {
	var tx model.Transaction
	if err := s.db.First(&tx, txID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAdminTxNotFound
		}
		return nil, err
	}

	if tx.Type != "withdrawal" || tx.Status != "pending" {
		return nil, ErrAdminWithdrawalStatus
	}

	err := s.db.Transaction(func(dbTx *gorm.DB) error {
		// Update transaction status
		if err := dbTx.Model(&tx).Updates(map[string]interface{}{
			"status": "completed",
			"remark": remark,
		}).Error; err != nil {
			return err
		}

		// Unfreeze amount
		var wallet model.Wallet
		if err := dbTx.Where("user_id = ?", tx.UserID).First(&wallet).Error; err != nil {
			return err
		}
		newFrozen := wallet.FrozenAmount - tx.Amount
		if newFrozen < 0 {
			newFrozen = 0
		}
		return dbTx.Model(&wallet).Update("frozen_amount", roundTwo(newFrozen)).Error
	})
	if err != nil {
		return nil, err
	}

	return &AdminWithdrawalReviewResponse{TransactionID: txID, Status: "completed"}, nil
}

func (s *AdminService) RejectWithdrawal(txID uint, remark string) (*AdminWithdrawalReviewResponse, error) {
	var tx model.Transaction
	if err := s.db.First(&tx, txID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrAdminTxNotFound
		}
		return nil, err
	}

	if tx.Type != "withdrawal" || tx.Status != "pending" {
		return nil, ErrAdminWithdrawalStatus
	}

	err := s.db.Transaction(func(dbTx *gorm.DB) error {
		// Update transaction status
		if err := dbTx.Model(&tx).Updates(map[string]interface{}{
			"status": "rejected",
			"remark": remark,
		}).Error; err != nil {
			return err
		}

		// Refund: unfreeze + restore balance
		var wallet model.Wallet
		if err := dbTx.Where("user_id = ?", tx.UserID).First(&wallet).Error; err != nil {
			return err
		}
		newFrozen := wallet.FrozenAmount - tx.Amount
		if newFrozen < 0 {
			newFrozen = 0
		}
		return dbTx.Model(&wallet).Updates(map[string]interface{}{
			"balance":       roundTwo(wallet.Balance + tx.Amount),
			"frozen_amount": roundTwo(newFrozen),
		}).Error
	})
	if err != nil {
		return nil, err
	}

	return &AdminWithdrawalReviewResponse{TransactionID: txID, Status: "rejected"}, nil
}

// --- Banner Management ---

type AdminBannerListResponse struct {
	Banners []AdminBannerItem `json:"banners"`
	Total   int64             `json:"total"`
}

type AdminBannerItem struct {
	ID         uint       `json:"id"`
	Title      string     `json:"title"`
	ImageURL   string     `json:"image_url"`
	LinkURL    string     `json:"link_url"`
	LinkType   string     `json:"link_type"`
	SortOrder  int        `json:"sort_order"`
	Status     string     `json:"status"`
	MarketCode string     `json:"market_code"`
	StartAt    *time.Time `json:"start_at"`
	EndAt      *time.Time `json:"end_at"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (s *AdminService) ListBanners() (*AdminBannerListResponse, error) {
	var banners []model.Banner
	if err := s.db.Order("sort_order ASC").Find(&banners).Error; err != nil {
		return nil, err
	}

	items := make([]AdminBannerItem, len(banners))
	for i, b := range banners {
		items[i] = AdminBannerItem{
			ID:         b.ID,
			Title:      b.Title,
			ImageURL:   b.ImageURL,
			LinkURL:    b.LinkURL,
			LinkType:   b.LinkType,
			SortOrder:  b.SortOrder,
			Status:     b.Status,
			MarketCode: b.MarketCode,
			StartAt:    b.StartAt,
			EndAt:      b.EndAt,
			CreatedAt:  b.CreatedAt,
		}
	}

	return &AdminBannerListResponse{Banners: items, Total: int64(len(banners))}, nil
}

func (s *AdminService) CreateBanner(title, imageURL, linkURL, linkType, marketCode string, sortOrder int) (*model.Banner, error) {
	banner := model.Banner{
		Title:      title,
		ImageURL:   imageURL,
		LinkURL:    linkURL,
		LinkType:   linkType,
		SortOrder:  sortOrder,
		Status:     "active",
		MarketCode: marketCode,
	}
	if banner.MarketCode == "" {
		banner.MarketCode = "IN"
	}
	if banner.LinkType == "" {
		banner.LinkType = "none"
	}
	if err := s.db.Create(&banner).Error; err != nil {
		return nil, err
	}
	return &banner, nil
}

func (s *AdminService) UpdateBanner(id uint, updates map[string]interface{}) error {
	var banner model.Banner
	if err := s.db.First(&banner, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminBannerNotFound
		}
		return err
	}
	return s.db.Model(&banner).Updates(updates).Error
}

func (s *AdminService) DeleteBanner(id uint) error {
	var banner model.Banner
	if err := s.db.First(&banner, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrAdminBannerNotFound
		}
		return err
	}
	return s.db.Delete(&banner).Error
}

// --- System Config ---

type AdminConfigResponse struct {
	Configs map[string]string `json:"configs"`
}

func (s *AdminService) GetConfigs() (*AdminConfigResponse, error) {
	var configs []model.SystemConfig
	if err := s.db.Where("market_code != ?", "SYSTEM").Find(&configs).Error; err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, c := range configs {
		result[c.ConfigKey] = c.ConfigValue
	}

	return &AdminConfigResponse{Configs: result}, nil
}

func (s *AdminService) UpdateConfigs(configs map[string]string) error {
	for key, value := range configs {
		if err := s.db.Where("config_key = ? AND market_code != ?", key, "SYSTEM").
			Assign(model.SystemConfig{ConfigValue: value}).
			FirstOrCreate(&model.SystemConfig{
				ConfigKey:   key,
				ConfigValue: value,
				MarketCode:  "IN",
			}).Error; err != nil {
			return err
		}
	}
	return nil
}

// --- Operation Log ---

func (s *AdminService) LogOperation(adminID uint, action, targetType string, targetID uint, detail interface{}, ipAddress string) {
	detailStr := ""
	if detail != nil {
		if b, err := json.Marshal(detail); err == nil {
			detailStr = string(b)
		}
	}

	log := model.AdminOperationLog{
		AdminID:    adminID,
		Action:     action,
		TargetType: targetType,
		TargetID:   targetID,
		Detail:     detailStr,
		IPAddress:  ipAddress,
	}
	if err := s.db.Create(&log).Error; err != nil {
		s.logger.Error("Failed to log admin operation", zap.Error(err))
	}
}
