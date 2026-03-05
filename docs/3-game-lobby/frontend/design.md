# 前端技术方案 -- 赌场游戏大厅

> 需求: game-lobby | 角色: frontend

## 期次分类概览

> **第一期 = 全功能实现。** 游戏大厅所有页面和组件均在第一期完整实现，对接真实 API。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| ExplorePage | 一期全功能 | 真实 API `/games` | 游戏大厅主页 |
| CategoryTabs (10 Tab) | 一期全功能 | 真实 API `/games/categories` | 分类筛选 |
| ProviderFilter | 一期全功能 | 真实 API `/games/providers` | 供应商筛选 |
| GameSearchBar | 一期全功能 | 真实 API `/games?search=` | 搜索框 |
| GameCard | 一期全功能 | 真实 API `/games` | 游戏卡片 (缩略图+名称+收藏) |
| GameGrid | 一期全功能 | 真实 API `/games` | 3 列网格+无限滚动 |
| FavoriteButton | 一期全功能 | 真实 API `/games/:id/favorite` | 收藏/取消 |
| ProviderLogos | 一期全功能 | 真实 API `/games/providers` | 底部供应商展示 |
| EmptyState | 一期全功能 | - | 空状态 (3 种变体) |
| GameGridSkeleton | 一期全功能 | - | 骨架屏加载 |
| GamePlayPage | 一期 Mock | Mock: 返回占位页面 URL | 游戏启动 (第三方接入后续) |

## 技术栈

同项目统一前端栈: React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Axios

## 页面与组件结构

### 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| ExplorePage | /explore | 游戏大厅主页 |
| GamePlayPage | /games/:id/play | 游戏运行页 (iframe/webview) |

### 组件结构

```
src/pages/
  explore/
    ExplorePage.tsx               -- 游戏大厅主页
    components/
      CategoryTabs.tsx            -- 分类 Tab 栏 (All/New/Recent/Fav/Slots/Live/...)
      ProviderFilter.tsx          -- 供应商下拉筛选器
      GameSearchBar.tsx           -- 搜索框
      GameGrid.tsx                -- 游戏网格布局
      GameCard.tsx                -- 单个游戏卡片 (缩略图+名称+New标签+收藏)
      FavoriteButton.tsx          -- 收藏/取消收藏按钮
      ProviderLogos.tsx           -- 页面底部供应商 Logo 展示

  game/
    GamePlayPage.tsx              -- 游戏运行页面
    components/
      GameLoadingScreen.tsx       -- 游戏加载中画面
      GamePlaceholder.tsx         -- Mock 游戏占位页

src/components/
  shared/
    EmptyState.tsx                -- 通用空状态组件 (图标+标题+副标题)
    GameGridSkeleton.tsx          -- 游戏网格骨架屏加载组件
```

### 空状态与加载状态组件 (来自 merge.html)

#### EmptyState.tsx -- 通用空状态

```
3 种变体 (通过 props 传入):

My Fav 空状态:
  图标: 心形 SVG, 64x64px (w-16 h-16), stroke #6B7070, stroke-width 1.5
  标题: "No favourite games yet", 白色 16px semibold
  副标题: "Browse games to add favourites", #6B7070 14px

Recent 空状态:
  图标: 时钟 SVG, 64x64px
  标题: "No recently played games"
  副标题: "Start playing to see your history here"

Search 空状态:
  图标: 搜索 SVG, 64x64px
  标题: "No games found"
  副标题: "Try a different search term"

容器: flex flex-col items-center justify-center, py-20
图标: text-txt-muted (#6B7070)
标题: text-txt, mt-4, text-base font-semibold
副标题: text-txt-muted, mt-2, text-sm
```

#### GameGridSkeleton.tsx -- 骨架屏加载

```
容器: 3 列网格 (grid grid-cols-3 gap-3), 9 个骨架卡片

单个骨架卡片:
  缩略图区: aspect-square, bg-bg-card, 圆角 8px, animate-pulse
  游戏名区: h-3, bg-bg-card, 圆角, mt-2, w-3/4, animate-pulse
  供应商名区: h-2.5, bg-bg-card, 圆角, mt-1, w-1/2, animate-pulse
```

## 路由设计

```typescript
const routes = [
    { path: '/explore', element: <ExplorePage /> },
    { path: '/games/:id/play', element: <GamePlayPage />, auth: true },
];
```

## 状态管理

### gameStore (Zustand)

```typescript
interface GameState {
    categories: Category[];
    providers: Provider[];
    games: Game[];
    filters: {
        category: string | null;   // slug: "slots" | "new" | "recent" | "favorites" | null (all)
        provider: string | null;   // slug: "jili" | null (all)
        search: string;
    };
    pagination: { page: number; pageSize: number; total: number };
    loading: boolean;

    fetchCategories: () => Promise<void>;
    fetchProviders: () => Promise<void>;
    fetchGames: () => Promise<void>;       // 根据 filters 调用不同 API
    loadMore: () => Promise<void>;         // 无限滚动加载下一页
    setFilter: (key: string, value: string | null) => void;
    toggleFavorite: (gameId: number) => Promise<void>;  // 乐观更新 games 中的 is_favorited
}
```

说明:
- 收藏状态不单独存储 ID 列表，后端 `/api/v1/games` 的每个 game 已包含 `is_favorited` 字段
- `toggleFavorite` 先乐观更新 `games` 数组中对应 game 的 `is_favorited`，再调用 API
- `filters.category` 为 `"recent"` 或 `"favorites"` 时，`fetchGames` 调用对应的专用 API (`/games/recent` 或 `/games/favorites`)
- 切换分类/供应商/搜索时自动重置 page=1 并重新加载
```

## API 对接

```typescript
// src/api/games.ts
export const gamesApi = {
    list: (params: GameListParams) => get('/games', { params }),
    detail: (id: number) => get(`/games/${id}`),
    categories: () => get('/games/categories'),
    providers: () => get('/games/providers'),
    launch: (id: number) => post(`/games/${id}/launch`),
    favorites: () => get('/games/favorites'),
    addFavorite: (id: number) => post(`/games/${id}/favorite`),
    removeFavorite: (id: number) => del(`/games/${id}/favorite`),
    recent: () => get('/games/recent'),
};
```

## 交互设计

### Explore 页面布局

```
[标题栏: < ALL GAMES 🔍]
[搜索框 (始终可见, 位于标题栏下方)]
[分类 Tabs (filter-chip 胶囊样式): All | New | Recent | My Fav | Slots | Live | Crash | Table | Fishing | Lotto]
  样式: bg #3A4142, 白色文字, 圆角 8px, padding 6px 12px
  选中态: bg #24EE89, 黑色文字
  前 4 个 Tab (All/New/Recent/My Fav) 有 SVG 图标
[筛选行: Type: [All v]  Providers: [ALL v]]
[游戏网格: 3列固定]
  [GameCard] [GameCard] [GameCard]
  [GameCard] [GameCard] [GameCard]
  ...
[无限滚动加载 (IntersectionObserver, 距底200px触发)]
[供应商 Logo 展示区 (4列网格)]
```

### 筛选交互

- 点击分类 Tab: 切换 category filter, 重新加载游戏列表
- 选择供应商: 切换 provider filter, 与 category 组合筛选
- 搜索框始终可见 (位于标题栏下方), 有内容时右侧显示清除按钮 (X), 点击清空搜索
- 搜索框聚焦: 边框变为品牌色 #24EE89, 右侧显示清除按钮 (X)
- 输入搜索: 300ms 防抖, 实时搜索
- 搜索高亮: 第一期不做，后续可优化 (UI design.md 中有定义)
- Recent / My Fav: 需要登录, 未登录提示登录

### 游戏卡片

- 缩略图 (1:1 正方形, 自适应列宽, 圆角 8px)
- 游戏名称 (12px, 白色, 单行截断)
- 供应商名称 (10px, #6B7070)
- New 标签 (绿色角标, 绝对定位 top:6px left:6px)
- 收藏心形按钮 (绝对定位 top:6px right:6px)
- 悬浮/按压: scale(1.05) 200ms 动画
- 点击缩略图 -> 登录检查 -> 跳转 GamePlayPage
- 加载中显示灰色骨架屏占位 (pulse 动画)

### 收藏按钮交互 (FavoriteButton)

- 已登录: 点击切换收藏状态 (乐观更新 UI -> 调用 API)
- 未登录: 点击弹出登录提示弹窗, 引导跳转登录页
- 未收藏样式: 白色描边心形
- 已收藏样式: #FF4757 实心心形

### 供应商 Logo 区 (ProviderLogos)

- 4 列网格, 各供应商 Logo 为圆角矩形按钮
- 点击供应商 Logo -> 调用 setFilter('provider', slug) 跳转到该供应商筛选结果
- Logo 图片从后端 `/assets/providers/<slug>.png` 加载

### 游戏运行页

- 调用 launch API 获取 game_url
- iframe 加载游戏 (Mock: 显示占位页面)
- 顶部返回按钮

## 关键决策

- 游戏卡片缩略图使用 lazy loading (IntersectionObserver), 加载前显示灰色骨架屏 (pulse 动画)
- 无限滚动: IntersectionObserver 监听距底部 200px 触发 loadMore
- 分类和供应商数据在页面首次加载时缓存到 store
- 搜索使用 300ms 防抖避免频繁请求
- 收藏操作乐观更新 (先更新 UI 再发请求)
- 未登录用户点击收藏/Recent/My Fav 时弹出登录提示而非直接 401

## 资源依赖

| 资源 | 来源 | 加载方式 |
|------|------|----------|
| 游戏缩略图 | 后端 `/assets/games/<slug>.jpg` | GameCard 直接引用后端 URL |
| 供应商 Logo | 后端 `/assets/providers/<slug>.png` | ProviderLogos 组件引用 |
| 分类图标 | UI 设计师提供 SVG，放入 `public/assets/icons/categories/` | CategoryTabs 引用本地资源 |
| 搜索/筛选图标 | 组件内联 SVG (heroicons 风格) | 组件代码内嵌 |

- 游戏缩略图和供应商 Logo 由后端静态服务提供 (UI 设计师交付)
- 分类图标 (slots/live/crash/table/fishing/lotto) 由 UI 设计师交付 SVG 文件
- 通用 UI 图标 (搜索/心形/返回箭头等) 使用内联 SVG，不引入外部图标库

## 依赖与约束

- 依赖用户系统: 收藏/最近游玩/启动需登录
- 首页分类区也复用 GameCard 组件
- 游戏缩略图从后端 `/assets/` 静态资源加载，URL 格式: `/assets/games/<slug>.jpg`
- 分类图标和供应商 Logo 的可用性依赖资源抓取任务
