# UI 设计方案 -- 用户系统

> 需求: user-system | 角色: ui | 更新: 2026-03-04

## 设计理念

认证页面采用全屏沉浸式设计，不显示顶部栏和底部 Tab 栏。顶部展示品牌 Banner（奖轮图形），强调 "Sign Up & Get 100 Bonuses" 注册奖励，降低注册门槛。

## 设计系统

继承全局设计系统 (详见 2-homepage-navigation/ui/design.md):

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
| 错误红 | #FF4757 | `--color-error` | `text-error` |

### 字体

| 属性 | 值 |
|------|------|
| 主字体 | AvertaStd (需授权) |
| 降级字体 | Inter -> system-ui -> sans-serif |
| CSS | `font-family: 'AvertaStd', 'Inter', system-ui, sans-serif` |

### 字号层级

| 用途 | 大小 | 字重 | 行高 |
|------|------|------|------|
| Banner 大标题 | 32px | 800 | 1.1 |
| Banner 副标题 | 22px | 800 | 1.2 |
| 区块标题 | 18px | 800 | 1.3 |
| 按钮文字 | 16px | 800 | - |
| Header 按钮 | 15px | 800 | - |
| 正文/输入框 | 14px | 400-600 | 1.5 |
| 辅助文字 | 12px | 400 | 1.5 |
| 微小标签 | 10px | 700 | - |

### 间距系统

| 间距名 | 值 | 用途 |
|--------|-----|------|
| xs | 4px | 错误提示与输入框间距 |
| sm | 8px | 卡片间距、图标间距 |
| md | 12px | 输入框之间间距、协议项间距 |
| lg | 16px | 区块间距、水平内边距、Banner padding |
| xl | 20px | 按钮上方间距 |
| 2xl | 32px | Banner 底部 padding、页面底部安全间距 |

### 圆角

| 用途 | 值 |
|------|------|
| 输入框 | 8px |
| 按钮 | 8px |
| 卡片 | 8px |
| 复选框 | 4px |
| 徽章 | 4px |

## 页面设计

### 注册页 (Sign Up)

**布局从上到下 (严格顺序和间距):**

1. **Header** (56px)
   - 背景: rgba(50, 55, 56, 0.85) + backdrop-filter: blur(10px)
   - 内容: [Logo] ... [Sign In 文字按钮] [Sign Up 渐变按钮]
   - position: sticky, top: 0

2. **Banner** (padding: 16px 16px 32px)
   - 背景: linear-gradient(180deg, #1a3a1e 0%, #0d2a12 40%, #232626 100%)
   - 左侧: "Secure and Fast" (12px, #B0B3B3) + "Sign Up & Get" (22px) + "100 Bonuses" (32px)
   - 右侧: 奖轮装饰图 (140x110px)，opacity 0.5，**需人工提供真实图片**

3. **表单区** (padding: 0 16px)
   - "Sign Up" 标题: margin 16px 0 12px, 18px, #fff, 800
   - 手机号输入: 48px, +91 前缀带竖线分隔
   - 密码输入: margin-top 12px, 右侧 eye-off 图标
   - OTP 输入: margin-top 12px, 右侧 "Send OTP" 绿色文字

4. **赠送游戏** (margin-top: 16px)
   - 标题: "Select your sign up gift" (14px, #B0B3B3, margin-bottom 8px)
   - 两卡片: flex, gap: 8px, 等宽
   - 缩略图: 60x60px, border-radius 8px
   - 选中态: border 2px #24EE89
   - 徽章: "Active" (#24EE89 bg) / "Apply" (#3A4142 bg)

5. **邀请码** (margin-top: 12px)
   - 普通输入框 + chevron-down 图标

6. **协议** (margin-top: 16px)
   - 两行复选框，gap: 12px
   - 默认已勾选
   - 第一条必选 (未勾选时文字变红)

7. **注册按钮** (margin-top: 20px)
   - 全宽渐变按钮 48px

8. **Google 登录** (margin-top: 12px)
   - 透明边框按钮 48px, Google logo + "Sign in with Google"

9. **底部链接** (margin-top: 16px, padding-bottom: 32px)
   - "Already have an account?" + "Sign In" (品牌色)

### 登录页 (Sign In - Password)

1. Header -- 同注册页
2. Banner -- padding: 16px 16px 24px (比注册页小), "Welcome Back" 标题, 装饰图 110x80px
3. 表单区:
   - "Sign In" 标题
   - Tab 切换: [Password (active)] [OTP Login], 底部 1px #3A4142 分隔线
   - 手机号输入
   - 密码输入 (margin-top: 12px)
   - "Forgot Password?" 右对齐 (margin-top: 8px, 12px, #24EE89)
   - Sign In 按钮 (margin-top: 20px)
   - Google 登录 (margin-top: 12px)
   - 底部: "Don't have an account?" + "Sign Up"

### OTP 登录 (Sign In - OTP)

- 同登录页布局，Tab 切换到 "OTP Login" 态
- 表单: 手机号 + OTP (带 Send OTP 按钮) + Sign In 按钮
- 无 "Forgot Password" 链接

## 状态设计

### 正常态
- 所有输入框: border #3A4142
- 复选框: 已勾选 (绿色)
- 按钮: 可点击

### 聚焦态
- 输入框: border #24EE89, transition 0.2s

### 错误态 (见 merge.html "Sign Up (Error)" Tab)
- 输入框: border #FF4757
- 输入框下方: 红色错误文字 (12px, margin-top 4px)
- 未勾选协议: 文字变红色
- 复选框: 空框 (transparent bg + #3A4142 border)

### 加载态 (见 merge.html "Sign Up (Loading)" Tab)
- 所有输入框: opacity 0.6, disabled
- 主按钮: 内容变 spinner 动画, opacity 0.7, cursor: not-allowed
- Google 按钮: opacity 0.5, disabled
- 赠送游戏区: opacity 0.6

### OTP 倒计时态
- "Send OTP" -> "45s" (color: #6B7070)
- 倒计时结束: "Resend OTP" (color: #24EE89)

## 组件规范

### 输入框

| 属性 | 值 |
|------|------|
| 高度 | 48px |
| 背景 | #1E2121 |
| 边框 | 1px solid #3A4142 |
| 圆角 | 8px |
| 内边距 | 0 12px |
| 文字 | 14px, #FFFFFF |
| Placeholder | 14px, #6B7070 |
| 聚焦边框 | 1px solid #24EE89 |
| 错误边框 | 1px solid #FF4757 |
| 过渡 | border-color 0.2s ease |

### 手机号前缀

| 属性 | 值 |
|------|------|
| 文字 | "+91", 14px, #B0B3B3, font-weight 600 |
| 右侧分隔 | border-right: 1px solid #3A4142 |
| 右间距 | margin-right: 12px, padding-right: 12px |

### 复选框

| 属性 | 选中态 | 未选中态 |
|------|--------|----------|
| 尺寸 | 18x18px | 18x18px |
| 圆角 | 4px | 4px |
| 背景 | #24EE89 | transparent |
| 边框 | 无 | 1.5px solid #3A4142 |
| 图标 | 白色勾号 (check.svg, 12px, stroke: #000) | 无 |

## 关键决策

1. 认证页面全屏沉浸，不显示全局导航
2. 注册页和登录页为独立页面（非弹窗/模态框）
3. 品牌 Banner 固定在顶部，表单区可滚动
4. OTP 快捷登录作为 Tab 切换选项，不是独立页面
5. 赠送游戏选择内嵌在注册流程中，不是单独步骤
6. 设计稿包含正常态、错误态、加载态三种状态
7. Google 按钮文案统一使用英文 "Sign in with Google"
