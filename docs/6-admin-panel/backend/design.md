# 后端技术方案 -- 管理后台

> 需求: admin-panel | 角色: backend

## 期次分类概览

> **第一期 = 全功能实现。** 管理后台全部 API 在第一期真实实现。

### 一期全功能 API

| API 组 | 包含端点 | 说明 |
|--------|----------|------|
| 认证 | POST /admin/auth/login, GET /admin/auth/me | 管理员登录 |
| Dashboard | GET /admin/dashboard/stats | 运营数据概览 |
| 用户管理 | GET /admin/users, GET /admin/users/:id, PUT /admin/users/:id/status | 用户 CRUD |
| 游戏管理 | GET/PUT /admin/games, GET/POST/PUT /admin/providers | 游戏+供应商管理 |
| 交易管理 | GET /admin/transactions, GET/PUT /admin/withdrawals | 交易+提现审核 |
| 内容管理 | GET/POST/PUT/DELETE /admin/banners | Banner CRUD |
| 系统配置 | GET/PUT /admin/config | 系统参数 |

## 技术栈

同项目统一技术栈: Go + Gin + GORM + SQLite + Zap

管理后台 API 与客户端 API 共用后端服务，路由前缀 `/api/admin`，JWT role 隔离。

## 数据模型

### admin_users 表

管理员独立账号体系:

```sql
CREATE TABLE admin_users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    nickname        VARCHAR(50) DEFAULT '',
    role            VARCHAR(20) DEFAULT 'operator',    -- super_admin / admin / operator
    status          VARCHAR(20) DEFAULT 'active',
    last_login_at   DATETIME,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### admin_operation_logs 表

```sql
CREATE TABLE admin_operation_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id        INTEGER NOT NULL,
    action          VARCHAR(100) NOT NULL,             -- user.disable, withdrawal.approve 等
    target_type     VARCHAR(50) DEFAULT '',
    target_id       INTEGER DEFAULT 0,
    detail          TEXT DEFAULT '',                   -- JSON 操作详情
    ip_address      VARCHAR(50) DEFAULT '',
    created_at      DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);
CREATE INDEX idx_admin_logs_admin ON admin_operation_logs(admin_id, created_at DESC);
```

## API 设计

### 错误码

- 4001: 管理员用户名或密码错误
- 4002: 管理员 Token 无效或过期
- 4003: 权限不足 (role 不够)
- 4004: 目标用户不存在
- 4005: 目标游戏不存在
- 4006: 目标交易不存在
- 4007: 提现状态不允许审核 (非 pending)
- 4008: Banner 不存在

### 认证

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/admin/auth/login | 管理员登录 | 否 |
| GET | /api/admin/auth/me | 当前管理员信息 | Admin JWT |

### Dashboard

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/dashboard/stats | 运营数据概览 |

### 用户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/users | 用户列表 (搜索/分页) |
| GET | /api/admin/users/:id | 用户详情 (含余额+交易) |
| PUT | /api/admin/users/:id/status | 启用/禁用用户 |

### 游戏管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/games | 游戏列表 |
| PUT | /api/admin/games/:id | 编辑游戏 |
| PUT | /api/admin/games/:id/status | 上架/下架 |
| GET | /api/admin/providers | 供应商列表 |
| POST | /api/admin/providers | 添加供应商 |
| PUT | /api/admin/providers/:id | 编辑供应商 |
| PUT | /api/admin/providers/:id/status | 启用/禁用供应商 |

### 交易管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/transactions | 交易记录 |
| GET | /api/admin/withdrawals/pending | 待审核提现 |
| PUT | /api/admin/withdrawals/:id/approve | 审核通过 |
| PUT | /api/admin/withdrawals/:id/reject | 审核拒绝 |

### 内容管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/banners | Banner 列表 |
| POST | /api/admin/banners | 添加 Banner |
| PUT | /api/admin/banners/:id | 编辑 Banner |
| DELETE | /api/admin/banners/:id | 删除 Banner |

### 系统配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/config | 获取配置 |
| PUT | /api/admin/config | 更新配置 |

### 关键接口示例

**POST /api/admin/auth/login**
```json
// Request
{ "username": "admin", "password": "admin123" }
// Response
{
    "code": 0, "message": "Login successful",
    "data": {
        "token": "eyJ...",
        "admin": { "id": 1, "username": "admin", "nickname": "Super Admin", "role": "super_admin" }
    }
}
```

**GET /api/admin/dashboard/stats**
```json
{
    "code": 0, "message": "success",
    "data": {
        "today": { "new_users": 150, "active_users": 1200, "total_deposits": 500000.00, "total_withdrawals": 200000.00, "pending_withdrawals": 5 },
        "week": { "new_users": 800, "active_users": 5000, "total_deposits": 3000000.00, "total_withdrawals": 1200000.00 },
        "total": { "users": 10000, "games": 150, "providers": 18 }
    }
}
```

**GET /api/admin/users**
```
Query: ?search=+911234&page=1&page_size=20
```
```json
{
    "code": 0, "message": "success",
    "data": {
        "users": [
            {
                "id": 1, "phone": "+911234567890", "nickname": "Player001",
                "role": "user", "status": "active", "balance": 1000.00,
                "bonus_balance": 100.00, "market_code": "IN",
                "last_login_at": "2026-03-04T10:00:00Z",
                "created_at": "2026-03-04T08:00:00Z"
            }
        ],
        "total": 100, "page": 1, "page_size": 20
    }
}
```

**GET /api/admin/users/:id**
```json
{
    "code": 0, "message": "success",
    "data": {
        "user": {
            "id": 1, "phone": "+911234567890", "nickname": "Player001",
            "avatar_url": "", "google_email": "", "role": "user", "status": "active",
            "market_code": "IN", "last_login_at": "2026-03-04T10:00:00Z",
            "created_at": "2026-03-04T08:00:00Z"
        },
        "wallet": { "balance": 1000.00, "bonus_balance": 100.00, "frozen_amount": 0.00 },
        "recent_transactions": [
            { "id": 101, "type": "deposit", "amount": 500.00, "status": "completed", "created_at": "2026-03-04T10:00:00Z" }
        ]
    }
}
```

**PUT /api/admin/withdrawals/:id/approve**
```json
// Request
{ "remark": "Approved" }
// Response
{ "code": 0, "message": "Withdrawal approved", "data": { "transaction_id": 102, "status": "completed" } }
```

**PUT /api/admin/withdrawals/:id/reject**
```json
// Request
{ "remark": "Insufficient documentation" }
// Response
{ "code": 0, "message": "Withdrawal rejected", "data": { "transaction_id": 102, "status": "rejected" } }
```

## 业务逻辑

### 管理员认证

- admin_users 独立表, JWT role = super_admin / admin / operator
- Admin 中间件校验 JWT 且 role 为管理员角色
- JWT Secret 与客户端共用

### Dashboard

- 实时统计: 今日/近7日 新注册、活跃、充值、提现
- 数据库直接查询 (数据量小)

### 提现审核

1. 审核通过: status -> completed, 解冻金额, 调用 PaymentGateway
2. 审核拒绝: status -> rejected, 退回余额

### 操作日志

- 所有管理操作自动记录 admin_operation_logs

### Seed 数据

- 超级管理员: `admin` / `admin123`

## 关键决策

- 管理员与玩家使用独立账号体系
- 所有 /api/admin/* 接口需要 Admin JWT
- 操作日志记录所有变更

## 依赖与约束

- 管理后台 API 与客户端 API 共用后端服务
- 管理后台前端为独立应用 (admin/ 目录, create-web Kit)
- 依赖所有其他模块的数据表
