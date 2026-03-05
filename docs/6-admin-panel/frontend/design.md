# 前端技术方案 -- 管理后台

> 需求: admin-panel | 角色: frontend

## 期次分类概览

> **第一期 = 全功能实现。** 管理后台所有页面均在第一期完成，不要求与设计图纸一致，使用标准管理后台框架。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| DashboardPage | 一期全功能 | 真实 API `/admin/dashboard/stats` | 运营数据概览 |
| UsersPage / UserDetailPage | 一期全功能 | 真实 API `/admin/users` | 用户管理 |
| GamesPage | 一期全功能 | 真实 API `/admin/games` | 游戏管理 |
| ProvidersPage | 一期全功能 | 真实 API `/admin/providers` | 供应商管理 |
| TransactionsPage | 一期全功能 | 真实 API `/admin/transactions` | 交易记录 |
| WithdrawalsPage | 一期全功能 | 真实 API `/admin/withdrawals` | 提现审核 |
| BannersPage | 一期全功能 | 真实 API `/admin/banners` | Banner 管理 |
| SettingsPage | 一期全功能 | 真实 API `/admin/config` | 系统配置 |

## 技术栈

管理后台使用 create-web Dark Dashboard Kit:

| 组件 | 选型 | 说明 |
|------|------|------|
| 基础 | create-web Kit | 预置深色主题仪表盘框架 |
| 框架 | React 19 + TypeScript | |
| 构建 | Vite | |
| 样式 | CSS Variables (Kit 内置) | |
| 状态 | useReducer (Kit AppContext) | |
| HTTP | Axios | API 请求 |

目录: `/admin/` (独立于 `/web/` 客户端)

## 页面结构

使用 create-web Kit 的 Panel-based 路由:

| PageId | 页面 | 说明 |
|--------|------|------|
| dashboard | DashboardPage | 运营数据概览 |
| users | UsersPage | 用户列表与管理 |
| user-detail | UserDetailPage | 用户详情 |
| games | GamesPage | 游戏列表与管理 |
| providers | ProvidersPage | 供应商管理 |
| transactions | TransactionsPage | 交易记录 |
| withdrawals | WithdrawalsPage | 提现审核 |
| banners | BannersPage | Banner 管理 |
| settings | SettingsPage | 系统配置 |

### 组件结构

```
admin/src/
  components/
    pages/
      DashboardPage.tsx           -- 仪表盘 (StatCard + BarChart)
      UsersPage.tsx               -- 用户列表 (DataTable + Search)
      UserDetailPage.tsx          -- 用户详情 (Info + Transactions)
      GamesPage.tsx               -- 游戏管理 (DataTable + Filter)
      ProvidersPage.tsx           -- 供应商管理
      TransactionsPage.tsx        -- 交易记录
      WithdrawalsPage.tsx         -- 待审核提现列表
      BannersPage.tsx             -- Banner CRUD
      SettingsPage.tsx            -- 系统配置表单
    shared/
      DataTable.tsx               -- 通用数据表格 (分页/排序/筛选)
      StatusBadge.tsx             -- 状态标签 (active/disabled/pending...)
      ConfirmModal.tsx            -- 确认弹窗 (审核/禁用等操作)
      ImageUpload.tsx             -- 图片上传 (Banner)
```

## Kit 集成

### 初始化

```bash
bash .claude/skills/create-web/scripts/init_project.sh go-plus-admin /Users/luca/work/go-plus/admin
```

### 页面注册

按 Kit 规范在 `AppShell.tsx` 中注册页面, 在 `Sidebar` 中添加导航:

- Dashboard (首页)
- 用户管理
- 游戏管理 > 游戏列表 / 供应商
- 交易管理 > 交易记录 / 提现审核
- 内容管理 > Banner
- 系统设置

### Kit 组件复用

| Kit 组件 | 用途 |
|----------|------|
| StatCard | Dashboard 数据卡片 |
| BarChart | 充值/提现趋势图 |
| DonutChart | 用户分布饼图 |
| FormInput / FormSelect | 表单输入 |
| Modal | 操作确认弹窗 |
| Toast | 操作成功/失败提示 |
| SearchBox | 搜索框 |
| TabSwitcher | Tab 切换 |

## API 对接

```typescript
// admin/src/api/client.ts
const adminApi = axios.create({
    baseURL: '/api/admin',
    timeout: 10000,
});

// admin/src/api/
export const authApi = {
    login: (data) => post('/auth/login', data),
    me: () => get('/auth/me'),
};
export const dashboardApi = { stats: () => get('/dashboard/stats') };
export const userMgmtApi = {
    list: (params) => get('/users', { params }),
    detail: (id) => get(`/users/${id}`),
    updateStatus: (id, status) => put(`/users/${id}/status`, { status }),
};
export const gameMgmtApi = {
    list: (params) => get('/games', { params }),
    update: (id, data) => put(`/games/${id}`, data),
    updateStatus: (id, status) => put(`/games/${id}/status`, { status }),
};
export const providerMgmtApi = {
    list: () => get('/providers'),
    create: (data) => post('/providers', data),
    update: (id, data) => put(`/providers/${id}`, data),
    updateStatus: (id, status) => put(`/providers/${id}/status`, { status }),
};
export const transactionMgmtApi = {
    list: (params) => get('/transactions', { params }),
    pendingWithdrawals: () => get('/withdrawals/pending'),
    approve: (id, remark) => put(`/withdrawals/${id}/approve`, { remark }),
    reject: (id, remark) => put(`/withdrawals/${id}/reject`, { remark }),
};
export const bannerMgmtApi = {
    list: () => get('/banners'),
    create: (data) => post('/banners', data),
    update: (id, data) => put(`/banners/${id}`, data),
    remove: (id) => del(`/banners/${id}`),
};
export const configMgmtApi = {
    get: () => get('/config'),
    update: (data) => put('/config', data),
};
```

## 关键页面设计

### Dashboard

- 4 个 StatCard: 今日注册 / 今日活跃 / 今日充值 / 今日提现
- 7日趋势 BarChart (充值 vs 提现)
- 待审核提现数 (红色高亮)

### 提现审核

- 表格: 用户手机号 / 金额 / 支付方式 / 申请时间
- 操作: [通过] [拒绝] 按钮, 点击弹出确认弹窗

### Banner 管理

- 列表: 缩略图 / 标题 / 链接 / 排序 / 状态
- 新增/编辑: 表单 + 图片上传
- 拖拽排序 (或数字排序)

## 关键决策

- 管理后台使用 create-web Kit 快速搭建
- 独立目录 /admin/，独立 Vite 配置
- 开发时 admin Vite dev 代理 /api/admin -> http://localhost:8080
- 管理后台桌面端优先 (Kit 已内置响应式)
- 默认登录: admin / admin123

## 依赖与约束

- 后端 API 前缀 /api/admin/*
- 与客户端共用同一个后端服务
- 管理员 JWT 与玩家 JWT 隔离 (不同 role)
- Vite dev server 端口: 5174 (客户端 5173)
