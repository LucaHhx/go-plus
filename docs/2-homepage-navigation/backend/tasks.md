# 任务清单

> 计划: homepage-navigation/backend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 设计并迁移banners/markets/system_configs/game_categories/game_providers表 | 已完成 | 2026-03-04 | 2026-03-04 | 含games最小表 |
| 2 | 实现GET /api/v1/home聚合端点(banners+游戏分类+供应商+支付+社交) | 已完成 | 2026-03-04 | 2026-03-04 |  |
| 3 | 实现GET /api/v1/banners端点 | 已完成 | 2026-03-04 | 2026-03-04 |  |
| 4 | 实现GET /api/v1/config/market和/config/nav端点 | 已完成 | 2026-03-04 | 2026-03-04 | sidebar完整15项 |
| 5 | 实现内存缓存(Banner/导航/市场配置启动加载+刷新) | 已完成 | 2026-03-04 | 2026-03-04 | sync.RWMutex |
| 6 | 首页Seed数据(市场IN+Banner+导航+分类+供应商+支付图标+社交链接) | 已完成 | 2026-03-04 | 2026-03-04 | 20供应商/30游戏 |
| 7 | /api/v1/home聚合接口增加二期mock字段(jackpot/trending_games/big_winners/one_go_selection/promo_banners/latest_bets) | 已完成 | 2026-03-04 | 2026-03-04 | 二期功能一期mock数据，硬编码返回，结构严格匹配merge.html; 硬编码jackpot/trending_games/big_winners/promo_banners/one_go_selection/latest_bets mock数据 |
