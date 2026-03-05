package provider

import (
	"fmt"
	"time"

	"go.uber.org/zap"
)

// DepositRequest 充值请求
type DepositRequest struct {
	UserID        uint
	Amount        float64
	PaymentMethod string
}

// DepositResult 充值结果
type DepositResult struct {
	Success    bool
	PaymentRef string
}

// WithdrawRequest 提现请求
type WithdrawRequest struct {
	UserID        uint
	Amount        float64
	PaymentMethod string
	AccountInfo   map[string]string
}

// WithdrawResult 提现结果
type WithdrawResult struct {
	Success    bool
	PaymentRef string
}

// PaymentGateway 支付网关接口
type PaymentGateway interface {
	CreateDeposit(req *DepositRequest) (*DepositResult, error)
	ProcessWithdraw(req *WithdrawRequest) (*WithdrawResult, error)
}

// MockPaymentGateway Mock 实现: 充值直接成功，提现走管理审核
type MockPaymentGateway struct {
	logger *zap.Logger
}

func NewMockPaymentGateway(logger *zap.Logger) *MockPaymentGateway {
	return &MockPaymentGateway{logger: logger}
}

func (m *MockPaymentGateway) CreateDeposit(req *DepositRequest) (*DepositResult, error) {
	ref := fmt.Sprintf("MOCK-DEP-%d-%d", req.UserID, time.Now().UnixMilli())
	m.logger.Info("[MOCK PAYMENT] Deposit processed",
		zap.Uint("user_id", req.UserID),
		zap.Float64("amount", req.Amount),
		zap.String("method", req.PaymentMethod),
		zap.String("ref", ref),
	)
	return &DepositResult{
		Success:    true,
		PaymentRef: ref,
	}, nil
}

func (m *MockPaymentGateway) ProcessWithdraw(req *WithdrawRequest) (*WithdrawResult, error) {
	ref := fmt.Sprintf("MOCK-WD-%d-%d", req.UserID, time.Now().UnixMilli())
	m.logger.Info("[MOCK PAYMENT] Withdrawal submitted (pending admin review)",
		zap.Uint("user_id", req.UserID),
		zap.Float64("amount", req.Amount),
		zap.String("method", req.PaymentMethod),
		zap.String("ref", ref),
	)
	return &WithdrawResult{
		Success:    true,
		PaymentRef: ref,
	}, nil
}
