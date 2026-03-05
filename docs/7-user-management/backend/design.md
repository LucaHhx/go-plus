# 后端技术方案 -- 用户管理

> 需求: 7-user-management | 角色: backend

## 与 1-user-system 的复用关系

本需求在 1-user-system 已有基础设施上扩展，不修改已有 API 的行为，仅新增端点和扩展数据模型。

| 复用项 | 来源 | 说明 |
|--------|------|------|
| users 表 | 1-user-system | 新增 password_version 字段 |
| JWT 鉴权 | 1-user-system | JWTClaims 新增 pwd_ver 字段 |
| AuthMiddleware | 1-user-system | 扩展 pwd_ver 校验逻辑 |
| UserService | 1-user-system | 新增 Profile/Password/Google 相关方法 |
| POST /auth/logout | 1-user-system | 已实现，前端调用即可 |
| GET /auth/me | 1-user-system | 已实现，前端调用即可 |
| 静态资源服务 | 1-user-system | `r.Static("/assets", "./assets")` 复用 |

## 技术栈

沿用项目标准栈，无新增依赖:

| 组件 | 选型 | 说明 |
|------|------|------|
| 语言 | Go 1.25+ | |
| 框架 | Gin | HTTP 路由与中间件 |
| ORM | GORM + SQLite | 数据持久化 |
| 认证 | golang-jwt/jwt v5 | JWT Token 鉴权 |
| 校验 | go-playground/validator v10 | 请求参数校验 |
| 日志 | Zap | 结构化日志 |
| 图片处理 | Go 标准库 image/* + golang.org/x/image/webp | 头像裁剪和 WebP 编码 |

## 数据模型扩展

### users 表变更

在已有 users 表基础上新增一个字段:

```sql
ALTER TABLE users ADD COLUMN password_version INTEGER DEFAULT 0;
```

GORM Model 修改:

```go
type User struct {
    // ... 已有字段保持不变 ...
    PasswordVersion int `gorm:"default:0" json:"-"`
}
```

**说明:** `password_version` 每次修改密码时 +1，用于 JWT pwd_ver 校验实现"其他设备自动失效"。

### 无新增表

本需求不创建新表，所有数据存储复用已有 users 表。头像文件存储到文件系统 `./assets/uploads/avatars/`。

## API 设计

基础路径: `/api/v1`

所有新增 API 均需要认证 (AuthMiddleware)。

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| PUT | /api/v1/user/profile | 更新个人资料 (昵称) | 是 |
| POST | /api/v1/user/avatar | 上传头像 | 是 |
| PUT | /api/v1/user/password | 修改密码 | 是 |
| POST | /api/v1/user/google/bind | 绑定 Google 账号 | 是 |
| POST | /api/v1/user/google/unbind | 解绑 Google 账号 | 是 |

### PUT /api/v1/user/profile

更新用户昵称。

```json
// Request
{ "nickname": "Player001" }

// Response (成功)
{
    "code": 0,
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "phone": "+911234567890",
        "nickname": "Player001",
        "avatar_url": "/assets/uploads/avatars/1_1709654400.webp",
        "google_email": "",
        "role": "user",
        "market_code": "IN",
        "balance": 1000.00,
        "bonus_balance": 100.00,
        "created_at": "2026-03-04T10:00:00Z"
    }
}
```

校验规则:
- nickname: 2-20 字符，允许字母、数字、下划线，不能为空

### POST /api/v1/user/avatar

上传并更换头像。接收 multipart/form-data。

```
// Request
Content-Type: multipart/form-data
Field: avatar (file)

// Response (成功)
{
    "code": 0,
    "message": "Avatar uploaded successfully",
    "data": {
        "avatar_url": "/assets/uploads/avatars/1_1709654400.webp"
    }
}
```

处理逻辑:
1. 校验文件格式: 仅接受 JPEG、PNG、WebP
2. 校验文件大小: 最大 2MB
3. 解码图片，缩放为 200x200 正方形 (居中裁剪)
4. 编码为 WebP 格式 (质量 85)
5. 保存到 `./assets/uploads/avatars/{user_id}_{timestamp}.webp`
6. 删除该用户旧头像文件 (如果存在)
7. 更新 users 表 avatar_url 字段
8. 返回新的 avatar_url

错误码:
- 1001: 参数校验失败 (文件格式不支持)
- 1008: 文件大小超限 (>2MB)
- 1009: 图片处理失败

### PUT /api/v1/user/password

修改密码。支持两种场景:
- 有密码的用户: 需要验证 current_password
- 无密码的 Google-only 用户: 首次设置密码，无需 current_password

```json
// Request (已有密码用户)
{
    "current_password": "OldPassword123",
    "new_password": "NewPassword456",
    "confirm_password": "NewPassword456"
}

// Request (Google-only 用户首次设置密码)
{
    "new_password": "NewPassword456",
    "confirm_password": "NewPassword456"
}

// Response (成功)
{
    "code": 0,
    "message": "Password updated successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

处理逻辑:
1. 判断用户是否有密码 (password_hash 非空)
2. 有密码: 校验 current_password 正确性 (bcrypt compare)
3. 无密码 (Google-only): 跳过 current_password 校验
4. 校验 new_password 与 confirm_password 一致
5. 校验 new_password 强度 (>=6 位，含字母和数字)
6. bcrypt 加密新密码，更新 password_hash
7. password_version +1
8. 签发新 JWT (包含新的 pwd_ver)
9. 返回新 Token (当前设备使用)

错误码:
- 1001: 参数校验失败
- 1004: 当前密码错误
- 1010: 新密码与确认密码不一致
- 1011: 新密码强度不足

### POST /api/v1/user/google/bind

绑定 Google 账号。

```json
// Request
{ "id_token": "google-oauth-id-token-string" }

// Response (成功)
{
    "code": 0,
    "message": "Google account bound successfully",
    "data": {
        "google_email": "user@gmail.com"
    }
}
```

处理逻辑:
1. 验证 Google id_token (Mock: 解析模拟信息)
2. 检查该 Google ID 是否已被其他用户绑定
3. 检查当前用户是否已绑定其他 Google 账号
4. 更新 users 表 google_id 和 google_email 字段

错误码:
- 1007: Google Token 验证失败
- 1012: 该 Google 账号已被其他用户绑定
- 1013: 当前用户已绑定 Google 账号

### POST /api/v1/user/google/unbind

解绑 Google 账号。

```json
// Request (无需请求体)
{}

// Response (成功)
{
    "code": 0,
    "message": "Google account unbound successfully",
    "data": null
}
```

处理逻辑:
1. 检查用户是否已绑定 Google 账号
2. 检查用户是否有密码 (password_hash 非空)
3. 如果无密码且唯一登录方式为 Google: 拒绝解绑，提示先设置密码
4. 清除 users 表 google_id 和 google_email 字段

错误码:
- 1014: 未绑定 Google 账号
- 1015: Google 是唯一登录方式，请先设置密码后再解绑

## JWT 扩展

### JWTClaims 新增字段

```go
type JWTClaims struct {
    UserID          uint   `json:"user_id"`
    Role            string `json:"role"`
    MarketCode      string `json:"market_code"`
    PasswordVersion int    `json:"pwd_ver"`  // 新增
    jwt.RegisteredClaims
}
```

### GenerateToken 签名变更

```go
func (s *JWTService) GenerateToken(userID uint, role string, marketCode string, pwdVer int) (string, error) {
    claims := JWTClaims{
        UserID:          userID,
        Role:            role,
        MarketCode:      marketCode,
        PasswordVersion: pwdVer,
        // ...
    }
    // ...
}
```

**注意:** GenerateToken 增加 pwdVer 参数，所有现有调用点 (Register, Login, LoginOTP, GoogleLogin) 需要同步传入 `user.PasswordVersion`。

### AuthMiddleware 扩展

```go
// 在现有 AuthMiddleware 中增加 pwd_ver 校验
func AuthMiddleware(jwtService *JWTService) gin.HandlerFunc {
    return func(c *gin.Context) {
        // ... 现有 Token 解析逻辑 ...

        // 新增: 查询用户当前 password_version，与 Token 中的 pwd_ver 比对
        // 如果不一致，返回 401 (Token 已失效，密码已变更)
        // 注意: 仅在 pwd_ver > 0 时校验 (向后兼容旧 Token)
    }
}
```

**向后兼容:** 已有的不含 pwd_ver 字段的 Token (pwd_ver 为零值 0)，当用户 password_version 也为 0 时正常通过。用户修改密码后 password_version 变为 1，旧 Token 中 pwd_ver=0 不匹配，自动失效。

## 路由注册

在 `server/internal/handler/router.go` 中新增路由组:

```go
// 用户管理端点 (全部需要认证)
user := v1.Group("/user")
user.Use(middleware.AuthMiddleware(jwtService))
{
    user.PUT("/profile", userMgmtHandler.UpdateProfile)
    user.POST("/avatar", userMgmtHandler.UploadAvatar)
    user.PUT("/password", userMgmtHandler.ChangePassword)
    user.POST("/google/bind", userMgmtHandler.BindGoogle)
    user.POST("/google/unbind", userMgmtHandler.UnbindGoogle)
}
```

## 文件存储

```
assets/
└── uploads/
    └── avatars/
        ├── 1_1709654400.webp    -- 用户 ID_时间戳.webp
        ├── 2_1709654500.webp
        └── ...
```

- 文件命名: `{user_id}_{unix_timestamp}.webp`
- 上传新头像时删除该用户旧头像文件
- 目录 `assets/uploads/avatars/` 在首次上传时自动创建 (os.MkdirAll)
- 通过已有 `r.Static("/assets", "./assets")` 直接访问

## 代码结构

```
server/internal/
├── handler/
│   ├── user_mgmt.go          -- 新增: 用户管理 Handler
│   ├── user_mgmt_request.go  -- 新增: 请求结构体
│   └── router.go             -- 修改: 新增 /user 路由组
├── service/
│   ├── user.go               -- 修改: 新增 Profile/Password/Google 方法
│   └── jwt.go                -- 修改: JWTClaims 增加 pwd_ver
├── middleware/
│   └── auth.go               -- 修改: 增加 pwd_ver 校验
└── model/
    └── user.go               -- 修改: User 增加 PasswordVersion 字段
```

## 错误码汇总

| 错误码 | 说明 | 使用场景 |
|--------|------|----------|
| 1001 | 参数校验失败 | 通用参数错误 |
| 1004 | 用户名或密码错误 | 当前密码验证失败 |
| 1006 | Token 无效或过期 | pwd_ver 不匹配 |
| 1007 | Google 登录验证失败 | Google Token 无效 |
| 1008 | 文件大小超限 | 头像 > 2MB |
| 1009 | 图片处理失败 | 头像解码/编码错误 |
| 1010 | 密码不一致 | new_password != confirm_password |
| 1011 | 密码强度不足 | 不满足 >=6位 含字母数字 |
| 1012 | Google 已被绑定 | 该 Google ID 关联到其他用户 |
| 1013 | 已绑定 Google | 当前用户已有 Google 关联 |
| 1014 | 未绑定 Google | 用户无 Google 关联，无法解绑 |
| 1015 | 唯一登录方式 | Google 是唯一方式，需先设密码 |

## 关键决策

1. **头像本地文件存储:** MVP 阶段使用 `./assets/uploads/avatars/` 本地存储，复用已有 Static 服务，零外部依赖。后续可迁移到 S3/OSS，仅需改存储逻辑，API 接口不变。

2. **password_version + JWT pwd_ver:** 修改密码后通过 version 不匹配使旧 Token 失效，实现"其他设备自动登出"。不引入 Redis Token 黑名单，SQLite 本地查询 password_version 性能足够。

3. **Google 解绑安全约束:** 如果 Google 是用户唯一登录方式 (无密码)，解绑前必须先设置密码，避免用户被锁定在账户外。

4. **头像处理:** 后端统一裁剪为 200x200 WebP 格式，保证一致性和存储效率。前端使用 react-easy-crop 做客户端预裁剪，减少后端处理压力。

5. **向后兼容:** pwd_ver 校验对旧 Token (不含 pwd_ver) 向后兼容。PasswordVersion 默认值 0，旧 Token 的 pwd_ver 零值也为 0，正常通过。

## 依赖与约束

- 本模块依赖 1-user-system 的 UserService、JWTService、AuthMiddleware
- 修改 GenerateToken 签名会影响所有现有调用点 (Register, Login, LoginOTP, GoogleLogin)，需要同步更新
- 头像文件目录需要写权限
- 图片处理使用 Go 标准库，不引入第三方图片处理库 (golang.org/x/image 用于 WebP 编码)
