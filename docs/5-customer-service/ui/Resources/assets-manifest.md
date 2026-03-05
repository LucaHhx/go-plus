# 资源交付清单 -- 客服系统

> 需求: customer-service | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 类型 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | 耳机图标 | `icons/headset.svg` | SVG | 已交付 | 客服入口图标, stroke=currentColor |
| 2 | 发送图标 | `icons/send.svg` | SVG | 已交付 | 聊天发送按钮, stroke=currentColor |
| 3 | 关闭图标 | `icons/close.svg` | SVG | 已交付 | 聊天窗口关闭按钮, stroke=currentColor |
| 4 | CSS Design Tokens | `tokens.css` | CSS | 已交付 | 客服特有 CSS 变量 (聊天气泡/状态色) |
| 5 | Tailwind 扩展配置 | `tailwind.config.js` | JS | 已交付 | 客服特有 Tailwind 配置 |

## 需人工提供资源 (复用/记录)

| # | 资源 | 格式 | 来源 | 状态 | 说明 |
|---|------|------|------|------|------|
| 1 | 社交媒体图标 (5个) | SVG | 需求 2 已交付 | 已交付 | 复用 2-homepage-navigation/ui/Resources/icons/ 中的 telegram/facebook/instagram/whatsapp/youtube.svg |
| 2 | Live Support 图标 | SVG | 需求 2 已交付 | 已交付 | 复用 2-homepage-navigation/ui/Resources/icons/live-support.svg |
| 3 | 客服头像 | PNG | 运营提供 | 待提供 | merge.html 使用绿色圆形 + 文字首字母占位 |

## 设计系统继承说明

本需求继承全局设计系统 (`docs/2-homepage-navigation/ui/Resources/`)。客服聊天窗口使用品牌绿色作为用户消息气泡，深灰色作为客服消息气泡。侧边菜单中的 "Live Support" 图标已在需求 2 中交付。

## 自检清单

- [x] 所有 SVG 图标已交付 (3个: headset, send, close)
- [x] 社交媒体图标复用首页导航已有资源 (5个)
- [x] tokens.css 包含客服特有 CSS 变量
- [x] tailwind.config.js 包含客服特有配置
- [x] 需人工提供的资源已记录
- [x] merge.html 中 SVG 图标已内嵌
- [x] merge.html 无外部 URL 引用本地应有的资源
