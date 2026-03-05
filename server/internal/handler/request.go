package handler

// SendOTPRequest 发送 OTP 请求
type SendOTPRequest struct {
	Phone   string `json:"phone" binding:"required"`
	Purpose string `json:"purpose" binding:"required,oneof=register login"`
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	OTP      string `json:"otp" binding:"required,len=6"`
	GiftGame string `json:"gift_game" binding:"omitempty,oneof=aviator money-coming"`
}

// LoginRequest 手机号+密码登录请求
type LoginRequest struct {
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginOTPRequest OTP 登录请求
type LoginOTPRequest struct {
	Phone string `json:"phone" binding:"required"`
	OTP   string `json:"otp" binding:"required,len=6"`
}

// GoogleLoginRequest Google 登录请求
type GoogleLoginRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}
