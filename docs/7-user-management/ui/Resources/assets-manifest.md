# 资源交付清单

> 需求: 7-user-management | 创建: 2026-03-05

## AI 生成资源（必须交付）

以下资源由 UI 设计师直接生成并交付，**不可留空**:

| # | 资源 | 路径 | 状态 |
|---|------|------|------|
| 1 | SVG 图标 (20 个) | `icons/*.svg` | 已交付 |
| 2 | CSS 变量 (Design Tokens) | `tokens.css` | 已交付 |
| 3 | Tailwind 扩展配置 | `tailwind.config.js` | 已交付 |

### SVG 图标清单

| # | 图标名称 | 文件 | 用途 |
|---|----------|------|------|
| 1 | arrow-left | `icons/arrow-left.svg` | PageHeader 返回按钮 |
| 2 | chevron-right | `icons/chevron-right.svg` | 导航行右侧箭头 |
| 3 | edit | `icons/edit.svg` | 昵称编辑按钮 |
| 4 | camera | `icons/camera.svg` | 头像编辑按钮 |
| 5 | user | `icons/user.svg` | 默认头像占位图标 |
| 6 | shield | `icons/shield.svg` | 安全设置区块图标 |
| 7 | lock | `icons/lock.svg` | 修改密码区块图标 |
| 8 | log-out | `icons/log-out.svg` | 登出按钮图标 |
| 9 | phone | `icons/phone.svg` | 手机图标（预留） |
| 10 | calendar | `icons/calendar.svg` | 日历图标（预留） |
| 11 | star | `icons/star.svg` | VIP 等级图标 |
| 12 | google | `icons/google.svg` | Google 账号区块图标 |
| 13 | eye | `icons/eye.svg` | 密码显示图标 |
| 14 | eye-off | `icons/eye-off.svg` | 密码隐藏图标 |
| 15 | check | `icons/check.svg` | 勾选图标（预留） |
| 16 | close | `icons/close.svg` | 弹窗关闭按钮 |
| 17 | link | `icons/link.svg` | Google 绑定按钮图标 |
| 18 | unlink | `icons/unlink.svg` | Google 解绑按钮图标 |
| 19 | alert-triangle | `icons/alert-triangle.svg` | 警告/错误 Toast 图标 |
| 20 | check-circle | `icons/check-circle.svg` | 成功 Toast 图标 |

## 需人工提供资源（记录 + 占位）

以下资源需要人工提供，UI 设计师需记录需求并提供占位方案:

| # | 资源描述 | 用途 | 占位方案 | 状态 |
|---|----------|------|----------|------|
| 1 | 品牌 Logo (1GO.PLUS) | Header 展示 | 文字 "1GO.PLUS" | 待提供 |
| 2 | AvertaStd 字体文件 (WOFF2) | 全局字体 | Inter 字体降级 | 待提供 |

## 自检清单

- [x] `icons/` 目录包含所有设计稿中使用的 SVG 图标 (20 个)
- [x] `tokens.css` 包含完整的 CSS 变量（颜色、间距、字号、组件 token）
- [x] `tailwind.config.js` 包含设计系统的 Tailwind 扩展配置
- [x] merge.html 中无外部 URL 引用本地应有的资源
- [x] 所有需人工提供的资源已记录并有占位方案
- [x] 占位方案在视觉上可接受（不影响布局预览）
