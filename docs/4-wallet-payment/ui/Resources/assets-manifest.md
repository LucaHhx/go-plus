# 资源交付清单 -- 钱包与支付

> 需求: wallet-payment | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 类型 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | 充值箭头图标 | `icons/arrow-up.svg` | SVG | 已交付 | 充值记录向上箭头, stroke=currentColor |
| 2 | 提现箭头图标 | `icons/arrow-down.svg` | SVG | 已交付 | 提现记录向下箭头, stroke=currentColor |
| 3 | 返回箭头图标 | `icons/chevron-left.svg` | SVG | 已交付 | 页面返回按钮 |
| 4 | 时间图标 | `icons/clock.svg` | SVG | 已交付 | 交易记录时间/历史入口 |
| 5 | 闪电图标 | `icons/bolt.svg` | SVG | 已交付 | 投注记录图标 |
| 6 | 货币图标 | `icons/currency.svg` | SVG | 已交付 | 返现/Bonus 记录图标 |
| 7 | CSS Design Tokens | `tokens.css` | CSS | 已交付 | 钱包特有 CSS 变量 (继承全局系统) |
| 8 | Tailwind 扩展配置 | `tailwind.config.js` | JS | 已交付 | 钱包特有 Tailwind 配置 (继承全局系统) |

## 需人工提供资源 (记录 + 占位)

| # | 资源 | 格式 | 来源 | 状态 | 占位方案 | 尺寸要求 |
|---|------|------|------|------|----------|----------|
| 1 | UPI 支付图标 | SVG/PNG | 原站/品牌官网 | 待提供 | merge.html 使用文字 "UPI" 占位 | 40x40px |
| 2 | Paytm 支付图标 | SVG/PNG | 原站/品牌官网 | 待提供 | merge.html 使用蓝色背景 + "Pay" 文字占位 | 40x40px |
| 3 | Google Pay 支付图标 | SVG/PNG | 原站/品牌官网 | 待提供 | merge.html 使用品牌色文字 "GPay" 占位 | 40x40px |
| 4 | Amazon Pay 支付图标 | SVG/PNG | 原站/品牌官网 | 待提供 | merge.html 使用橙色背景 + "AMZ" 文字占位 | 40x40px |

## 设计系统继承说明

本需求继承全局设计系统 (`docs/2-homepage-navigation/ui/Resources/`)。前端集成时:
1. 先引入全局 `tokens.css` 和 `tailwind.config.js`
2. 再引入本模块的 `tokens.css` 和 `tailwind.config.js` 作为补充

## 自检清单

- [x] 所有 SVG 图标已交付 (6个: arrow-up, arrow-down, chevron-left, clock, bolt, currency)
- [x] tokens.css 包含钱包特有 CSS 变量 (交易状态色、支付品牌色、组件尺寸)
- [x] tailwind.config.js 包含钱包特有配置
- [x] 需人工提供的资源已逐项记录 (支付方式品牌图标)
- [x] merge.html 中 SVG 图标已内嵌 (不依赖外部 URL)
- [x] merge.html 无外部 URL 引用本地应有的资源
