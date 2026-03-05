# 钱包与支付 -- 前端设计说明

## 设计概述

钱包与支付包含充值 (Deposit)、提现 (Withdraw)、交易记录 (Transactions) 三个子页面。入口: 顶部栏余额旁 "+" 按钮。

## 页面清单

| 页面 | 路由建议 | 入口 |
|------|----------|------|
| 充值 | `/deposit` | 顶部栏 "+" 按钮 |
| 提现 | `/withdraw` | 充值页切换 / 侧边菜单 |
| 交易记录 | `/transactions` | 充值页右上角时钟图标 |

## 充值页要点

- 余额展示: "Available Balance" (14px) + "₹0.00" (30px/text-3xl, Extra Bold), 居中
- 4 种支付方式: 2 列网格 (gap-3), 40x40 Logo + 名称, 选中态 2px 品牌色边框
- 金额输入: h-14, "₹" 前缀 24px, 数字 24px Extra Bold 居中
- 最低金额: "Minimum: ₹100" (12px, #6B7070)
- 快捷金额: 4 列网格 (gap-2), h-10 按钮, 选中态品牌色背景
- Deposit 按钮: h-11 全宽, 品牌色背景, bold
- 右上角时钟图标跳转到交易记录页

## 提现页要点

- 余额: "₹1,250.00" (30px, Extra Bold) 居中
- Bonus 余额: pill 样式 (#2A2D2D 圆角, "Bonus: ₹100.00 (not withdrawable)"), 居中
- 金额输入: h-14, "₹" 前缀, 最低 ₹200 / 最高 ₹50,000 (flex justify-between)
- UPI / Bank Transfer: 两个 flex-1 按钮, 选中态品牌色, 未选中 #2A2D2D + border
- UPI: 仅需 UPI ID 输入框 (h-12, placeholder "username@upi")
- Withdraw 按钮: h-11 全宽, 品牌色
- "Instant Withdrawal - Get your money fast!" 品牌色居中提示 (12px, mt-3)

## 交易记录要点

- 顶部 pill 筛选: All / Deposit / Withdraw / Bet / Cashback
- 选中态: 品牌色背景 + 深色文字 bold, 未选中: #2A2D2D + #B0B3B3 semibold
- 样式: px-4 py-1.5, rounded-full, 12px 字号
- 列表每条: 36px 圆形图标 + 名称/时间 + 金额/状态标签
- 颜色编码:
  - Deposit: 绿色透明圆 + 向上箭头 + 绿色金额 (+) + Completed 标签
  - Withdraw: 红色透明圆 + 向下箭头 + 红色金额 (-) + Pending/Rejected 标签
  - Bet: 灰色圆 + 闪电图标 + 灰色金额 (-), 无状态标签
  - Win: 绿色透明圆 + 闪电图标 + 绿色金额 (+), 无状态标签
  - Cashback/Bonus: 绿色透明圆 + 货币图标 + 绿色金额 (+) + Bonus 标签

## 前端注意事项

1. 金额输入框只允许数字，使用 `type="number"` 或自定义输入过滤
2. 快捷金额点击后自动填入输入框并高亮选中按钮
3. 支付方式和快捷金额都是单选逻辑
4. 提现页 UPI/Bank Tab 切换时保留已输入的金额
5. 交易记录支持下拉刷新和上拉加载更多
6. 充值成功后需刷新顶部栏余额显示
