# 任务清单

> 计划: customer-service/backend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 设计并迁移social_links/live_support_config表 | 已完成 | 2026-03-04 | 2026-03-04 | 创建 SocialLink 和 LiveSupportConfig 模型，添加 AutoMigrate 和 Seed 数据 |
| 2 | 实现GET /api/v1/support/links端点 | 已完成 | 2026-03-04 | 2026-03-04 | 实现 SupportHandler.GetSocialLinks，从 social_links 表查询数据 |
| 3 | 实现GET /api/v1/support/live-chat端点 | 已完成 | 2026-03-04 | 2026-03-04 | 实现 SupportHandler.GetLiveChat，从 live_support_config 表查询配置 |
| 4 | 社交链接Seed数据(Telegram/WhatsApp/Facebook/Instagram/YouTube) | 已完成 | 2026-03-04 | 2026-03-04 | seedSocialLinks 5条数据 + seedLiveSupportConfig mock配置，seedVersion 升至 7 |