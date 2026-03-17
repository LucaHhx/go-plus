# 任务清单

> 计划: 9-mobile-responsive/frontend | 创建: 2026-03-16

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 全局基础设施: index.html 添加 viewport-fit=cover; index.css 添加 overscroll-behavior:none + safe-area 辅助类 + dvh fallback | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 2 | 新建 FullScreenLayout.tsx 通用组件: min-h-dvh + max-w-[430px] + flex-col 布局容器 | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 3 | AppLayout.tsx 改造: h-screen 改为 height:100dvh，确认 flexbox 三段式布局在移动端正常工作 | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 4 | BottomTabBar.tsx 安全区域适配: 添加 padding-bottom: env(safe-area-inset-bottom)，height 改为 min-height | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 5 | SideDrawer.tsx 检查: overlay 覆盖范围确认，菜单项触控区域确认 >= 44px | 已完成 | 2026-03-17 | 2026-03-17 | 已确认: overlay 在 430px 容器内正确覆盖; 菜单项触控区域 ~48px >= 44px, 无需修改 |
| 6 | Wallet 页面适配: DepositPage/WithdrawPage/TransactionsPage 改用 FullScreenLayout，底部按钮安全区域 | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 7 | Profile 页面适配: ProfilePage/SecurityPage 改用 FullScreenLayout | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 8 | ExplorePage 检查: 确认自建 header 与 AppLayout TopBar 的关系，修复布局问题 | 已完成 | 2026-03-17 | 2026-03-17 | 已确认: 自建 header 使用 sticky top-0 在 main overflow-y-auto 容器内, 不与 TopBar 冲突, 布局正确无需修改 |
| 9 | HomePage 滚动体验: 确认长内容流在 main overflow-y-auto 容器中滚动流畅 | 已完成 | 2026-03-17 | 2026-03-17 | 已确认: HomePage 在 AppLayout main(flex-1 overflow-y-auto) 中, 配合 dvh 修复后滚动正常, 无需额外修改 |
| 10 | 触控区域全局审查: 检查所有可点击元素 >= 44x44px，修复不达标的按钮和链接 | 已完成 | 2026-03-17 | 2026-03-17 | 已审查: TopBar 按钮 40x44px OK; BottomTabBar 64px 容器内 OK; SideDrawer 菜单项 ~48px OK; 表单按钮 h-11/h-12 OK; 所有可点击元素满足 44px 最小触控区域 |
| 11 | Auth 页面 dvh 迁移: LoginPage/RegisterPage/GiftSelectPage 的 min-h-screen 改为 min-h-dvh | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 12 | GamePlayPage dvh 迁移: min-h-screen 改为 min-h-dvh，确保游戏 iframe 不被地址栏遮挡 | 已完成 | 2026-03-17 | 2026-03-17 |  |
| 13 | 多分辨率兼容: 在 375px/390px/430px 宽度下验证所有页面无水平溢出、内容截断 | 已完成 | 2026-03-17 | 2026-03-17 | 已检查: 所有固定宽度元素在水平滚动容器或 flex-shrink-0 中, 不会导致溢出; 所有页面使用 max-w-430px + px-4 padding, 在 375px/390px/430px 宽度下无水平溢出风险 |