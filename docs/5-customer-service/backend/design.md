# 后端技术方案 -- 客服系统

> 需求: customer-service | 角色: backend

## 期次分类概览

> **第一期 = 全功能实现。** 客服后端 API 在第一期真实实现。在线客服 Mock 在前端处理。

### 一期全功能 API

| API | 说明 | 数据来源 |
|-----|------|----------|
| GET /api/v1/support/links | 社交媒体客服链接 | social_links 表查询 |
| GET /api/v1/support/live-chat | 在线客服配置 | live_support_config 表查询 |

### Mock 说明

在线客服 Mock 完全在前端处理 (预设自动回复)，后端仅提供配置信息。后续接入第三方 SDK (Tawk.to / LiveChat) 时，后端提供 SDK 配置信息。

## 技术栈

同项目统一技术栈: Go + Gin + GORM + SQLite + Zap

## 数据模型

### social_links 表

```sql
CREATE TABLE social_links (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,             -- Telegram, WhatsApp 等
    platform        VARCHAR(50) NOT NULL,              -- telegram, whatsapp, facebook, instagram, youtube
    url             VARCHAR(500) NOT NULL,
    icon_url        VARCHAR(500) DEFAULT '',
    sort_order      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### live_support_config 表

```sql
CREATE TABLE live_support_config (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    provider        VARCHAR(50) NOT NULL,              -- mock / tawk / livechat
    config          TEXT DEFAULT '{}',                 -- JSON 配置
    status          VARCHAR(20) DEFAULT 'active',
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

## API 设计

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/support/links | 社交媒体客服链接 | 否 |
| GET | /api/v1/support/live-chat | 在线客服配置 | 否 |

### GET /api/v1/support/links

```json
{
    "code": 0, "message": "success",
    "data": [
        { "name": "Telegram", "platform": "telegram", "url": "https://t.me/goplus_support", "icon_url": "/assets/social/telegram.svg" },
        { "name": "WhatsApp", "platform": "whatsapp", "url": "https://wa.me/919999999999", "icon_url": "/assets/social/whatsapp.svg" },
        { "name": "Facebook", "platform": "facebook", "url": "https://facebook.com/goplus", "icon_url": "/assets/social/facebook.svg" },
        { "name": "Instagram", "platform": "instagram", "url": "https://instagram.com/goplus", "icon_url": "/assets/social/instagram.svg" },
        { "name": "YouTube", "platform": "youtube", "url": "https://youtube.com/@goplus", "icon_url": "/assets/social/youtube.svg" }
    ]
}
```

### GET /api/v1/support/live-chat

```json
{
    "code": 0, "message": "success",
    "data": { "provider": "mock", "enabled": true, "config": {} }
}
```

## 业务逻辑

- 社交媒体链接: 纯配置数据，前端直接跳转外部链接
- 在线客服: 第一期前端 Mock 对话窗口 (预设自动回复)，后续接入第三方 SDK
- 社交链接数据同时包含在首页 /api/v1/home 聚合接口中

### Seed 数据

- 5 个社交媒体链接
- 1 条 live_support_config (provider=mock)

## 关键决策

- 客服系统第一期轻量实现，不做自建聊天系统
- 在线客服 Mock: 前端显示对话 UI，预设自动回复
- 后续考虑接入 Tawk.to 或 LiveChat

## 依赖与约束

- 客服系统相对独立，不强依赖其他模块
- 社交链接通过管理后台可配置
