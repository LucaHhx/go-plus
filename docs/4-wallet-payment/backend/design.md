# 后端技术方案 -- 钱包与支付

> 需求: wallet-payment | 角色: backend

## 期次分类概览

> **第一期 = 全功能实现 (核心交易链路)。** 钱包全部 API 在第一期真实实现。

### 一期全功能 API

| API | 说明 | 数据来源 |
|-----|------|----------|
| GET /api/v1/wallet | 钱包余额 | wallets 表查询 |
| GET /api/v1/wallet/payment-methods | 可用支付方式 | payment_methods 表 |
| POST /api/v1/wallet/deposit | 发起充值 | wallets + transactions 表 (Mock: 直接成功) |
| POST /api/v1/wallet/withdraw | 发起提现 | wallets + transactions 表 (真实冻结+审核) |
| GET /api/v1/wallet/transactions | 交易记录 | transactions 表查询 |
| GET /api/v1/wallet/transactions/:id | 交易详情 | transactions 表查询 |

### 外部服务 Mock (一期)

| 服务 | Mock 行为 | 后续替换为 |
|------|-----------|-----------|
| 支付网关 (PaymentGateway) | 充值直接成功，提现走管理审核 | 真实支付网关 (UPI/Paytm 对接) |

## 技术栈

同项目统一技术栈: Go + Gin + GORM + SQLite + Zap

## 数据模型

### wallets 表

```sql
CREATE TABLE wallets (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE,
    balance         DECIMAL(12,2) DEFAULT 0.00,        -- 主余额 (INR)
    bonus_balance   DECIMAL(12,2) DEFAULT 0.00,        -- Bonus 余额
    frozen_amount   DECIMAL(12,2) DEFAULT 0.00,        -- 冻结金额 (提现中)
    currency        VARCHAR(10) DEFAULT 'INR',
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### transactions 表

```sql
CREATE TABLE transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    wallet_id       INTEGER NOT NULL,
    type            VARCHAR(20) NOT NULL,              -- deposit / withdrawal / bet / cashback / bonus
    amount          DECIMAL(12,2) NOT NULL,
    balance_before  DECIMAL(12,2) NOT NULL,
    balance_after   DECIMAL(12,2) NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',     -- pending / processing / completed / failed / rejected
    payment_method  VARCHAR(50) DEFAULT '',             -- upi / paytm / gpay / amazon_pay / bank
    payment_ref     VARCHAR(200) DEFAULT '',
    remark          VARCHAR(500) DEFAULT '',
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type, status);
```

### payment_methods 表

```sql
CREATE TABLE payment_methods (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,             -- BHIM UPI, Paytm 等
    code            VARCHAR(50) NOT NULL UNIQUE,       -- upi, paytm, gpay, amazon_pay
    icon_url        VARCHAR(500) DEFAULT '',
    type            VARCHAR(20) NOT NULL,              -- deposit / withdrawal / both
    min_amount      DECIMAL(12,2) DEFAULT 100.00,
    max_amount      DECIMAL(12,2) DEFAULT 100000.00,
    market_code     VARCHAR(10) DEFAULT 'IN',
    status          VARCHAR(20) DEFAULT 'active',
    sort_order      INTEGER DEFAULT 0,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

## API 设计

### 错误码

- 2001: 充值金额低于最低限额
- 2002: 充值金额超过最高限额
- 2003: 提现金额低于最低限额
- 2004: 提现金额超过可用余额
- 2005: 钱包不存在
- 2006: 支付方式不可用
- 2007: 交易不存在

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/wallet | 钱包余额 | 是 |
| GET | /api/v1/wallet/payment-methods | 可用支付方式 | 是 |
| POST | /api/v1/wallet/deposit | 发起充值 | 是 |
| POST | /api/v1/wallet/withdraw | 发起提现 | 是 |
| GET | /api/v1/wallet/transactions | 交易记录 | 是 |
| GET | /api/v1/wallet/transactions/:id | 交易详情 | 是 |

### GET /api/v1/wallet

```json
{
    "code": 0, "message": "success",
    "data": {
        "balance": 1000.00, "bonus_balance": 100.00,
        "frozen_amount": 0.00, "currency": "INR"
    }
}
```

### GET /api/v1/wallet/payment-methods

```json
{
    "code": 0, "message": "success",
    "data": [
        { "id": 1, "name": "BHIM UPI", "code": "upi", "icon_url": "/assets/payment/upi.svg", "type": "both", "min_amount": 100.00, "max_amount": 100000.00 },
        { "id": 2, "name": "Paytm", "code": "paytm", "icon_url": "/assets/payment/paytm.svg", "type": "deposit", "min_amount": 100.00, "max_amount": 50000.00 },
        { "id": 3, "name": "Google Pay", "code": "gpay", "icon_url": "/assets/payment/gpay.svg", "type": "deposit", "min_amount": 100.00, "max_amount": 50000.00 },
        { "id": 4, "name": "Amazon Pay", "code": "amazon_pay", "icon_url": "/assets/payment/amazon.svg", "type": "deposit", "min_amount": 100.00, "max_amount": 50000.00 }
    ]
}
```

### POST /api/v1/wallet/deposit

```json
// Request
{ "amount": 500.00, "payment_method": "upi" }
// Response (Mock: 直接成功)
{
    "code": 0, "message": "Deposit successful",
    "data": {
        "transaction_id": 101, "amount": 500.00,
        "status": "completed", "balance": 1500.00
    }
}
```

### POST /api/v1/wallet/withdraw

```json
// Request
{ "amount": 200.00, "payment_method": "upi", "account_info": { "upi_id": "user@paytm" } }
// Response
{
    "code": 0, "message": "Withdrawal request submitted",
    "data": { "transaction_id": 102, "amount": 200.00, "status": "pending" }
}
```

### GET /api/v1/wallet/transactions

```
Query: ?type=deposit&page=1&page_size=20
```

```json
{
    "code": 0, "message": "success",
    "data": {
        "transactions": [
            {
                "id": 101, "type": "deposit", "amount": 500.00,
                "status": "completed", "payment_method": "upi",
                "balance_after": 1500.00, "created_at": "2026-03-04T10:00:00Z"
            }
        ],
        "total": 25, "page": 1, "page_size": 20
    }
}
```

### GET /api/v1/wallet/transactions/:id

```json
{
    "code": 0, "message": "success",
    "data": {
        "id": 101, "type": "deposit", "amount": 500.00,
        "balance_before": 1000.00, "balance_after": 1500.00,
        "status": "completed", "payment_method": "upi",
        "payment_ref": "UPI-REF-12345", "remark": "",
        "created_at": "2026-03-04T10:00:00Z", "updated_at": "2026-03-04T10:00:00Z"
    }
}
```

## 业务逻辑

### 充值流程

1. 校验金额 (>= min_amount, <= max_amount)
2. 调用 PaymentGateway.CreateDeposit()
3. Mock: 直接返回成功，立即增加 wallet.balance
4. 创建 transaction (status=completed), 记录 balance_before / balance_after

### 提现流程

1. 校验金额 (>= min_amount, <= 可用余额)
2. 冻结: wallet.frozen_amount += amount, wallet.balance -= amount
3. 创建 transaction (status=pending)
4. 管理员审核通过: status -> completed, 解冻
5. 管理员审核拒绝: status -> rejected, 退回余额

### 余额安全

- 所有余额操作在 GORM 事务中执行
- 每笔交易记录 balance_before / balance_after 审计链
- Bonus 余额与主余额分开，Bonus 不可提现

### 注册联动

- 用户注册时自动创建 wallet (balance=0, bonus_balance=100)

### Mock 策略

| 外部服务 | Interface | Mock 行为 |
|----------|-----------|-----------|
| 支付网关 | `PaymentGateway` | 充值直接成功; 提现走管理审核 |

```go
type PaymentGateway interface {
    CreateDeposit(req *DepositRequest) (*DepositResult, error)
    ProcessWithdraw(req *WithdrawRequest) (*WithdrawResult, error)
}
```

## 关键决策

- 充值 Mock 直接成功，不模拟异步回调
- 提现需要管理员审核，体现真实业务流程
- 充值最低 100 INR，提现最低 200 INR
- 第一期仅支持 INR 货币

## 依赖与约束

- 依赖用户系统: 所有钱包操作需认证
- 管理后台调用提现审核 API
- 钱包在用户注册时由用户 Service 联动创建
