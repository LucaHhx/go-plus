# 赌场游戏大厅 -- 前端设计说明

## 设计概述

游戏大厅 (Explore) 是底部 Tab 的第二个入口。页面在全局 AppShell 框架内渲染（有顶部栏和底部 Tab）。核心功能: 分类浏览 + 搜索 + 供应商筛选 + 收藏。

## 页面结构

### 标题栏

- 左: 返回箭头（如果从首页某分类 "See All" 进入）
- 中: "ALL GAMES" 文字
- 右: 搜索图标

### 搜索框

- 始终显示在标题栏下方 (mt-3)
- 全宽，背景 #1E2020, 边框 1px #3A4142, 圆角 8px, 高度 44px
- 左侧搜索图标 (20px, #6B7070)
- 聚焦时边框变为 #24EE89
- 输入时实时过滤游戏列表（防抖 300ms）
- 有内容时右侧显示 X 清除按钮 (16px, #6B7070)

### 分类 Chip 栏 (filter-chip 样式)

- 横向滚动 (overflow-x-auto, hide-scrollbar), mt-3, flex gap-2
- 10 个 Chip: All Games / New / Recent / My Fav / Slots / Live / Crash / Table Game / Fishing / Lotto
- 前 4 个 Chip 有小 SVG 图标 (14px)
- **选中态: #3A4142 背景 + 白色文字** (不是下划线样式)
- **未选中: 透明背景 + #B0B3B3 文字**
- 样式: padding 6px 12px, 圆角 8px, 12px 字号, 600 字重
- 从首页 "See All" 进入时自动选中对应分类

### 筛选行

- Type 选择器 + Providers 选择器, flex gap-2, mt-3
- 各占 flex:1 等宽
- 样式: 透明背景, 1px solid #3A4142 边框, 圆角 8px, padding 8px 12px
- 标签 (Type:/Providers:) 12px #B0B3B3, 值 12px 白色 bold
- 右侧 chevron-down 箭头 12px #6B7070
- 与 Chip 独立，可组合使用
- 选择后即时过滤

### 游戏网格

- 3 列等宽 (grid grid-cols-3), gap-x-2 / gap-y-3, mt-4
- 卡片: 1:1 正方形缩略图 (圆角 8px) + 游戏名 (12px) + 供应商名 (10px)
- 缩略图区域: #2A2D2D 占位背景 + 居中缩写文字, 前端替换为真实图片
- NEW 角标: absolute top:6px left:6px, #24EE89 背景 8px 字号
- 收藏按钮: absolute top:6px right:6px, 28px 圆形 rgba(0,0,0,0.4) 背景
- 悬浮: scale(1.05) 200ms transition
- 支持无限滚动加载, 底部 spinner + "Loading more games..." 文字
- 加载态: 9 个骨架屏占位 (shimmer 动画 1.5s)

## 游戏卡片交互

- 点击缩略图 -> 启动游戏（跳转到游戏加载页）
- 点击心形图标 -> 切换收藏状态
- 收藏图标: 未收藏白色描边, 已收藏红色 (#FF4757) 实心
- New 标签: 由后端数据标记，前端只负责展示
- 悬浮/按压: scale(1.05) 200ms

## 空状态处理

| 场景 | 图标 | 文案 |
|------|------|------|
| My Fav 无数据 | 心形 | "No favourite games yet" + "Browse games to add favourites" |
| Recent 无数据 | 时钟 | "No recently played games" + "Start playing to see your history here" |
| 搜索无结果 | 搜索 | "No games found" + "Try a different search term" |

## 供应商 Logo 区 (页面底部)

- 位于游戏网格下方
- 4 列网格，圆角矩形按钮
- 显示所有 19 家供应商名称/Logo
- 点击跳转到该供应商的筛选结果（等同于 Providers 下拉选中该供应商）

## merge.html 状态清单

| 状态 | 说明 |
|------|------|
| Normal | 正常态: 12 个游戏 + 供应商网格 + 底部 Tab |
| Empty: My Fav | My Fav Chip 选中, 心形图标 + "No favourite games yet" |
| Empty: Recent | Recent Chip 选中, 时钟图标 + "No recently played games" |
| Empty: Search | 搜索框有文字 (brand 色边框) + 清除按钮 + "No games found" |
| Loading | 9 个骨架屏 (shimmer 动画) |

## 底部 Tab 栏

- 固定底部 (position fixed), max-width 430px, 64px 高
- 背景: #323738
- 5 个 Tab: Menu / Explore / GET 1700 / Raffle / Quest
- 当前页面 Explore 高亮为品牌色, 其余 #6B7070
- 中间 GET 1700: 56px 圆形渐变按钮, margin-top -16px 向上突出
- Tab 文字: 10px, 600

## 前端注意事项

1. 分类 Chip + Type + Providers 三者可组合筛选，筛选结果为条件的交集，前端需维护筛选状态
2. 游戏缩略图使用懒加载 + 灰色骨架屏占位（参考 merge.html 中的 skeleton 动画）
3. 搜索输入防抖 300ms，避免频繁请求
4. 无限滚动使用 Intersection Observer，距底部 200px 时触发加载
5. 游戏列表数据量大，建议虚拟滚动或分页加载
6. 收藏状态需要用户已登录，未登录时点击收藏弹出登录提示（复用用户系统登录弹窗）
7. 搜索框聚焦时边框变为品牌色 #24EE89，右侧显示清除按钮 (X)

## 资源使用指南

### SVG 图标

所有图标位于 `ui/Resources/icons/` 目录:

| 图标文件 | 用途 |
|----------|------|
| `search.svg` | 搜索框、搜索按钮、搜索空状态 |
| `heart-outline.svg` | 未收藏状态 |
| `heart-filled.svg` | 已收藏状态 (#FF4757) |
| `chevron-down.svg` | 筛选器下拉箭头 |
| `chevron-left.svg` | 页面顶部返回按钮 |
| `clock.svg` | Recent 分类图标、Recent 空状态 |
| `star.svg` | New 分类图标 |
| `grid.svg` | All Games 分类图标 |
| `close.svg` | 搜索框清除按钮 |
| `spinner.svg` | 无限滚动加载指示器 |
| `slots.svg` / `live.svg` / `crash.svg` | 游戏分类图标 (备用) |
| `table-game.svg` / `fishing.svg` / `lotto.svg` | 游戏分类图标 (备用) |
| `new-badge.svg` | NEW 角标参考 (实际建议用 CSS 实现) |

### CSS 变量

`ui/Resources/tokens.css` 包含完整的设计变量，前端可直接引入使用。

### Tailwind 配置

`ui/Resources/tailwind.config.js` 包含 `theme.extend` 配置，前端项目合并到自己的 tailwind 配置中即可。

### 需人工提供的资源

详见 `ui/Resources/assets-manifest.md`，包括:
- 游戏缩略图 (从供应商 API 或原站获取)
- 供应商 Logo (从各供应商官网或原站获取)
- GET 1700 中间 Tab 装饰图
- AvertaStd 字体文件
- 品牌 Logo
