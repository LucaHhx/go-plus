package handler

// UpdateProfileRequest 更新个人资料请求
type UpdateProfileRequest struct {
	Nickname string `json:"nickname" binding:"required,min=2,max=20"`
}

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

// BindGoogleRequest 绑定 Google 账号请求
type BindGoogleRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}
