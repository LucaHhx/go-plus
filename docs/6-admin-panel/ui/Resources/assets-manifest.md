# 资源交付清单 -- 管理后台

> 需求: admin-panel | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 类型 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | CSS Design Tokens | `tokens.css` | CSS | 已交付 | 管理后台独立深蓝色系深色主题 CSS 变量 |
| 2 | Tailwind 扩展配置 | `tailwind.config.js` | JS | 已交付 | 管理后台 Tailwind 配置 (surface/accent/txt/border/danger/warn) |

管理后台使用内联 SVG 图标 (Heroicons 风格 stroke 图标)，不需要额外的自定义 SVG 文件。

## 需人工提供资源 (记录 + 占位)

| # | 资源 | 格式 | 来源 | 状态 | 占位方案 |
|---|------|------|------|------|----------|
| 1 | 品牌 Logo (管理后台用) | SVG/PNG | 同客户端 Logo | 待提供 | merge.html 使用绿色圆形 "G" + "GO PLUS Admin" 文字占位 |

## 设计系统说明

管理后台使用**独立深蓝色系深色主题** (surface: #1a1a2e, card: #16213e)，与客户端配色 (#232626/#2A2D2D) 不同。字体使用 Inter 而非 AvertaStd。管理后台面向内部运营人员，采用标准管理后台设计模式，不要求与原站 1:1 还原。

## 自检清单

- [x] tokens.css 包含管理后台完整 CSS 变量 (深蓝色系深色主题)
- [x] tailwind.config.js 颜色与 merge.html 一致 (surface/accent/txt/border/danger/warn)
- [x] 管理后台使用内联 SVG 图标，无需自定义 SVG 文件
- [x] 品牌 Logo 使用文字占位方案
- [x] merge.html 无外部 URL 引用本地应有的资源
