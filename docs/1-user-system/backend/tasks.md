# 任务清单

> 计划: user-system/backend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 搭建后端项目骨架(Go+Gin+GORM+SQLite+Zap+Viper) | 已完成 | 2026-03-04 | 2026-03-04 | Go+Gin+GORM+SQLite+Zap+Viper 项目骨架搭建完成，编译通过 |
| 2 | 实现统一响应格式和错误码体系 | 已完成 | 2026-03-04 | 2026-03-04 | response.go 实现统一 JSON 响应格式和 7 个错误码(0/1001-1007) |
| 3 | 设计并迁移users/otp_records/user_bonuses表 | 已完成 | 2026-03-04 | 2026-03-04 | GORM AutoMigrate 自动创建 users/otp_records/user_bonuses/wallets 表 |
| 4 | 实现SMSProvider接口和Mock实现(固定验证码123456) | 已完成 | 2026-03-04 | 2026-03-04 | MockSMSProvider 实现，固定验证码 123456，zap 日志输出 |
| 5 | 实现OAuthProvider接口和Mock实现(跳过Google验证) | 已完成 | 2026-03-04 | 2026-03-04 | MockOAuthProvider 实现，跳过 Google Token 验证，支持 base64 JSON 解析 mock 用户信息 |
| 6 | 实现POST /api/v1/auth/send-otp端点 | 已完成 | 2026-03-04 | 2026-03-04 | send-otp 端点实现，含手机号格式校验(+91)和 OTP 记录持久化 |
| 7 | 实现POST /api/v1/auth/register端点(含注册奖励发放) | 已完成 | 2026-03-04 | 2026-03-04 | register 端点实现，含 OTP 验证+bcrypt 加密+钱包创建+welcome bonus+free_spin 发放 |
| 8 | 实现POST /api/v1/auth/login端点(手机号+密码) | 已完成 | 2026-03-04 | 2026-03-04 | login 端点实现，手机号+密码登录，bcrypt 校验+JWT 签发+last_login_at 更新 |
| 9 | 实现POST /api/v1/auth/login-otp端点 | 已完成 | 2026-03-04 | 2026-03-04 | login-otp 端点实现，OTP 验证后签发 JWT |
| 10 | 实现POST /api/v1/auth/google端点 | 已完成 | 2026-03-04 | 2026-03-04 | google 端点实现，Mock 模式跳过验证，自动创建新用户并发放欢迎奖励 |
| 11 | 实现JWT签发和验证中间件(HS256,24h有效期) | 已完成 | 2026-03-04 | 2026-03-04 | JWT HS256 签发/验证+Auth 中间件，24h 有效期，payload 含 user_id/role/market_code |
| 12 | 实现GET /api/v1/auth/me端点 | 已完成 | 2026-03-04 | 2026-03-04 | GET /auth/me 端点实现，联查 users+wallets 表返回完整用户信息(含 balance/bonus_balance) |
| 13 | 注册时联动创建钱包记录(balance=0,bonus=100) | 已完成 | 2026-03-04 | 2026-03-04 | 注册事务中联动创建钱包(balance=0,bonus_balance=100) |