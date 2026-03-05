# QA 测试方案 -- 赌场游戏大厅

> 需求: game-lobby | 角色: qa

## 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| 单元测试 | Go testing | 筛选/搜索/分页逻辑、收藏/最近游玩业务逻辑 |
| API 测试 | Go httptest | 所有 /api/v1/games/* 接口 |
| 前端组件测试 | Vitest + Testing Library | GameCard/CategoryTabs/ProviderFilter/GameSearchBar |
| 前端集成测试 | Vitest | gameStore 状态管理 + API 调用 |

## 后端 API 测试用例

### 游戏列表 GET /api/v1/games

- 无筛选 -> 返回全部 active 游戏 (分页, 默认 page_size=20)
- 按分类筛选 `?category=slots` -> 返回 Slots 分类游戏
- 按供应商筛选 `?provider=jili` -> 返回 JILI 供应商游戏
- 分类+供应商组合 `?category=slots&provider=jili` -> 返回交集
- 搜索关键词 `?search=sugar` -> 模糊匹配游戏名称
- 空结果 -> 返回空 games 列表, total=0
- 分页验证: page_size=2, 验证 total/page 正确
- 已登录用户 -> is_favorited 字段正确反映收藏状态
- 未登录用户 -> is_favorited 始终为 false

### 特殊分类

- `?category=new` -> 返回 is_new=true 的游戏
- `?category=recent` 已登录 -> 返回最近游玩记录, 按 played_at DESC
- `?category=recent` 未登录 -> 401
- `?category=favorites` 已登录 -> 返回收藏列表
- `?category=favorites` 未登录 -> 401
- `?category=all` 或无 category -> 返回所有 active 游戏

### 游戏详情 GET /api/v1/games/:id

- 有效 ID -> 返回游戏详情, 包含 provider 和 category 信息
- 无效 ID -> 3001 游戏不存在
- 已下架游戏 -> 3002 游戏已下架

### 分类与供应商

- GET /api/v1/games/categories -> 返回 6 个分类, 按 sort_order 排序
- GET /api/v1/games/providers -> 返回 18+ 个供应商, 按 sort_order 排序

### 收藏

- 登录后 POST /api/v1/games/:id/favorite -> 成功, 返回 200
- 重复收藏 -> 幂等, 不报错
- DELETE /api/v1/games/:id/favorite -> 取消收藏成功
- 重复取消 -> 幂等, 不报错
- 未登录收藏/取消 -> 401
- 收藏不存在的游戏 -> 3001

### 最近游玩 GET /api/v1/games/recent

- 有记录 -> 按 played_at DESC 排序, 包含 played_at 字段
- 无记录 -> 空列表
- 最多 50 条限制
- 未登录 -> 401

### 游戏启动 POST /api/v1/games/:id/launch

- 登录后启动 -> 返回 game_url + token
- 启动后自动记录到 recent (UPSERT played_at)
- 再次启动同一游戏 -> played_at 更新
- 未登录启动 -> 401
- 启动不存在的游戏 -> 3001
- 启动已下架游戏 -> 3002

## 前端测试用例

### GameCard 组件

- 正确渲染游戏名称、供应商名、缩略图
- is_new=true 时显示 New 标签
- 点击收藏按钮触发 toggleFavorite
- 收藏状态切换 (未收藏白色 -> 已收藏红色)

### CategoryTabs 组件

- 渲染 10 个 Tab (All/New/Recent/My Fav + 6 分类)
- 点击 Tab 触发 setFilter
- 选中 Tab 高亮样式

### ProviderFilter 组件

- 渲染供应商下拉列表
- 选择供应商触发筛选

### GameSearchBar 组件

- 输入触发 300ms 防抖搜索
- 清空输入重置搜索

### ProviderLogos 组件

- 渲染所有供应商 Logo (4列网格)
- 点击供应商 Logo 触发 setFilter('provider', slug), 页面展示该供应商游戏

### 空状态

- My Fav 无数据显示正确文案 ("No favourite games yet")
- Recent 无数据显示正确文案 ("No recently played games")
- 搜索无结果显示正确文案 ("No games found")

### 无限滚动与骨架屏

- 滚动到底部 200px 时触发加载下一页
- 加载中显示骨架屏 (pulse 动画占位)
- 全部加载完毕后不再触发

### 未登录交互

- 未登录点击收藏按钮 -> 弹出登录提示
- 未登录点击 Recent Tab -> 弹出登录提示
- 未登录点击 My Fav Tab -> 弹出登录提示

## 关键决策

- Seed 数据覆盖每个分类和供应商至少 1 个游戏
- 分页测试: page_size=2 验证分页正确性
- 收藏幂等性是核心验证点
- is_favorited 在登录/未登录场景下的行为需重点测试
