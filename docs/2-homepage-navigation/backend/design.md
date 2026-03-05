# 后端技术方案 -- 首页布局与导航

> 需求: homepage-navigation | 角色: backend

## 期次分类概览

> **全部 API 一期交付。** 部分字段使用 mock 数据 (硬编码 JSON)，后续替换为真实数据源时 API 结构不变。

### 一期全功能 API (数据库真实查询)

| API | 说明 | 数据来源 |
|-----|------|----------|
| GET /api/v1/home (banners 字段) | 首页 Banner 列表 | banners 表查询 |
| GET /api/v1/home (game_sections 字段) | 6 分类游戏列表 | games + game_categories 表查询 |
| GET /api/v1/home (providers 字段) | 供应商网格 | game_providers 表查询 |
| GET /api/v1/home (payment_icons 字段) | 支付方式图标 | system_configs 硬编码 |
| GET /api/v1/home (social_links 字段) | 社交链接 | social_links 表查询 |
| GET /api/v1/banners | Banner 列表 | banners 表查询 |
| GET /api/v1/config/market | 市场配置 | markets 表查询 |
| GET /api/v1/config/nav | 导航配置 | system_configs 硬编码 |

### 一期 Mock API (硬编码 JSON，前端 1:1 渲染)

| API (均在 /api/v1/home 聚合接口内) | Mock 字段 | 说明 | 后续替换为 |
|------|-----------|------|-----------|
| jackpot | 双奖池金额+倒计时+冠军+投注额 | 硬编码 JSON | 真实奖池系统 (数据库 + 实时计算) |
| trending_games | 5 个热门游戏 | 硬编码 JSON | 真实热门算法 (基于投注量/收藏量排序) |
| big_winners | 5 条大赢家记录 | 硬编码 JSON | 真实中奖记录 (从交易流水提取) |
| one_go_selection | 5 Tab + 游戏列表 | 硬编码 JSON | 真实推荐算法 (基于用户行为) |
| promo_banners | 37% 返现 Banner | 硬编码 JSON | 真实促销系统 (promotions 表) |
| latest_bets | 3 Tab 投注记录 | 硬编码 JSON | 真实投注流 (实时 WebSocket/轮询) |

### Mock 数据后续升级路径

后续只需替换 `/api/v1/home` 聚合接口中 mock 字段的数据源:
- mock 字段从硬编码 JSON -> 数据库查询 / 实时计算
- API 响应结构不变，前端组件无需修改
- 新增依赖表: jackpots, promotions, bet_records 等

## 技术栈

同项目统一技术栈: Go + Gin + GORM + SQLite + Zap

## 数据模型

### banners 表

```sql
CREATE TABLE banners (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           VARCHAR(200) NOT NULL,
    image_url       VARCHAR(500) NOT NULL,
    link_url        VARCHAR(500) DEFAULT '',
    link_type       VARCHAR(20) DEFAULT 'none',        -- none / internal / external
    sort_order      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',      -- active / disabled
    market_code     VARCHAR(10) DEFAULT 'IN',
    start_at        DATETIME,
    end_at          DATETIME,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
CREATE INDEX idx_banners_market_status ON banners(market_code, status);
```

### markets 表

```sql
CREATE TABLE markets (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            VARCHAR(10) NOT NULL UNIQUE,        -- IN, BR, PH
    name            VARCHAR(100) NOT NULL,
    currency        VARCHAR(10) NOT NULL,               -- INR
    currency_symbol VARCHAR(10) NOT NULL,               -- ₹
    phone_prefix    VARCHAR(10) NOT NULL,               -- +91
    locale          VARCHAR(20) DEFAULT 'en',
    timezone        VARCHAR(50) DEFAULT 'Asia/Kolkata',
    status          VARCHAR(20) DEFAULT 'active',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### game_categories 表

```sql
CREATE TABLE game_categories (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,           -- table-game, slots, live, fishing, crash, lotto
    icon_url        VARCHAR(500) DEFAULT '',
    sort_order      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

> 注意: games 表属于游戏大厅需求，此处仅定义 game_categories 表供首页分类区使用。

### game_providers 表

```sql
CREATE TABLE game_providers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,           -- jili, jdb, evo, spribe
    logo_url        VARCHAR(500) DEFAULT '',
    is_new          BOOLEAN DEFAULT FALSE,
    sort_order      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL
);
```

### system_configs 表

```sql
CREATE TABLE system_configs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key      VARCHAR(100) NOT NULL,
    config_value    TEXT NOT NULL,
    description     VARCHAR(500) DEFAULT '',
    market_code     VARCHAR(10) DEFAULT 'IN',
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    UNIQUE(config_key, market_code)
);
```

## API 设计

### API 分类 (全部一期交付)

| 方法 | 路径 | 说明 | 认证 | 期次 |
|------|------|------|------|------|
| GET | /api/v1/home | 首页聚合数据 (含 mock 字段) | 否 | 全功能 + mock 数据 |
| GET | /api/v1/banners | Banner 列表 | 否 | 一期全功能 |
| GET | /api/v1/config/market | 市场配置 | 否 | 一期全功能 |
| GET | /api/v1/config/nav | 导航配置 | 否 | 一期全功能 |

> **说明**: `/api/v1/home` 聚合接口一期返回所有字段，部分字段使用 mock 数据。后续替换为真实数据源时只需修改后端实现，API 结构不变。

### GET /api/v1/home

首页聚合接口，一次返回所有首页数据 (部分字段为 mock 数据):

```json
{
    "code": 0, "message": "success",
    "data": {
        // === 一期全功能字段 ===
        "banners": [
            { "id": 1, "title": "Welcome Bonus", "image_url": "/assets/banners/welcome.jpg",
              "link_url": "/register", "link_type": "internal" }
        ],
        "game_sections": [
            {
                "category": { "id": 4, "name": "Table Game", "slug": "table-game" },
                "games": [ { "id": 1, "name": "Blackjack", "slug": "blackjack", "thumbnail_url": "...", "is_new": false, "is_hot": false } ]
            }
        ],
        "payment_icons": [
            { "name": "UPI", "icon_url": "/assets/payment/upi.svg" },
            { "name": "Paytm", "icon_url": "/assets/payment/paytm.svg" }
        ],
        "providers": [
            { "id": 1, "name": "JILI", "slug": "jili", "logo_url": "/assets/providers/jili.png", "is_new": false },
            { "id": 2, "name": "NETENT", "slug": "netent", "logo_url": "", "is_new": true }
        ],
        "social_links": [
            { "name": "Telegram", "url": "https://t.me/goplus", "icon_url": "/assets/social/telegram.svg" }
        ],

        // === mock 数据字段 (一期硬编码返回，后续接真实数据源) ===
        // 结构精确匹配 merge.html 设计稿
        "jackpot": {
            "pots": [
                { "type": "vip_money_pot", "label": "VIP Money Pot", "amount": 15000000.00, "countdown": "23:59:59" },
                { "type": "daily_jackpot", "label": "Daily Jackpot", "amount": 500000.00, "winner_count": 128 }
            ],
            "last_champion": {
                "avatar_url": "/assets/avatars/default.png",
                "username": "Player***89",
                "bet_amount": 1000.00,
                "win_amount": 50000.00,
                "currency": "INR"
            },
            "my_turnover": 0.00
        },
        "trending_games": [
            { "id": 10, "name": "Aviator", "slug": "aviator", "thumbnail_url": "...", "provider_name": "Spribe" }
        ],
        "big_winners": [
            { "game_name": "Sugar Rush", "thumbnail_url": "...", "multiplier": 80.0 }
        ],
        "promo_banners": [
            { "id": 1, "title": "37% First Deposit Cash Back", "link_url": "/wallet/deposit" }
        ],
        "one_go_selection": {
            "tabs": ["1GO", "Deposit", "Cashier", "Pay", "Mega"],
            "active_tab": "1GO",
            "games": [
                { "id": 30, "name": "Fortune Gems 3", "slug": "fortune-gems-3", "thumbnail_url": "...", "provider_name": "JILI" },
                { "id": 31, "name": "Color Prediction", "slug": "color-prediction", "thumbnail_url": "...", "provider_name": "JILI" }
            ]
        },
        "latest_bets": {
            "latest_bet": [
                { "game": "Blackjack", "game_initial": "B", "player": "Player***12", "profit": 3.2, "currency": "INR" }
            ],
            "high_roller": [
                { "game": "Roulette", "game_initial": "R", "player": "Player***45", "profit": 150.0, "currency": "INR" }
            ],
            "high_multiplier": [
                { "game": "Aviator", "game_initial": "A", "player": "Player***78", "profit": 0, "currency": "INR" }
            ]
        }
    }
}
```

### GET /api/v1/config/market

```json
{
    "code": 0, "message": "success",
    "data": {
        "code": "IN", "name": "India", "currency": "INR",
        "currency_symbol": "₹", "phone_prefix": "+91", "locale": "en"
    }
}
```

### GET /api/v1/config/nav

```json
{
    "code": 0, "message": "success",
    "data": {
        "bottom_tabs": [
            { "id": "menu", "label": "Menu", "icon": "menu", "route": "/menu", "enabled": true },
            { "id": "explore", "label": "Explore", "icon": "explore", "route": "/explore", "enabled": true },
            { "id": "get1700", "label": "GET 1700", "icon": "gift", "route": "/lucky-wheel", "enabled": false },
            { "id": "raffle", "label": "Raffle", "icon": "raffle", "route": "/raffle", "enabled": false },
            { "id": "quest", "label": "Quest", "icon": "quest", "route": "/quest", "enabled": false }
        ],
        "sidebar_menu": [
            { "id": "favourite", "label": "Favourite", "icon": "heart", "route": "/explore?category=favorites" },
            { "id": "crash", "label": "Crash", "icon": "crash", "route": "/explore?category=crash" },
            { "id": "live", "label": "Live", "icon": "live", "route": "/explore?category=live" },
            { "id": "slots", "label": "Slots", "icon": "slots", "route": "/explore?category=slots" },
            { "id": "table-game", "label": "Table Game", "icon": "table", "route": "/explore?category=table-game" },
            { "id": "fishing", "label": "Fishing", "icon": "fishing", "route": "/explore?category=fishing" },
            { "id": "lotto", "label": "Lotto", "icon": "lotto", "route": "/explore?category=lotto" },
            { "id": "live-support", "label": "Live Support", "icon": "support", "route": "/support" }
        ]
    }
}
```

## 业务逻辑

### 首页聚合

- 有效 Banner (status=active, 在时间范围内)
- 各分类热门游戏 (每分类取 sort_order 前 10)
- 分类顺序: Table Game > Slots > Live > Fishing > Crash > Lotto
- 供应商列表 (status=active, sort_order 排序)
- 支付方式图标、社交媒体链接

### 内存缓存

- Banner、导航、市场配置在启动时加载内存
- 管理后台修改后触发缓存刷新
- sync.RWMutex 保护并发

### Seed 数据

**一期全功能数据:**
- 1 个市场 (IN), 5 个 Banner, 导航配置 (底部5Tab + 侧边15项), 支付图标 (6个), 社交链接 (5个)
- 6 个游戏分类 (Table Game/Slots/Live/Fishing/Crash/Lotto)
- 20 个供应商 (JILI/JDB/EVO/Spribe/PP/PG 等, NETENT/TADA/LUDO 标记 is_new)
- 30 个游戏 (每分类 5 个)

**mock 数据 (一期硬编码在聚合接口中, 结构匹配 merge.html, 后续替换为真实数据):**
- jackpot: 双奖池 (VIP Money Pot + Daily Jackpot) + Last Champion 记录 + My Turnover 值
- trending_games: 5 个热门游戏 (大缩略图 142x96, 含供应商名)
- big_winners: 5 条大赢家记录 (游戏缩略图 + 倍率, marquee 滚动展示)
- one_go_selection: 5 个 Sub-Tab (1GO/Deposit/Cashier/Pay/Mega) + 游戏列表 (复用 seed 游戏)
- promo_banners: 1 个 37% First Deposit Cash Back Banner
- latest_bets: 3 个 Tab 分组 (latest_bet / high_roller / high_multiplier), 每组 10 条记录

> **变更 (2026-03-04)**: Seed 数据中的图片 URL 需使用 1goplus.com CDN 真实地址 (如 `https://1goplus.com/static/game/icon/{provider}/{id}.png`)，确保开发阶段首页能显示真实游戏缩略图、Banner 图片和供应商 Logo。本地占位路径 (如 `/assets/games/xxx.jpg`) 会导致图片 404。

## 关键决策

- 首页使用聚合 API 减少前端请求数
- 导航数据由后端提供，enabled=false 前端显示灰色
- **Seed 数据使用真实 CDN 图片 URL**: 开发阶段直接引用 1goplus.com CDN 资源，生产环境需替换为自托管 URL
- **所有动态数据由后端 API 提供**: 游戏、供应商、Banner、社交链接、支付方式均通过 /home 聚合接口返回，前端不硬编码
- **mock 数据策略**: `/api/v1/home` 聚合接口一期包含全部字段 (jackpot/trending_games/big_winners/one_go_selection/promo_banners/latest_bets)，部分字段为硬编码 mock 数据。后续将 mock 数据替换为真实数据库查询时，API 结构和前端组件无需修改

## 依赖与约束

- 依赖游戏大厅: 首页游戏分类数据
- 依赖钱包模块: 支付方式图标
- Banner 通过管理后台管理
