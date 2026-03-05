# UI 设计方案 -- 赌场游戏大厅

> 需求: game-lobby | 角色: ui

## 设计理念

游戏大厅 (Explore) 是平台的核心产品页面。设计重点: 高效的分类筛选 + 清晰的游戏网格布局 + 流畅的横向 Tab 切换。参考 1goplus.com 的 Explore 页面，标题栏 "ALL GAMES"，支持搜索、分类 Tab、类型/供应商组合筛选。

## 设计规范

继承全局设计系统 (详见 2-homepage-navigation/ui/design.md)。

### 特有色值

| 用途 | 值 | 说明 |
|------|-----|------|
| 分类 Chip 选中态背景 | #3A4142 | filter-chip.active 背景 |
| 分类 Chip 选中态文字 | #FFFFFF | filter-chip.active 文字 |
| 分类 Chip 未选中文字 | #B0B3B3 | filter-chip 默认文字 |
| 搜索框背景 | #1E2020 | 深色输入框背景 |
| New 角标 | #24EE89 背景 + #1A1D1D 文字 | 游戏卡片左上角, 8px 字号 |
| 收藏按钮背景 | rgba(0,0,0,0.4) | 28px 圆形半透明底 |
| 收藏-未选中 | #FFFFFF 描边 | 心形图标 stroke |
| 收藏-已选中 | #FF4757 实心 | 心形图标 fill |
| 供应商按钮 | #2A2D2D 背景, #B0B3B3 文字 | 底部供应商网格 |

## 页面设计

### Explore 页面 (ALL GAMES)

**布局从上到下:**

1. **标题栏**
   - 左: 返回箭头 (<)
   - 中: "ALL GAMES" (白色, 16px, bold, 居中)
   - 右: 搜索图标 (放大镜)

2. **搜索框** (始终显示，位于标题栏下方)
   - 全宽搜索框，左侧搜索图标
   - "Search games" placeholder
   - 背景: #1E2020, 边框: 1px solid #3A4142, 圆角 8px, 高度 44px
   - 聚焦边框: #24EE89
   - 搜索无结果时右侧显示清除按钮 (X)
   - 实时搜索，输入即过滤

3. **分类 Chip 栏** (横向滚动，filter-chip 样式)
   - Chip 列表: All Games / New / Recent / My Fav / Slots / Live / Crash / Table Game / Fishing / Lotto
   - **选中态**: 背景 #3A4142 + 白色文字 (非下划线样式)
   - **未选中态**: 透明背景 + #B0B3B3 文字
   - 前 4 个 Chip 有小 SVG 图标 (方格/星/时钟/心形)
   - 样式: padding 6px 12px, 圆角 8px, 12px 字号, font-weight 600
   - 横向可滚动，不换行，hide-scrollbar

4. **筛选行** (flex gap-2, mt-3)
   - 左: "Type:" + 值 "ALL" + 下拉箭头
   - 右: "Providers:" + 值 "ALL" + 下拉箭头
   - 选择器样式: 透明背景, 1px solid #3A4142 边框, 圆角 8px, padding 8px 12px
   - 标签: 12px #B0B3B3, 值: 白色 font-weight 600
   - 各占 flex: 1 等宽

5. **游戏网格** (grid grid-cols-3 gap-x-2 gap-y-3 mt-4)
   - 3 列网格 (移动端 430px)
   - 每个卡片: 缩略图占位 + 游戏名 + 供应商名
   - 缩略图: 1:1 正方形, 圆角 8px, #2A2D2D 背景 (占位), 居中缩写文字
   - 游戏名: 12px, 白色, 单行截断 (text-overflow: ellipsis)
   - 供应商名: 10px, #6B7070
   - 卡片间距: gap-x-2 (8px 水平) / gap-y-3 (12px 垂直)
   - New 角标: position absolute top:6px left:6px, #24EE89 背景, #1A1D1D 文字, 8px 字号
   - 收藏按钮: position absolute top:6px right:6px, 28px 圆形, rgba(0,0,0,0.4) 背景
   - 悬浮效果: transform scale(1.05) 200ms transition
   - 无限滚动: 底部显示旋转 spinner + "Loading more games..." 文字

6. **底部供应商 Logo 网格** (section-label "Game Providers" + 4 列网格)
   - 标题: "Game Providers", 13px, 700, #B0B3B3, 大写, letter-spacing 0.5px
   - 4 列网格 (grid grid-cols-4 gap-2)
   - 按钮: #2A2D2D 背景, 圆角 8px, padding 10px 8px, min-height 44px
   - 文字: 10px, 600, #B0B3B3, 居中
   - 悬浮: #323738 背景
   - 19 个供应商: JILI / Spribe / JDB / Evolution / INOUT / Hacksaw / PG / Playtech / Turbo Games / MG / Habanero / SA Gaming / NetEnt / Nolimit City / Red Tiger / Big Time Gaming / TAP-A-ROO / Ezugi / EENI

7. **底部 Tab 栏** (fixed bottom, 64px 高)
   - 5 个 Tab: Menu / Explore / GET 1700 / Raffle / Quest
   - 背景: #323738
   - 当前高亮: Explore (品牌色)
   - 中间 GET 1700: 56px 圆形渐变按钮, 向上突出 -16px
   - 非活跃: #6B7070
   - Tab 文字: 10px, 600

### 游戏卡片组件

```
+------------------+
| [New]        [♡] |
|                  |
|    缩略图        |
|                  |
+------------------+
  游戏名
  供应商
```

| 属性 | 值 |
|------|-----|
| 缩略图尺寸 | 1:1 正方形 (自适应列宽) |
| 圆角 | 8px |
| 游戏名字号 | 12px |
| 供应商字号 | 10px |
| New 标签 | 绝对定位 top:6px left:6px |
| 收藏按钮 | 绝对定位 top:6px right:6px |
| 悬浮效果 | scale(1.05) 200ms |

### 搜索结果

- 搜索框输入时实时过滤游戏
- 无结果时显示空状态: 搜索图标 + "No games found" 文字
- 搜索高亮匹配的文字部分

### 空状态

| 场景 | 图标 | 主文案 | 副文案 |
|------|------|--------|--------|
| My Fav 无收藏 | 心形 (64px, #6B7070) | No favourite games yet | Browse games to add favourites |
| Recent 无记录 | 时钟 (64px, #6B7070) | No recently played games | Start playing to see your history here |
| 搜索无结果 | 搜索 (64px, #6B7070) | No games found | Try a different search term |

空状态区域垂直居中 (padding 48px 16px, gap 12px)，主文案 16px #B0B3B3 600 weight，副文案 13px #6B7070 text-align center。

### 加载态 (骨架屏)

- 与正常态同布局 (标题栏 + 搜索框 + 分类 Chip + 筛选行)
- 游戏网格替换为骨架占位:
  - 缩略图: #2A2D2D 背景, 1:1 正方形, 圆角 8px
  - 游戏名: #2A2D2D, 12px 高, 随机宽度 (60%-90%)
  - 供应商名: #2A2D2D, 10px 高, 随机宽度 (40%-60%)
  - shimmer 动画: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent), translateX, 1.5s infinite
- 9 个占位卡片 (3x3 网格)

### 未登录收藏提示

- 未登录用户点击收藏按钮时，弹出登录提示弹窗
- 复用用户系统的登录弹窗组件

## 组件规范

### 筛选选择器 (filter-select)

| 属性 | 值 |
|------|-----|
| 布局 | flex, align-items center, gap 4px |
| 内边距 | 8px 12px |
| 边框 | 1px solid #3A4142 |
| 圆角 | 8px |
| 背景 | transparent |
| 标签文字 | 12px, #B0B3B3 |
| 值文字 | 12px, #FFFFFF, font-weight 600 |
| 下拉箭头 | 右侧 chevron-down 12px, #6B7070, ml-auto |
| 宽度 | flex: 1 (两个等宽) |

### 搜索框 (search-box)

| 属性 | 值 |
|------|-----|
| 高度 | 44px |
| 背景 | #1E2020 |
| 边框 | 1px solid #3A4142 |
| 圆角 | 8px |
| 内边距 | 0 12px |
| 布局 | flex, align-items center, gap 8px |
| 搜索图标 | 左侧, 20px, #6B7070, flex-shrink-0 |
| 输入文字 | 14px, #FFFFFF |
| Placeholder | "Search games", #6B7070 |
| 聚焦边框 | #24EE89 |
| 清除按钮 | 右侧 X 图标, 16px, #6B7070 (仅搜索有内容时显示) |

### 分类 Chip (filter-chip)

| 属性 | 值 |
|------|-----|
| 布局 | inline-flex, align-items center, gap 4px |
| 内边距 | 6px 12px |
| 圆角 | 8px |
| 字号 | 12px, font-weight 600 |
| 默认态 | transparent 背景, #B0B3B3 文字 |
| 选中态 | #3A4142 背景, #FFFFFF 文字 |
| 图标 | 14px (前4个 Chip 有图标) |

## 交互说明

- 分类 Tab 切换: 即时过滤，带加载态
- 供应商下拉: 展开浮层列表，选中后过滤
- 分类 + 供应商可组合筛选
- 游戏网格无限滚动，底部加载 spinner
- 点击游戏卡片 -> 跳转游戏加载页 (全屏 loading -> iframe 游戏)
- 长按/右上角心形 -> 收藏/取消收藏
- 搜索支持防抖 (300ms)

## merge.html 预览 Tab 列表

| Tab | 说明 |
|-----|------|
| Normal | 正常态 - 12 个游戏卡片 + 供应商网格 + 底部 Tab |
| Empty: My Fav | 空状态 - My Fav 无收藏 |
| Empty: Recent | 空状态 - Recent 无记录 |
| Empty: Search | 空状态 - 搜索无结果 (输入框有文字 + 清除按钮) |
| Loading | 加载态 - 9 个骨架屏占位 |

## 关键决策

1. Explore 页面在全局框架内 (有底部 Tab 栏)
2. 搜索框始终显示 (不是默认收起)
3. 分类使用 filter-chip 样式 (背景色高亮)，非传统下划线 Tab
4. 游戏网格 3 列固定，不响应式变化
5. 游戏缩略图使用占位背景 + 缩写文字 (前端替换为真实图片后使用懒加载)
6. 分类 Chip "All Games" 默认选中
