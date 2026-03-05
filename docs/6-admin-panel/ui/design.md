# UI 设计方案 -- 管理后台

> 需求: admin-panel | 角色: ui

## 设计理念

管理后台面向内部运营团队，桌面优先。使用 create-web Dark Dashboard Kit 的组件和布局框架，不需要像素级还原原站，功能优先于视觉。深色主题保持与客户端的品牌一致性。

## 设计规范

| 属性 | 值 |
|------|------|
| 基础框架 | 独立深色管理主题 (非客户端配色) |
| 主题 | 深蓝色系深色主题 |
| 强调色 | #24EE89 (品牌绿) |
| 布局 | 桌面优先: 左侧导航 (240px) + 顶栏 + 内容区 |
| 断点 | 移动(<768) / 平板(768-1199) / 桌面(>=1200) |
| 字体 | Inter, system-ui, sans-serif (不使用 AvertaStd) |

### 管理后台配色 (与客户端不同)

| 用途 | 色值 | Tailwind |
|------|------|----------|
| 页面背景 | #0f0f1a | `bg-[#0f0f1a]` (body) |
| 表面/卡片 | #1a1a2e | `bg-surface` |
| 卡片深层 | #16213e | `bg-surface-card` |
| 悬浮 | #1f2b47 | `bg-surface-hover` |
| 强调色 | #24EE89 | `text-accent` / `bg-accent` |
| 强调色深 | #1DBF6E | `bg-accent-dark` |
| 强调色浅 | rgba(36,238,137,0.12) | `bg-accent-light` |
| 正文 | #e2e8f0 | `text-txt` |
| 次要文字 | #94a3b8 | `text-txt-secondary` |
| 弱化文字 | #64748b | `text-txt-muted` |
| 边框 | #334155 | `border-border` |
| 危险色 | #ef4444 | `text-danger` |
| 警告色 | #f59e0b | `text-warn` |

## 布局结构

### 桌面端

```
+--------+----------------------------------+
| Sidebar|  TopBar (breadcrumb + user)      |
| (240px)|----------------------------------|
|        |                                  |
| Nav    |  PageContainer                   |
| Items  |  (padding: 24px)                 |
|        |                                  |
+--------+----------------------------------+
```

### 平板/移动端

- Sidebar 折叠为汉堡菜单
- TopBar 变为 MobileHeader
- 底部 BottomNav (Kit 自带)

## 页面设计

### 登录页

- 居中登录表单卡片
- 用户名 + 密码 + 登录按钮
- 品牌 Logo 在表单上方

### Dashboard (仪表盘)

**布局:**

1. **4 个 StatCard 横排** (1 行 4 列, 移动端 2x2)
   - 今日注册用户数
   - 今日活跃用户数
   - 今日充值总额 (INR)
   - 今日提现总额 (INR)
   - 每个 StatCard: 图标 + 数值 + 标题 + 趋势箭头

2. **BarChart** (7 日趋势)
   - 充值 vs 提现 双柱对比
   - X 轴: 近 7 日日期
   - Y 轴: 金额 (INR)

3. **待审核提现** (右侧或下方)
   - 红色徽章显示数量
   - 快速跳转到提现审核

### 用户管理

**列表页:**
- 搜索框: 按手机号 / 用户名搜索
- DataTable:
  | ID | 手机号 | 注册时间 | 余额 | 状态 | 操作 |
  - 状态 Badge: 活跃(绿) / 禁用(红)
  - 操作: 查看详情 / 禁用 / 启用
- 分页组件

**详情页:**
- 用户基本信息卡片
- 余额信息 (主余额 + Bonus)
- 最近交易记录列表

### 游戏管理

**列表页:**
- 筛选: 分类下拉 + 供应商下拉 + 搜索
- DataTable:
  | 缩略图 | 游戏名 | 供应商 | 分类 | 状态 | 操作 |
  - 状态 Badge: 上架(绿) / 下架(灰)
  - 操作: 上架 / 下架 / 编辑

**供应商管理子页:**
- DataTable:
  | Logo | 供应商名 | 游戏数量 | 状态 | 操作 |

### 交易管理

**充值记录:**
- DataTable:
  | ID | 用户 | 金额 | 支付方式 | 状态 | 时间 |
  - 状态: Completed / Failed

**提现记录:**
- DataTable:
  | ID | 用户 | 金额 | 收款方式 | 状态 | 时间 | 操作 |
  - 状态: Pending(黄) / Approved(绿) / Rejected(红)
  - 操作 (Pending): Approve / Reject 按钮

### Banner 管理

- DataTable + 图片预览
  | 预览 | 标题 | 链接 | 排序 | 状态 | 操作 |
- 新增/编辑表单:
  - 图片上传 (拖拽区 + 预览)
  - 标题输入
  - 跳转链接输入
  - 排序数字输入
  - 保存 / 取消按钮

### 系统配置

- 表单页面:
  - 最低充值金额 (INR)
  - 最低提现金额 (INR)
  - 最高提现金额 (INR)
  - 支付渠道开关 (UPI / Paytm / GPay / Amazon Pay)
  - 保存按钮

## 组件使用 (Kit 内置)

| 组件 | 用途 |
|------|------|
| StatCard | Dashboard 指标卡 |
| BarChart | 7 日趋势图 |
| DataTable (自定义) | 列表页表格 |
| Button | 操作按钮 |
| FormInput | 表单输入 |
| FormSelect | 下拉选择 |
| Modal | 确认弹窗 |
| Toast | 操作提示 |
| Avatar | 用户头像 |
| SearchBox | 搜索框 |
| TabSwitcher | 页面内 Tab |

## 导航结构

```
Sidebar:
  Dashboard
  ---
  Users         -> /admin/users
  Games         -> /admin/games
    Providers   -> /admin/games/providers
  Transactions  -> /admin/transactions
    Deposits    -> /admin/transactions/deposits
    Withdrawals -> /admin/transactions/withdrawals
  ---
  Content
    Banners     -> /admin/content/banners
  Settings      -> /admin/settings
```

## merge.html 预览 Tab 列表

| Tab | 说明 |
|-----|------|
| Dashboard | 仪表盘 - 4 个 StatCard + 7 日柱状图 |
| Users | 用户管理 - 搜索 + DataTable + 分页 |
| Games | 游戏管理 - 分类/供应商筛选 + DataTable |
| Withdrawals | 提现审核 - Pending 行黄色高亮 + Approve/Reject |
| Banners | Banner 管理 - 预览缩略图 + DataTable |

> 注: 登录页和系统配置页未包含在 merge.html 中，前端参考 design.md 描述实现。

## 关键决策

1. 管理后台使用独立深蓝色系配色 (非客户端 #232626 体系)
2. 字体使用 Inter (非 AvertaStd)
3. 桌面优先，移动端 Sidebar 折叠为汉堡菜单
4. DataTable 组件需要前端自行实现
5. 提现审核是核心流程，Pending 行有黄色背景高亮 + 醒目操作按钮
6. Dashboard 数据第一期用 Mock，柱状图使用 CSS div 实现 (非 Chart 库)
7. Sidebar 导航项: Dashboard / Users / Games / Transactions (带红色数字徽章) / Banners / Settings
