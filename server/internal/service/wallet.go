package service

import (
	"errors"
	"fmt"
	"math"

	"go.uber.org/zap"
	"gorm.io/gorm"

	"go-plus/server/internal/model"
	"go-plus/server/internal/provider"
)

var (
	ErrDepositBelowMin    = errors.New("deposit amount below minimum")
	ErrDepositAboveMax    = errors.New("deposit amount above maximum")
	ErrWithdrawBelowMin   = errors.New("withdrawal amount below minimum")
	ErrWithdrawAboveMax   = errors.New("withdrawal amount exceeds available balance")
	ErrWalletNotFound     = errors.New("wallet not found")
	ErrPaymentMethodNotFound = errors.New("payment method not available")
	ErrTransactionNotFound   = errors.New("transaction not found")
)

type WalletService struct {
	db      *gorm.DB
	gateway provider.PaymentGateway
	logger  *zap.Logger
}

func NewWalletService(db *gorm.DB, gateway provider.PaymentGateway, logger *zap.Logger) *WalletService {
	return &WalletService{
		db:      db,
		gateway: gateway,
		logger:  logger,
	}
}

// WalletBalanceResponse 钱包余额响应
type WalletBalanceResponse struct {
	Balance      float64 `json:"balance"`
	BonusBalance float64 `json:"bonus_balance"`
	FrozenAmount float64 `json:"frozen_amount"`
	Currency     string  `json:"currency"`
}

// GetBalance 获取钱包余额
func (s *WalletService) GetBalance(userID uint) (*WalletBalanceResponse, error) {
	var wallet model.Wallet
	if err := s.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWalletNotFound
		}
		return nil, err
	}

	return &WalletBalanceResponse{
		Balance:      wallet.Balance,
		BonusBalance: wallet.BonusBalance,
		FrozenAmount: wallet.FrozenAmount,
		Currency:     wallet.Currency,
	}, nil
}

// PaymentMethodResponse 支付方式响应
type PaymentMethodResponse struct {
	ID        uint    `json:"id"`
	Name      string  `json:"name"`
	Code      string  `json:"code"`
	IconURL   string  `json:"icon_url"`
	Type      string  `json:"type"`
	MinAmount float64 `json:"min_amount"`
	MaxAmount float64 `json:"max_amount"`
}

// GetPaymentMethods 获取可用支付方式
func (s *WalletService) GetPaymentMethods() ([]PaymentMethodResponse, error) {
	var methods []model.PaymentMethod
	if err := s.db.Where("status = ?", "active").Order("sort_order ASC").Find(&methods).Error; err != nil {
		return nil, err
	}

	result := make([]PaymentMethodResponse, len(methods))
	for i, m := range methods {
		result[i] = PaymentMethodResponse{
			ID:        m.ID,
			Name:      m.Name,
			Code:      m.Code,
			IconURL:   m.IconURL,
			Type:      m.Type,
			MinAmount: m.MinAmount,
			MaxAmount: m.MaxAmount,
		}
	}
	return result, nil
}

// DepositResponse 充值响应
type DepositResponse struct {
	TransactionID uint    `json:"transaction_id"`
	Amount        float64 `json:"amount"`
	Status        string  `json:"status"`
	Balance       float64 `json:"balance"`
}

// Deposit 发起充值
func (s *WalletService) Deposit(userID uint, amount float64, paymentMethodCode string) (*DepositResponse, error) {
	// 查找支付方式
	var pm model.PaymentMethod
	if err := s.db.Where("code = ? AND status = ? AND type IN ?", paymentMethodCode, "active", []string{"deposit", "both"}).First(&pm).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPaymentMethodNotFound
		}
		return nil, err
	}

	// 校验金额
	if amount < pm.MinAmount {
		return nil, ErrDepositBelowMin
	}
	if amount > pm.MaxAmount {
		return nil, ErrDepositAboveMax
	}

	// 查找钱包
	var wallet model.Wallet
	if err := s.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWalletNotFound
		}
		return nil, err
	}

	// 调用支付网关
	gatewayResult, err := s.gateway.CreateDeposit(&provider.DepositRequest{
		UserID:        userID,
		Amount:        amount,
		PaymentMethod: paymentMethodCode,
	})
	if err != nil {
		return nil, fmt.Errorf("payment gateway error: %w", err)
	}

	// 事务: 更新余额 + 创建交易记录
	var tx *model.Transaction
	err = s.db.Transaction(func(dbTx *gorm.DB) error {
		// 重新读取钱包 (事务内锁定)
		if err := dbTx.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
			return err
		}

		balanceBefore := wallet.Balance
		balanceAfter := roundTwo(balanceBefore + amount)

		// 更新余额
		if err := dbTx.Model(&wallet).Update("balance", balanceAfter).Error; err != nil {
			return err
		}

		// 创建交易记录
		tx = &model.Transaction{
			UserID:        userID,
			WalletID:      wallet.ID,
			Type:          "deposit",
			Amount:        amount,
			BalanceBefore: balanceBefore,
			BalanceAfter:  balanceAfter,
			Status:        "completed",
			PaymentMethod: paymentMethodCode,
			PaymentRef:    gatewayResult.PaymentRef,
			MarketCode:    wallet.MarketCode,
		}
		return dbTx.Create(tx).Error
	})
	if err != nil {
		return nil, err
	}

	s.logger.Info("Deposit completed",
		zap.Uint("user_id", userID),
		zap.Float64("amount", amount),
		zap.Uint("tx_id", tx.ID),
	)

	return &DepositResponse{
		TransactionID: tx.ID,
		Amount:        amount,
		Status:        "completed",
		Balance:       tx.BalanceAfter,
	}, nil
}

// WithdrawResponse 提现响应
type WithdrawResponse struct {
	TransactionID uint    `json:"transaction_id"`
	Amount        float64 `json:"amount"`
	Status        string  `json:"status"`
}

// Withdraw 发起提现
func (s *WalletService) Withdraw(userID uint, amount float64, paymentMethodCode string, accountInfo map[string]string) (*WithdrawResponse, error) {
	// 查找支付方式
	var pm model.PaymentMethod
	if err := s.db.Where("code = ? AND status = ? AND type IN ?", paymentMethodCode, "active", []string{"withdrawal", "both"}).First(&pm).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPaymentMethodNotFound
		}
		return nil, err
	}

	// 提现最低 200 INR，最高 50,000 INR (plan.md 范围定义)
	minWithdraw := 200.0
	maxWithdraw := 50000.0
	if amount < minWithdraw {
		return nil, ErrWithdrawBelowMin
	}
	if amount > maxWithdraw {
		return nil, ErrWithdrawAboveMax
	}

	// 查找钱包
	var wallet model.Wallet
	if err := s.db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWalletNotFound
		}
		return nil, err
	}

	// 可用余额 = 主余额 - 冻结金额 (Bonus 不可提现)
	available := wallet.Balance - wallet.FrozenAmount
	if amount > available {
		return nil, ErrWithdrawAboveMax
	}

	// 调用支付网关
	gatewayResult, err := s.gateway.ProcessWithdraw(&provider.WithdrawRequest{
		UserID:        userID,
		Amount:        amount,
		PaymentMethod: paymentMethodCode,
		AccountInfo:   accountInfo,
	})
	if err != nil {
		return nil, fmt.Errorf("payment gateway error: %w", err)
	}

	// 事务: 冻结金额 + 创建交易记录
	var tx *model.Transaction
	err = s.db.Transaction(func(dbTx *gorm.DB) error {
		// 重新读取钱包
		if err := dbTx.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
			return err
		}

		// 再次校验可用余额
		available := wallet.Balance - wallet.FrozenAmount
		if amount > available {
			return ErrWithdrawAboveMax
		}

		balanceBefore := wallet.Balance
		balanceAfter := roundTwo(balanceBefore - amount)

		// 冻结: balance -= amount, frozen_amount += amount
		if err := dbTx.Model(&wallet).Updates(map[string]interface{}{
			"balance":       balanceAfter,
			"frozen_amount": roundTwo(wallet.FrozenAmount + amount),
		}).Error; err != nil {
			return err
		}

		// 创建交易记录 (status=pending，等待管理员审核)
		tx = &model.Transaction{
			UserID:        userID,
			WalletID:      wallet.ID,
			Type:          "withdrawal",
			Amount:        amount,
			BalanceBefore: balanceBefore,
			BalanceAfter:  balanceAfter,
			Status:        "pending",
			PaymentMethod: paymentMethodCode,
			PaymentRef:    gatewayResult.PaymentRef,
			MarketCode:    wallet.MarketCode,
		}
		return dbTx.Create(tx).Error
	})
	if err != nil {
		return nil, err
	}

	s.logger.Info("Withdrawal submitted",
		zap.Uint("user_id", userID),
		zap.Float64("amount", amount),
		zap.Uint("tx_id", tx.ID),
	)

	return &WithdrawResponse{
		TransactionID: tx.ID,
		Amount:        amount,
		Status:        "pending",
	}, nil
}

// TransactionListResponse 交易列表响应
type TransactionListResponse struct {
	Transactions []TransactionItem `json:"transactions"`
	Total        int64             `json:"total"`
	Page         int               `json:"page"`
	PageSize     int               `json:"page_size"`
}

// TransactionItem 交易列表项
type TransactionItem struct {
	ID            uint    `json:"id"`
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	Status        string  `json:"status"`
	PaymentMethod string  `json:"payment_method"`
	BalanceAfter  float64 `json:"balance_after"`
	CreatedAt     string  `json:"created_at"`
}

// GetTransactions 获取交易记录 (支持筛选+分页)
func (s *WalletService) GetTransactions(userID uint, txType string, page, pageSize int) (*TransactionListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	query := s.db.Where("user_id = ?", userID)
	if txType != "" {
		query = query.Where("type = ?", txType)
	}

	var total int64
	if err := query.Model(&model.Transaction{}).Count(&total).Error; err != nil {
		return nil, err
	}

	var transactions []model.Transaction
	offset := (page - 1) * pageSize
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&transactions).Error; err != nil {
		return nil, err
	}

	items := make([]TransactionItem, len(transactions))
	for i, t := range transactions {
		items[i] = TransactionItem{
			ID:            t.ID,
			Type:          t.Type,
			Amount:        t.Amount,
			Status:        t.Status,
			PaymentMethod: t.PaymentMethod,
			BalanceAfter:  t.BalanceAfter,
			CreatedAt:     t.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
	}

	return &TransactionListResponse{
		Transactions: items,
		Total:        total,
		Page:         page,
		PageSize:     pageSize,
	}, nil
}

// TransactionDetailResponse 交易详情响应
type TransactionDetailResponse struct {
	ID            uint    `json:"id"`
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	BalanceBefore float64 `json:"balance_before"`
	BalanceAfter  float64 `json:"balance_after"`
	Status        string  `json:"status"`
	PaymentMethod string  `json:"payment_method"`
	PaymentRef    string  `json:"payment_ref"`
	Remark        string  `json:"remark"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
}

// GetTransactionByID 获取交易详情
func (s *WalletService) GetTransactionByID(userID uint, txID uint) (*TransactionDetailResponse, error) {
	var tx model.Transaction
	if err := s.db.Where("id = ? AND user_id = ?", txID, userID).First(&tx).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTransactionNotFound
		}
		return nil, err
	}

	return &TransactionDetailResponse{
		ID:            tx.ID,
		Type:          tx.Type,
		Amount:        tx.Amount,
		BalanceBefore: tx.BalanceBefore,
		BalanceAfter:  tx.BalanceAfter,
		Status:        tx.Status,
		PaymentMethod: tx.PaymentMethod,
		PaymentRef:    tx.PaymentRef,
		Remark:        tx.Remark,
		CreatedAt:     tx.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:     tx.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}, nil
}

// roundTwo 保留两位小数
func roundTwo(v float64) float64 {
	return math.Round(v*100) / 100
}
