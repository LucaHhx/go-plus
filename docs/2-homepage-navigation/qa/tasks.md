# 任务清单

> 计划: homepage-navigation/qa | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 编写首页聚合API测试(/home数据完整性+过滤逻辑) | 已完成 | 2026-03-04 | 2026-03-04 | 4个API端点全部通过 |
| 2 | 编写Banner API测试(状态过滤+排序+过期) | 已完成 | 2026-03-04 | 2026-03-04 | Banner列表返回正确,按sort_order排序 |
| 3 | 编写配置API测试(/config/market+/config/nav结构验证) | 已完成 | 2026-03-04 | 2026-03-04 | market和nav配置返回正确 |
| 4 | 编写TopBar组件测试(登录/未登录状态切换) | 已完成 | 2026-03-04 | 2026-03-04 | TopBar视觉和交互正常 |
| 5 | 编写BottomTabBar组件测试(Tab切换+disabled状态+Coming Soon) | 已完成 | 2026-03-04 | 2026-03-04 | BottomTabBar交互正常,disabled Tab不跳转 |
| 6 | 编写SideDrawer组件测试(菜单项+路由跳转+开关动画) | 已完成 | 2026-03-04 | 2026-03-04 | SideDrawer菜单完整,路由跳转正确 |
| 7 | 编写HomePage内容流测试(Banner轮播+分类区+"All >"跳转) | 已完成 | 2026-03-04 | 2026-03-04 | 首页内容流完整,All链接正确 |
| 8 | 手动视觉还原测试(色值/字体/间距/响应式对比设计图纸) | 已完成 | 2026-03-04 | 2026-03-04 | 视觉CSS值与设计稿一致,字体加载失败为已知问题 |
| 9 | 验证/home聚合接口二期mock字段完整性(jackpot/trending/big_winners/one_go_selection/promo/latest_bets) | 已完成 | 2026-03-04 | 2026-03-04 | 确认mock数据结构正确(含1GO Selection)，前端组件能渲染，内容流顺序与merge.html一致; 二期mock字段全部通过: API 54/54验证项通过, 6个前端组件正确渲染mock数据, graceful degradation正确实现 |
