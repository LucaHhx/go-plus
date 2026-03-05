# UI 设计方案 -- 用户管理

> 需求: 7-user-management | 角色: ui | 更新: 2026-03-05

## 设计理念

用户管理页面采用独立全屏布局（与 wallet 页面模式一致），不使用全局 AppLayout。每个页面自带 PageHeader 返回导航，内容区垂直滚动。整体风格延续平台深色主题，信息以卡片分组展示，操作按钮明确区分主要操作和危险操作。

入口设计：已登录用户在侧边菜单顶部可见用户信息区域（替换原有 Promo Banner），点击进入个人资料页。

## 设计系统

继承全局设计系统 (详见 1-user-system/ui/design.md)，新增用户管理模块特有的组件规范。

### 配色

| 用途 | 色值 | CSS 变量 | Tailwind |
|------|------|----------|----------|
| 页面背景 | #232626 | `--color-bg` | `bg-bg` |
| 深层背景 | #1A1D1D | `--color-bg-deep` | `bg-bg-deep` |
| 卡片背景 | #2A2D2D | `--color-bg-card` | `bg-bg-card` |
| 悬浮背景 | #323738 | `--color-bg-hover` | `bg-bg-hover` |
| 输入框背景 | #1E2121 | `--color-bg-input` | `bg-bg-input` |
| 品牌色 | #24EE89 | `--color-brand` | `text-brand` / `bg-brand` |
| 品牌色深 | #1DBF6E | `--color-brand-dark` | `text-brand-dark` |
| 品牌渐变尾 | #9FE871 | `--color-brand-end` | `text-brand-end` |
| 正文白 | #FFFFFF | `--color-txt` | `text-txt` |
| 次要文字 | #B0B3B3 | `--color-txt-secondary` | `text-txt-secondary` |
| 弱化文字 | #6B7070 | `--color-txt-muted` | `text-txt-muted` |
| 分隔线/边框 | #3A4142 | `--color-divider` | `border-divider` |
| 错误/危险 | #FF4757 | `--color-error` / `--color-danger` | `text-error` / `text-danger` |
| 警告 | #FFA502 | `--color-warning` | `text-warning` |
| 成功 | #24EE89 | `--color-success` | `text-success` |

### 字体

| 属性 | 值 |
|------|------|
| 主字体 | AvertaStd (需授权) |
| 降级字体 | Inter -> system-ui -> sans-serif |
| CSS | `font-family: 'AvertaStd', 'Inter', system-ui, sans-serif` |

### 字号层级

| 用途 | 大小 | 字重 | 行高 |
|------|------|------|------|
| 页面标题 | 16px | 600 | - |
| 区块标题 | 14px | 600 | - |
| 弹窗标题 | 18px | 600 | 1.3 |
| 按钮文字 | 16px / 14px | 800 / 600 | - |
| 正文/输入框 | 14px | 400-500 | 1.5 |
| 标签 | 12px | 400-600 | 1.5 |
| 辅助文字 | 12px | 400 | 1.5 |
| 微小标签 | 10px | 600 | - |

### 间距系统

| 间距名 | 值 | 用途 |
|--------|-----|------|
| xs | 4px | 错误提示与输入框间距、小元素间距 |
| sm | 8px | 图标间距、卡片内微间距 |
| md | 12px | 输入框之间间距、标签与输入间距 |
| lg | 16px | 水平内边距 (px-4)、区块间距、卡片内边距 |
| xl | 20px | 按钮上方间距 |
| 2xl | 24px | 弹窗内边距 |
| 3xl | 32px | 页面底部安全间距、头像区域上下 padding |

### 圆角

| 用途 | 值 |
|------|------|
| 输入框 | 8px |
| 按钮 | 8px |
| 卡片/区块 | 12px |
| 弹窗 | 12px |
| 头像 | 50% (全圆) |
| 头像编辑按钮 | 50% (全圆) |

## 页面设计

### ProfilePage (/profile)

**布局从上到下 (严格顺序和间距):**

1. **PageHeader** (56px)
   - 背景: #1A1D1D
   - 内容: [返回箭头] [Profile 标题]
   - position: sticky, top: 0
   - 底部: 1px solid rgba(58, 65, 66, 0.5)

2. **头像区域** (padding: 32px 16px)
   - 居中显示
   - 头像: 80x80px, 圆形, border: 3px solid #24EE89
   - 编辑按钮: 28x28px 圆形, 右下角绝对定位, bg: #24EE89, border: 2px solid #232626
   - 昵称: 16px, #fff, font-semibold, margin-top 12px
   - 加入时间: 12px, #6B7070, margin-top 4px

3. **昵称区块** (margin: 0 16px 12px, padding: 16px)
   - 背景: #2A2D2D, 圆角 12px
   - 标题: "Nickname", 14px, #B0B3B3, font-semibold, uppercase
   - 正常态: 显示昵称文字 + "Edit" 品牌色文字按钮
   - 编辑态: 输入框 + Cancel/Save 按钮行 + 验证提示

4. **账户信息区块** (margin: 0 16px 12px, padding: 16px)
   - 背景: #2A2D2D, 圆角 12px
   - 标题: "Account Info"
   - 信息行: Phone / Registered / VIP Level
   - 每行: flex between, padding 14px 0, 底部 1px 分隔线 (最后一行无分隔线)

5. **安全设置导航** (margin: 0 16px 12px)
   - 背景: #2A2D2D, 圆角 12px, padding: 16px
   - 左侧: shield 图标 + "Security Settings" 文字
   - 右侧: chevron-right 图标
   - 整行可点击, hover: bg #323738
   - 点击跳转 /profile/security

6. **登出按钮** (margin: 24px 16px, padding-bottom: 32px)
   - 全宽, 高度 48px, 圆角 8px
   - 背景: rgba(255, 71, 87, 0.1)
   - 文字: #FF4757, 14px, font-semibold
   - 图标: log-out, 18px, 左侧

### SecurityPage (/profile/security)

**布局从上到下:**

1. **PageHeader** (56px)
   - 同 ProfilePage, 标题 "Security Settings"

2. **修改密码区块** (padding: 16px, margin: 16px)
   - 背景: #2A2D2D, 圆角 12px
   - 区块头: lock 图标 + "Change Password"
   - 三个输入框: Current Password / New Password / Confirm New Password
   - 每个输入框上方有 label (12px, #B0B3B3, margin-bottom 6px)
   - 输入框间距: margin-bottom 12px
   - "Update Password" 渐变主按钮, margin-top 16px

3. **Google 账号区块** (padding: 16px, margin: 0 16px 16px)
   - 背景: #2A2D2D, 圆角 12px
   - 区块头: Google logo + "Google Account"
   - **未绑定态:**
     - Status: "Not linked" (灰色)
     - "Bind" 渐变小按钮 (h-10, px-5, link 图标)
   - **已绑定态:**
     - Linked to: "user@gmail.com" (白色)
     - "Unbind" 边框红色小按钮 (h-10, px-5, unlink 图标)

## 状态设计

### 正常态
- 输入框: border #3A4142
- 按钮: 可点击
- 信息行: 正常显示

### 编辑态 (昵称)
- 输入框出现 (替换文字显示), border #24EE89 (聚焦)
- 操作按钮: Cancel (outline) + Save (gradient)
- 验证提示: "2-20 characters, letters, numbers and underscores only"

### 错误态
- 输入框: border #FF4757
- 错误文字: 12px, #FF4757, margin-top 4px
- 按钮: opacity 0.5, cursor: not-allowed (表单验证未通过)

### 加载态
- 表单区: opacity 0.6
- 按钮: 内容变 spinner 动画, opacity 0.7, cursor: not-allowed
- Google 绑定按钮: 显示 spinner, opacity 0.5

### Toast 通知
- 成功: 绿色底 (rgba(36,238,137,0.15)), 绿色边框, check-circle 图标
- 错误: 红色底 (rgba(255,71,87,0.15)), 红色边框, alert-triangle 图标
- 位置: 固定在顶部, top 72px (header 下方), 水平居中
- 自动消失: 3 秒

## 组件规范

### PageHeader

| 属性 | 值 |
|------|------|
| 高度 | 56px |
| 背景 | #1A1D1D |
| 定位 | sticky, top: 0, z-index: 50 |
| 底部边框 | 1px solid rgba(58, 65, 66, 0.5) |
| 返回按钮 | 40x40px 热区, 24x24px 图标 (arrow-left), #fff |
| 标题 | 16px, #fff, font-semibold, margin-left 4px |

### Avatar

| 属性 | 值 |
|------|------|
| 大尺寸 (Profile) | 80x80px |
| 小尺寸 (Drawer) | 48x48px |
| 圆角 | 50% |
| 边框 | 3px solid #24EE89 (大尺寸) / 无 (小尺寸) |
| 默认背景 | #323738 |
| 默认图标 | user.svg, #6B7070 |
| 编辑按钮 | 28x28px, bg #24EE89, border 2px solid #232626, camera 图标 |

### Section Card

| 属性 | 值 |
|------|------|
| 背景 | #2A2D2D |
| 圆角 | 12px |
| 内边距 | 16px |
| 标题 | 14px, #B0B3B3, font-semibold, uppercase, letter-spacing 0.5px |

### Info Row

| 属性 | 值 |
|------|------|
| 高度 | auto (padding 14px 0) |
| 布局 | flex, space-between |
| 标签 | 14px, #B0B3B3 |
| 值 | 14px, #fff, font-medium |
| 分隔线 | 1px solid rgba(58, 65, 66, 0.5) |

### Logout Button

| 属性 | 值 |
|------|------|
| 宽度 | 100% |
| 高度 | 48px |
| 背景 | rgba(255, 71, 87, 0.1) |
| 圆角 | 8px |
| 文字 | #FF4757, 14px, font-semibold |
| 图标 | log-out, 18px, 左侧, gap 8px |

### Confirm Dialog (登出/解绑)

| 属性 | 值 |
|------|------|
| 遮罩 | rgba(0, 0, 0, 0.6) |
| 弹窗背景 | #2A2D2D |
| 圆角 | 12px |
| 内边距 | 24px |
| 最大宽度 | 320px |
| 标题 | 18px, #fff, font-semibold |
| 描述 | 14px, #B0B3B3 |
| Cancel 按钮 | border #3A4142, bg transparent, color #fff |
| 确认按钮 (登出) | bg #FF4757, color #fff |
| 确认按钮 (解绑) | bg #FF4757, color #fff |
| 按钮高度 | 48px |
| 按钮间距 | gap 12px |

### Avatar Crop Modal

| 属性 | 值 |
|------|------|
| 弹窗最大宽度 | 360px |
| 裁剪区域 | aspect-ratio 1:1, bg #1A1D1D, 圆角 8px |
| 裁剪圆 | 200x200px 虚拟圆, border 2px solid #24EE89, 外围半透明遮罩 |
| 缩放滑块 | 品牌色轨道 + 品牌色滑块, 两端 -/+ 标签 |
| Cancel/Confirm | 同其他弹窗按钮规范 |

### SideDrawer 用户信息区域

| 属性 | 值 |
|------|------|
| 内边距 | 16px |
| 底部边框 | 1px solid #3A4142 |
| 头像 | 48x48px, 圆形, bg #323738 |
| 间距 (头像-文字) | 12px |
| 昵称 | 16px, #fff, font-semibold, truncate |
| 手机号 | 12px, #6B7070 (格式: +91****7890) |
| "Profile" 链接 | 12px, #24EE89, font-medium, chevron-right 图标 |
| 整行可点击 | cursor: pointer, 跳转 /profile |
| 登出按钮 | 菜单底部, #FF4757, log-out 图标 |

### Toast 通知

| 属性 | 值 |
|------|------|
| 位置 | fixed, top 72px, 水平居中 |
| 内边距 | 12px 20px |
| 圆角 | 8px |
| 字号 | 14px, font-medium |
| 图标 | 18px, 左侧 |
| 成功底色 | rgba(36, 238, 137, 0.15) |
| 成功边框 | 1px solid rgba(36, 238, 137, 0.3) |
| 成功文字 | #24EE89 |
| 错误底色 | rgba(255, 71, 87, 0.15) |
| 错误边框 | 1px solid rgba(255, 71, 87, 0.3) |
| 错误文字 | #FF4757 |
| 自动消失 | 3000ms |

## 关键决策

1. **独立全屏页面:** ProfilePage 和 SecurityPage 为独立全屏页面（与 wallet 模式一致），不渲染全局 AppLayout 的底部 Tab 栏。
2. **分页设计:** 个人资料和安全设置分两个页面，避免单页过长，符合移动端设计习惯。
3. **SideDrawer 条件渲染:** 已登录态显示用户信息区域（替换 Promo Banner），未登录态保持原样。
4. **昵称 inline 编辑:** 点击 Edit 后原地切换为输入框模式，不跳转新页面。
5. **危险操作二次确认:** 登出和 Google 解绑都需要弹窗确认，防止误操作。
6. **Toast 反馈:** 所有异步操作的成功/失败结果通过 Toast 通知用户。
7. **Google-only 用户特殊处理:** 如果用户仅有 Google 登录方式（has_password=false），修改密码区隐藏 "Current Password" 输入框，解绑时提示先设置密码。
8. **手机号遮罩:** 统一格式 +91****7890，中间 4 位用星号代替。
