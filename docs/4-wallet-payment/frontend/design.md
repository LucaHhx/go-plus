# 前端技术方案 -- 钱包与支付

> 需求: wallet-payment | 角色: frontend

## 期次分类概览

> **第一期 = 全功能实现 (核心交易链路)。** 钱包与支付是核心交易链路，第一期全部完成。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| DepositPage | 一期全功能 | 真实 API `/wallet/deposit` | 充值页 (Mock: 直接成功) |
| WithdrawPage | 一期全功能 | 真实 API `/wallet/withdraw` | 提现页 (真实审核流程) |
| TransactionsPage | 一期全功能 | 真实 API `/wallet/transactions` | 交易记录 |
| TransactionDetailPage | 一期全功能 | 真实 API `/wallet/transactions/:id` | 交易详情 |
| PaymentMethodSelector | 一期全功能 | 真实 API `/wallet/payment-methods` | 支付方式选择 |
| AmountInput / QuickAmountButtons | 一期全功能 | - | 金额输入 |
| BalanceDisplay | 一期全功能 | 真实 API `/wallet` | 余额展示 |
| BalanceChip / DepositButton (顶栏) | 一期全功能 | 真实 API `/auth/me` | 全局余额显示 |

## 技术栈

同项目统一前端栈: React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Axios

## 页面与组件结构

### 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| DepositPage | /wallet/deposit | 充值页 |
| WithdrawPage | /wallet/withdraw | 提现页 |
| TransactionsPage | /wallet/transactions | 交易记录页 |
| TransactionDetailPage | /wallet/transactions/:id | 交易详情页 |

### 组件结构

```
src/pages/
  wallet/
    DepositPage.tsx               -- 充值页面
    WithdrawPage.tsx              -- 提现页面
    TransactionsPage.tsx          -- 交易记录列表
    TransactionDetailPage.tsx     -- 交易详情
    components/
      PaymentMethodSelector.tsx   -- 支付方式选择
      AmountInput.tsx             -- 金额输入 (含快捷金额按钮)
      QuickAmountButtons.tsx      -- 快捷金额: 100/500/1000/5000
      WithdrawForm.tsx            -- 提现表单 (金额+收款信息)
      TransactionCard.tsx         -- 交易记录卡片
      TransactionFilter.tsx       -- 交易类型筛选
      BalanceDisplay.tsx          -- 余额展示 (主+Bonus)
```

### 全局组件

```
src/components/
  TopBar/
    BalanceChip.tsx               -- 顶栏余额显示 (₹1,000)
    DepositButton.tsx             -- 顶栏充值按钮 (+)
```

## 状态管理

### walletStore (Zustand)

```typescript
interface WalletState {
    balance: number;
    bonusBalance: number;
    frozenAmount: number;
    currency: string;
    paymentMethods: PaymentMethod[];

    fetchWallet: () => Promise<void>;
    fetchPaymentMethods: () => Promise<void>;
    deposit: (amount: number, method: string) => Promise<DepositResult>;
    withdraw: (data: WithdrawRequest) => Promise<WithdrawResult>;
}
```

## API 对接

```typescript
// src/api/wallet.ts
export const walletApi = {
    getWallet: () => get('/wallet'),
    getPaymentMethods: () => get('/wallet/payment-methods'),
    deposit: (data: DepositRequest) => post('/wallet/deposit', data),
    withdraw: (data: WithdrawRequest) => post('/wallet/withdraw', data),
    transactions: (params: TransactionParams) => get('/wallet/transactions', { params }),
    transactionDetail: (id: number) => get(`/wallet/transactions/${id}`),
};
```

## 交互设计

### 充值页面

```
[返回] 充值
[余额显示: ₹1,000.00]

选择支付方式:
  [UPI icon] BHIM UPI    [selected]
  [Paytm]    Paytm
  [GPay]     Google Pay
  [Amazon]   Amazon Pay

输入金额:
  [₹ _________ ]
  [100] [500] [1000] [5000]   <- 快捷金额

[充值] (绿色大按钮)
```

### 提现页面 (来自 merge.html)

```
[返回] Withdraw
[Available Balance: ₹1,250.00 (居中, text-3xl extrabold)]
[Bonus: ₹100.00 (not withdrawable) -- 圆角药丸标签, bg-bg-card]

Withdrawal Amount:
  [₹ _________ ]  (h-14, text-2xl extrabold, 居中)
  左: Minimum: ₹500   右: Maximum: ₹50,000   (text-xs txt-muted)

收款方式 Tab (flex gap-2):
  [UPI (激活态: bg-brand text-bg-deep)] [Bank Transfer (bg-bg-card border)]

UPI ID 输入:
  label: "UPI ID", txt-secondary text-sm
  [username@upi]  (h-12)

[Withdraw] (h-11, bg-brand, font-bold)
[Instant Withdrawal - Get your money fast!] (text-brand text-xs font-semibold, 居中)
```

### 交易记录页面

```
[返回] 交易记录
[全部] [充值] [提现] [投注] [返现]   <- 类型筛选 Tab

[↑ 充值 +₹500   已完成  03-04 10:00]
[↓ 提现 -₹200   处理中  03-04 09:30]
[↑ 充值 +₹1000  已完成  03-03 15:00]
```

### 状态颜色

- completed: 绿色
- pending / processing: 黄色
- failed / rejected: 红色

## 关键决策

- 充值 Mock 直接成功，刷新余额显示
- 提现提交后显示 "审核中" 状态
- 顶栏余额: 登录后始终显示，充值后实时更新
- 金额输入: 数字键盘，自动格式化千分位
- 快捷金额按钮: 100/500/1000/5000 INR

## 资源依赖

| 资源 | 来源 | 存储路径 |
|------|------|----------|
| 支付方式图标 (UPI/Paytm/GPay/Amazon) | UI 设计师交付 | `public/assets/icons/payment/` |
| 交易类型图标 (充值/提现箭头) | 组件内 SVG | 无需抓取 |

支付方式图标由 2-homepage-navigation 的资源抓取任务统一处理。

## 依赖与约束

- 依赖用户认证: 所有钱包页面需登录
- 顶栏余额组件在 TopBar 中全局展示
- 注册成功后自动获取钱包余额
- 支付方式图标依赖资源抓取任务
