# 资源交付清单 -- 用户系统

> 需求: user-system | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 尺寸 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | Google Logo | `icons/google.svg` | 24x24 | 已交付 | Google 品牌四色 Logo，用于登录按钮 |
| 2 | 眼睛图标 (显示密码) | `icons/eye.svg` | 24x24 | 已交付 | 密码明文态图标，stroke=currentColor |
| 3 | 眼睛图标 (隐藏密码) | `icons/eye-off.svg` | 24x24 | 已交付 | 密码密文态图标 (斜线)，stroke=currentColor |
| 4 | 勾选图标 | `icons/check.svg` | 24x24 | 已交付 | 复选框勾选态，stroke=currentColor |
| 5 | 关闭按钮图标 | `icons/close.svg` | 24x24 | 已交付 | X 关闭按钮，stroke=currentColor |
| 6 | 下拉箭头图标 | `icons/chevron-down.svg` | 24x24 | 已交付 | 邀请码展开/收起，stroke=currentColor |
| 7 | 手机图标 | `icons/phone.svg` | 24x24 | 已交付 | 预留装饰图标，stroke=currentColor |
| 8 | 锁图标 | `icons/lock.svg` | 24x24 | 已交付 | 预留装饰图标，stroke=currentColor |
| 9 | CSS Design Tokens | `tokens.css` | - | 已交付 | 完整 CSS 变量 (颜色/字体/间距/圆角/组件/布局) |
| 10 | Tailwind 扩展配置 | `tailwind.config.js` | - | 已交付 | theme.extend 配置，前端直接合并使用 |

## 需人工提供资源 (记录 + 占位)

| # | 资源 | 格式 | 来源 | 状态 | 占位方案 | 尺寸要求 |
|---|------|------|------|------|----------|----------|
| 1 | 品牌 Logo | PNG/SVG | 原站 1goplus.com | 待提供 | 文字 "1GO.PLUS" 替代 | height: 32px |
| 2 | 奖轮装饰图 | PNG | 原站注册/登录页 | 待提供 | SVG 几何占位 (圆环+金币) | 注册: 140x110, 登录: 110x80 |
| 3 | Aviator 游戏缩略图 | PNG/JPG | 原站游戏列表 | 待提供 | SVG 飞机图标占位 | 60x60px, object-cover |
| 4 | MoneyComing 游戏缩略图 | PNG/JPG | 原站游戏列表 | 待提供 | SVG 金币图标占位 | 60x60px, object-cover |
| 5 | AvertaStd 字体文件 | WOFF2 | 授权来源 | 待提供 | Inter 系统字体降级 | @font-face 引入 |

## 自检清单

- [x] 所有 SVG 图标使用 `stroke="currentColor"` 或 `fill="currentColor"`（Google Logo 除外，使用品牌固定色）
- [x] 图标尺寸统一 viewBox="0 0 24 24"
- [x] 资源文件命名 kebab-case，放入对应子目录
- [x] merge.html 中无外部 URL 引用本地资源（仅 Tailwind CDN 和 SVG xmlns）
- [x] 所有装饰性占位使用内联 SVG（无障碍无问题）
- [x] tokens.css 包含完整 CSS 变量（颜色、字体、间距、圆角、组件、布局间距）
- [x] tailwind.config.js 包含 theme.extend 配置
- [x] 需人工提供的资源已逐项记录（描述、来源、占位方案、尺寸要求）
- [x] merge.html 包含 5 个预览状态（正常注册/密码登录/OTP登录/错误态/加载态）
- [x] tokens.css 色值与 design.md 和 merge.html 完全一致（#3A4142 统一边框色）

## 备注

- Tailwind CDN (`https://cdn.tailwindcss.com`) 仅用于设计稿预览，不属于本地资源
- SVG xmlns 声明是 XML 标准命名空间，不是外部资源引用
- Google Logo SVG 使用固定品牌色 (#4285F4, #34A853, #FBBC05, #EA4335)，不使用 currentColor
- 所有间距值 (12px/16px/20px/32px) 已在 Introduction.md 中逐一标注，前端必须精确还原
