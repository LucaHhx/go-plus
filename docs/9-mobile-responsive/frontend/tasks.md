# 任务清单

> 计划: 9-mobile-responsive/frontend | 创建: 2026-03-16

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 全局基础设施: index.html 添加 viewport-fit=cover; index.css 添加 overscroll-behavior:none + safe-area 辅助类 + dvh fallback | 待办 |  |  |  |
| 2 | 新建 FullScreenLayout.tsx 通用组件: min-h-dvh + max-w-[430px] + flex-col 布局容器 | 待办 |  |  |  |
| 3 | AppLayout.tsx 改造: h-screen 改为 height:100dvh，确认 flexbox 三段式布局在移动端正常工作 | 待办 |  |  |  |
| 4 | BottomTabBar.tsx 安全区域适配: 添加 padding-bottom: env(safe-area-inset-bottom)，height 改为 min-height | 待办 |  |  |  |
| 5 | SideDrawer.tsx 检查: overlay 覆盖范围确认，菜单项触控区域确认 >= 44px | 待办 |  |  |  |
| 6 | Wallet 页面适配: DepositPage/WithdrawPage/TransactionsPage 改用 FullScreenLayout，底部按钮安全区域 | 待办 |  |  |  |
| 7 | Profile 页面适配: ProfilePage/SecurityPage 改用 FullScreenLayout | 待办 |  |  |  |
| 8 | ExplorePage 检查: 确认自建 header 与 AppLayout TopBar 的关系，修复布局问题 | 待办 |  |  |  |
| 9 | HomePage 滚动体验: 确认长内容流在 main overflow-y-auto 容器中滚动流畅 | 待办 |  |  |  |
| 10 | 触控区域全局审查: 检查所有可点击元素 >= 44x44px，修复不达标的按钮和链接 | 待办 |  |  |  |
| 11 | Auth 页面 dvh 迁移: LoginPage/RegisterPage/GiftSelectPage 的 min-h-screen 改为 min-h-dvh | 待办 |  |  |  |
| 12 | GamePlayPage dvh 迁移: min-h-screen 改为 min-h-dvh，确保游戏 iframe 不被地址栏遮挡 | 待办 |  |  |  |
| 13 | 多分辨率兼容: 在 375px/390px/430px 宽度下验证所有页面无水平溢出、内容截断 | 待办 |  |  |  |