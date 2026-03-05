package provider

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"

	"go.uber.org/zap"
)

// GoogleUserInfo Google 用户信息
type GoogleUserInfo struct {
	GoogleID string `json:"sub"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
}

// OAuthProvider OAuth 验证接口
type OAuthProvider interface {
	VerifyGoogleToken(idToken string) (*GoogleUserInfo, error)
}

// MockOAuthProvider Mock 实现，跳过 Token 验证，解析 mock 用户信息
type MockOAuthProvider struct {
	logger *zap.Logger
}

func NewMockOAuthProvider(logger *zap.Logger) *MockOAuthProvider {
	return &MockOAuthProvider{logger: logger}
}

func (m *MockOAuthProvider) VerifyGoogleToken(idToken string) (*GoogleUserInfo, error) {
	m.logger.Info("[MOCK OAuth] Verifying Google token (mock mode)")

	// Try to decode the token as a base64 JSON payload (for testing convenience)
	// Format: base64({"sub":"google-id","email":"user@gmail.com","name":"Test User"})
	parts := strings.Split(idToken, ".")
	var payload string
	if len(parts) >= 2 {
		// JWT-like format: header.payload.signature
		payload = parts[1]
	} else {
		// Plain base64
		payload = idToken
	}

	// Add padding if needed
	switch len(payload) % 4 {
	case 2:
		payload += "=="
	case 3:
		payload += "="
	}

	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		// If decode fails, return mock data
		m.logger.Info("[MOCK OAuth] Using default mock user info")
		return &GoogleUserInfo{
			GoogleID: fmt.Sprintf("google-mock-%s", idToken[:min(8, len(idToken))]),
			Email:    "mockuser@gmail.com",
			Name:     "Mock User",
			Picture:  "",
		}, nil
	}

	var info GoogleUserInfo
	if err := json.Unmarshal(decoded, &info); err != nil {
		m.logger.Info("[MOCK OAuth] Using default mock user info (JSON parse failed)")
		return &GoogleUserInfo{
			GoogleID: fmt.Sprintf("google-mock-%s", idToken[:min(8, len(idToken))]),
			Email:    "mockuser@gmail.com",
			Name:     "Mock User",
			Picture:  "",
		}, nil
	}

	if info.GoogleID == "" {
		info.GoogleID = fmt.Sprintf("google-mock-%s", idToken[:min(8, len(idToken))])
	}

	m.logger.Info("[MOCK OAuth] Google user info parsed",
		zap.String("google_id", info.GoogleID),
		zap.String("email", info.Email),
	)

	return &info, nil
}
