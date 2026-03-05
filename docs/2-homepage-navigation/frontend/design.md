# 前端技术方案 -- 首页布局与导航

> 需求: homepage-navigation | 角色: frontend

## 期次分类概览

> **第一期 = 所有页面 + 所有组件 + mock 数据。** 设计图纸上的每一个组件都必须在第一期完整实现。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| AppLayout / TopBar / BottomTabBar / SideDrawer | 一期 | 真实 API `/config/nav` | 全局布局框架 |
| PromoBanner / BannerCarousel | 一期 | 真实 API `/banners` | 顶部 Banner 轮播 |
| GameSectionRow (x6: Table/Slots/Live/Fishing/Crash/Lotto) | 一期 | 真实 API `/home` game_sections | 游戏分类横向滚动 |
| ProviderGrid | 一期 | 真实 API `/home` providers | 供应商网格 |
| PaymentMethodsBar | 一期 | 真实 API `/home` payment_icons | 支付方式图标 |
| CommunityLinks / FooterSection | 一期 | 真实 API `/home` social_links | 社区+页脚 |
| JackpotSection | 一期 (mock 数据) | mock API `/home` jackpot | 奖池区，后续替换为真实奖池系统 |
| TrendingGames | 一期 (mock 数据) | mock API `/home` trending_games | 热门游戏，后续替换为真实热门算法 |
| RecentBigWin | 一期 (mock 数据) | mock API `/home` big_winners | 大赢家，后续替换为真实中奖记录 |
| OneGoSelection | 一期 (mock 数据) | mock API `/home` one_go_selection | 1GO Selection，后续替换为真实推荐算法 |
| FirstDepositBanner | 一期 (mock 数据) | mock API `/home` promo_banners | 37%返现，后续替换为真实促销系统 |
| LatestBetRace | 一期 (mock 数据) | mock API `/home` latest_bets | 实时投注，后续替换为真实投注流 |
| GET 1700 / Raffle / Quest Tab | 一期占位 | 无 | 显示图标，点击 "Coming Soon" |

## 技术栈

同项目统一前端栈: React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Axios

## 页面与组件结构

### 布局架构

> **变更 (2026-03-04)**: 从 `position: fixed` 方案改为 flex column 容器模式，解决 fixed 元素在宽屏不居中的问题。

```
<App>
  <BrowserRouter>
    <Route element={<AppLayout />}>    -- 带布局的页面
      <Route path="/" element={<HomePage />} />
    </Route>
    <Route path="/register" ... />     -- 无布局的页面
    <Route path="/login" ... />
  </BrowserRouter>
</App>

<!-- AppLayout 内部结构 -->
<div max-w-[430px] h-screen flex flex-col overflow-hidden relative>
  <TopBar />                    -- shrink-0, 文档流内, 始终可见
  <SideDrawer />                -- absolute 定位, 相对 430px 容器
  <main flex-1 overflow-y-auto> -- 独立滚动容器
    <Outlet />
  </main>
  <BottomTabBar />              -- shrink-0, 文档流内, 始终可见
</div>
```

**关键决策**: TopBar 和 BottomTabBar 不使用 `position: fixed`，而是作为 flex column 容器的 `shrink-0` 子项。main 区域使用 `overflow-y-auto` 实现独立滚动，效果等同 fixed 布局但避免了宽屏居中问题。SideDrawer 使用 `absolute` 定位相对于 430px 容器。

### 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| HomePage | / | 首页信息流 |

### 组件结构

```
src/components/
  layout/
    TopBar.tsx                    -- 固定顶栏: Logo + Auth/Balance
    BottomTabBar.tsx              -- 固定底栏: 5个Tab
    SideDrawer.tsx                -- 侧边抽屉菜单
    AppLayout.tsx                 -- 整体布局容器

src/pages/
  home/
    HomePage.tsx                  -- 首页
    components/
      PromoBanner.tsx              -- 顶部促销注册 Banner (一期)
      BannerCarousel.tsx          -- 轮播 Banner (一期)
      JackpotSection.tsx          -- "Jackpot of the Day" 完整区域 (mock 数据)
      TrendingGames.tsx           -- "Trending Games" 大缩略图横向滚动 (mock 数据)
      RecentBigWin.tsx            -- "Recent Big Win" marquee 滚动 (mock 数据)
      GameSectionRow.tsx          -- 单个分类游戏横向滚动区 (一期)
      AllLink.tsx                  -- "All >" 跳转链接 (一期)
      OneGoSelection.tsx          -- "1GO Selection" 带 Sub-Tab 横向滚动 (mock 数据)
      FirstDepositBanner.tsx      -- "37% First Deposit Cash Back" (mock 数据)
      LatestBetRace.tsx           -- "Latest bet & Race" 3-Tab 表格 (mock 数据)
      ProviderGrid.tsx            -- 供应商 4 列网格 (含 NEW 标签) (一期)
      PaymentMethodsBar.tsx       -- 底部支付方式图标 (一期)
      CommunityLinks.tsx          -- 社交媒体链接 (一期)
      FooterSection.tsx           -- 页脚 (版权信息) (一期)
```

## 路由设计

```typescript
const routes = [
    {
        element: <AppLayout />,       // 带 TopBar + BottomTabBar 的布局
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/explore', element: <ExplorePage /> },
            { path: '/wallet/*', element: <WalletRoutes /> },
            { path: '/support', element: <SupportPage /> },
        ]
    },
    // 无布局页面
    { path: '/register', element: <RegisterPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/games/:id/play', element: <GamePlayPage /> },
];
```

## 状态管理

### appStore (Zustand)

```typescript
interface AppState {
    sideDrawerOpen: boolean;
    marketConfig: MarketConfig | null;
    navConfig: NavConfig | null;

    toggleSideDrawer: () => void;
    fetchMarketConfig: () => Promise<void>;
    fetchNavConfig: () => Promise<void>;
}

interface MarketConfig {
    code: string;
    currency: string;
    currency_symbol: string;
    phone_prefix: string;
    locale: string;
}

interface NavConfig {
    bottom_tabs: TabItem[];
    sidebar_menu: MenuItem[];
}
```

## API 对接

```typescript
// src/api/home.ts
export const homeApi = {
    getHomeData: () => get('/home'),
    getBanners: () => get('/banners'),
    getMarketConfig: () => get('/config/market'),
    getNavConfig: () => get('/config/nav'),
};
```

## 交互设计

### 首页完整内容流 (从上到下, 严格按 merge.html 设计稿顺序)

> **策略**: 所有设计图纸上的区域均在一期完整实现。部分组件使用后端 mock 数据渲染，标注 [mock]。
> **注意**: 以下顺序从 merge.html 逐行提取，任何差异以 merge.html 为准。

```
[固定顶栏: Logo | Hot Event | Sign In | Sign Up]

[促销注册 Banner]                       ← 一期
  "Sign Up & Get 100 Bonuses" + Join Now

[Jackpot of the Day]                    ← 一期 [mock 数据]
  [VIP Money Pot card] [Daily Jackpot card]
  [Last Champion row]
  [My Turnover row + GO BET button]

[Trending Games]                        ← 一期 [mock 数据]
  大缩略图 (142x96px) 横向滚动

[Recent Big Win]                        ← 一期 [mock 数据]
  Marquee 横向自动滚动卡片 (140px)

[Table Game 区]                         ← 一期
  56px 小图标横向滚动 + "All >"

[Slots 区]                              ← 一期
[Live 区]                               ← 一期
[Fishing 区]                            ← 一期

[1GO Selection 区]                      ← 一期 [mock 数据]
  Sub-Tab: 1GO | Deposit | Cashier | Pay | Mega
  56px 小图标横向滚动 + "All >"

[Crash 区]                              ← 一期
[Lotto 区]                              ← 一期

[支付方式图标]                           ← 一期
  UPI | Paytm | PhonePe | GPay | IMPS | USDT

[37% First Deposit Cash Back Banner]    ← 一期 [mock 数据]
  绿色渐变 + "Deposit Now" 按钮

[Latest bet & Race]                     ← 一期 [mock 数据]
  3 Tab: Latest Bet | High Roller | High Multiplier
  表格: Game | Player | Profit

[供应商网格]                             ← 一期
  4 列网格, 供应商名/Logo, NEW 角标

[Community 社交媒体]                     ← 一期
  Telegram | Facebook | Instagram | WhatsApp | YouTube

[页脚]                                   ← 一期
  Privacy Policy | Terms Of Service

[固定底栏: Menu | Explore | GET1700 | Raffle | Quest]
```

### 顶栏

- 未登录: Logo (左) + Sign In (白色文字无背景) + Sign Up (绿色渐变按钮, 右)
- 已登录: Logo (左) + ₹1,000 + 充值按钮 (右)

### 底部 Tab 栏

- 5 个 Tab, 第一期仅 Menu 和 Explore 可用
- 不可用 Tab 显示灰色图标, 点击提示 "Coming Soon"
- Menu Tab 打开侧边抽屉

### 侧边抽屉

- 从左侧滑出, 半透明遮罩
- 游戏分类快捷入口 (Favourite/Crash/Live/Slots/...)
- 功能入口 (Notifications/Live Support/...)
- 不可用项显示灰色 + "Coming Soon" 标签

### Banner 轮播

- 自动轮播 (5s 间隔)
- 手势滑动切换
- 底部圆点指示器

## Mock 数据组件拆分与渲染方案

> **核心原则**: 设计图纸上有的所有区域，第一期前端全部完整实现。部分组件使用后端 mock 数据渲染，后续替换为真实数据源时前端无需修改。

### Mock 数据组件清单 (精确匹配 merge.html)

| 组件 | merge.html 区域 | 一期状态 | Mock 数据来源 |
|------|----------------|---------|--------------|
| `JackpotSection.tsx` | "Jackpot of the Day" | 组件化 + mock 渲染 | `/api/v1/home` 的 `jackpot` 字段 |
| `TrendingGames.tsx` | "Trending Games" | 组件化 + mock 渲染 | `/api/v1/home` 的 `trending_games` 字段 |
| `RecentBigWin.tsx` | "Recent Big Win" | 组件化 + mock 渲染 | `/api/v1/home` 的 `big_winners` 字段 |
| `FirstDepositBanner.tsx` | "37% First Deposit Cash Back" | 组件化 + mock 渲染 | `/api/v1/home` 的 `promo_banners` 字段 |
| `OneGoSelection.tsx` | "1GO Selection" | 组件化 + mock 渲染 | `/api/v1/home` 的 `one_go_selection` 字段 |
| `LatestBetRace.tsx` | "Latest bet & Race" | 组件化 + mock 渲染 | `/api/v1/home` 的 `latest_bets` 字段 |

### Mock 数据组件详细规范 (来自 merge.html)

#### JackpotSection.tsx -- "Jackpot of the Day"

```
位置: 促销注册 Banner 下方

布局:
  标题行: 奖杯图标(金色SVG) + "Jackpot of the Day" (16px extrabold) + "More >" 链接

  双卡行 (flex gap-3):
    [VIP Money Pot 卡片]                [Daily Jackpot 卡片]
      背景: #323738, 圆角 12px, p-4      背景: linear-gradient(135deg, #1a3a1e, #0d2a12)
      标题: txt-secondary 12px semibold   标题: brand色 12px semibold
      倒计时: txt-muted 10px (脉冲动画)   金额: 白色 18px extrabold (发光脉冲动画)
      金额: 白色 18px extrabold           "Winner" txt-secondary 10px
                                          右侧: 奖杯装饰图 (opacity-30, 绝对定位)

  Last Champion 行 (mt-2, bg #323738, 圆角 8px, p-2):
    [头像 32px圆形] + [Last Champion / 用户名] + [投注额 / 奖金(brand色)]

  My Turnover 行 (mt-2, bg #323738, 圆角 8px, p-3):
    左: "My Turnover" 标签 + 数字 (18px extrabold)
    右: "GO BET" 绿色按钮 (bg-brand, text-black, extrabold, 14px, px-5 py-2, 圆角 8px)
```

#### TrendingGames.tsx -- "Trending Games"

```
位置: Jackpot 区下方

标题: "Trending Games" (16px extrabold)
布局: 横向可滚动 (game-scroll hide-scrollbar), flex gap-3

单张卡片 (trending-card):
  宽度: 142px, flex-shrink: 0
  缩略图: 142x96px, 圆角 8px, object-fit: cover
  游戏名: 12px 白色, mt-1, 单行截断
  供应商名: 10px #6B7070
  hover: scale(1.05) 200ms transition
```

#### RecentBigWin.tsx -- "Recent Big Win"

```
位置: Trending Games 下方

标题: "Recent Big Win" (16px extrabold)
布局: marquee 容器 (overflow: hidden)
  内部轨道: flex gap-3, animation marqueeScroll 20s linear infinite
  内容需复制一份实现无缝循环 (translateX(-50%))

单张卡片 (bigwin-card):
  宽度: 140px, flex-shrink: 0
  背景: #323738, 圆角 8px, padding 8px
  游戏缩略图: 48x48px, 圆角 8px, 居中
  游戏名: 12px 白色 semibold 居中
  倍率: "x 80.0" brand色 12px bold
```

#### OneGoSelection.tsx -- "1GO Selection"

```
位置: Fishing 区下方, Crash 区上方 (merge.html line 644-676)

标题行: 1GO图标(24px SVG, 绿色圆角方块+1GO文字) + "1GO Selection" (16px extrabold) + "All >" 链接

Sub-Tab 栏 (flex gap-2 mb-3, 横向可滚动 hide-scrollbar):
  5 个 Tab: "1GO" | "Deposit" | "Cashier" | "Pay" | "Mega"
  激活态: bg-brand (#24EE89), text-black, px-3 py-1.5, rounded-full, 12px semibold
  非激活: bg-bg-hover (#323738), text-txt-secondary (#B0B3B3), 同样尺寸
  whitespace-nowrap

游戏列表: 与 GameSectionRow 相同布局
  game-scroll hide-scrollbar flex gap-3
  56px 小图标 + 10px 游戏名, 横向滚动

Mock 数据:
  Tab 切换时切换游戏列表 (一期可仅显示默认 Tab 的游戏)
  数据来自 /api/v1/home 的 one_go_selection 字段
```

#### FirstDepositBanner.tsx -- "37% First Deposit Cash Back"

```
位置: Lotto 区下方 (所有游戏分类区之后)

容器: mx-4 mt-6, 圆角 12px, cursor-pointer
  背景: linear-gradient(90deg, #24EE89 0%, #0d6b32 100%)
  内边距: p-4, flex justify-between items-center

  左侧: "37% First Deposit Cash Back" (黑色 #000, 16px extrabold)
  右侧: "Deposit Now" 按钮 (bg-black, text-brand, 14px extrabold, px-4 py-2, 圆角 8px, whitespace-nowrap)
```

#### LatestBetRace.tsx -- "Latest bet & Race"

```
位置: 37% Banner 下方

标题: "Latest bet & Race" (16px extrabold)

Tab 栏 (flex gap-2, bg #232626, 圆角 8px):
  3 个 Tab: "Latest Bet" | "High Roller" | "High Multiplier"
  激活态: bg #323738, 白色文字
  非激活: 文字 #6B7070
  样式: px-4 py-2, 14px semibold, 圆角 8px, whitespace-nowrap

表格:
  表头行 (bet-row): Game | Player | Profit
    font-size 12px, color #6B7070, padding 8px 16px, 底部 divider #3A3D3D

  数据行 (bet-row):
    grid-template-columns: 1fr 1fr auto
    padding: 12px 16px, border-bottom: 1px solid #2A2D2D

    Game 列: [首字母圆形 20px (bg-brand/20 text-brand 10px)] + 游戏名 (14px 白色, 截断)
    Player 列: 玩家ID (14px txt-secondary)
    Profit 列: 正数 "+₹ 3.2" (brand色 semibold) / 零 "0" (txt-muted)
```

### 底部 Tab 栏占位方案

| Tab | 一期状态 | 占位方案 |
|-----|---------|---------|
| Menu | 可用 | 正常功能 |
| Explore | 可用 | 正常功能 |
| GET 1700 | 一期占位 | 显示图标+文字，点击提示 "Coming Soon" Toast |
| Raffle | 一期占位 | 显示图标+文字，点击提示 "Coming Soon" Toast |
| Quest | 一期占位 | 显示图标+文字，点击提示 "Coming Soon" Toast |

### 组件文件结构 (全部一期交付)

```
src/pages/home/components/
  PromoBanner.tsx              ← 真实数据
  BannerCarousel.tsx           ← 真实数据
  JackpotSection.tsx           ← mock 数据 -- Jackpot of the Day 完整区域
  TrendingGames.tsx            ← mock 数据 -- 大缩略图 142x96 横向滚动
  RecentBigWin.tsx             ← mock 数据 -- marquee 自动滚动卡片
  GameSectionRow.tsx           ← 真实数据
  AllLink.tsx                  ← 真实数据
  OneGoSelection.tsx           ← mock 数据 -- 1GO Selection 带 Sub-Tab 横向滚动
  FirstDepositBanner.tsx       ← mock 数据 -- 37% 首存返现绿色渐变 Banner
  LatestBetRace.tsx            ← mock 数据 -- 3 Tab 投注表格
  ProviderGrid.tsx             ← 真实数据
  PaymentMethodsBar.tsx        ← 真实数据
  CommunityLinks.tsx           ← 真实数据
  FooterSection.tsx            ← 真实数据
```

### Mock 数据渲染规则

- mock 数据组件从后端 `/api/v1/home` 聚合接口获取数据
- 数据为空或接口未返回对应字段时，组件不渲染 (graceful degradation)
- 组件内部不硬编码 mock 数据，所有数据均来自后端 API
- 后续接入真实数据时，只需后端替换数据源，前端组件无需修改

## 关键决策

- 深色主题: 背景 #232626, 品牌色 #24EE89, 字体 AvertaStd
- 移动优先: 主内容区 ~430px, 桌面端居中
- **布局方案**: flex column 容器模式 (非 fixed 定位), TopBar/BottomTabBar 为 shrink-0, main 为 flex-1 overflow-y-auto, SideDrawer 为 absolute
- 游戏分类区: 每区 10 个游戏, 横向滚动 (CSS scroll-snap)
- 首页数据通过聚合 API /home 一次获取 (banners+game_sections+providers+payment_icons+social_links+jackpot+trending_games+big_winners+one_go_selection+promo_banners+latest_bets)
- 导航配置通过 /config/nav 动态获取
- 所有动态数据从后端 API 获取, 前端不硬编码
- **全部组件一期交付**: 所有设计图纸上的区域在一期均拆分为独立组件完整实现，部分组件使用后端 mock 数据渲染，确保 1:1 还原设计图纸

## 资源管理方案 (1:1 视觉还原)

### 资源来源

所有 UI 资源由 UI 设计师交付，前端开发以 UI 设计图纸 (merge.html) 为准:

| 资源类型 | 来源 | 存储路径 | 说明 |
|----------|------|----------|------|
| 品牌 Logo | UI 设计师交付 | `public/assets/brand/logo.svg` | GO PLUS 品牌 Logo |
| 底部 Tab 图标 | UI 设计师交付 | `public/assets/icons/tabs/` | menu/explore/gift/raffle/quest 共 5 个 |
| 侧边菜单图标 | UI 设计师交付 | `public/assets/icons/menu/` | 各分类和功能图标 |
| Banner 图片 | UI 设计师交付/管理上传 | 后端 `/assets/banners/` | 轮播 Banner 图片 |
| 游戏分类图标 | UI 设计师交付 | `public/assets/icons/categories/` | slots/live/crash 等分类图标 |
| 支付方式图标 | UI 设计师交付 | `public/assets/icons/payment/` | UPI/Paytm/GPay/AmazonPay |
| 社交媒体图标 | UI 设计师交付 | `public/assets/icons/social/` | Telegram/Facebook 等 |
| 游戏缩略图 | UI 设计师交付 | 后端 `/assets/games/` | 100+ 游戏缩略图 |
| 供应商 Logo | UI 设计师交付 | 后端 `/assets/providers/` | 18+ 供应商 Logo |
| 装饰元素 | UI 设计师交付 | `public/assets/decorations/` | 金币/奖杯/彩带等装饰图 |

### 字体方案

```css
/* AvertaStd 字体由 UI 设计师交付 */
@font-face {
    font-family: 'AvertaStd';
    src: url('/assets/fonts/AvertaStd-ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-display: swap;
}
@font-face {
    font-family: 'AvertaStd';
    src: url('/assets/fonts/AvertaStd-Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}
@font-face {
    font-family: 'AvertaStd';
    src: url('/assets/fonts/AvertaStd-Semibold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
}
```

- 字体文件由 UI 设计师交付
- 存储在 `public/assets/fonts/`
- 使用 `font-display: swap` 避免 FOIT
- fallback: `'Inter', system-ui, sans-serif`

### 资源抓取策略

1. **资源来源**: UI 设计师交付到 `docs/<req>/ui/Resources/` 目录
2. **格式优化**: SVG 优先 (图标/Logo)，PNG/WebP (缩略图/Banner)
3. **命名规范**: kebab-case，如 `slots-icon.svg`, `jili-logo.png`
4. **存储分类**: 前端静态资源放 `public/assets/`，后端动态资源放后端 `/assets/`
5. **图片优化**: 缩略图统一压缩到合适尺寸 (游戏卡片 280x280，Banner 860x360)

### 静态资源目录结构

```
public/
  assets/
    brand/              -- Logo, favicon
    fonts/              -- AvertaStd 字体文件
    icons/
      tabs/             -- 底部 Tab 图标
      menu/             -- 侧边菜单图标
      categories/       -- 游戏分类图标
      payment/          -- 支付方式图标
      social/           -- 社交媒体图标
    decorations/        -- 装饰元素 (奖轮, 金币等)
```

## 依赖与约束

- 顶栏/底栏/侧边菜单是全局组件，所有页面共享
- 首页依赖游戏数据 (通过聚合 API)
- 认证状态影响顶栏显示
- 底部 Tab 的可用状态由后端配置控制
- 资源抓取是前端开发的前置依赖，需在 UI 开发前完成
- AvertaStd 字体是 1:1 还原的关键，必须确保正确加载
