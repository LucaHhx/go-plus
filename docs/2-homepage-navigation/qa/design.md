# QA 测试方案 -- 首页布局与导航

> 需求: homepage-navigation | 角色: qa

## 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| API 测试 | Go httptest | /home, /banners, /config/market, /config/nav |
| 前端组件测试 | Vitest + React Testing Library | 布局组件、Banner轮播、导航组件 |
| 视觉还原测试 | 手动对比 | 深色主题、像素级还原、响应式 |

## 测试用例

### 1. 首页聚合 API (/api/v1/home)

- 返回数据结构完整 (banners + game_sections + providers + payment_icons + social_links)
- banners 仅返回 status=active 且在时间范围内的记录
- game_sections 包含 6 个分类，每分类最多 10 个游戏
- game_sections 分类顺序: Table Game > Slots > Live > Fishing > Crash > Lotto
- 每个 game 对象包含 id/name/slug/thumbnail_url/is_new/is_hot 字段
- providers 返回 active 状态的供应商列表
- providers 中 is_new 字段正确标记
- payment_icons 和 social_links 非空

### 2. Banner API (/api/v1/banners)

- 返回 active 状态的 Banner 列表
- Banner 对象包含 id/title/image_url/link_url/link_type
- 按 sort_order 排序
- 过期 Banner 不返回

### 3. 配置 API (/api/v1/config/market, /config/nav)

- market 返回完整的市场配置 (code/name/currency/currency_symbol/phone_prefix/locale)
- nav 返回 bottom_tabs (5 个) 和 sidebar_menu
- bottom_tabs 中 Menu 和 Explore 的 enabled=true，其余 enabled=false
- sidebar_menu 路由使用 /explore?category= 格式

### 4. 顶部栏组件 (TopBar)

- 未登录状态: 显示 Logo + Sign In + Sign Up 按钮
- 已登录状态: 显示 Logo + 余额 + 充值按钮
- Logo 图片正确加载
- Sign Up 按钮使用绿色渐变背景

### 5. 底部 Tab 栏 (BottomTabBar)

- 显示 5 个 Tab: Menu / Explore / GET 1700 / Raffle / Quest
- Menu Tab 点击打开侧边菜单
- Explore Tab 点击跳转到 /explore
- GET 1700 / Raffle / Quest 点击显示 "Coming Soon" 提示
- 选中 Tab 图标和文字变为 #24EE89
- 未选中 Tab 图标和文字为 #6B7070

### 6. 侧边抽屉菜单 (SideDrawer)

- 从左侧滑出动画 (300ms ease-out)
- 显示遮罩层 rgba(0,0,0,0.6)
- 点击遮罩关闭菜单
- 包含全部游戏分类入口 (Favourite/Crash/Live/Slots/Table Game/Fishing/Lotto)
- 包含功能入口 (Notifications/Live Support 等)
- 分类入口点击跳转到 /explore?category=xxx
- 不可用功能显示 "Coming Soon" 标签

### 7. 首页内容流 (HomePage)

- Banner 轮播: 自动轮播 (5s) + 手势滑动 + 底部指示器
- 6 个游戏分类区各显示正确
- 每区有分类标题 + "All >" 链接
- "All >" 跳转到 /explore?category=xxx
- 游戏卡片支持横向滚动 (56px 小图标网格)
- 供应商网格 4 列显示
- 支付方式图标区域显示
- 社交媒体链接区显示
- 页脚显示 Privacy Policy / Terms Of Service

### 8. 视觉还原测试 (手动)

- 页面背景色 #232626
- 品牌强调色 #24EE89
- 顶部栏半透明毛玻璃效果
- 底部栏背景 #323738
- 字体 AvertaStd 正确加载 (fallback: Inter/system-ui)
- 移动端 430px 布局居中
- 横向滚动区隐藏滚动条

### 9. Mock 数据验证

- /home 聚合接口包含 jackpot/trending_games/big_winners/one_go_selection/promo_banners/latest_bets 字段
- 各 mock 字段数据结构完整 (非 null/非空)
- one_go_selection 包含 tabs 数组 (5个) 和 games 列表
- 前端 mock 数据组件能正确渲染
- mock 数据字段为空时，对应组件不渲染 (graceful degradation)
- 首页内容流顺序与 merge.html 精确一致: PromoBanner > Jackpot > Trending > BigWin > TableGame > Slots > Live > Fishing > 1GOSelection > Crash > Lotto > Payment > 37%Banner > LatestBet > Provider > Community > Footer

## 关键决策

- 首页以视觉还原度为重点
- API 测试覆盖数据完整性和过滤逻辑
- 导航可用性需覆盖全部入口和状态切换
- mock 数据需验证: API 返回结构正确 + 前端组件能渲染
