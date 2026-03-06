package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 错误码定义
const (
	CodeSuccess            = 0
	CodeValidationError    = 1001
	CodePhoneRegistered    = 1002
	CodeOTPFailed          = 1003
	CodeInvalidCredentials = 1004
	CodeUserDisabled       = 1005
	CodeTokenInvalid       = 1006
	CodeGoogleAuthFailed   = 1007
	CodeFileTooLarge       = 1008
	CodeImageProcessFailed = 1009
	CodePasswordMismatch   = 1010
	CodePasswordWeak       = 1011
	CodeGoogleAlreadyBound = 1012
	CodeAlreadyBoundGoogle = 1013
	CodeGoogleNotBound     = 1014
	CodeGoogleOnlyLogin    = 1015

	// 管理后台错误码
	CodeAdminInvalidCredentials = 4001
	CodeAdminTokenInvalid       = 4002
	CodeAdminForbidden          = 4003
	CodeAdminUserNotFound       = 4004
	CodeAdminGameNotFound       = 4005
	CodeAdminTxNotFound         = 4006
	CodeAdminWithdrawalStatus   = 4007
	CodeAdminBannerNotFound     = 4008

	// 钱包相关错误码
	CodeDepositBelowMin       = 2001
	CodeDepositAboveMax       = 2002
	CodeWithdrawBelowMin      = 2003
	CodeWithdrawAboveMax      = 2004
	CodeWalletNotFound        = 2005
	CodePaymentMethodNotFound = 2006
	CodeTransactionNotFound   = 2007
)

// 错误码对应的 HTTP 状态码
var codeHTTPStatus = map[int]int{
	CodeSuccess:            http.StatusOK,
	CodeValidationError:    http.StatusBadRequest,
	CodePhoneRegistered:    http.StatusConflict,
	CodeOTPFailed:          http.StatusBadRequest,
	CodeInvalidCredentials: http.StatusUnauthorized,
	CodeUserDisabled:       http.StatusForbidden,
	CodeTokenInvalid:       http.StatusUnauthorized,
	CodeGoogleAuthFailed:   http.StatusUnauthorized,
	CodeFileTooLarge:       http.StatusBadRequest,
	CodeImageProcessFailed: http.StatusInternalServerError,
	CodePasswordMismatch:   http.StatusBadRequest,
	CodePasswordWeak:       http.StatusBadRequest,
	CodeGoogleAlreadyBound: http.StatusConflict,
	CodeAlreadyBoundGoogle: http.StatusConflict,
	CodeGoogleNotBound:     http.StatusBadRequest,
	CodeGoogleOnlyLogin:    http.StatusBadRequest,

	CodeAdminInvalidCredentials: http.StatusUnauthorized,
	CodeAdminTokenInvalid:       http.StatusUnauthorized,
	CodeAdminForbidden:          http.StatusForbidden,
	CodeAdminUserNotFound:       http.StatusNotFound,
	CodeAdminGameNotFound:       http.StatusNotFound,
	CodeAdminTxNotFound:         http.StatusNotFound,
	CodeAdminWithdrawalStatus:   http.StatusBadRequest,
	CodeAdminBannerNotFound:     http.StatusNotFound,

	CodeDepositBelowMin:       http.StatusBadRequest,
	CodeDepositAboveMax:       http.StatusBadRequest,
	CodeWithdrawBelowMin:      http.StatusBadRequest,
	CodeWithdrawAboveMax:      http.StatusBadRequest,
	CodeWalletNotFound:        http.StatusNotFound,
	CodePaymentMethodNotFound: http.StatusBadRequest,
	CodeTransactionNotFound:   http.StatusNotFound,
}

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// Success 成功响应
func Success(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: message,
		Data:    data,
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	httpStatus := http.StatusInternalServerError
	if status, ok := codeHTTPStatus[code]; ok {
		httpStatus = status
	}
	c.JSON(httpStatus, Response{
		Code:    code,
		Message: message,
		Data:    nil,
	})
}
