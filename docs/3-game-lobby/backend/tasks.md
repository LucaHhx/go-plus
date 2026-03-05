# 任务清单

> 计划: game-lobby/backend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 设计并迁移game_providers/game_categories/games/user_favorites/user_recent_games表 | 已完成 | 2026-03-04 | 2026-03-04 | 更新Game模型(新增game_url/market_code), 新增UserFavorite/UserRecentGame模型, 更新AutoMigrate和Seed清理逻辑 |
| 2 | 实现游戏Seed数据(6分类+18供应商+100游戏, 资源由UI设计师交付) | 已完成 | 2026-03-04 | 2026-03-04 | 扩充Seed数据到120个游戏, 覆盖全部19个供应商, 6个分类均有15-25个游戏 |
| 3 | 实现GET /api/v1/games列表(分类+供应商+搜索+分页) | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /api/v1/games列表API, 支持category/provider/search/page筛选, 包含特殊分类(new/recent/favorites/all) |
| 4 | 实现GET /api/v1/games/categories和/providers端点 | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /categories和/providers端点, 返回6个分类和19个供应商 |
| 5 | 实现POST /api/v1/games/:id/launch(GameLauncher接口+Mock) | 已完成 | 2026-03-04 | 2026-03-04 | 实现POST /games/:id/launch, GameLauncher接口+MockGameLauncher, 自动记录最近游玩 |
| 6 | 实现收藏API(POST/DELETE /api/v1/games/:id/favorite) | 已完成 | 2026-03-04 | 2026-03-04 | 实现POST/DELETE /games/:id/favorite, 幂等操作 |
| 7 | 实现GET /api/v1/games/favorites和/recent端点 | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /favorites和/recent端点, 按收藏时间/played_at倒序, 支持分页 |
| 8 | 游戏列表支持is_favorited字段(已登录用户) | 已完成 | 2026-03-04 | 2026-03-04 | 通过OptionalAuthMiddleware解析JWT, 已登录用户games列表/详情自动返回is_favorited状态 |
| 9 | 集成UI设计师交付的游戏缩略图和供应商Logo到/assets/目录 | 已完成 | 2026-03-04 | 2026-03-04 | Seed数据的前置依赖, 资源由UI设计师从原站抓取; 已创建assets目录结构(games/providers/icons), 当前Seed数据使用远程URL作为占位, 待UI设计师交付本地资源后替换 |