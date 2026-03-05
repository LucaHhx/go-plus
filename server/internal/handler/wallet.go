package handler

import (
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"go-plus/server/internal/response"
	"go-plus/server/internal/service"
)

// WalletHandler 钱包处理器
type WalletHandler struct {
	walletService *service.WalletService
	logger        *zap.Logger
}

func NewWalletHandler(walletService *service.WalletService, logger *zap.Logger) *WalletHandler {
	return &WalletHandler{
		walletService: walletService,
		logger:        logger,
	}
}

// GetBalance GET /api/v1/wallet
func (h *WalletHandler) GetBalance(c *gin.Context) {
	userID := c.GetUint("user_id")

	balance, err := h.walletService.GetBalance(userID)
	if err != nil {
		if errors.Is(err, service.ErrWalletNotFound) {
			response.Error(c, response.CodeWalletNotFound, "Wallet not found")
			return
		}
		h.logger.Error("Failed to get wallet balance", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get wallet balance")
		return
	}

	response.Success(c, "success", balance)
}

// GetPaymentMethods GET /api/v1/wallet/payment-methods
func (h *WalletHandler) GetPaymentMethods(c *gin.Context) {
	methods, err := h.walletService.GetPaymentMethods()
	if err != nil {
		h.logger.Error("Failed to get payment methods", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get payment methods")
		return
	}

	response.Success(c, "success", methods)
}

// DepositRequest 充值请求
type DepositRequest struct {
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
}

// Deposit POST /api/v1/wallet/deposit
func (h *WalletHandler) Deposit(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req DepositRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	result, err := h.walletService.Deposit(userID, req.Amount, req.PaymentMethod)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrDepositBelowMin):
			response.Error(c, response.CodeDepositBelowMin, "Deposit amount below minimum limit")
		case errors.Is(err, service.ErrDepositAboveMax):
			response.Error(c, response.CodeDepositAboveMax, "Deposit amount above maximum limit")
		case errors.Is(err, service.ErrWalletNotFound):
			response.Error(c, response.CodeWalletNotFound, "Wallet not found")
		case errors.Is(err, service.ErrPaymentMethodNotFound):
			response.Error(c, response.CodePaymentMethodNotFound, "Payment method not available")
		default:
			h.logger.Error("Deposit failed", zap.Error(err))
			response.Error(c, response.CodeValidationError, "Deposit failed")
		}
		return
	}

	response.Success(c, "Deposit successful", result)
}

// WithdrawRequest 提现请求
type WithdrawRequest struct {
	Amount        float64           `json:"amount" binding:"required,gt=0"`
	PaymentMethod string            `json:"payment_method" binding:"required"`
	AccountInfo   map[string]string `json:"account_info"`
}

// Withdraw POST /api/v1/wallet/withdraw
func (h *WalletHandler) Withdraw(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req WithdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, response.CodeValidationError, "Invalid request parameters")
		return
	}

	result, err := h.walletService.Withdraw(userID, req.Amount, req.PaymentMethod, req.AccountInfo)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrWithdrawBelowMin):
			response.Error(c, response.CodeWithdrawBelowMin, "Withdrawal amount below minimum limit")
		case errors.Is(err, service.ErrWithdrawAboveMax):
			response.Error(c, response.CodeWithdrawAboveMax, "Withdrawal amount exceeds available balance")
		case errors.Is(err, service.ErrWalletNotFound):
			response.Error(c, response.CodeWalletNotFound, "Wallet not found")
		case errors.Is(err, service.ErrPaymentMethodNotFound):
			response.Error(c, response.CodePaymentMethodNotFound, "Payment method not available")
		default:
			h.logger.Error("Withdraw failed", zap.Error(err))
			response.Error(c, response.CodeValidationError, "Withdrawal failed")
		}
		return
	}

	response.Success(c, "Withdrawal request submitted", result)
}

// GetTransactions GET /api/v1/wallet/transactions
func (h *WalletHandler) GetTransactions(c *gin.Context) {
	userID := c.GetUint("user_id")

	txType := c.Query("type")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.walletService.GetTransactions(userID, txType, page, pageSize)
	if err != nil {
		h.logger.Error("Failed to get transactions", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get transactions")
		return
	}

	response.Success(c, "success", result)
}

// GetTransactionDetail GET /api/v1/wallet/transactions/:id
func (h *WalletHandler) GetTransactionDetail(c *gin.Context) {
	userID := c.GetUint("user_id")

	txID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, response.CodeValidationError, "Invalid transaction ID")
		return
	}

	result, err := h.walletService.GetTransactionByID(userID, uint(txID))
	if err != nil {
		if errors.Is(err, service.ErrTransactionNotFound) {
			response.Error(c, response.CodeTransactionNotFound, "Transaction not found")
			return
		}
		h.logger.Error("Failed to get transaction detail", zap.Error(err))
		response.Error(c, response.CodeValidationError, "Failed to get transaction detail")
		return
	}

	response.Success(c, "success", result)
}
