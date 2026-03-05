# 后端技术方案 -- 用户系统

> 需求: user-system | 角色: backend

## 期次分类概览

> **第一期 = 全功能实现 (核心交易链路)。** 用户系统全部 API 在第一期真实实现。

### 一期全功能 API

| API | 说明 | 数据来源 |
|-----|------|----------|
| POST /api/v1/auth/send-otp | 发送 OTP | otp_records 表 (Mock SMS: 固定 123456) |
| POST /api/v1/auth/register | 注册 | users/wallets/user_bonuses 表 |
| POST /api/v1/auth/login | 密码登录 | users 表 bcrypt 校验 |
| POST /api/v1/auth/login-otp | OTP 登录 | users + otp_records 表 |
| POST /api/v1/auth/google | Google 登录 | Mock: 跳过 Token 验证，创建用户 |
| GET /api/v1/auth/me | 当前用户信息 | users + wallets 表联查 |
| POST /api/v1/auth/logout | 登出 | 前端清除 Token |

### 外部服务 Mock (一期)

| 服务 | Mock 行为 | 后续替换为 |
|------|-----------|-----------|
| SMS OTP | 固定验证码 123456，控制台打印 | 真实短信网关 (Twilio/MSG91) |
| Google OAuth | 跳过 Token 验证，解析 mock 信息 | 真实 Google OAuth 验证 |

## 技术栈

| 组件 | 选型 | 说明 |
|------|------|------|
| 语言 | Go 1.25+ | |
| 框架 | Gin | HTTP 路由与中间件 |
| ORM | GORM + SQLite | 数据持久化 |
| 认证 | golang-jwt/jwt v5 | JWT 单 Token 方案 (24h) |
| 校验 | go-playground/validator v10 | 请求参数校验 |
| 日志 | Zap | 结构化日志 |
| 配置 | Viper | YAML 配置管理 |

## 数据模型

### users 表

```sql
CREATE TABLE users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    phone           VARCHAR(20) UNIQUE NOT NULL,       -- +91XXXXXXXXXX 格式
    password_hash   VARCHAR(255) NOT NULL,
    nickname        VARCHAR(50) DEFAULT '',
    avatar_url      VARCHAR(500) DEFAULT '',
    google_id       VARCHAR(100) UNIQUE,               -- Google OAuth 关联
    google_email    VARCHAR(255) DEFAULT '',
    role            VARCHAR(20) DEFAULT 'user',        -- user / admin
    status          VARCHAR(20) DEFAULT 'active',      -- active / disabled
    market_code     VARCHAR(10) DEFAULT 'IN',          -- 多市场预留
    last_login_at   DATETIME,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    deleted_at      DATETIME                           -- GORM 软删除
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_market_code ON users(market_code);
```

### user_bonuses 表 (欢迎奖励记录)

```sql
CREATE TABLE user_bonuses (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    bonus_type      VARCHAR(50) NOT NULL,              -- welcome / free_spin
    amount          DECIMAL(10,2) DEFAULT 0,           -- Bonus 金额 (100 for welcome)
    game_slug       VARCHAR(100) DEFAULT '',           -- 赠送游戏标识 (aviator/money-coming)
    status          VARCHAR(20) DEFAULT 'pending',     -- pending / claimed / expired
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### otp_records 表 (OTP 验证码记录)

```sql
CREATE TABLE otp_records (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    phone           VARCHAR(20) NOT NULL,
    code            VARCHAR(10) NOT NULL,
    purpose         VARCHAR(20) NOT NULL,              -- register / login
    verified        BOOLEAN DEFAULT FALSE,
    expires_at      DATETIME NOT NULL,
    created_at      DATETIME NOT NULL
);

CREATE INDEX idx_otp_phone_purpose ON otp_records(phone, purpose);
```

## API 设计

基础路径: `/api/v1`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/v1/auth/send-otp | 发送 OTP 验证码 | 否 |
| POST | /api/v1/auth/register | 手机号+密码+OTP 注册 | 否 |
| POST | /api/v1/auth/login | 手机号+密码登录 | 否 |
| POST | /api/v1/auth/login-otp | 手机号+OTP 快捷登录 | 否 |
| POST | /api/v1/auth/google | Google 登录/注册 | 否 |
| GET  | /api/v1/auth/me | 获取当前用户信息 | 是 |
| POST | /api/v1/auth/logout | 登出 (前端清除 Token) | 是 |

### 统一响应格式

```json
{
    "code": 0,
    "message": "success",
    "data": {}
}
```

错误码:
- 0: 成功
- 1001: 参数校验失败
- 1002: 手机号已注册
- 1003: OTP 验证失败
- 1004: 用户名或密码错误
- 1005: 用户已被禁用
- 1006: Token 无效或过期
- 1007: Google 登录验证失败

### POST /api/v1/auth/send-otp

```json
// Request
{ "phone": "+911234567890", "purpose": "register" }
// Response
{ "code": 0, "message": "OTP sent successfully", "data": { "expires_in": 300 } }
```

### POST /api/v1/auth/register

```json
// Request
{
    "phone": "+911234567890",
    "password": "MyPassword123",
    "otp": "123456",
    "gift_game": "aviator"
}
// Response
{
    "code": 0,
    "message": "Registration successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
            "id": 1, "phone": "+911234567890", "nickname": "",
            "avatar_url": "", "role": "user", "market_code": "IN",
            "created_at": "2026-03-04T10:00:00Z"
        },
        "welcome_bonus": { "amount": 100, "gift_game": "aviator" }
    }
}
```

### POST /api/v1/auth/login

```json
// Request
{ "phone": "+911234567890", "password": "MyPassword123" }
// Response
{
    "code": 0, "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
            "id": 1, "phone": "+911234567890", "nickname": "Player001",
            "avatar_url": "", "role": "user", "market_code": "IN",
            "created_at": "2026-03-04T10:00:00Z"
        }
    }
}
```

### POST /api/v1/auth/login-otp

```json
// Request
{ "phone": "+911234567890", "otp": "123456" }
// Response 同 login
```

### POST /api/v1/auth/google

```json
// Request
{ "id_token": "google-oauth-id-token-string" }
// Response 同 login (新用户自动创建账户并发放欢迎奖励)
```

### GET /api/v1/auth/me

```json
{
    "code": 0, "message": "success",
    "data": {
        "id": 1, "phone": "+911234567890", "nickname": "Player001",
        "avatar_url": "", "google_email": "", "role": "user",
        "market_code": "IN", "balance": 1000.00, "bonus_balance": 100.00,
        "created_at": "2026-03-04T10:00:00Z"
    }
}
```

## 业务逻辑

### 注册流程

1. 前端调用 send-otp，后端生成 OTP 存入 otp_records，Mock 实现固定返回 `123456` 并在控制台打印
2. 前端调用 register，后端校验 OTP、检查手机号唯一性、bcrypt 加密密码、创建用户
3. 自动创建钱包 (balance=0, bonus_balance=100)
4. 创建 welcome bonus 记录；如果选择 gift_game 创建 free_spin 记录
5. 签发 JWT Token 返回

### 登录流程

1. 手机号+密码: 查询用户 -> bcrypt 校验密码 -> 更新 last_login_at -> 签发 JWT
2. OTP 登录: 查询用户 -> 校验 OTP -> 更新 last_login_at -> 签发 JWT
3. Google 登录: Mock 实现跳过 Token 验证，解析模拟用户信息；查找 google_id 关联用户或自动创建

### GET /auth/me 联查逻辑

- 查询 users 表获取基本信息
- JOIN wallets 表获取 balance 和 bonus_balance (这两个字段存在 wallets 表中，不在 users 表)
- 合并返回完整的用户信息对象

### JWT 设计

- 算法: HS256
- 有效期: 24 小时
- Payload: `{ user_id, role, market_code, exp, iat }`
- Secret: 从 Viper 配置读取

### Mock 策略

| 外部服务 | Interface | Mock 行为 |
|----------|-----------|-----------|
| 短信 OTP | `SMSProvider` | 固定验证码 `123456`，控制台打印 |
| Google OAuth | `OAuthProvider` | 跳过 Token 验证，解析 mock 用户信息 |

```go
type SMSProvider interface {
    SendOTP(phone string, code string) error
}

type OAuthProvider interface {
    VerifyGoogleToken(idToken string) (*GoogleUserInfo, error)
}
```

## 关键决策

- JWT 单 Token 24h 有效期: 简化实现，前端存 localStorage，过期后重新登录
- OTP 有效期 5 分钟，Mock 模式固定验证码 `123456`
- 密码要求: 最少 6 位，包含字母和数字
- 手机号格式限定 +91 开头（印度市场）
- 数据库 market_code 字段预留多市场扩展

## 依赖与约束

- 本模块是其他所有模块的基础依赖（钱包、游戏等都需要用户身份）
- 注册时联动创建钱包记录（依赖钱包模块 Service）
