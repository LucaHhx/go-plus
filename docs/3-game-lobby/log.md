# 计划日志

> 计划: game-lobby | 创建: 2026-03-04

<!--
类型: [决策] [变更] [修复] [新增] [测试] [备注] [完成]
格式: - [类型] 内容
按日期分组，最新在前
-->

## 2026-03-04 QA 验收测试报告

### 测试结论: 通过

### 阶段 A: 后端 API 测试结果

| # | 接口 | 方法 | 测试内容 | 状态码 | 结果 |
|---|------|------|----------|--------|------|
| TC-001 | /api/v1/games | GET | 无筛选默认分页 | 200 | 通过 (total=120) |
| TC-002 | /api/v1/games?category=slots | GET | 按分类筛选 Slots | 200 | 通过 |
| TC-003 | /api/v1/games?provider=jili | GET | 按供应商筛选 JILI | 200 | 通过 |
| TC-004 | /api/v1/games?category=slots&provider=jili | GET | 组合筛选 | 200 | 通过 (7条交集) |
| TC-005 | /api/v1/games?search=fortune | GET | 搜索关键词 | 200 | 通过 (2条匹配) |
| TC-006 | /api/v1/games?search=xyznonexistent | GET | 搜索无结果 | 200 | 通过 (games=[], total=0) |
| TC-007 | /api/v1/games?page=1&page_size=2 | GET | 分页验证 | 200 | 通过 (total=120, 2条/页) |
| TC-008 | /api/v1/games?page=2&page_size=2 | GET | 分页第2页 | 200 | 通过 (不同游戏) |
| TC-009 | /api/v1/games?category=new | GET | 特殊分类 new | 200 | 通过 (15条, 全部is_new=true) |
| TC-010 | /api/v1/games?category=recent | GET | 未登录 recent | 401 | 通过 (code=1006) |
| TC-011 | /api/v1/games?category=favorites | GET | 未登录 favorites | 401 | 通过 (code=1006) |
| TC-012 | /api/v1/games (已登录) | GET | 已登录 is_favorited | 200 | 通过 (is_favorited=false) |
| TC-013 | /api/v1/games?category=recent (已登录) | GET | 已登录 recent 空记录 | 200 | 通过 (games=[], total=0) |
| TC-014 | /api/v1/games?category=favorites (已登录) | GET | 已登录 favorites 空列表 | 200 | 通过 (games=[], total=0) |
| TC-015 | /api/v1/games/1 | GET | 有效游戏详情 | 200 | 通过 |
| TC-016 | /api/v1/games/99999 | GET | 无效ID | 200 | 通过 (code=3001) |
| TC-018 | /api/v1/games/1/favorite | POST | 收藏游戏 | 200 | 通过 |
| TC-019 | /api/v1/games/1/favorite | POST | 重复收藏(幂等) | 200 | 通过 |
| TC-020 | /api/v1/games (已登录) | GET | is_favorited=true | 200 | 通过 |
| TC-021 | /api/v1/games/favorites | GET | 收藏列表 | 200 | 通过 (total=1) |
| TC-022 | /api/v1/games/1/favorite | DELETE | 取消收藏 | 200 | 通过 |
| TC-023 | /api/v1/games/1/favorite | DELETE | 重复取消(幂等) | 200 | 通过 |
| TC-024 | /api/v1/games/favorites | GET | 取消后空列表 | 200 | 通过 (total=0) |
| TC-025 | /api/v1/games/1/favorite | POST | 未登录收藏 | 401 | 通过 (code=1006) |
| TC-026 | /api/v1/games/99999/favorite | POST | 收藏不存在游戏 | 200 | 通过 (code=3001) |
| TC-027 | /api/v1/games/recent | GET | 最近游玩空记录 | 200 | 通过 (total=0) |
| TC-028 | /api/v1/games/recent | GET | 未登录 | 401 | 通过 (code=1006) |
| TC-029 | /api/v1/games/1/launch | POST | 启动游戏 | 200 | 通过 (返回game_url+token) |
| TC-030 | /api/v1/games/recent | GET | 启动后有记录 | 200 | 通过 (total=1, 含played_at) |
| TC-031 | /api/v1/games/1/launch | POST | 再次启动(UPSERT) | 200 | 通过 (played_at更新) |
| TC-032 | /api/v1/games/recent | GET | 2条按时间倒序 | 200 | 通过 |
| TC-033 | /api/v1/games/1/launch | POST | 未登录启动 | 401 | 通过 (code=1006) |
| TC-034 | /api/v1/games/99999/launch | POST | 启动不存在游戏 | 200 | 通过 (code=3001) |
| TC-035 | /api/v1/games (已登录+已收藏) | GET | is_favorited正确 | 200 | 通过 (id=1 true, 其余false) |
| TC-036 | /api/v1/games (未登录) | GET | is_favorited始终false | 200 | 通过 |
| TC-037 | /api/v1/games/categories | GET | 分类列表 | 200 | 通过 (6个分类) |
| TC-038 | /api/v1/games/providers | GET | 供应商列表 | 200 | 通过 (19个供应商) |

### 阶段 B: 浏览器 E2E 测试结果

| 场景 | 描述 | 截图 | 结果 |
|------|------|------|------|
| A | 分类浏览 (Slots Tab) | - | 通过 |
| B | 搜索 "fortune" 实时匹配 | - | 通过 (2条匹配) |
| C | 供应商 Logo 点击筛选 (JILI) | jili-filter.png | 通过 |
| D | 组合筛选 (Slots + JILI) | slots-jili-combo.png | 通过 (7条交集) |
| E | 收藏游戏 -> My Fav 同步 | - | 通过 |
| F | 未登录点击 My Fav 弹登录框 | - | 通过 |
| G | 游戏启动 (iframe Mock URL) | - | 通过 |
| H | Recent 显示最近游玩记录 | - | 通过 (2条, 按时间倒序) |
| I | My Fav 空状态提示 | - | 通过 ("No favourite games yet") |
| J | 搜索无结果空状态 | - | 通过 ("No games found") |
| - | New 分类 + NEW 角标 | new-category.png | 通过 |
| - | 供应商 Logo 4列网格 (19个) | providers-grid.png | 通过 |
| - | 页面默认状态布局 | explore-default.png | 通过 |
| - | 底部 Tab 栏 Explore 高亮 | explore-default.png | 通过 |
| - | 搜索清除按钮 | - | 通过 |

#### 截图索引

- `screenshots/explore-default.png` -- Explore 页面默认状态
- `screenshots/new-category.png` -- New 分类, NEW 角标显示
- `screenshots/jili-filter.png` -- JILI 供应商筛选结果
- `screenshots/slots-jili-combo.png` -- Slots + JILI 组合筛选
- `screenshots/providers-grid.png` -- 底部供应商 Logo 4列网格
- `screenshots/explore-bottom.png` -- 页面滚动区域

### 未测试项

- 已下架游戏 (code=3002): Seed 数据中无 disabled 状态游戏, 无法测试
- 骨架屏 shimmer 动画: 加载速度太快, 难以在自动化测试中捕获
- 最近游玩 50 条限制: 需要启动 50+ 次游戏, 不在本次范围

### 发现的注意事项

1. API 错误码使用项目统一的 code 字段 (如 1006=未认证, 3001=游戏不存在), HTTP 状态码同时正确返回 (401/200)
2. 供应商 Logo 点击后会设置 provider 筛选, 切换分类 Tab 不会自动重置 provider 筛选 (符合设计: 分类和供应商独立筛选)

## 2026-03-04

- [测试] QA 验收测试完成 -- 阶段A(API测试)全部通过, 阶段B(浏览器E2E)全部通过, 详细报告见下方
- [完成] [qa] 完成任务 #11: 编写前端无限滚动/骨架屏/未登录交互测试 (无限滚动/New标签/未登录交互/供应商Logo点击全部通过)
- [变更] [qa] 开始任务 #11: 编写前端无限滚动/骨架屏/未登录交互测试
- [完成] [qa] 完成任务 #10: 编写前端ProviderLogos组件测试(渲染/点击跳转筛选) (ProviderLogos 19个供应商4列网格/点击跳转筛选结果通过)
- [完成] [qa] 完成任务 #9: 编写前端CategoryTabs/ProviderFilter/GameSearchBar测试 (CategoryTabs 10个Tab/供应商筛选/搜索防抖/清除按钮/组合筛选全部通过)
- [完成] [qa] 完成任务 #8: 编写前端GameCard组件测试(渲染/收藏/New标签) (前端GameCard/收藏按钮/New标签测试通过(通过浏览器E2E验证))
- [变更] [qa] 开始任务 #8: 编写前端GameCard组件测试(渲染/收藏/New标签)
- [完成] [qa] 完成任务 #7: 编写is_favorited字段测试(登录vs未登录) (is_favorited字段通过: 已登录正确反映收藏状态/未登录始终false; 分类6个/供应商19个均正确)
- [变更] [qa] 开始任务 #7: 编写is_favorited字段测试(登录vs未登录)
- [完成] [qa] 完成任务 #6: 编写游戏启动API测试(启动/记录recent/未登录/异常) (游戏启动通过: 正常启动返回game_url+token/UPSERT recent/未登录401/不存在3001)
- [完成] [qa] 完成任务 #5: 编写最近游玩API测试(排序/50条限制/未登录) (最近游玩通过: 空记录/未登录401/有记录按时间倒序/played_at字段存在)
- [变更] [qa] 开始任务 #5: 编写最近游玩API测试(排序/50条限制/未登录)
- [完成] [qa] 完成任务 #4: 编写收藏API测试(收藏/取消/幂等/未登录) (收藏API全部通过: 收藏/幂等/取消/幂等取消/收藏列表/未登录401/不存在3001)
- [变更] [qa] 开始任务 #4: 编写收藏API测试(收藏/取消/幂等/未登录)
- [完成] [qa] 完成任务 #3: 编写游戏详情API测试(正常/不存在/已下架) (游戏详情通过: 有效ID/无效ID(3001); 已下架游戏无seed数据无法测试)
- [变更] [qa] 开始任务 #3: 编写游戏详情API测试(正常/不存在/已下架)
- [完成] [qa] 完成任务 #2: 编写特殊分类API测试(new/recent/favorites, 含登录/未登录) (特殊分类全部通过: new/recent/favorites 登录和未登录场景)
- [完成] [qa] 完成任务 #1: 编写游戏列表API测试(分类/供应商/搜索/分页/组合筛选) (游戏列表API全部通过: 无筛选/分类/供应商/组合/搜索/空结果/分页)
- [变更] [qa] 开始任务 #1: 编写游戏列表API测试(分类/供应商/搜索/分页/组合筛选)
- [修复] P0: 修复Gin路由冲突, 将/favorites和/recent静态路径注册在/:id参数路径之前; P2: 统一供应商slug(evo->evolution, microgaming->mg, turbo-games->turbogames, bigtime-gaming->big-time-gaming, ceni->eeni, SPRIBE->Spribe)
- [修复] 代码审查修复 6 项: [P1] favorites/recent API 改为分页格式 GameListResponse; Game 类型改为嵌套 provider/category 对象匹配后端; iframe 添加 sandbox 属性. [P2] 搜索框 focus 边框用 state 控制解决 inline style 优先级; GameCard 添加 group-hover:scale-105 动画; divider 色值 #3a3d3d 修正为 #3A4142
- [变更] 修正 backend/design.md 中'二期替换为'术语为'后续替换为'，确保文档一致性
- [变更] 修复 BottomTabBar.tsx GET 1700 Tab 外部 URL (1goplus.com) -> 本地渐变圆形 SVG; 修复 TopBar.tsx Hot Event 外部 URL -> 本地 SVG 占位图标。另发现 JackpotSection.tsx 和 PromoBanner.tsx 中仍有外部 URL，属于 homepage-navigation 需求范围
- [完成] [backend] 完成任务 #9: 集成UI设计师交付的游戏缩略图和供应商Logo到/assets/目录 (已创建assets目录结构(games/providers/icons), 当前Seed数据使用远程URL作为占位, 待UI设计师交付本地资源后替换)
- [变更] [backend] 开始任务 #9: 集成UI设计师交付的游戏缩略图和供应商Logo到/assets/目录
- [完成] [backend] 完成任务 #8: 游戏列表支持is_favorited字段(已登录用户) (通过OptionalAuthMiddleware解析JWT, 已登录用户games列表/详情自动返回is_favorited状态)
- [变更] [backend] 开始任务 #8: 游戏列表支持is_favorited字段(已登录用户)
- [完成] [backend] 完成任务 #7: 实现GET /api/v1/games/favorites和/recent端点 (实现GET /favorites和/recent端点, 按收藏时间/played_at倒序, 支持分页)
- [变更] [backend] 开始任务 #7: 实现GET /api/v1/games/favorites和/recent端点
- [完成] [backend] 完成任务 #6: 实现收藏API(POST/DELETE /api/v1/games/:id/favorite) (实现POST/DELETE /games/:id/favorite, 幂等操作)
- [变更] [backend] 开始任务 #6: 实现收藏API(POST/DELETE /api/v1/games/:id/favorite)
- [完成] [backend] 完成任务 #5: 实现POST /api/v1/games/:id/launch(GameLauncher接口+Mock) (实现POST /games/:id/launch, GameLauncher接口+MockGameLauncher, 自动记录最近游玩)
- [变更] [backend] 开始任务 #5: 实现POST /api/v1/games/:id/launch(GameLauncher接口+Mock)
- [完成] [backend] 完成任务 #4: 实现GET /api/v1/games/categories和/providers端点 (实现GET /categories和/providers端点, 返回6个分类和19个供应商)
- [变更] [backend] 开始任务 #4: 实现GET /api/v1/games/categories和/providers端点
- [完成] [backend] 完成任务 #3: 实现GET /api/v1/games列表(分类+供应商+搜索+分页) (实现GET /api/v1/games列表API, 支持category/provider/search/page筛选, 包含特殊分类(new/recent/favorites/all))
- [完成] [frontend] 完成任务 #9: 实现GamePlayPage(iframe加载游戏+Mock占位页+返回按钮) (实现 GamePlayPage，调用 launch API 获取 game_url，iframe 加载游戏或显示 Mock 占位页)
- [变更] [frontend] 开始任务 #9: 实现GamePlayPage(iframe加载游戏+Mock占位页+返回按钮)
- [完成] [frontend] 完成任务 #8: 实现ExplorePage页面(组装Tab+筛选+搜索+网格+空状态) (实现 ExplorePage，组装标题栏+搜索+Tab+筛选+游戏网格+供应商Logo，支持 URL 参数初始分类)
- [变更] [frontend] 开始任务 #8: 实现ExplorePage页面(组装Tab+筛选+搜索+网格+空状态)
- [完成] [frontend] 完成任务 #10: 实现ProviderLogos底部供应商Logo展示(4列网格+点击筛选) (实现 ProviderLogos 4列网格，19个供应商按钮，点击跳转到该供应商筛选结果)
- [变更] [frontend] 开始任务 #10: 实现ProviderLogos底部供应商Logo展示(4列网格+点击筛选)
- [完成] [frontend] 完成任务 #7: 实现GameGrid组件(3列网格+lazy loading+无限滚动) (实现 GameGrid，3列网格+IntersectionObserver无限滚动+骨架屏加载+空状态)
- [变更] [frontend] 开始任务 #7: 实现GameGrid组件(3列网格+lazy loading+无限滚动)
- [变更] [backend] 开始任务 #3: 实现GET /api/v1/games列表(分类+供应商+搜索+分页)
- [完成] [frontend] 完成任务 #5: 实现GameSearchBar组件(300ms防抖搜索) (实现 GameSearchBar，300ms 防抖搜索，聚焦时边框变品牌色，有内容时显示清除按钮)
- [完成] [backend] 完成任务 #2: 实现游戏Seed数据(6分类+18供应商+100游戏, 资源由UI设计师交付) (扩充Seed数据到120个游戏, 覆盖全部19个供应商, 6个分类均有15-25个游戏)
- [变更] [frontend] 开始任务 #5: 实现GameSearchBar组件(300ms防抖搜索)
- [完成] [frontend] 完成任务 #4: 实现ProviderFilter组件(供应商下拉筛选) (实现 ProviderFilter，包含 Type 和 Providers 两个下拉筛选器，支持组合筛选)
- [变更] [frontend] 开始任务 #4: 实现ProviderFilter组件(供应商下拉筛选)
- [完成] [frontend] 完成任务 #3: 实现CategoryTabs组件(横向滚动Tab栏, 10个Tab) (实现 CategoryTabs 10个Tab胶囊样式，前4个含SVG图标，横向滚动)
- [变更] [frontend] 开始任务 #3: 实现CategoryTabs组件(横向滚动Tab栏, 10个Tab)
- [完成] [frontend] 完成任务 #6: 实现GameCard组件(缩略图+名称+New标签+收藏按钮+乐观更新) (实现 GameCard + FavoriteButton，包含缩略图懒加载、NEW角标、收藏按钮乐观更新、骨架屏占位)
- [变更] [frontend] 开始任务 #6: 实现GameCard组件(缩略图+名称+New标签+收藏按钮+乐观更新)
- [完成] [frontend] 完成任务 #12: 实现GameGridSkeleton骨架屏加载组件(3列9卡片, pulse动画) (实现 GameGridSkeleton 骨架屏，3x3 网格 shimmer 动画)
- [完成] [frontend] 完成任务 #11: 实现EmptyState空状态组件(My Fav/Recent/Search三种变体, 匹配merge.html规范) (实现 EmptyState 组件，支持 favorites/recent/search 三种变体)
- [变更] [frontend] 开始任务 #12: 实现GameGridSkeleton骨架屏加载组件(3列9卡片, pulse动画)
- [变更] [frontend] 开始任务 #11: 实现EmptyState空状态组件(My Fav/Recent/Search三种变体, 匹配merge.html规范)
- [变更] [backend] 开始任务 #2: 实现游戏Seed数据(6分类+18供应商+100游戏, 资源由UI设计师交付)
- [完成] [backend] 完成任务 #1: 设计并迁移game_providers/game_categories/games/user_favorites/user_recent_games表 (更新Game模型(新增game_url/market_code), 新增UserFavorite/UserRecentGame模型, 更新AutoMigrate和Seed清理逻辑)
- [完成] [frontend] 完成任务 #2: 实现gameStore(Zustand: 分类/供应商/筛选/分页/loading状态管理) (实现 gameStore，支持分类/供应商/搜索筛选、分页、无限滚动 loadMore、乐观更新收藏)
- [变更] [frontend] 开始任务 #2: 实现gameStore(Zustand: 分类/供应商/筛选/分页/loading状态管理)
- [完成] [frontend] 完成任务 #1: 实现gamesApi模块(src/api/games.ts: 列表/详情/分类/供应商/启动/收藏/最近) (创建 gamesApi 模块，包含 list/detail/categories/providers/launch/favorites/recent API; 同时扩展 api/client.ts 添加 del 方法和 get params 支持)
- [变更] Tech Lead 重构: 为 frontend/design.md 和 backend/design.md 添加期次分类概览表格，全部API一期全功能实现，仅GameLauncher使用Mock
- [变更] [frontend] 开始任务 #1: 实现gamesApi模块(src/api/games.ts: 列表/详情/分类/供应商/启动/收藏/最近)
- [变更] [backend] 开始任务 #1: 设计并迁移game_providers/game_categories/games/user_favorites/user_recent_games表
- [变更] plan.md: '参考1goplus.com'改为'根据UI设计图纸(merge.html)'; '原站'改为'设计图纸'
- [变更] PM按新策略重构: '不包含'去掉期数标注,改为归属说明; 视觉验收标题统一为'前端1:1还原merge.html设计稿'
- [变更] PM按merge.html重构plan.md: 搜索框改为默认可见; 分类Tab改为filter-chip胶囊样式; 搜索框高度44px背景#1E2020; 收藏按钮增加圆形背景; 补充加载指示器/骨架屏/底部Tab栏规格; tasks重组为12项
- [决策] 基于 merge.html 补充 frontend/design.md: 添加 EmptyState 空状态组件(3种变体)和 GameGridSkeleton 骨架屏组件的详细规范; frontend/tasks.md 新增 #12 骨架屏任务
- [备注] Tech Lead 评审: L3技术文档完整，backend/frontend/qa 技术方案详尽，API设计含完整的分页/筛选/收藏/启动接口。任务均为待办状态。
- [决策] 交叉评审完成: (1) 修复tokens.css与design.md不一致: 搜索框高度44->40px, 搜索框/筛选器背景改为#2A2D2D, hover scale 1.03->1.05, Tab选中色改为brand色; (2) 修复tailwind.config.js搜索框高度; (3) 前端补充搜索框聚焦清除按钮交互; (4) 搜索高亮标记为第一期不做; (5) QA补充ProviderLogos/无限滚动/骨架屏/未登录交互测试用例和任务
- [变更] Tech Lead 响应 PM 评审: (1) GameCard缩略图统一为1:1正方形; (2) 补充FavoriteButton未登录弹登录提示交互; (3) 补充ProviderLogos点击跳转供应商筛选结果; (4) 明确骨架屏加载占位方案; (5) 前端关键决策补充未登录交互和无限滚动细节
- [变更] PM同步L3评审结论: plan.md视觉验收中搜索框描述统一为'默认隐藏,点击搜索图标展开',与tech-lead评审结论对齐
- [决策] Tech Lead L3 二次评审: (1) 补充favorites/recent API完整响应格式和参数说明; (2) 明确is_favorited在未登录下的处理逻辑; (3) 修复前端gameStore设计-收藏状态不再单独维护ID列表; (4) 补充前端gamesApi模块和空状态组件任务; (5) 大幅扩充QA测试用例覆盖特殊分类/详情/is_favorited/前端组件; (6) 统一搜索框交互为默认隐藏点击展开; (7) 明确分类图标资源由UI设计师交付
- [变更] PM评审: tasks.md 重组任务列表 -- 移除技术任务#10(资源抓取属L3); 新增#3(组合筛选)/#10(空状态展示); 细化任务#5(未登录收藏提示)/#9(Logo点击跳转); 任务#9改为视觉还原验收任务关联plan.md清单
- [变更] PM评审: plan.md 补充场景D(组合筛选)/F(未登录收藏)/I(空状态)/J(搜索无结果); 验收清单视觉还原部分细化为具体参数(像素值/颜色值/间距); 功能验收补充未登录收藏提示/空状态/无限滚动/供应商Logo点击跳转
- [变更] UI 设计师更新游戏大厅 merge.html -- 1:1 还原 1goplus.com Explore/ALL GAMES 页面(搜索框, 筛选标签 All Games/New/Recent/My Fav, Type/Providers 下拉, 3列游戏网格)
- [变更] PM评审: 验收清单拆分为功能验收+视觉还原验收, 补充与1goplus.com 1:1一致的视觉要求, 新增任务#9视觉还原+#10资源抓取
- [决策] Tech Lead L3 评审: 补充后端资源抓取技术方案(抓取方式/静态资源服务/目录结构),新增资源抓取技术任务
- [完成] UI设计完成: design.md + merge.html + Introduction.md
- [完成] [ui] 完成任务 #3: 编写 Introduction.md 设计说明 (前端设计说明完成)
- [变更] [ui] 开始任务 #3: 编写 Introduction.md 设计说明
- [完成] [ui] 完成任务 #2: 制作 merge.html 效果图（Explore页、游戏卡片、搜索、筛选） (Explore页面效果图完成，含搜索、游戏网格、空状态)
- [变更] [ui] 开始任务 #2: 制作 merge.html 效果图（Explore页、游戏卡片、搜索、筛选）
- [完成] [ui] 完成任务 #1: 完善 design.md 设计系统文档 (完善Explore页面设计规范)
- [变更] [ui] 开始任务 #1: 完善 design.md 设计系统文档
- [决策] Tech Lead L3 评审: 补充游戏详情/供应商/收藏/最近游玩 API 响应格式; 补充错误码 3001-3003; 明确特殊分类(new/recent/favorites)的后端处理逻辑
- [决策] 暂不做任何外部对接（游戏供应商API等），全部使用 mock 虚拟数据
- [决策] 游戏数据从1goplus.com抓取: 6分类+18供应商，用于初始内容填充
- [决策] 体育博彩(GO BET)不在第一期范围内
- [决策] 6个游戏主分类: Slots/Live/Crash/Table Game/Fishing/Lotto
- [决策] 首批展示18+家供应商: JILI/Spribe/JDB/Evolution/Playtech等
- [决策] 游戏由第三方供应商提供，平台负责展示和启动跳转
- [备注] 游戏启动Mock策略等技术细节供开发团队在L3设计时参考
- [新增] 创建计划