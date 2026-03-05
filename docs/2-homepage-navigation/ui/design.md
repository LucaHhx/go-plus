# UI 设计方案 -- 首页布局与导航

> 需求: homepage-navigation | 角色: ui
> 更新日期: 2026-03-04
> 参考原站: https://1goplus.com/ (通过实际抓取分析)

## 设计理念

1:1 克隆 1goplus.com 首页视觉效果。深色主题赌场风格，移动优先，竖屏优先。所有颜色、间距、圆角、字体均从原站实际 CSS 计算样式提取，确保视觉一致性。

## 全局设计系统 (Design Tokens)

### 调色板 (从原站 getComputedStyle 提取)

| 用途 | 色值 | CSS Token | 原站验证来源 |
|------|------|-----------|-------------|
| 页面主背景 | #232626 | `bg-bg` | body.backgroundColor = rgb(35, 38, 38) |
| 底部栏/头部背景 | #323738 | `bg-bg-layer4` | tabbar bg = rgb(50, 55, 56) |
| 侧边菜单背景 | #1A1D1D | `bg-bg-deep` | sidebar bg |
| 卡片背景 | #2A2D2D | `bg-bg-card` | 输入框、列表背景 |
| 悬浮/按钮底色 | #323738 | `bg-bg-hover` | 按钮、供应商格子 |
| 品牌色 (主) | #24EE89 | `text-brand` | CTA、选中态、图标强调 |
| 品牌色 (渐变终点) | #9FE871 | `brand-end` | Sign Up 按钮渐变 = linear-gradient(90deg, #24EE89, #9FE871) |
| 品牌色 (暗) | #1DBF6E | `brand-dark` | 按钮 hover 态 |
| 品牌色 (透明) | rgba(36,238,137,0.15) | `brand-light` | 品牌色背景填充 |
| 文字色 (主) | #FFFFFF | `text-white` | 标题、重要文本 |
| 文字色 (次) | #B0B3B3 | `text-txt-secondary` | 描述文字、placeholder |
| 文字色 (弱) | #6B7070 | `text-txt-muted` | 未选中 Tab、禁用态 |
| 分割线 | #3A3D3D | `border-divider` | 边框、分隔线 |
| 错误色 | #FF4757 | `text-error` | 错误提示、Hot 标签 |
| 警告色 | #FFA502 | `text-warning` | 处理中状态 |
| 遮罩层 | rgba(0,0,0,0.6) | - | 侧边菜单遮罩 |

### 字体方案 (从原站按钮 getComputedStyle 提取)

| 属性 | 值 | 验证来源 |
|------|------|---------|
| 主字体 | 'AvertaStd', 'Inter', system-ui, sans-serif | 原站 CSS |
| 主字重 | 800 (Extra Bold) | Sign In/Up 按钮 fontWeight = "800" |
| 正文字重 | 400 (Regular) | 正文内容 |
| 中等字重 | 600 (Semi Bold) | Tab 标签、辅助按钮 |
| Sign Up 字号 | 16px | 按钮 fontSize = "16px" |
| Sign In 字号 | 16px | 按钮 fontSize = "16px" |

### 字号层级 (从原站提取)

| 层级 | 移动端 | 用途 | 原站 class |
|------|--------|------|-----------|
| Section Title | 16px / font-extrabold | 区块标题 ("Slots", "Table Game" 等) | text-base font-extrabold |
| Body | 14px | 正文、描述 | text-sm |
| Caption | 12px | 辅助说明、游戏名 | text-xs |
| Small | 10px | Tab 标签文字、角标 | text-2xs |

### 间距系统

| Token | 值 | 用途 |
|-------|-----|------|
| xs | 4px | 图标与文字间距、游戏卡片间 text gap |
| sm | 8px | 紧凑元素间距 |
| md | 12px | 游戏图标网格 gap (gap-3) |
| base | 16px | 页面水平内边距 (px-4) |
| lg | 16px | 区块间距 (mt-4) |
| xl | 24px | 大区块间距 (mt-6) |

### 圆角

| 用途 | 值 |
|------|-----|
| 按钮 | 8px (rounded-lg) |
| 输入框 | 8px |
| 游戏缩略图 | 8px |
| 卡片/Banner | 12px (rounded-xl) |
| 供应商格子 | 8px |
| 头像/GET1700 | 50% (rounded-full) |
| Hot/New 标签 | 4px |

### 阴影

深色主题下不使用明显阴影，依靠背景色层次 (#232626 -> #323738 -> #2A2D2D) 区分层级。

## 布局结构

### 整体框架

**布局方案: Flex Column 容器 (非 fixed 定位)**

外层 430px 容器使用 `h-screen flex flex-col overflow-hidden`，header 和 nav 用 `shrink-0` 固定高度，main 用 `flex-1 overflow-y-auto` 撑满剩余空间并独立滚动。所有元素都在同一个容器内，不使用 `position: fixed`，避免宽屏下 fixed 元素脱离居中容器的问题。

```
+---------------------------+
| 容器: max-w-430px mx-auto |   h-screen flex flex-col overflow-hidden
| +-----------------------+ |
| |  顶部栏 (shrink-0)    | |   56px, z-index: 1000
| |  bg: rgba(50,55,56,.85)| |   backdrop-filter: blur(10px)
| +-----------------------+ |
| |                       | |
| |  内容区 (flex-1)       | |   overflow-y: auto
| |  (padding: 0 16px)    | |   独立滚动
| |                       | |
| +-----------------------+ |
| |  底部 Tab (shrink-0)   | |   64px, z-index: 999
| |  bg: #323738          | |
| +-----------------------+ |
+---------------------------+
```

- 内容区无需 padding-top/bottom (header/nav 不是 fixed，不会遮挡)
- 最大宽度: 430px (移动端居中)
- 侧边菜单: 使用 `absolute` 定位 (相对于 430px 容器)，而非 `fixed`

### 顶部栏 (从原站精确提取)

- 高度: 56px (h-14)
- 背景: rgba(50, 55, 56, 0.85) + backdrop-filter: blur(10px)
  - 原站使用 class="alpha-layer4"，半透明效果
- 左: Logo 图片 `newlogo-a2586KU_.png` (h-8, 约 124x32px)
- 中间偏右: Hot Event 图标 `hotevent-GYxqVDim.png` (40x44px)
- 右 (未登录):
  - "Sign In": 白色文字, 16px, font-weight: 800, 无背景/边框, h-10, px-4
  - "Sign Up": 渐变背景 linear-gradient(90deg, #24EE89, #9FE871), 黑色文字, 16px, font-weight: 800, rounded-lg, h-10, px-4
- z-index: 1000

### 底部 Tab 栏 (从原站精确提取)

- 高度: 64px
- 背景: #323738 (rgb(50, 55, 56))
- z-index: 999
- 5 个 Tab: Menu / Explore / GET 1700 / Raffle / Quest
- 选中态: 图标 + 文字 #24EE89
- 未选中: 图标 + 文字 #6B7070
- Tab 标签文字: 10px, font-semibold
- 图标: 原站 SVG sprite 图标 (各有独特设计)
- GET 1700 Tab: 居中突出
  - 使用原站图片 `tab200-etZXx2_Z.png` (147x102px)
  - 图片 transform: scale(1.35), 上移突出底部栏
  - 下方绿色底座 bg: rgb(1, 68, 28)
  - 文字 "GET ₹1700" 使用多色 (白/绿/金)

### 侧边抽屉菜单 (从原站截图还原)

- 宽度: 280px
- 从左侧滑出，300ms ease-out
- 背景: #1A1D1D
- 遮罩: rgba(0,0,0,0.6)
- 顶部: 绿色渐变促销 Banner "Sign up & Get 100 Bonuses"
- 游戏分类组:
  - Favourite! (心形图标, 绿色)
  - Weekly Raffle (带 Hot 红色标签)
  - Crash (带 Hot 红色标签)
  - Live
  - Slots
  - Table Game
  - Fishing
  - Lotto
- 分割线
- 功能入口组:
  - Notifications (铃铛图标, #B0B3B3)
  - Hot Event (火焰图标, #FF8800)
  - Gift Code (礼物图标, #24EE89)
  - VIP Club (星星图标, #FFD700)
  - Affiliate (人群图标, #24EE89)
  - GET ₹1700 (信息图标, #24EE89)
  - Live Support (聊天图标, #24EE89)
- 每项: 图标(24px) + 文字(14px, white, semibold) + 右箭头(>) + 间距 px-4 py-3

### 首页内容流 (从原站截图精确还原)

从上到下:

> **一期实现策略**: 所有区块在第一期前端均需完整实现 UI 组件。标注 [mock] 的区域使用 mock 数据，后端 API 在第二/三期接入。标注 [占位] 的区域仅显示图标文字，点击提示即将上线。

1. **促销注册 Banner** — 绿色渐变背景, "Sign Up & Get 100 Bonuses", Join Now 按钮, 右侧装饰图
2. **Jackpot of the Day** [mock] — 标题 + "More >" 链接
   - 两列卡片: VIP Money Pot (倒计时) / Daily Jackpot (金额 + 绿光动画)
   - Last Champion 行: 头像 + 名字 + 金额
   - My Turnover 行: 数字 + GO BET 按钮
3. **Trending Games** [mock] — 横向滚动大卡片 (142x96px 缩略图)
4. **Recent Big Win** [mock] — 横向滚动小卡片 (倍率显示, 跑马灯滚动)
5. **Table Game** — 分类图标 + 横向滚动 56px 游戏图标网格
6. **Slots** — 同上
7. **Live** — 同上
8. **Fishing** — 同上
9. **1GO Selection** — 横向滚动, 带 Tab 切换 (1GO / Deposit / Cashier / Pay / Mega) + 游戏图标网格
10. **Crash** — 同上
11. **Lotto** — 同上
12. **支付方式 Banner** — UPI / Paytm / PhonePe / GPay / IMPS / USDT 图标展示
13. **37% 首充返现 Banner** [mock] — 绿色渐变 + "Deposit Now" 按钮
14. **Latest bet & Race** [mock] — 3 个 Tab (Latest Bet / High Roller / High Multiplier) + 投注数据表格
15. **供应商网格** — 4 列网格, 每格 #323738 背景, 8px 圆角, 含供应商名/Logo
    - 带 NEW 标签的供应商: NETENT, NOLIMIT CITY, RED TIGER, BigTimeGaming, TAP-A-ROO, Ezugi, CENi
16. **Community** — 社交媒体按钮 (各自品牌色背景)
    - Telegram (#229ED9) / facebook (#1877F2) / Instagram (渐变) / WhatsApp (#25D366) / YouTube (#FF0000)
17. **页脚** — Privacy Policy | Terms Of Service

## 组件规范

### 按钮

| 类型 | 背景 | 文字色 | 圆角 | 高度 |
|------|------|--------|------|------|
| Sign Up (CTA) | linear-gradient(90deg, #24EE89, #9FE871) | #000000 (黑色) | 8px | 40px |
| Primary | #24EE89 | #000000 | 8px | 各异 |
| Sign In (Ghost) | transparent | #FFFFFF | 8px | 40px |
| Secondary | #323738 | #FFFFFF | 8px | 各异 |
| Disabled | #323738 | #6B7070 | 8px | 各异 |

### 游戏图标卡片 (56px 网格)

- 容器: flex, gap-3 (12px), 横向滚动, hide-scrollbar
- 单项宽度: 56px, 固定不伸缩
- 图片: 56x56px, rounded-lg (8px), object-fit: cover
- 游戏名: 10px, #B0B3B3, text-center, 单行截断

### Trending 游戏卡片 (大卡片)

- 宽度: 142px
- 缩略图: 142x96px, rounded-lg (8px)
- 游戏名: 12px, white, 单行截断
- 供应商名: 10px, #6B7070

### Recent Big Win 卡片

- 宽度: 140px
- 背景: #323738, rounded-lg (8px), p-2
- 游戏图标: 48x48px, rounded-lg
- 游戏名: 12px, white
- 倍率: 12px, #24EE89, bold

### Latest Bet Tab 组件

- 容器: flex, gap-2
- Tab: px-4 py-2, 14px, font-semibold, rounded-lg
- 选中态: bg #323738, color white
- 未选中: color #6B7070

### 供应商网格

- grid grid-cols-4 gap-2
- 单项: bg #323738, rounded-lg (8px), h-11 (44px), 居中显示
- NEW 标签: 左上角, bg #24EE89, 黑色文字, 8px, font-extrabold

### 社交媒体按钮

- inline-flex, gap-2, px-5 py-2.5, rounded-lg (8px)
- 各自品牌色背景, 白色图标+文字

## 资源引用

### 本地 SVG 图标 (Resources/icons/)

所有 SVG 图标均从原站 SVG sprite 精确复刻，存放在 `Resources/icons/` 目录。前端实现时通过相对路径引用或转为 React 组件。

**底部 Tab 栏图标 (4个):**

| 文件 | 原站 symbol ID | 用途 |
|------|---------------|------|
| `icons/menu-tab.svg` | icon-svg-IconMenu | 底部 Tab 菜单 (四方块, 右上绿色) |
| `icons/explore-tab.svg` | icon-svg-ExploreTab | 底部 Tab 搜索 (放大镜+星) |
| `icons/raffle-tab.svg` | icon-svg-weeklyTab | 底部 Tab Raffle (票券) |
| `icons/quest-tab.svg` | icon-svg-Quest1 | 底部 Tab Quest (礼物盒) |

**侧边菜单/分类区图标 (14个):**

| 文件 | 原站 symbol ID | 用途 |
|------|---------------|------|
| `icons/favourite.svg` | icon-svg-FavouriteMenu | 侧边菜单收藏 |
| `icons/weekly-raffle.svg` | icon-svg-weeklyMenu | 侧边菜单 Weekly Raffle |
| `icons/crash.svg` | icon-svg-CrashMenu | 侧边菜单/分类区 Crash |
| `icons/live-casino.svg` | icon-svg-LiveCasinoMenu | 侧边菜单/分类区 Live |
| `icons/slots.svg` | icon-svg-SlotsMenu | 侧边菜单/分类区 Slots |
| `icons/table-game.svg` | icon-svg-CasinoMenu | 侧边菜单/分类区 Table Game |
| `icons/fishing.svg` | icon-svg-Fishing | 侧边菜单/分类区 Fishing |
| `icons/lotto.svg` | icon-svg-Lotto | 侧边菜单/分类区 Lotto |
| `icons/notifications.svg` | icon-svg-Notifications | 侧边菜单通知 |
| `icons/hot-event.svg` | icon-svg-Promotions | 侧边菜单 Hot Event |
| `icons/gift-code.svg` | icon-svg-Redeems01 | 侧边菜单 Gift Code |
| `icons/vip-club.svg` | icon-svg-VipClubMenu | 侧边菜单 VIP Club |
| `icons/affiliate.svg` | icon-svg-AffiliateMenu | 侧边菜单 Affiliate |
| `icons/live-support.svg` | icon-svg-LiveSupport | 侧边菜单客服 |

**社交媒体图标 (5个):** `icons/telegram.svg`, `icons/facebook.svg`, `icons/instagram.svg`, `icons/whatsapp.svg`, `icons/youtube.svg`

**通用 UI 图标 (5个):** `icons/chevron-right.svg`, `icons/chevron-left.svg`, `icons/close.svg`, `icons/trophy.svg`, `icons/heart.svg`

**辅助图标 (1个):** `icons/info-circle.svg` (GET 1700)

### Design Tokens 文件

| 文件 | 说明 |
|------|------|
| `Resources/tokens.css` | 完整 CSS 变量 (颜色/字体/间距/圆角/布局/组件/动画) |
| `Resources/tailwind.config.js` | Tailwind theme.extend 配置，前端直接合并 |

### 需人工提供的品牌素材 (开发阶段可用原站 CDN)

| 资源 | 开发阶段 URL | 尺寸 |
|------|-------------|------|
| Logo | `https://1goplus.com/png/newlogo-a2586KU_.png` | 124x32px |
| Hot Event 图标 | `https://1goplus.com/png/hotevent-GYxqVDim.png` | 40x44px |
| GET 1700 Tab 图片 | `https://1goplus.com/png/tab200-etZXx2_Z.png` | 147x102px |
| 注册 Banner 装饰 | `https://1goplus.com/png/login-fWVrBuNX.png` | 128x96px |
| Jackpot 奖杯 | `https://1goplus.com/png/trophy-B3u8sNrg-Bogwg3F_.png` | 适配卡片高度 |
| 用户头像 | `https://1goplus.com/png/8-BgAWkeDv.png` | 32x32px |

### 游戏图片路径规则 (动态内容，由后端 API 提供)

- 大缩略图: `https://1goplus.com/static/game/img/{provider}/{id}.png`
- 小图标: `https://1goplus.com/static/game/icon/{provider}/{id}.png`
- 供应商: jili, jdb, spribe, evo, others

## 交互说明

- 侧边菜单: 左侧 300ms ease-out 滑入, 遮罩 opacity 0->0.6
- 游戏分类区: 横向可拖动滚动 (overflow-x: auto, hide-scrollbar)
- Tab 切换 (Latest Bet): 即时切换, 背景色变化
- Jackpot 金额: 绿色发光脉冲动画 (text-shadow)
- GET 1700 图片: 突出底部 Tab 栏, scale(1.35)

## 关键决策

1. 1:1 还原 1goplus.com 首页视觉效果 -- 所有色值、间距、字体均从原站 CSS 提取
2. SVG 图标从原站 sprite 精确复刻，存放在 `Resources/icons/` 目录，前端通过本地路径引用
3. 品牌素材 (Logo、Hot Event、GET 1700 等) 开发阶段可用原站 CDN，生产环境需自行托管
4. 游戏缩略图为动态内容，由后端 API + CDN 提供，不属于本地静态资源
5. 移动优先 430px 宽度
6. 深色主题为唯一主题，不支持浅色模式
7. 底部 Tab 使用原站实际 SVG sprite 图标 (已导出到 Resources/icons/)
8. 顶部栏使用半透明毛玻璃效果 (rgba + backdrop-filter)
9. Sign Up 按钮使用绿色渐变 (不是纯色)
10. 供应商网格用文字替代 Logo 图片 (原站也是文字为主)
11. 首页是全局设计系统的定义者，tokens.css 和 tailwind.config.js 是所有需求的基础配置
