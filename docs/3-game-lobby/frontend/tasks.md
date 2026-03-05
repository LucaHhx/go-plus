# 任务清单

> 计划: game-lobby/frontend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 实现gamesApi模块(src/api/games.ts: 列表/详情/分类/供应商/启动/收藏/最近) | 已完成 | 2026-03-04 | 2026-03-04 | 创建 gamesApi 模块，包含 list/detail/categories/providers/launch/favorites/recent API; 同时扩展 api/client.ts 添加 del 方法和 get params 支持 |
| 2 | 实现gameStore(Zustand: 分类/供应商/筛选/分页/loading状态管理) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 gameStore，支持分类/供应商/搜索筛选、分页、无限滚动 loadMore、乐观更新收藏 |
| 3 | 实现CategoryTabs组件(横向滚动Tab栏, 10个Tab) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 CategoryTabs 10个Tab胶囊样式，前4个含SVG图标，横向滚动 |
| 4 | 实现ProviderFilter组件(供应商下拉筛选) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 ProviderFilter，包含 Type 和 Providers 两个下拉筛选器，支持组合筛选 |
| 5 | 实现GameSearchBar组件(300ms防抖搜索) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 GameSearchBar，300ms 防抖搜索，聚焦时边框变品牌色，有内容时显示清除按钮 |
| 6 | 实现GameCard组件(缩略图+名称+New标签+收藏按钮+乐观更新) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 GameCard + FavoriteButton，包含缩略图懒加载、NEW角标、收藏按钮乐观更新、骨架屏占位 |
| 7 | 实现GameGrid组件(3列网格+lazy loading+无限滚动) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 GameGrid，3列网格+IntersectionObserver无限滚动+骨架屏加载+空状态 |
| 8 | 实现ExplorePage页面(组装Tab+筛选+搜索+网格+空状态) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 ExplorePage，组装标题栏+搜索+Tab+筛选+游戏网格+供应商Logo，支持 URL 参数初始分类 |
| 9 | 实现GamePlayPage(iframe加载游戏+Mock占位页+返回按钮) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 GamePlayPage，调用 launch API 获取 game_url，iframe 加载游戏或显示 Mock 占位页 |
| 10 | 实现ProviderLogos底部供应商Logo展示(4列网格+点击筛选) | 已完成 | 2026-03-04 | 2026-03-04 | 实现 ProviderLogos 4列网格，19个供应商按钮，点击跳转到该供应商筛选结果 |
| 11 | 实现EmptyState空状态组件(My Fav/Recent/Search三种变体, 匹配merge.html规范) | 已完成 | 2026-03-04 | 2026-03-04 | 心形/时钟/搜索图标+标题+副标题; 实现 EmptyState 组件，支持 favorites/recent/search 三种变体 |
| 12 | 实现GameGridSkeleton骨架屏加载组件(3列9卡片, pulse动画) | 已完成 | 2026-03-04 | 2026-03-04 | 匹配merge.html Loading状态; 实现 GameGridSkeleton 骨架屏，3x3 网格 shimmer 动画 |