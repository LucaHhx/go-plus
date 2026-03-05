package provider

import (
	"go.uber.org/zap"
)

// SMSProvider 短信发送接口
type SMSProvider interface {
	SendOTP(phone string, code string) error
}

// MockSMSProvider Mock 实现，固定验证码 123456，控制台打印
type MockSMSProvider struct {
	logger *zap.Logger
}

func NewMockSMSProvider(logger *zap.Logger) *MockSMSProvider {
	return &MockSMSProvider{logger: logger}
}

func (m *MockSMSProvider) SendOTP(phone string, code string) error {
	m.logger.Info("[MOCK SMS] OTP sent",
		zap.String("phone", phone),
		zap.String("code", code),
	)
	return nil
}
