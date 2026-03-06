package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go-plus/server/internal/config"
)

var (
	ErrTokenExpired = errors.New("token has expired")
	ErrTokenInvalid = errors.New("token is invalid")
)

// JWTClaims JWT 负载
type JWTClaims struct {
	UserID          uint   `json:"user_id"`
	Role            string `json:"role"`
	MarketCode      string `json:"market_code"`
	PasswordVersion int    `json:"pwd_ver"`
	jwt.RegisteredClaims
}

// JWTService JWT 签发和验证服务
type JWTService struct {
	secret      []byte
	expireHours int
}

func NewJWTService(cfg *config.JWTConfig) *JWTService {
	return &JWTService{
		secret:      []byte(cfg.Secret),
		expireHours: cfg.ExpireHours,
	}
}

// GenerateToken 签发 JWT Token
func (s *JWTService) GenerateToken(userID uint, role string, marketCode string, pwdVer int) (string, error) {
	now := time.Now()
	claims := JWTClaims{
		UserID:          userID,
		Role:            role,
		MarketCode:      marketCode,
		PasswordVersion: pwdVer,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(s.expireHours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.secret)
}

// ParseToken 解析并验证 JWT Token
func (s *JWTService) ParseToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrTokenInvalid
		}
		return s.secret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrTokenExpired
		}
		return nil, ErrTokenInvalid
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, ErrTokenInvalid
	}

	return claims, nil
}
