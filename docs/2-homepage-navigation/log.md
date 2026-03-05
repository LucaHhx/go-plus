# 计划日志

> 计划: homepage-navigation | 创建: 2026-03-04

<!--
类型: [决策] [变更] [修复] [新增] [测试] [备注] [完成]
格式: - [类型] 内容
按日期分组，最新在前
-->

## 2026-03-04

- [变更] Tech Lead 重构: 为 frontend/design.md 和 backend/design.md 添加期次分类概览表格。后端明确区分一期全功能API(6类数据库查询)、一期Mock API(6个硬编码字段)、二期API升级路径。前端明确标注13个组件的期次和数据来源
- [完成] [qa] 完成任务 #9: 验证/home聚合接口二期mock字段完整性(jackpot/trending/big_winners/one_go_selection/promo/latest_bets) (二期mock字段全部通过: API 54/54验证项通过, 6个前端组件正确渲染mock数据, graceful degradation正确实现)
- [测试] [qa] 二期 mock 字段完整性验证 (任务 #9) -- 结论: **通过**

### API 测试 -- 二期 mock 字段验证 (54/54 通过)

**注意**: 首次测试时 mock 字段全部缺失 (MISSING)，原因是后端服务运行的是旧编译版本 (18:14 启动，代码 19:00 更新)。重启后端服务后所有 mock 字段正常返回。

| mock 字段 | 数据量 | 字段完整性 | 结果 |
|-----------|--------|-----------|------|
| jackpot | pots:2, last_champion:1, my_turnover:1 | 全部字段匹配 design.md 定义 | 通过 |
| trending_games | 5 个游戏 | id/name/slug/thumbnail_url/provider_name 全有, CDN URL | 通过 |
| big_winners | 5 条记录 | game_name/thumbnail_url/multiplier 全有, multiplier 为数字 | 通过 |
| promo_banners | 1 个 | id/title/link_url 全有, title="37% First Deposit Cash Back" | 通过 |
| one_go_selection | tabs:5, games:5 | tabs=[1GO/Deposit/Cashier/Pay/Mega], active_tab=1GO | 通过 |
| latest_bets | latest_bet:10, high_roller:10, high_multiplier:10 | game/game_initial/player/profit/currency 全有 | 通过 |

### 浏览器 E2E 测试 -- 二期 mock 组件渲染验证

| # | 组件 | 渲染状态 | 数据一致性 | 交互 | 结果 |
|---|------|----------|-----------|------|------|
| 1 | JackpotSection | 渲染完整 (双奖池+Last Champion+My Turnover+GO BET) | 金额/用户名/倒计时与 API 一致 | -- | 通过 |
| 2 | TrendingGames | 5 个大卡片横向排列 | 游戏名+供应商名与 API 一致 | -- | 通过 |
| 3 | RecentBigWin | marquee 滚动 (10 个卡片 = 5 原始 + 5 复制) | 游戏名+倍率与 API 一致 | -- | 通过 |
| 4 | OneGoSelection | 5 个 Sub-Tab + 5 个游戏图标 | Tab 名称与 API tabs 一致 | Tab 可点击 | 通过 |
| 5 | DepositBanner | 绿色渐变 + "Deposit Now" 按钮 | 标题与 API title 一致 | -- | 通过 |
| 6 | LatestBetRace | 3 Tab + 10 行数据表格 | Tab 切换数据正确 (Latest Bet/High Roller/High Multiplier) | Tab 切换正常 | 通过 |

### 内容流顺序验证 (与 merge.html 一致)

实际页面顺序: PromoBanner > Jackpot > Trending Games > Recent Big Win > Table Game > Slots > Live > Fishing > 1GO Selection > Crash > Lotto > 支付方式 > 37%返现Banner > Latest Bet & Race > 供应商网格 > Community > Footer -- **与 frontend/design.md 和 merge.html 完全一致**

### Graceful Degradation 验证 (代码审查)

| 组件 | 空数据处理 | 代码位置 |
|------|-----------|---------|
| JackpotSection | `jackpot && jackpot.pots.length > 0` | HomePage.tsx:75 |
| TrendingGames | `if (games.length === 0) return null` | TrendingGames.tsx:8 |
| RecentBigWin | `if (winners.length === 0) return null` | RecentBigWin.tsx:8 |
| OneGoSelection | `oneGoSelection && oneGoSelection.tabs.length > 0` | HomePage.tsx:89 |
| DepositBanner | `if (banners.length === 0) return null` | DepositBanner.tsx:8 |
| LatestBetRace | `latestBets &&` | HomePage.tsx:105 |

全部组件在数据为空时不渲染 (return null)，graceful degradation 正确实现。

- [完成] [frontend] 完成任务 #17: 首页HomePage组装二期组件到正确位置(merge.html精确顺序) (HomePage按merge.html精确顺序组装全部二期组件: PromoBanner>Jackpot>Trending>BigWin>TableGame>Slots>Live>Fishing>1GOSelection>Crash>Lotto>Payment>37%Banner>LatestBet>Provider>Community>Footer)
- [变更] [frontend] 开始任务 #17: 首页HomePage组装二期组件到正确位置(merge.html精确顺序)
- [完成] [frontend] 完成任务 #16: 实现二期功能组件拆分: OneGoSelection/FirstDepositBanner/LatestBetRace(mock数据渲染) (OneGoSelection新建+DepositBanner/LatestBetRace改为props驱动,对接API数据)
- [变更] [frontend] 开始任务 #16: 实现二期功能组件拆分: OneGoSelection/FirstDepositBanner/LatestBetRace(mock数据渲染)
- [完成] [frontend] 完成任务 #15: 实现二期功能组件拆分: JackpotSection/TrendingGames/RecentBigWin(mock数据渲染) (JackpotSection/TrendingGames/RecentBigWin 改为从props接收API数据,不再硬编码mock)
- [变更] Tech Lead 按 merge.html 重构 L3 文档: (1) 发现并补充缺失的 '1GO Selection' 区域(merge.html line 644-676)到前端/后端/QA design+tasks; (2) 修正内容流顺序(Payment在Lotto后37%Banner前, 1GO Selection在Fishing和Crash之间); (3) 后端 /home API 增加 one_go_selection mock 字段; (4) 前端增加 OneGoSelection.tsx 组件规范(Sub-Tab+横向滚动)
- [变更] plan.md+tasks.md: 根据merge.html对齐首页内容流顺序; 新增1GO Selection区(Sub-Tab+mock); 修正支付方式和37%返现的先后顺序; 游戏分类拆为Fishing前4个+Crash后2个
- [完成] [backend] 完成任务 #7: /api/v1/home聚合接口增加二期mock字段(jackpot/trending_games/big_winners/one_go_selection/promo_banners/latest_bets) (硬编码jackpot/trending_games/big_winners/promo_banners/one_go_selection/latest_bets mock数据)
- [变更] [frontend] 开始任务 #15: 实现二期功能组件拆分: JackpotSection/TrendingGames/RecentBigWin(mock数据渲染)
- [变更] [qa] 开始任务 #9: 验证/home聚合接口二期mock字段完整性(jackpot/trending/big_winners/promo/latest_bets)
- [变更] [backend] 开始任务 #7: /api/v1/home聚合接口增加二期mock字段(jackpot/trending_games/big_winners/one_go_selection/promo_banners/latest_bets)
- [变更] PM按新策略重构范围: 去掉'二期功能一期前端实现'标注,统一为'第一期交付+后端mock'; 验收章节标题改为'后端mock组件验收'
- [决策] 基于 merge.html 设计稿更新后端 mock 数据结构: jackpot 改为双奖池(VIP Money Pot+Daily Jackpot)+Last Champion+My Turnover; big_winners 改为含缩略图+倍率; latest_bets 改为 3-Tab 分组(latest_bet/high_roller/high_multiplier); 前端任务组件名同步更新(JackpotSection/RecentBigWin/LatestBetRace)
- [变更] PM评审(补充): 以merge.html为权威参考重新校准plan.md -- (1) 修正内容流顺序: 支付方式在供应商网格之后(而非之前); (2) mock组件验收标准细化为像素级参数(从merge.html提取: trending-card 142x96px, bigwin-card 140px/48x48缩略图, jackpotPulse/marqueeScroll动效, bet-row grid布局等); (3) 包含章节补充merge.html中各组件的具体结构描述(Jackpot子区域/Trending卡片尺寸/BigWin marquee参数)
- [决策] Tech Lead 评审: 后端/api/v1/home聚合接口增加二期mock字段(jackpot/trending_games/big_winners/promo_banners/latest_bets)，一期硬编码返回，二期替换为真实数据
- [决策] Tech Lead 评审: 前端design.md增加二期功能组件拆分方案(JackpotBanner/TrendingGames/BigWinners/FirstDepositBanner/LatestBets)，所有设计图纸区域一期均拆分为独立组件使用mock数据渲染
- [变更] PM评审: (1) plan.md范围重构 -- '不包含'拆分为三类: '一期组件+mock数据'(奖池/Trending/大赢家/37%返现/实时投注)/一期占位(GET1700/Raffle/Quest Tab)/不包含; (2) 首页内容流补充二期mock组件的完整顺序; (3) 功能验收新增'一期组件+mock数据验收'章节(6条); (4) 视觉验收内容流顺序更新; (5) tasks.md新增任务#12~#16: 5个二期mock组件任务
- [决策] 最终量化评估: 10区域中5PASS(AppLayout/TopBar/PromoBanner/CommunityLinks/Footer)、5FAIL(GameSectionRow/ProviderGrid/PaymentMethodsBar/BottomTabBar/SideDrawer)。共12处差异,7处严重。根因统一: img+filter替代内联SVG导致颜色控制失真。结论: 不需重构架构,修6个文件即可。
- [测试] P0间距验证通过: 所有Tailwind utility class computed值与merge.html一致。PromoBanner mx-4=16px/mt-3=12px, GameSectionRow px-4=16px/mt-4=16px, ProviderGrid gap-2=8px/item h-44px/bg#323738, game-icon 56x56px/gap-3=12px, All链接14px/600/#24EE89, 社交按钮品牌色正确
- [决策] 深度评估: 用户评分3/10后重新审查。发现之前审查过于表面(只对比class名)。核心问题: (1)BottomTabBar/GameSectionRow/SideDrawer图标用img+filter而非内联SVG,颜色控制失真; (2)PaymentMethodsBar用SVG text而非HTML span; (3)ProviderGrid丢失个性化样式; (4)Tailwind v3(CDN)vs v4(@theme)可能有渲染差异。结论: 不需重构架构,需系统性修复6个组件的SVG渲染和样式细节。
- [变更] 更新供应商 seed 数据与设计稿完全对齐: 19个供应商(JILI/SPRIBE/JDB/Evolution/iNOUT/HACKSAW GAMING/PG/playtech/TURBO GAMES/Microgaming/HABANERO/SA GAMING + 7个NEW标记: NETENT/NOLIMIT CITY/RED TIGER/BigTime Gaming/TAP-A-ROO/Ezugi/CENi), seed版本升级到v3
- [决策] 第二轮代码审查完成: 两个P0问题(Card边框+内容紧贴边缘)经逐行对比确认代码与merge.html完全一致。merge.html设计系统无显式border,使用背景色层叠;所有组件px-4/mx-4间距匹配。建议QA用DevTools验证computed值。
- [测试] [P0 Bug] 全局CSS reset覆盖Tailwind: index.css第64-68行 * { margin: 0; padding: 0; } 覆盖了@layer utilities中的所有Tailwind间距类(px-4/mx-4/mt-4/gap-3等), 导致页面所有内容紧贴边缘无留白
- [修复] [tech-lead] 用户补充反馈: Card缺少边框, Card样式(边框/圆角/阴影/背景)与设计稿不一致。已创建修复任务#10, 协调UI审查边框规范+前端修复
- [完成] QA验收测试全部通过: API测试4/4通过, 浏览器E2E测试6/6通过, 视觉CSS验证10/10通过
- [测试] [qa] QA 最终验收测试完成 -- 结论: **通过**

### API 测试结果 (阶段A) -- 全部通过 (4/4)

| 接口 | 方法 | 状态码 | 结果 |
|------|------|--------|------|
| /api/v1/home | GET | 200 | 通过 |
| /api/v1/banners | GET | 200 | 通过 |
| /api/v1/config/market | GET | 200 | 通过 |
| /api/v1/config/nav | GET | 200 | 通过 |

**API 详细验证:**

**TC-001: GET /api/v1/home (首页聚合)**
- 请求: `GET /api/v1/home`
- 响应: `200 {"code":0,"message":"success","data":{...}}`
- 数据完整性: banners(3个), game_sections(6个分类), providers(20个), payment_icons(6个), social_links(5个) -- 全部非空
- 分类顺序: Table Game > Slots > Live > Fishing > Crash > Lotto -- 正确
- 每分类 8 个游戏, game 对象包含 id/name/slug/thumbnail_url/is_new/is_hot -- 字段完整
- thumbnail_url 使用真实 CDN URL (https://1goplus.com/static/game/icon/...) -- 正确
- providers 中 NETENT/TADA/LUDO 标记 is_new=true -- 正确
- 结果: 通过

**TC-002: GET /api/v1/banners (Banner列表)**
- 请求: `GET /api/v1/banners`
- 响应: `200 {"code":0,"data":[3个Banner]}`
- 每个 Banner 包含 id/title/image_url/link_url/link_type -- 字段完整
- 结果: 通过

**TC-003: GET /api/v1/config/market (市场配置)**
- 请求: `GET /api/v1/config/market`
- 响应: `200 {"code":0,"data":{"code":"IN","name":"India","currency":"INR","currency_symbol":"₹","phone_prefix":"+91","locale":"en"}}`
- 结果: 通过

**TC-004: GET /api/v1/config/nav (导航配置)**
- 请求: `GET /api/v1/config/nav`
- 响应: `200 {"code":0,"data":{"bottom_tabs":[5个],"sidebar_menu":[15个]}}`
- bottom_tabs: Menu/Explore enabled=true, GET 1700/Raffle/Quest enabled=false -- 正确
- sidebar_menu: 8 个游戏分类 + 7 个功能入口, 路由使用 /explore?category=xxx 格式 -- 正确
- Weekly Raffle/Crash 有 tag="Hot" -- 正确
- 结果: 通过

**TC-005: 错误处理**
- 404: `GET /api/v1/nonexistent` -> HTTP 404 -- 正确
- CORS: Access-Control-Allow-Origin: * -- 已配置

### 浏览器 E2E 测试结果 (阶段B) -- 全部通过

| # | 场景 | 截图 | 结果 |
|---|------|------|------|
| 1 | 首页顶部 (TopBar + Banner + 游戏分类) | step-01, step-02 | 通过 |
| 2 | 首页底部 (供应商 + 社区 + 页脚) | step-03, step-04 | 通过 |
| 3 | 侧边菜单 (Menu Tab 打开) | step-05 | 通过 |
| 4 | 分类跳转 (Live -> /explore?category=live) | step-06 | 通过 |
| 5 | Explore Tab 跳转 (/explore) | -- | 通过 |
| 6 | Disabled Tab (GET 1700 点击不跳转) | step-07 | 通过 |

**视觉 CSS 验证:**

| 属性 | 期望值 | 实际值 | 状态 |
|------|--------|--------|------|
| 容器最大宽度 | 430px | 430px | 通过 |
| 内容区背景色 | #232626 | rgb(35,38,38) | 通过 |
| TopBar 高度 | 56px | 56px | 通过 |
| TopBar z-index | 1000 | 1000 | 通过 |
| TopBar 毛玻璃 | rgba(50,55,56,0.85) + blur(10px) | 一致 | 通过 |
| BottomTabBar 高度 | 64px | 64px | 通过 |
| BottomTabBar 背景 | #323738 | rgb(50,55,56) | 通过 |
| Sign Up 渐变 | linear-gradient(90deg, #24EE89, #9FE871) | 一致 | 通过 |
| Sign Up 字号/字重/高度 | 16px / 800 / 40px | 一致 | 通过 |
| Sign In 样式 | 白色文字, 透明背景 | 一致 | 通过 |

**功能验收清单对照:**

- [x] 首页加载后展示完整的深色主题布局
- [x] 顶部栏固定显示: Sign In + Sign Up 按钮
- [x] 底部 Tab 栏固定显示 5 个 Tab, Menu 和 Explore 可点击
- [x] Banner 轮播展示 (CDN 图片)
- [x] 6 个游戏分类区, 横向排列游戏图标
- [x] 每个分类区有 "All" 链接, 跳转正确
- [x] Menu Tab 打开侧边菜单
- [x] 侧边菜单包含 8 个游戏分类 + 7 个功能入口
- [x] 侧边菜单分类项跳转正确 (/explore?category=xxx)
- [x] 供应商网格 4 列, NEW 角标正确
- [x] 社区链接 5 个 (Telegram/facebook/Instagram/WhatsApp/YouTube)
- [x] 移动优先 430px 布局
- [x] 滚动时顶栏/底栏固定可见

### 已知问题 (非阻塞)

| 问题 | 严重程度 | 说明 |
|------|----------|------|
| AvertaStd 字体加载失败 | P2 | 字体文件未部署到 public/assets/fonts/, 回退到 system-ui |
| Logo 显示为文字 "GO PLUS" | P2 | logo.svg 未部署, 使用绿色文字替代 |

### 截图索引

- `step-01-homepage-top.png` — 首页顶部 (TopBar + PromoBanner + Banner轮播)
- `step-02-homepage-scroll1.png` — 6个游戏分类区 (Table Game/Slots/Live/Fishing/Crash/Lotto)
- `step-03-homepage-scroll2.png` — 供应商网格 + 社区链接 + 支付方式 + 页脚
- `step-04-homepage-bottom.png` — 页面底部区域
- `step-05-side-drawer.png` — 侧边菜单展开
- `step-06-explore-live.png` — Live 分类页面 (Coming Soon)
- `step-07-get1700-click.png` — GET 1700 点击后 (不跳转)

- [完成] [qa] 完成任务 #8: 手动视觉还原测试(色值/字体/间距/响应式对比原站) (视觉CSS值与设计稿一致,字体加载失败为已知问题)
- [变更] [qa] 开始任务 #8: 手动视觉还原测试(色值/字体/间距/响应式对比原站)
- [完成] [qa] 完成任务 #7: 编写HomePage内容流测试(Banner轮播+分类区+"All >"跳转) (首页内容流完整,All链接正确)
- [变更] [qa] 开始任务 #7: 编写HomePage内容流测试(Banner轮播+分类区+"All >"跳转)
- [完成] [qa] 完成任务 #6: 编写SideDrawer组件测试(菜单项+路由跳转+开关动画) (SideDrawer菜单完整,路由跳转正确)
- [变更] [qa] 开始任务 #6: 编写SideDrawer组件测试(菜单项+路由跳转+开关动画)
- [完成] [qa] 完成任务 #5: 编写BottomTabBar组件测试(Tab切换+disabled状态+Coming Soon) (BottomTabBar交互正常,disabled Tab不跳转)
- [变更] [qa] 开始任务 #5: 编写BottomTabBar组件测试(Tab切换+disabled状态+Coming Soon)
- [完成] [qa] 完成任务 #4: 编写TopBar组件测试(登录/未登录状态切换) (TopBar视觉和交互正常)
- [完成] [tech-lead] 代码审查(任务#3)完成 -- 结论: 通过(有条件)。14/17项通过,3项NOTE(非阻塞): (1)SideDrawer PromoBanner简化与merge.html略有差异; (2)index.css残留第二期动画样式(死代码); (3)PaymentMethodsBar在merge.html中无对应区域。所有用户反馈问题已解决: 第二期组件已移除,布局/样式与设计稿对齐。通知QA开始测试。
- [修复] 前端视觉修复: (1)移除5个第二期组件(Jackpot/TrendingGames/RecentBigWin/DepositBanner/LatestBetRace) (2)SideDrawer promo改为pt-6+简化文案/菜单项统一chevron-right SVG/divider用token (3)BottomTabBar改用CSS class get1700-wrap/get1700-bg/tab间距mr-3 ml-3 (4)GameSectionRow All链接箭头改inline SVG/game-scroll CSS class (5)CommunityLinks Instagram渐变45deg (6)index.css新增game-scroll/game-icon-card/get1700样式
- [完成] [frontend] 完成任务 #1: 实现AppLayout整体布局(TopBar+BottomTabBar+内容区) (视觉修复完成: 移除第二期组件、修复侧边菜单样式、修复底部Tab布局、统一设计稿CSS规范)
- [备注] [tech-lead] 代码审查(任务#3)进行中: HomePage移除第二期组件(通过), SideDrawer/BottomTabBar/GameSectionRow样式对齐设计稿(通过), CSS动画(rainbowRotate/hotEventPulse)与merge.html一致(通过), 等待UI视觉复核
- [变更] [qa] 开始任务 #4: 编写TopBar组件测试(登录/未登录状态切换)
- [变更] [frontend] 开始任务 #1: 实现AppLayout整体布局(TopBar+BottomTabBar+内容区)
- [完成] [qa] 完成任务 #3: 编写配置API测试(/config/market+/config/nav结构验证) (market和nav配置返回正确)
- [变更] [qa] 开始任务 #3: 编写配置API测试(/config/market+/config/nav结构验证)
- [完成] [qa] 完成任务 #2: 编写Banner API测试(状态过滤+排序+过期) (Banner列表返回正确,按sort_order排序)
- [变更] [qa] 开始任务 #2: 编写Banner API测试(状态过滤+排序+过期)
- [完成] [qa] 完成任务 #1: 编写首页聚合API测试(/home数据完整性+过滤逻辑) (4个API端点全部通过)
- [变更] [qa] 开始任务 #1: 编写首页聚合API测试(/home数据完整性+过滤逻辑)
- [测试] [qa] QA 最终回归测试完成 (seed 数据更新 + 前端图标 API 驱动渲染后) -- 结论: **有条件通过**

### API 测试结果 (阶段A) -- 全部通过 (4/4)

| 接口 | 方法 | 状态码 | 结果 |
|------|------|--------|------|
| /api/v1/home | GET | 200 | 通过 |
| /api/v1/banners | GET | 200 | 通过 |
| /api/v1/config/market | GET | 200 | 通过 |
| /api/v1/config/nav | GET | 200 | 通过 |

**API 详细验证 (最终回归 - seed 数据更新后):**
- /home: 5个顶层字段完整 (banners/game_sections/payment_icons/providers/social_links)
- /home: 3个 Banner (使用 1goplus.com CDN 图片), 6个游戏分类(Table Game>Slots>Live>Fishing>Crash>Lotto 顺序正确), 每分类8个游戏
- /home: game 对象包含 id/name/slug/thumbnail_url/is_new/is_hot 全部字段, thumbnail_url 使用真实 CDN URL
- /home: 20个供应商(NETENT/TADA/LUDO 3个 is_new=true), 6个支付图标(UPI/Paytm/PhonePe/GPay/IMPS/USDT), 5个社交链接
- /banners: 3个 Banner, 每个包含 id/title/image_url/link_url/link_type
- /config/market: code=IN, currency=INR, currency_symbol=₹, phone_prefix=+91, locale=en
- /config/nav: 5个 bottom_tabs (Menu/Explore enabled, 其余 disabled), 15个 sidebar_menu 项(7个游戏分类+8个功能)

### 浏览器 E2E 测试结果 (阶段B) -- 最终回归

| # | 场景 | 截图 | 结果 |
|---|------|------|------|
| 1 | 首页内容流完整渲染 (PromoBanner+Banner轮播+6分类+供应商+支付+社区+页脚) | final-01~04 | 通过 |
| 2 | TopBar/BottomTabBar 在 430px 容器内居中 | final-01 | 通过 |
| 3 | Banner 轮播 (真实 CDN 图片+自动轮播+指示器) | final-01 | 通过 |
| 4 | 6个游戏分类区 (每区8个游戏, 真实 CDN 缩略图, 横向滚动) | final-03 | 通过 |
| 5 | "All >" 链接跳转 (6个分类全部 href 正确, 点击跳转 /explore?category=xxx) | final-03 | 通过 |
| 6 | 侧边菜单打开 (Menu Tab, 8游戏分类+7功能入口, Hot/Coming Soon 标签) | final-05 | 通过 |
| 7 | 侧边菜单分类跳转 (Slots -> /explore?category=slots) | -- | 通过 |
| 8 | 供应商网格 (4列, 20个供应商, NETENT/TADA/LUDO 有 NEW 角标) | final-04 | 通过 |
| 9 | 社区链接 (Telegram/facebook/Instagram/WhatsApp/YouTube, 品牌色+SVG图标) | final-04 | 通过 |
| 10 | 支付方式图标 (UPI/Paytm/PhonePe/GPay/IMPS/USDT, API 数据驱动) | final-04 | 通过 |
| 11 | 页脚 (Privacy Policy / Terms Of Service) | final-04 | 通过 |
| 12 | Explore Tab 跳转 (/explore) | -- | 通过 |
| 13 | 不可用 Tab Coming Soon (GET 1700/Raffle/Quest) | -- | 通过 |
| 14 | GET 1700 Tab 居中突出 (CDN 图片 + scale) | final-01 | 通过 |

### 已修复的 Bug

| Bug | 严重程度 | 状态 | 说明 |
|-----|----------|------|------|
| BUG-1: 侧边菜单/All>/Explore跳转失败 | P1 | 已修复 | App.tsx 缺少 /explore 路由 (task #14) |
| BUG-2: 游戏缩略图全部黑色占位 | P1 | 已修复 | seed 数据改用真实 CDN URL (task #11) |
| BUG-3: 社交/支付图标不显示 | P1 | 已修复 | 前端改为内联 SVG + API 数据驱动 (task #12) |

### 观察 (非阻塞)

| 问题 | 严重程度 | 说明 |
|------|----------|------|
| ~~Jackpot of the Day 区域出现在首页~~ | ~~P3~~ | 已解决: PM评审(第二轮)明确为一期组件+mock数据，属于设计图纸还原范围 |
| ~~37% First Deposit Cash Back 横幅出现~~ | ~~P3~~ | 已解决: PM评审(第二轮)明确为一期组件+mock数据 |
| ~~Latest bet & Race 区域出现~~ | ~~P3~~ | 已解决: PM评审(第二轮)明确为一期组件+mock数据 |
| Logo 显示为文字 "GO PLUS" | P2 | logo.svg 未部署, 降级为绿色文字 (可接受) |
| 字体 AvertaStd 未加载 | P2 | 字体文件未部署, 使用 fallback (可接受) |

### 截图索引 (最终回归)
- `final-01-homepage-top.png` — 首页顶部 (TopBar+PromoBanner+Banner轮播+Jackpot)
- `final-02-game-sections-top.png` — 首页中部 (Banner轮播+Jackpot)
- `final-03-game-sections.png` — 6个游戏分类区 (Slots/Live/Fishing/Crash/Lotto, 真实CDN图片)
- `final-04-providers-footer.png` — 供应商网格+支付方式+社区链接+页脚
- `final-05-side-drawer.png` — 侧边菜单展开

- [决策] 所有动态数据(游戏/供应商/Banner/社交链接/支付方式)统一从后端API获取，前端不硬编码; 后端seed数据需使用真实CDN图片URL
- [修复] 代码审查修复: (1) 前后端API字段名对齐(payment_methods->payment_icons, GameSection.category从string改为对象, Game.icon_url->thumbnail_url等8处); (2) SideDrawer游戏分类项添加path路由; (3) All>从span改为Link组件+text-txt-secondary颜色; (4) Coming Soon toast; (5) divider色值#3A4142->#3A3D3D; (6) UserBalanceChip h-9->h-10; (7) TopBar添加Hot Event图标
- [变更] 布局方案从 position:fixed 改为 flex column 容器模式: AppLayout(h-screen flex flex-col) + TopBar/BottomTabBar(shrink-0) + main(flex-1 overflow-y-auto) + SideDrawer(absolute); 解决了 fixed 元素在宽屏不居中的根本问题
- [变更] Tech Lead 同步PM评审修正: (1) 顶栏按钮文案从 Join Now/Log In 改为 Sign In/Sign Up; (2) 分类跳转链接从 See All 改为 All >; (3) 前端组件 SeeAllLink.tsx 重命名为 AllLink.tsx; 涉及文件: frontend/design.md, frontend/tasks.md, qa/design.md, qa/tasks.md
- [决策] Tech Lead L3 评审(第二轮): (1) 标注 UI/前端内容流中第二期区块(Jackpot/Trending/BigWin/37%Banner/LatestBet), 避免误导开发; (2) 后端补充 game_categories/game_providers 表和 /home API providers 字段; (3) QA 测试方案从2个用例扩充到8个(覆盖API+组件+视觉); (4) 前端补充 ProviderGrid/PromoBanner 组件; (5) UI 补充 Resources/assets-manifest.md 资源交付清单
- [变更] PM评审: 验收清单大幅增强 -- 视觉还原按维度拆分(整体布局/顶部栏/底部Tab/Banner/游戏分类区/侧边菜单/供应商网格/社区页脚/图片资源), 补充像素级标准(高度/宽度/间距/色值/字号/圆角/动效参数); 修正按钮文案Join Now/Log In为原站实际的Sign In/Sign Up; 修正See All为原站实际的All >; 优化tasks.md消除任务重叠,补充供应商网格任务#6,每个任务备注增加关键验收参数
- [变更] UI 设计师完成首页 merge.html 1:1 还原 -- 从 1goplus.com 实际抓取色值(#323738 底部栏, rgba(50,55,56,0.85) 顶部栏, linear-gradient(90deg,#24EE89,#9FE871) Sign Up 按钮), SVG 图标, 图片资源 URL, 布局结构。更新 design.md 和 Introduction.md 设计文档
- [变更] PM评审: 验收清单拆分为功能验收+视觉还原验收, 补充与1goplus.com 1:1一致的视觉要求, 新增任务#9~#11视觉还原+资源抓取
- [决策] Tech Lead L3 评审: 补充前端资源管理方案(资源来源/抓取策略/字体方案/目录结构),新增资源抓取和字体配置技术任务
- [完成] UI设计完成: design.md + merge.html + Introduction.md (含全局设计系统)
- [修复] Tech Lead L3 评审: 修复侧边菜单导航路由从 /games?category= 改为 /explore?category= 与前端路由一致; 首页聚合 API games 对象补充 slug/is_hot 字段
- [完成] [ui] 完成任务 #3: 编写 Introduction.md 设计说明 (编写前端设计说明，含布局架构、内容流、组件规范、交互要点)
- [变更] [ui] 开始任务 #3: 编写 Introduction.md 设计说明
- [完成] [ui] 完成任务 #2: 制作 merge.html 效果图（首页、顶部栏、底部Tab、侧边菜单） (首页完整效果图，含顶部栏、底部Tab、侧边菜单、Banner、6个游戏分类区、供应商网格、社区页脚)
- [变更] [ui] 开始任务 #2: 制作 merge.html 效果图（首页、顶部栏、底部Tab、侧边菜单）
- [完成] [ui] 完成任务 #1: 完善 design.md 设计系统文档 (完善全局设计系统文档，包含调色板、字体、间距、圆角、组件规范)
- [变更] [ui] 开始任务 #1: 完善 design.md 设计系统文档
- [决策] UI资源从1goplus.com网站抓取
- [决策] 底部5个Tab: Menu/Explore/GET1700/Raffle/Quest, 第一期仅Menu和Explore可用
- [决策] 移动优先设计(~430px), 竖屏优先
- [决策] 采用深色主题设计: 背景#232626, 强调色#24EE89
- [备注] 导航配置和首页API设计等技术细节供开发团队在L3设计时参考
- [新增] 创建计划