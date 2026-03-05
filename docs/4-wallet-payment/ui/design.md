# UI 设计方案 -- 钱包与支付

> 需求: wallet-payment | 角色: ui

## 设计理念

钱包页面重点突出余额和充值入口，降低用户充值阻力。提现流程清晰直接。交易记录使用颜色编码区分类型和状态。

## 设计规范

继承全局设计系统。特有色值:

| 用途 | 值 | 说明 |
|------|-----|------|
| 充值标记 | #24EE89 (绿色) | 金额 +, 向上箭头 |
| 提现标记 | #FF4757 (红色) | 金额 -, 向下箭头 |
| 处理中 | #FFA502 (黄色) | Pending 状态 |
| 已完成 | #24EE89 (绿色) | Completed 状态 |
| 已拒绝 | #FF4757 (红色) | Rejected 状态 |

## 页面设计

### 充值页 (Deposit)

**布局从上到下:**

1. **余额展示区** (text-center py-6)
   - 副标题: "Available Balance" (14px, #B0B3B3, mb-1)
   - 大字体余额: "₹0.00" (30px/text-3xl, 白色, Extra Bold)
   - 无特殊背景，纯居中文字

2. **支付方式选择** (mb-6)
   - 标题: "Select Payment Method" (14px, 白色, semibold, mb-3)
   - 2 列网格 (gap-3):
     - BHIM UPI (蓝色 "UPI" 文字 Logo, 白色背景)
     - Paytm (#00BAF2 背景 "Pay" 文字)
     - Google Pay (白色背景, 彩色 "GPay" 文字)
     - Amazon Pay (#FF9900 背景 "AMZ" 文字)
   - 卡片: flex, align-items center, gap-3, #2A2D2D 背景, 圆角 8px, px-3 py-3
   - Logo 容器: 40x40px, 圆角 8px
   - 选中态: border-2 #24EE89
   - 未选中: border-2 #3A3D3D, hover 时 border-brand/50

3. **金额输入** (mb-2)
   - 标题: "Enter Amount" (14px, 白色, semibold, mb-3)
   - 输入框: h-14 (56px), #2A2D2D 背景, 1px #3A3D3D 边框, 圆角 8px, px-4
   - 前缀 "₹": 24px, #B0B3B3, bold, mr-2
   - 输入文字: 24px, 白色, Extra Bold, 居中
   - 最低金额提示: "Minimum: ₹100" (12px, #6B7070, mb-4)

4. **快捷金额按钮**
   - 横排 4 个: ₹100 / ₹500 / ₹1,000 / ₹5,000
   - 圆角按钮, #2A2D2D 背景
   - 选中时: #24EE89 背景 + 深色文字

5. **充值按钮**
   - "Deposit" 全宽, #24EE89 背景, #1A1D1D 文字, 44px 高 (h-11), bold, 圆角 8px
   - hover: #1DBF6E

### 提现页 (Withdrawal)

**布局从上到下:**

1. **余额展示**
   - 主余额: "₹0.00" (大字体)
   - Bonus 余额: "Bonus: ₹100.00" (小字体, 灰色, 不可提现提示)

2. **金额输入**
   - "Withdrawal Amount" 标题 (14px, semibold, mb-3)
   - 输入框: h-14 (56px), #2A2D2D 背景, 1px #3A3D3D 边框, 圆角 8px, px-4
   - 前缀 "₹": 24px, #B0B3B3, bold
   - 最低提现: "Minimum: ₹200" (12px, #6B7070, 左对齐)
   - 最高提现: "Maximum: ₹50,000" (12px, #6B7070, 右对齐)
   - 两个提示 flex justify-between mb-6

3. **收款方式**
   - Tab 切换: UPI / Bank Transfer
   - UPI: UPI ID 输入框 (如 "username@upi")
   - Bank: 银行名称 + 账号 + IFSC 输入

4. **提现按钮**
   - "Withdraw" 全宽, #24EE89

### 交易记录 (Transactions)

**布局:**

1. **类型筛选 Tab** (横向滚动, py-3, px-4, pill 样式)
   - All / Deposit / Withdraw / Bet / Cashback
   - 选中态: #24EE89 背景 + #1A1D1D 文字, bold
   - 未选中: #2A2D2D 背景 + #B0B3B3 文字, semibold
   - 样式: px-4 py-1.5, rounded-full, 12px 字号

2. **交易列表** (px-4 pb-8)
   - 每条记录: flex, align-items center, gap-3, py-3, border-b border-border/50
   - 左侧图标: 36px (w-9 h-9) 圆形背景 + 箭头/闪电图标
   - 中间: 名称 (14px, 白色, semibold) + 时间 (12px, #6B7070)
   - 右侧: 金额 (14px, bold, 颜色按类型) + 状态标签 (可选)

   **交易类型颜色编码:**
   | 类型 | 图标背景 | 金额颜色 | 状态标签 |
   |------|----------|----------|----------|
   | Deposit | brand/15 (绿色透明) | #24EE89 (+) | Completed (绿) |
   | Withdraw | error/15 (红色透明) | #FF4757 (-) | Pending (黄) / Rejected (红) |
   | Bet | bg-hover (灰色) | #B0B3B3 (-) | 无 |
   | Win | brand/15 (绿色透明) | #24EE89 (+) | 无 |
   | Cashback/Bonus | brand/15 (绿色透明) | #24EE89 (+) | Bonus (绿) |

3. **空状态**
   - 钱包图标 + "No transactions yet"

## 组件规范

### 金额输入框

| 属性 | 值 |
|------|-----|
| 高度 | 56px |
| 背景 | #2A2D2D |
| 边框 | 1px solid #3A3D3D |
| 圆角 | 8px |
| 文字 | 24px, 白色, Extra Bold, 居中 |
| 前缀 | "₹", 24px, #B0B3B3 |

### 快捷金额按钮

| 属性 | 值 |
|------|-----|
| 高度 | 40px |
| 背景 (默认) | #2A2D2D |
| 背景 (选中) | #24EE89 |
| 文字 (默认) | 14px, #B0B3B3 |
| 文字 (选中) | 14px, #1A1D1D |
| 圆角 | 8px |

### 交易记录项

| 属性 | 值 |
|------|-----|
| 高度 | ~60px |
| 左侧图标 | 36px 圆形背景 + 箭头方向 |
| 主文字 | 14px, 白色 |
| 金额 | 14px, bold, 颜色按类型 |
| 时间 | 12px, #6B7070 |
| 状态标签 | 10px, 对应颜色背景 + 白色文字, 4px 圆角 |

## 交互说明

- 快捷金额点击: 自动填入输入框
- 充值流程: 选支付方式 -> 输金额 -> 点充值 -> 跳转支付网关
- 提现流程: 输金额 -> 输收款信息 -> 提交 -> 显示处理中
- 交易记录: 下拉刷新 + 上拉加载更多

## 关键决策

1. 充值和提现是两个独立页面，从钱包入口进入
2. 钱包入口在顶部栏余额旁的 "+" 按钮
3. 交易记录可从充值/提现页底部链接进入
4. Bonus 余额独立显示，不可提现
5. 支付方式图标从原站抓取或使用品牌官方 Logo
