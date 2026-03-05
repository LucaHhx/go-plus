# 管理后台 -- 前端设计说明

## 设计概述

管理后台面向内部运营团队，桌面优先。基于 create-web Dark Dashboard Kit 构建，使用 Kit 内置组件和布局。深色主题，品牌绿色强调色。

## 技术基础

- 框架: React + TypeScript + Vite
- 配色: 独立深蓝色系主题 (surface: #1a1a2e, 非客户端 #232626)
- 字体: Inter (非 AvertaStd)
- 布局: Sidebar (240px) + TopBar (56px) + PageContainer (padding 24px)
- 响应式: 移动(<768) / 平板(768-1199) / 桌面(>=1200), Sidebar 在 lg 以下隐藏

## 页面清单

| 页面 | 路由 | 优先级 |
|------|------|--------|
| 登录 | `/admin/login` | P0 |
| 仪表盘 | `/admin/dashboard` | P0 |
| 用户管理 | `/admin/users` | P0 |
| 用户详情 | `/admin/users/:id` | P0 |
| 游戏管理 | `/admin/games` | P0 |
| 供应商管理 | `/admin/games/providers` | P1 |
| 充值记录 | `/admin/transactions/deposits` | P0 |
| 提现审核 | `/admin/transactions/withdrawals` | P0 |
| Banner管理 | `/admin/content/banners` | P1 |
| 系统配置 | `/admin/settings` | P1 |

## Dashboard 关键指标

4 个 StatCard:
1. 今日新注册用户数
2. 今日活跃用户数
3. 今日充值总额 (INR)
4. 今日提现总额 (INR) + 待审核数徽章

7 日柱状图: 充值 (绿色) vs 提现 (红色) 对比

## DataTable 规范

Kit 不包含 DataTable 组件，需前端自行实现:
- 表头: 灰色小字, 可排序 (点击切换升降序)
- 行: 悬浮态背景变深
- 分页: 底部页码导航
- 搜索: 顶部搜索框
- 状态 Badge: 绿色 (Active/Approved) / 黄色 (Pending) / 红色 (Disabled/Rejected)

## 提现审核流程

提现审核是管理后台的核心操作流程:
1. Pending 行黄色高亮背景
2. 每行有 Approve (绿色按钮) + Reject (红色按钮)
3. 点击 Approve/Reject 弹出确认 Modal
4. 操作成功后 Toast 提示
5. Sidebar "Transactions" 旁显示红色数字徽章

## 前端注意事项

1. 使用 Kit 自带的 AppShell、Sidebar、TopBar、Toast、Modal 组件
2. DataTable 需自行实现，建议封装为可复用组件
3. Dashboard 数据第一期用 Mock，后续接入 API
4. 管理员认证使用独立的 JWT token，与客户端分离
5. 提现审核操作需要二次确认 (Modal)
6. 表格数据量大时考虑服务端分页
