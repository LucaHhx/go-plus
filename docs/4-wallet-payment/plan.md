# 钱包与支付

> 提供用户资金管理功能，支持 UPI/Paytm/GPay/Amazon Pay 充值和即时提现

## 目标

1. 用户可以通过多种印度支付方式充值 (BHIM UPI, Paytm, Google Pay, Amazon Pay)
2. 用户可以发起提现，资金到账用户银行/UPI 账户
3. 用户可以查看钱包余额 (主余额 + Bonus 余额)
4. 用户可以查看交易记录 (充值/提现/投注/返现)
5. 平台承诺即时提现 (Instant Withdrawal)

## 范围

**包含:**

- 钱包余额展示 (顶部栏实时显示)
- 充值功能 (BHIM UPI, Paytm, Google Pay, Amazon Pay)
- 提现功能 (银行转账/UPI)
- 交易记录查询
- 充值/提现状态追踪
- 最低充值金额: 100 INR; 最低提现金额: 200 INR; 最高提现金额: 50,000 INR
- Bonus 余额不可提现
- INR 货币单位

**不包含 (不属于本需求范围):**

- 首充返现等促销 (归属促销系统需求)
- VIP 专属返现 (归属 VIP 系统需求)
- 多币种支持 (首发仅 INR)
- 加密货币支付

## 核心用户场景

- 场景 A: 用户想充值，进入 Deposit 页面，看到当前余额，从 2x2 网格中选择支付方式 (默认 UPI 选中)，输入金额或点击快捷金额按钮 (100/500/1000/5000)，点击 Deposit 按钮提交
- 场景 B: 用户赢了钱想提现，进入 Withdraw 页面，看到可提现余额和 Bonus 余额 (标注不可提现)，输入提现金额，选择收款方式 (UPI/Bank Transfer)，输入 UPI ID 或银行信息，点击 Withdraw 按钮提交
- 场景 C: 用户想查看资金流水，进入 Transactions 页面，通过顶部胶囊筛选标签按类型 (All/Deposit/Withdraw/Bet/Cashback) 筛选查看，每条记录显示类型图标、名称、时间、金额和状态标签
- 场景 D: 新注册用户获得 100 Bonuses，在提现页看到 Bonus 余额胶囊标注 "(not withdrawable)"，了解 Bonus 不可提现
- 场景 E: 用户在充值页点击标题栏右侧时钟图标，直接跳转到交易记录页

## 时间线

| 里程碑 | 目标日期 | 状态 |
|--------|----------|------|
| 需求确认 | 2026-03-04 | 已完成 |
| 开发完成 | - | 待办 |
| 测试通过 | - | 待办 |

## 背景

钱包与支付是平台商业化的基础。根据 UI 设计图纸 (merge.html)，平台支持主流印度支付方式，主打 "Instant Withdrawal" 即时提现。用户余额在顶部栏始终可见，充值入口醒目。首发市场为印度，货币为 INR，后续需预留多市场/多币种扩展能力。

## 验收清单

### 功能验收

- [ ] 用户可以通过 BHIM UPI 充值
- [ ] 用户可以通过 Paytm 充值
- [ ] 用户可以通过 Google Pay 充值
- [ ] 用户可以通过 Amazon Pay 充值
- [ ] 充值成功后余额实时更新
- [ ] 用户可以发起提现到 UPI 账户或银行账户
- [ ] 提现处理状态可追踪 (处理中/已完成/已拒绝)
- [ ] 顶部栏始终显示当前余额 (INR)
- [ ] 用户可以查看完整交易记录并按类型筛选
- [ ] Bonus 余额与主余额分开展示
- [ ] 充值和提现有最低金额限制

### 视觉还原验收 (前端 1:1 还原 merge.html 设计稿)

**通用页面结构:**

- [ ] 所有子页面 (Deposit/Withdraw/Transactions) 最大宽度 430px 居中
- [ ] 页面标题栏: sticky 置顶, 高度 56px (h-14), 背景 #1A1D1D
- [ ] 标题栏结构: 左侧返回箭头 + 居中标题 (白色, base, bold) + 右侧图标区

**充值页 (Deposit):**

- [ ] 标题栏右侧: 交易记录图标 (时钟, #B0B3B3), 点击跳转交易记录页
- [ ] 余额展示区: 居中, 垂直间距 py-6, "Available Balance" 文字 #B0B3B3 sm, 金额 30px (text-3xl) 白色 font-extrabold
- [ ] 支付方式标题: "Select Payment Method" 白色 sm font-semibold
- [ ] 支付方式: 2 列网格 (grid-cols-2 gap-3), 每项为卡片式布局
- [ ] 支付方式卡片: 背景 #2A2D2D, 圆角 lg, padding 12px, 左侧 40x40px Logo 方块 (圆角 lg), 右侧支付方式名称
- [ ] 选中态: 边框 2px solid #24EE89; 未选中: 边框 2px solid #3A3D3D, hover 时边框变 brand/50
- [ ] 4 种支付方式 Logo 色: UPI (白底蓝字), Paytm (#00BAF2 底白字), GPay (白底彩色), Amazon Pay (#FF9900 底白字)
- [ ] 金额输入区: "Enter Amount" 标题, 输入框高度 56px (h-14), 背景 #2A2D2D, 边框 #3A3D3D, 圆角 lg
- [ ] 金额输入框内: 左侧 "Rs" 符号 (#B0B3B3 text-2xl bold), 输入数字居中 (text-2xl extrabold 白色)
- [ ] 最低金额提示: "Minimum: Rs100" (#6B7070 xs)
- [ ] 快捷金额: 4 列网格 (grid-cols-4 gap-2), 高度 40px, 圆角 lg
- [ ] 快捷金额未选中: 背景 #2A2D2D + 边框 #3A3D3D + 文字 #B0B3B3; 选中: 背景 #24EE89 + 文字深色 bold
- [ ] 充值按钮: 全宽, 高度 44px (h-11), 背景 #24EE89, 文字深色 bold base, 圆角 lg, hover 变 #1DBF6E

**提现页 (Withdraw):**

- [ ] 余额展示: 同充值页结构, 下方增加 Bonus 胶囊: 圆角全圆 (rounded-full), 背景 #2A2D2D
- [ ] Bonus 胶囊: "Bonus: Rs100.00 (not withdrawable)" 文字 #6B7070 xs
- [ ] 提现金额输入: 标题 "Withdrawal Amount", 输入框样式同充值页
- [ ] 最低/最高提示: 左 "Minimum: Rs200" 右 "Maximum: Rs50,000", #6B7070 xs, flex justify-between
- [ ] 收款方式切换: 2 个等宽按钮 (flex gap-2), 高度 40px, 圆角 lg
- [ ] 收款方式选中: 背景 #24EE89 + 深色文字 bold; 未选中: 背景 #2A2D2D + 边框 #3A3D3D + #B0B3B3 文字
- [ ] UPI ID 输入: label (#B0B3B3 sm), 输入框高度 48px (h-12), 背景 #2A2D2D, 边框 #3A3D3D, placeholder "username@upi"
- [ ] 提现按钮: 样式同充值按钮
- [ ] 即时提现提示: "Instant Withdrawal - Get your money fast!" #24EE89 xs font-semibold, 居中, mt-3

**交易记录页 (Transactions):**

- [ ] 筛选 Tab: 横向滚动 (overflow-x-auto), 胶囊样式 (rounded-full), 间距 gap-2
- [ ] 筛选选中: 背景 #24EE89 + 深色文字 xs bold; 未选中: 背景 #2A2D2D + #B0B3B3 xs semibold
- [ ] 5 个筛选项: All / Deposit / Withdraw / Bet / Cashback
- [ ] 交易列表项: flex 布局, padding-y 12px, 底部分割线 border-b #3A3D3D/50
- [ ] 列表项结构: 左侧 36x36px 圆形图标 + 中间 (标题 sm semibold + 时间 xs #6B7070) + 右侧 (金额 sm bold + 状态标签)
- [ ] 充值图标: 向上箭头, 背景 brand/15, 图标 #24EE89; 金额绿色 (+)
- [ ] 提现图标: 向下箭头, 背景 error/15, 图标 #FF4757; 金额红色 (-)
- [ ] 投注图标: 闪电, 背景 hover色, 图标 #6B7070; 金额 #B0B3B3
- [ ] 赢取/返现: 闪电/货币, 背景 brand/15, 图标 #24EE89; 金额绿色
- [ ] 状态标签: 圆角小标签 (10px bold, padding 2px 6px)
- [ ] Completed: 背景 brand/15 + #24EE89 文字; Pending: 背景 warning/15 + #FFA502 文字; Rejected: 背景 error/15 + #FF4757 文字; Bonus: 背景 brand/15 + #24EE89 文字

**整体风格:**

- [ ] 深色主题: 页面背景 #232626, 外层背景 #1A1D1D
- [ ] 字体使用 AvertaStd（降级 Inter），字号/字重与 merge.html 规范一致
- [ ] 聚焦态: input/select 聚焦边框变 #24EE89
