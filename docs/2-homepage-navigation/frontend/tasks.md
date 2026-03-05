# 任务清单

> 计划: homepage-navigation/frontend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 实现AppLayout整体布局(TopBar+BottomTabBar+内容区) | 已完成 | 2026-03-04 | 2026-03-04 | AppLayout.tsx + Outlet; 视觉修复完成: 移除第二期组件、修复侧边菜单样式、修复底部Tab布局、统一设计稿CSS规范 |
| 2 | 实现TopBar组件(Logo+登录按钮/余额显示) | 已完成 | 2026-03-04 | 2026-03-04 | TopBar.tsx 半透明backdrop-filter |
| 3 | 实现BottomTabBar组件(5Tab+enabled状态控制) | 已完成 | 2026-03-04 | 2026-03-04 | 含GET1700特殊tab |
| 4 | 实现SideDrawer侧边抽屉菜单(游戏分类+功能入口) | 已完成 | 2026-03-04 | 2026-03-04 | 8游戏+7功能项 |
| 5 | 实现HomePage首页(聚合API数据渲染) | 已完成 | 2026-03-04 | 2026-03-04 | 对接/home API |
| 6 | 实现BannerCarousel轮播组件(自动+手势+指示器) | 已完成 | 2026-03-04 | 2026-03-04 | 5s自动+touch滑动 |
| 7 | 实现GameSectionRow游戏分类横向滚动区(含"All >"跳转) | 已完成 | 2026-03-04 | 2026-03-04 | 56px图标+隐藏滚动条 |
| 8 | 实现ProviderGrid供应商网格(4列+NEW标签) | 已完成 | 2026-03-04 | 2026-03-04 | 绿色NEW角标 |
| 9 | 实现FooterSection页脚(CommunityLinks+支付图标+版权) | 已完成 | 2026-03-04 | 2026-03-04 | 3个子组件 |
| 10 | 实现深色主题全局样式(#232626/#24EE89/AvertaStd) | 已完成 | 2026-03-04 | 2026-03-04 | index.css @theme扩展 |
| 11 | 实现appStore(Zustand: 侧边栏/市场配置/导航配置) | 已完成 | 2026-03-04 | 2026-03-04 | appStore.ts |
| 12 | 集成UI设计师交付的全部UI资源(Logo/图标/字体/装饰元素) | 已完成 | 2026-03-04 | 2026-03-04 | 29个SVG图标已复制到public/assets/icons/ |
| 13 | 配置AvertaStd字体(@font-face+fallback+font-display) | 已完成 | 2026-03-04 | 2026-03-04 | 字体文件待人工提供,@font-face已配置 |
| 14 | 代码审查修复(P0/P1/P2共8项) | 已完成 | 2026-03-04 | 2026-03-04 | API字段匹配/路由跳转/HotEvent/Toast/divider色值 |
| 15 | 实现二期功能组件拆分: JackpotSection/TrendingGames/RecentBigWin(mock数据渲染) | 已完成 | 2026-03-04 | 2026-03-04 | 二期功能一期组件化，对接/home聚合接口mock字段; JackpotSection/TrendingGames/RecentBigWin 改为从props接收API数据,不再硬编码mock |
| 16 | 实现二期功能组件拆分: OneGoSelection/FirstDepositBanner/LatestBetRace(mock数据渲染) | 已完成 | 2026-03-04 | 2026-03-04 | 1GO Selection(Sub-Tab+游戏列表)+37%首存Banner+实时投注动态; OneGoSelection新建+DepositBanner/LatestBetRace改为props驱动,对接API数据 |
| 17 | 首页HomePage组装二期组件到正确位置(merge.html精确顺序) | 已完成 | 2026-03-04 | 2026-03-04 | 顺序: PromoBanner>Jackpot>Trending>BigWin>TableGame>Slots>Live>Fishing>1GOSelection>Crash>Lotto>Payment>37%Banner>LatestBet>Provider>Community>Footer; HomePage按merge.html精确顺序组装全部二期组件: PromoBanner>Jackpot>Trending>BigWin>TableGame>Slots>Live>Fishing>1GOSelection>Crash>Lotto>Payment>37%Banner>LatestBet>Provider>Community>Footer |
