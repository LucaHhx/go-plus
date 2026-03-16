package handler

import (
	"regexp"
)

var phoneRegex = regexp.MustCompile(`^\+62\d{9,12}$`)

// validatePhone 验证手机号格式 (+62XXXXXXXXX ~ +62XXXXXXXXXXXX)
func validatePhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}

// validatePassword 验证密码: 最少 6 位，包含字母和数字
func validatePassword(password string) bool {
	if len(password) < 6 {
		return false
	}
	hasLetter := false
	hasDigit := false
	for _, c := range password {
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') {
			hasLetter = true
		}
		if c >= '0' && c <= '9' {
			hasDigit = true
		}
	}
	return hasLetter && hasDigit
}
