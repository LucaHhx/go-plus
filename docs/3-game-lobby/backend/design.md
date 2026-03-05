# 后端技术方案 -- 赌场游戏大厅

> 需求: game-lobby | 角色: backend

## 期次分类概览

> **第一期 = 全功能实现。** 游戏大厅全部 API 在第一期真实实现，数据库查询。

### 一期全功能 API

| API | 说明 | 数据来源 |
|-----|------|----------|
| GET /api/v1/games | 游戏列表 (筛选+搜索+分页) | games 表查询 |
| GET /api/v1/games/:id | 游戏详情 | games 表查询 |
| GET /api/v1/games/categories | 分类列表 | game_categories 表 |
| GET /api/v1/games/providers | 供应商列表 | game_providers 表 |
| POST /api/v1/games/:id/launch | 启动游戏 | Mock: 返回占位页面 URL |
| GET /api/v1/games/favorites | 我的收藏 | user_favorites 表 |
| POST /api/v1/games/:id/favorite | 收藏游戏 | user_favorites 表 |
| DELETE /api/v1/games/:id/favorite | 取消收藏 | user_favorites 表 |
| GET /api/v1/games/recent | 最近游玩 | user_recent_games 表 |

### 外部服务 Mock (一期)

| 服务 | Mock 行为 | 后续替换为 |
|------|-----------|-----------|
| 游戏启动 (GameLauncher) | 返回本地占位页面 URL | 真实第三方游戏 SDK 接入 |

## 技术栈

同项目统一技术栈: Go + Gin + GORM + SQLite + Zap

## 数据模型

### game_providers 表

```sql
CREATE TABLE game_providers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL UNIQUE,      -- JILI, Spribe, JDB 等
    slug            VARCHAR(100) NOT NULL UNIQUE,      -- jili, spribe, jdb
    logo_url        VARCHAR(500) DEFAULT '',
    status          VARCHAR(20) DEFAULT 'active',      -- active / disabled
    sort_order      INTEGER DEFAULT 0,
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### game_categories 表

```sql
CREATE TABLE game_categories (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,             -- Slots, Live, Crash 等
    slug            VARCHAR(100) NOT NULL UNIQUE,      -- slots, live, crash
    icon_url        VARCHAR(500) DEFAULT '',
    sort_order      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### games 表

```sql
CREATE TABLE games (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL UNIQUE,
    provider_id     INTEGER NOT NULL,
    category_id     INTEGER NOT NULL,
    thumbnail_url   VARCHAR(500) DEFAULT '',
    game_url        VARCHAR(500) DEFAULT '',           -- 第三方游戏入口 URL
    is_new          BOOLEAN DEFAULT FALSE,
    is_hot          BOOLEAN DEFAULT FALSE,
    status          VARCHAR(20) DEFAULT 'active',      -- active / disabled
    sort_order      INTEGER DEFAULT 0,
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,

    FOREIGN KEY (provider_id) REFERENCES game_providers(id),
    FOREIGN KEY (category_id) REFERENCES game_categories(id)
);

CREATE INDEX idx_games_category ON games(category_id, status);
CREATE INDEX idx_games_provider ON games(provider_id, status);
CREATE INDEX idx_games_market ON games(market_code);
CREATE INDEX idx_games_name ON games(name);
```

### user_favorites 表

```sql
CREATE TABLE user_favorites (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    game_id         INTEGER NOT NULL,
    created_at      DATETIME NOT NULL,
    UNIQUE(user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
```

### user_recent_games 表

```sql
CREATE TABLE user_recent_games (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    game_id         INTEGER NOT NULL,
    played_at       DATETIME NOT NULL,
    UNIQUE(user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
CREATE INDEX idx_recent_user ON user_recent_games(user_id, played_at DESC);
```

## API 设计

### 错误码

- 3001: 游戏不存在
- 3002: 游戏已下架
- 3003: 游戏启动失败

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/games | 游戏列表 (筛选+搜索+分页) | 否 |
| GET | /api/v1/games/:id | 游戏详情 | 否 |
| GET | /api/v1/games/categories | 分类列表 | 否 |
| GET | /api/v1/games/providers | 供应商列表 | 否 |
| POST | /api/v1/games/:id/launch | 启动游戏 | 是 |
| GET | /api/v1/games/favorites | 我的收藏 | 是 |
| POST | /api/v1/games/:id/favorite | 收藏 | 是 |
| DELETE | /api/v1/games/:id/favorite | 取消收藏 | 是 |
| GET | /api/v1/games/recent | 最近游玩 | 是 |

### GET /api/v1/games

```
Query: ?category=slots&provider=jili&search=sugar&page=1&page_size=20
```

```json
{
    "code": 0, "message": "success",
    "data": {
        "games": [
            {
                "id": 1, "name": "Sugar Rush", "slug": "sugar-rush",
                "provider": { "id": 1, "name": "JILI", "slug": "jili" },
                "category": { "id": 1, "name": "Slots", "slug": "slots" },
                "thumbnail_url": "/assets/games/sugar-rush.jpg",
                "is_new": true, "is_hot": false, "is_favorited": false
            }
        ],
        "total": 150, "page": 1, "page_size": 20
    }
}
```

### GET /api/v1/games/categories

```json
{
    "code": 0, "message": "success",
    "data": [
        { "id": 1, "name": "Slots", "slug": "slots", "icon_url": "/assets/icons/slots.svg" },
        { "id": 2, "name": "Live", "slug": "live", "icon_url": "/assets/icons/live.svg" },
        { "id": 3, "name": "Crash", "slug": "crash", "icon_url": "/assets/icons/crash.svg" },
        { "id": 4, "name": "Table Game", "slug": "table-game", "icon_url": "/assets/icons/table.svg" },
        { "id": 5, "name": "Fishing", "slug": "fishing", "icon_url": "/assets/icons/fishing.svg" },
        { "id": 6, "name": "Lotto", "slug": "lotto", "icon_url": "/assets/icons/lotto.svg" }
    ]
}
```

### GET /api/v1/games/:id

```json
{
    "code": 0, "message": "success",
    "data": {
        "id": 1, "name": "Sugar Rush", "slug": "sugar-rush",
        "provider": { "id": 1, "name": "JILI", "slug": "jili", "logo_url": "/assets/providers/jili.png" },
        "category": { "id": 1, "name": "Slots", "slug": "slots" },
        "thumbnail_url": "/assets/games/sugar-rush.jpg",
        "game_url": "",
        "is_new": true, "is_hot": false, "is_favorited": false
    }
}
```

### GET /api/v1/games/providers

```json
{
    "code": 0, "message": "success",
    "data": [
        { "id": 1, "name": "JILI", "slug": "jili", "logo_url": "/assets/providers/jili.png" },
        { "id": 2, "name": "Spribe", "slug": "spribe", "logo_url": "/assets/providers/spribe.png" }
    ]
}
```

### GET /api/v1/games/favorites

需认证。返回格式同游戏列表 (games 数组 + 分页)，按收藏时间倒序排列。

```
Query: ?page=1&page_size=20
```

```json
{
    "code": 0, "message": "success",
    "data": {
        "games": [
            {
                "id": 1, "name": "Sugar Rush", "slug": "sugar-rush",
                "provider": { "id": 1, "name": "JILI", "slug": "jili" },
                "category": { "id": 1, "name": "Slots", "slug": "slots" },
                "thumbnail_url": "/assets/games/sugar-rush.jpg",
                "is_new": false, "is_hot": false, "is_favorited": true
            }
        ],
        "total": 5, "page": 1, "page_size": 20
    }
}
```

注意: 不支持 category/provider/search 筛选，仅支持分页。is_favorited 始终为 true。

### GET /api/v1/games/recent

需认证。返回格式同游戏列表 (games 数组 + 分页)，按 played_at 倒序排列，最多 50 条。

```
Query: ?page=1&page_size=20
```

```json
{
    "code": 0, "message": "success",
    "data": {
        "games": [
            {
                "id": 1, "name": "Sugar Rush", "slug": "sugar-rush",
                "provider": { "id": 1, "name": "JILI", "slug": "jili" },
                "category": { "id": 1, "name": "Slots", "slug": "slots" },
                "thumbnail_url": "/assets/games/sugar-rush.jpg",
                "is_new": false, "is_hot": false, "is_favorited": true,
                "played_at": "2026-03-04T10:30:00Z"
            }
        ],
        "total": 10, "page": 1, "page_size": 20
    }
}
```

注意: 不支持 category/provider/search 筛选，仅支持分页。played_at 字段仅在 recent 接口返回。

### POST /api/v1/games/:id/launch

```json
{
    "code": 0, "message": "success",
    "data": {
        "game_url": "https://mock-game.goplus.local/play/sugar-rush",
        "token": "game-session-token"
    }
}
```

## 业务逻辑

### 游戏列表筛选

- 按 category slug 筛选: 传递数据库中 game_categories 的 slug (slots, live, crash 等)
- 按 provider slug 筛选; category + provider 可组合筛选
- 按名称模糊搜索 (LIKE %keyword%)
- 特殊分类处理 (非数据库 category，后端特殊逻辑):
  - `category=new`: 查询 is_new=true 的游戏
  - `category=recent`: 需认证，查询 user_recent_games 关联，按 played_at DESC 排序; 未登录返回 401
  - `category=favorites`: 需认证，查询 user_favorites 关联; 未登录返回 401
  - 未传 category 或 `category=all`: 返回所有 active 游戏
- 分页: 默认 page_size=20, 排序: sort_order ASC, created_at DESC
- is_favorited 字段: 已登录用户 (Authorization header 携带有效 JWT) 通过 LEFT JOIN user_favorites 返回收藏状态; 未登录或未携带 token 时统一返回 false (不报错，该字段不影响公开列表访问)

### 收藏与最近游玩

- 收藏/取消收藏均为幂等操作
- 最近游玩: 启动游戏时自动 UPSERT played_at, 最多保留 50 条

### 游戏启动

- 记录最近游玩 -> 调用 GameLauncher.Launch() -> 返回游戏 URL

### Mock 策略

| 外部服务 | Interface | Mock 行为 |
|----------|-----------|-----------|
| 游戏启动 | `GameLauncher` | 返回本地占位页面 URL |

```go
type GameLauncher interface {
    LaunchGame(userID uint, gameID uint) (*GameSession, error)
}
```

### Seed 数据

- 6 个游戏分类
- 18+ 个供应商 (名称+Logo, 由 UI 设计师交付)
- 每供应商 5-10 个游戏, 总计约 100-150 个
- 缩略图由 UI 设计师交付, 存入 /assets/games/

## 资源管理

### 资源来源

游戏相关资源由 UI 设计师交付, 用于 Seed 数据:

| 资源类型 | 来源 | 存储路径 | 格式 |
|----------|----------|----------|------|
| 游戏缩略图 | UI 设计师交付 | `assets/games/<slug>.jpg` | JPEG/WebP, 280x280px |
| 供应商 Logo | UI 设计师交付 | `assets/providers/<slug>.png` | PNG, 透明背景 |
| 分类图标 | UI 设计师交付 | `assets/icons/<slug>.svg` | SVG |

### 抓取方式

1. 浏览器 DevTools Network 面板，筛选 img 请求
2. 记录游戏名称 -> 缩略图 URL 映射
3. 批量下载并重命名为 slug 格式
4. 压缩优化 (游戏缩略图统一 280x280)

### 静态资源服务

```go
// Gin 静态文件服务
router.Static("/assets", "./assets")
```

- 后端提供 `/assets/*` 静态文件服务
- 数据库中存储相对路径: `/assets/games/sugar-rush.jpg`
- Seed 脚本将抓取的图片放入 `assets/` 目录

## 关键决策

- 分类和供应商数据在服务启动时加载到内存缓存
- 游戏列表查询直接走数据库 (SQLite 读性能足够)
- is_favorited 通过 LEFT JOIN user_favorites 实现
- 游戏资源统一由后端 `/assets/` 静态服务提供，前端不存储游戏资源副本

## 依赖与约束

- 依赖用户系统: 收藏/最近游玩/启动游戏需认证
- 首页各分类区数据也通过此模块 API 获取
- 游戏资源图片由 UI 设计师交付，是 Seed 数据的前置依赖
- 资源抓取任务需要在后端游戏 Seed 之前完成
