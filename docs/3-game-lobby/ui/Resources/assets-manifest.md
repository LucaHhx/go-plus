# 资源交付清单 -- 游戏大厅

> 需求: game-lobby | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 尺寸 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | 搜索图标 | `icons/search.svg` | 24x24 | 已交付 | 放大镜图标，stroke=currentColor |
| 2 | 收藏图标 (未选中) | `icons/heart-outline.svg` | 24x24 | 已交付 | 空心心形，stroke=currentColor |
| 3 | 收藏图标 (已选中) | `icons/heart-filled.svg` | 24x24 | 已交付 | 实心心形，fill=#FF4757 |
| 4 | 下拉箭头 | `icons/chevron-down.svg` | 24x24 | 已交付 | 筛选器下拉箭头，stroke=currentColor |
| 5 | 返回箭头 | `icons/chevron-left.svg` | 24x24 | 已交付 | 页面顶部返回，stroke=currentColor |
| 6 | 时钟图标 | `icons/clock.svg` | 24x24 | 已交付 | Recent 分类图标，stroke=currentColor |
| 7 | 星形图标 | `icons/star.svg` | 24x24 | 已交付 | New 分类图标，stroke=currentColor |
| 8 | 筛选图标 | `icons/filter.svg` | 24x24 | 已交付 | 备用筛选图标，stroke=currentColor |
| 9 | 网格图标 | `icons/grid.svg` | 24x24 | 已交付 | All Games 分类图标，stroke=currentColor |
| 10 | 加载动画图标 | `icons/spinner.svg` | 24x24 | 已交付 | 无限滚动加载指示器，stroke=currentColor |
| 11 | Slots 分类图标 | `icons/slots.svg` | 24x24 | 已交付 | 老虎机图标，stroke=currentColor |
| 12 | Live 分类图标 | `icons/live.svg` | 24x24 | 已交付 | 直播信号图标，stroke=currentColor |
| 13 | Crash 分类图标 | `icons/crash.svg` | 24x24 | 已交付 | 火箭/飞行图标，stroke=currentColor |
| 14 | Table Game 分类图标 | `icons/table-game.svg` | 24x24 | 已交付 | 骰子图标，stroke=currentColor |
| 15 | Fishing 分类图标 | `icons/fishing.svg` | 24x24 | 已交付 | 钓鱼图标，stroke=currentColor |
| 16 | Lotto 分类图标 | `icons/lotto.svg` | 24x24 | 已交付 | 彩球图标，stroke=currentColor |
| 17 | New 角标 | `icons/new-badge.svg` | 32x16 | 已交付 | 游戏卡片 NEW 标签，品牌色背景 |
| 18 | 关闭图标 | `icons/close.svg` | 24x24 | 已交付 | X 关闭按钮，stroke=currentColor |
| 19 | CSS Design Tokens | `tokens.css` | - | 已交付 | 完整 CSS 变量 (颜色/字体/间距/圆角/组件/布局) |
| 20 | Tailwind 扩展配置 | `tailwind.config.js` | - | 已交付 | theme.extend 配置，前端直接合并使用 |

## 需人工提供资源 (记录 + 占位)

| # | 资源 | 格式 | 来源 | 状态 | 占位方案 | 尺寸要求 |
|---|------|------|------|------|----------|----------|
| 1 | 游戏缩略图 (全部游戏) | PNG/JPG | 游戏供应商 API 或原站抓取 | 待提供 | 纯色块 (#2A2D2D) + 游戏名首字母 | 正方形 1:1，建议 200x200+ |
| 2 | 供应商 Logo (18+ 家) | PNG/SVG | 各供应商官网或原站 | 待提供 | 供应商名称文字替代 | 宽度自适应，高度 32px |
| 3 | 底部 Tab 中间装饰图 (GET 1700) | PNG | 原站 1goplus.com | 待提供 | 品牌色圆形 + 文字 "GET 1700" | 70x70px |
| 4 | AvertaStd 字体文件 | WOFF2 | 授权来源 | 待提供 | Inter 系统字体降级 | @font-face 引入 |
| 5 | 品牌 Logo | PNG/SVG | 原站 1goplus.com | 待提供 | 文字 "1GO.PLUS" 替代 | height: 32px |

## 自检清单

- [x] 所有 SVG 图标使用 `stroke="currentColor"` 或 `fill="currentColor"` (heart-filled 和 new-badge 除外，使用语义固定色)
- [x] 功能图标尺寸统一 viewBox="0 0 24 24"
- [x] 资源文件命名 kebab-case，放入对应子目录
- [x] merge.html 中无外部 URL 引用本地应有的资源 (图标全部内联 SVG)
- [x] 游戏缩略图使用纯色占位块 (属于需人工提供的第三方资源)
- [x] tokens.css 包含完整 CSS 变量 (颜色/字体/间距/圆角/搜索框/筛选器/游戏卡片/标签栏)
- [x] tailwind.config.js 包含 theme.extend 配置 (含游戏大厅特有的网格/高度/颜色)
- [x] 需人工提供的资源已逐项记录 (描述、来源、占位方案、尺寸要求)
- [x] merge.html 覆盖正常态、空状态、加载态
- [x] tokens.css 色值与 design.md 和 merge.html 完全一致

## 备注

- Tailwind CDN (`https://cdn.tailwindcss.com`) 仅用于设计稿预览，不属于本地资源
- SVG xmlns 声明是 XML 标准命名空间，不是外部资源引用
- 游戏缩略图和供应商 Logo 由第三方提供，设计稿中使用占位方案
- heart-filled.svg 使用固定色 #FF4757 (收藏激活态)，不使用 currentColor
- new-badge.svg 使用固定品牌色 #24EE89 背景 + #1A1D1D 文字
