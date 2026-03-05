# 用户系统 -- 前端设计说明

> 需求: user-system | 角色: ui | 更新: 2026-03-04

## 设计概述

用户系统包含注册 (Sign Up)、密码登录 (Sign In)、OTP 快捷登录三个视图。采用全屏沉浸式布局，**不显示全局顶部栏和底部 Tab 栏**。每个视图自带 Header 和品牌 Banner。

设计稿: `merge.html` 包含 5 个预览 Tab，覆盖正常态、错误态、加载态。

## 页面清单

| 页面 | 路由建议 | merge.html Tab | 说明 |
|------|----------|----------------|------|
| 注册页 | `/signup` | Sign Up | 手机号+密码+OTP+赠送游戏 |
| 登录页(密码) | `/signin` | Sign In (Password) | 手机号+密码 |
| 登录页(OTP) | `/signin?mode=otp` | Sign In (OTP) | 手机号+OTP |
| 注册(错误态) | - | Sign Up (Error) | 表单验证失败状态 |
| 注册(加载态) | - | Sign Up (Loading) | 提交中 loading 状态 |

## 全局布局结构

```
+------------------------------------------+
|  Header (56px, glassmorphism)            |  <- position: sticky, top: 0
|  [Logo]              [Sign In] [Sign Up] |
+------------------------------------------+
|  Banner (gradient background)            |  <- padding: 16px 16px 32px
|  "Secure and Fast"                       |
|  "Sign Up & Get"           [装饰图]      |
|  "100 Bonuses"                           |
+------------------------------------------+
|  Form Section (padding: 0 16px)          |
|                                          |
|  [Section Title]                         |  <- 18px, bold, white
|  [Phone Input]                           |  <- height: 48px
|  [Password Input]              12px gap  |
|  [OTP Input]                   12px gap  |
|                                          |
|  [Gift Selection]              16px gap  |
|  [Invite Code]                 12px gap  |
|  [Agreements]                  16px gap  |
|                                          |
|  [Sign Up Button]              20px gap  |
|  [Google Button]               12px gap  |
|  [Bottom Link]                 16px gap  |
|                               32px pad-b |
+------------------------------------------+
```

**关键尺寸 (前端务必精确还原):**

| 区域 | 属性 | 值 | Tailwind |
|------|------|----|----------|
| 整体容器 | max-width | 430px | `max-w-[430px]` |
| 整体容器 | background | #232626 | `bg-[#232626]` |
| 整体容器 | min-height | 100vh | `min-h-screen` |
| 整体容器 | 水平居中 | auto | `mx-auto` |

## Header (56px)

```css
height: 56px;
background: rgba(50, 55, 56, 0.85);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
position: sticky;
top: 0;
z-index: 50;
padding: 0 16px;
display: flex;
align-items: center;
```

| 元素 | 样式 |
|------|------|
| Logo | 文字占位 "1GO.PLUS"，**需替换为品牌 Logo 图片** |
| Sign In 按钮 | color: #fff, font-weight: 800, font-size: 15px, background: transparent, height: 40px |
| Sign Up 按钮 | height: 40px, padding: 0 16px, border-radius: 8px, background: gradient(#24EE89, #9FE871), color: #000, font-weight: 800 |

## Banner

```css
/* 注册页 Banner */
background: linear-gradient(180deg, #1a3a1e 0%, #0d2a12 40%, #232626 100%);
padding: 16px 16px 32px;
overflow: hidden;

/* 登录页 Banner (稍小) */
padding: 16px 16px 24px;
```

| 元素 | 样式 |
|------|------|
| "Secure and Fast" | color: #B0B3B3, font-size: 12px |
| "Sign Up & Get" | color: #fff, font-weight: 800, font-size: 22px, line-height: 1.2 |
| "100 Bonuses" | color: #fff, font-weight: 800, font-size: 32px, line-height: 1.1 |
| 右侧装饰图 | width: 140px, height: 110px (注册), width: 110px, height: 80px (登录) |

## 表单区

水平内边距: **16px** (即 `px-4`)。这是最关键的间距，前端截图中表单贴边是因为缺少这个 padding。

### 各区块间距

```
Section Title        margin: 16px 0 12px
Input -> Input       margin-top: 12px
Input -> Gift        margin-top: 16px
Gift -> Invite       margin-top: 12px
Invite -> Agreement  margin-top: 16px
Agreement -> Button  margin-top: 20px
Button -> Google     margin-top: 12px
Google -> Bottom     margin-top: 16px
Bottom               padding-bottom: 32px
```

## 组件详细规范

### 输入框 (form-input)

```css
display: flex;
align-items: center;
background: #1E2121;
border: 1px solid #3A4142;
border-radius: 8px;
height: 48px;
padding: 0 12px;
transition: border-color 0.2s ease;
```

**聚焦态:** `border-color: #24EE89`
**错误态:** `border-color: #FF4757`

#### 手机号前缀

```css
.prefix {
  color: #B0B3B3;
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
  padding-right: 12px;
  border-right: 1px solid #3A4142;  /* 竖线分隔 */
  white-space: nowrap;
}
```

**前端注意:** "+91" 和输入区域之间必须有 `border-right` 竖线分隔，这在 QA 截图中缺失。

#### 输入框文字

```css
input {
  flex: 1;
  min-width: 0;  /* 防止 flex 溢出 */
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
}
input::placeholder { color: #6B7070; }
```

#### 图标按钮 (密码显隐/下拉)

```css
.icon-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6B7070;
}
```

### 错误提示

```css
.error-text {
  color: #FF4757;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 2px;
}
```

显示在对应输入框正下方。错误态下输入框 `border-color: #FF4757`。

### 主按钮 (Sign Up / Sign In)

```css
width: 100%;
height: 48px;
border: none;
border-radius: 8px;
background: linear-gradient(90deg, #24EE89, #9FE871);
color: #000;
font-size: 16px;
font-weight: 800;
letter-spacing: 0.5px;
cursor: pointer;
```

**加载态:**
- `opacity: 0.7`
- `cursor: not-allowed`
- 内容替换为旋转 spinner (20x20px 圆形边框动画)

### Google 按钮

```css
width: 100%;
height: 48px;
border: 1px solid #3A4142;
border-radius: 8px;
background: transparent;
color: #fff;
font-size: 14px;
font-weight: 600;
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
```

文案: "Sign in with Google"（英文）

### OTP 发送按钮

```css
color: #24EE89;
font-size: 14px;
font-weight: 600;
background: transparent;
border: none;
white-space: nowrap;
cursor: pointer;
```

**倒计时态:** color: #6B7070, 显示 "45s" 等数字

### 赠送游戏卡片

```css
.gift-card {
  background: #323738;
  border-radius: 8px;
  padding: 10px 8px 8px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  flex: 1;
  min-width: 0;
}
.gift-card.selected {
  border-color: #24EE89;
}
```

两张卡片 `display: flex; gap: 8px` 等宽排列。

缩略图容器: `width: 60px, height: 60px, border-radius: 8px, background: #1A1D1D, margin: 0 auto 6px`

| 元素 | 样式 |
|------|------|
| 金额 "x100" | color: #24EE89, font-size: 14px, font-weight: 800 |
| 标签 "Aviator FS" | color: #B0B3B3, font-size: 10px |
| Active 徽章 | background: #24EE89, color: #000, font-size: 10px, font-weight: 700, padding: 2px 10px, border-radius: 4px |
| Apply 徽章 | background: #3A4142, color: #6B7070 (同上其他样式) |

### 复选框

```css
.custom-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
}
/* 选中 */
.checked { background: #24EE89; }
/* 未选中 */
.unchecked { background: transparent; border: 1.5px solid #3A4142; }
```

选中态内含白色勾号 SVG (12x12px, stroke: #000, stroke-width: 3)。

### 登录方式 Tab

```css
.auth-tabs {
  display: flex;
  border-bottom: 1px solid #3A4142;
}
.auth-tab {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7070;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
}
.auth-tab.active {
  color: #24EE89;
  border-bottom-color: #24EE89;
}
```

## 交互流程

### 注册流程

1. 用户输入手机号 (10 位) + 密码 (6-16 位)
2. 点击 "Send OTP" -> 按钮变为灰色倒计时 "60s...59s..."
3. 输入 OTP (6 位)
4. 选择赠送游戏 (默认选中 Aviator)
5. 确认协议已勾选 (默认已勾选)
6. 点击 "Sign Up" -> 按钮变 loading spinner -> 成功后跳转首页

### 登录流程 (密码)

1. 输入手机号 + 密码
2. 点击 "Sign In" -> loading -> 跳转首页

### 登录流程 (OTP)

1. 切换 Tab 到 "OTP Login"
2. 输入手机号
3. 点击 "Send OTP"
4. 输入 OTP
5. 点击 "Sign In" -> loading -> 跳转首页

### 表单验证规则

| 字段 | 规则 | 错误提示 |
|------|------|----------|
| 手机号 | 10 位数字 | "Please enter your phone number" / "Invalid phone number" |
| 密码 | 6-16 位 | "Password must be 6-16 characters" |
| OTP | 6 位数字 | "Please enter OTP verification code" |
| 协议 | 必须勾选第一项 | 文字变红色 |

验证时机: 实时验证 (onBlur + onChange)。

## 资源使用指南

### SVG 图标

所有图标位于 `ui/Resources/icons/` 目录:

| 图标 | 文件 | 用途 | 尺寸 |
|------|------|------|------|
| 显示密码 | `eye.svg` | 密码输入框 (明文状态) | 20x20 |
| 隐藏密码 | `eye-off.svg` | 密码输入框 (密文状态) | 20x20 |
| 勾选 | `check.svg` | 协议复选框 (选中态) | 12x12 |
| Google | `google.svg` | Google 登录按钮 | 20x20 |
| 关闭 | `close.svg` | 预留 (未来弹窗关闭) | 24x24 |
| 下拉 | `chevron-down.svg` | 邀请码展开/收起 | 16x16 |
| 手机 | `phone.svg` | 预留 (可选装饰) | 24x24 |
| 锁 | `lock.svg` | 预留 (可选装饰) | 24x24 |

**引用方式:** 建议内联 SVG 以支持 `currentColor` 主题色自适应，或使用组件库的 Icon 组件。

### CSS 变量

`ui/Resources/tokens.css` 包含完整的 CSS 自定义属性。前端可在全局样式中引入:

```css
@import './design-tokens/tokens.css';

.form-input {
  background: var(--color-bg-input);
  border: var(--input-border);
  border-radius: var(--input-radius);
  height: var(--input-height);
}
```

### Tailwind 配置

`ui/Resources/tailwind.config.js` 包含设计系统的 Tailwind 扩展配置。前端项目合并到 `tailwind.config.js` 的 `theme.extend`:

```js
// tailwind.config.js
const uiConfig = require('./path-to/ui/Resources/tailwind.config.js');
module.exports = {
  theme: {
    extend: {
      ...uiConfig.theme.extend,
    }
  }
}
```

### 待人工提供的资源

以下资源在设计稿中使用 SVG 占位符替代，前端需在资源到位后替换为真实图片:

| 资源 | 设计稿中的占位 | 前端替换方式 |
|------|----------------|-------------|
| 品牌 Logo | 文字 "1GO.PLUS" | 替换为 `<img src="logo.png" class="h-8">` |
| 奖轮装饰图 | SVG 圆环/金币 | 替换为 `<img src="banner-decoration.png">` |
| Aviator 缩略图 | SVG 飞机图标 | 替换为 `<img src="games/aviator.png" class="w-full h-full object-cover">` |
| MoneyComing 缩略图 | SVG 金币图标 | 替换为 `<img src="games/moneycoming.png" class="w-full h-full object-cover">` |
| AvertaStd 字体 | Inter 降级 | `@font-face` 引入 WOFF2 文件 |

资源清单详见 `ui/Resources/assets-manifest.md`。

## 前端实现注意事项

1. **认证页面不渲染 AppShell** -- 无全局顶部栏、底部 Tab 栏
2. **表单区水平内边距 16px** -- 这是最常见的还原问题，`padding: 0 16px` 不能省略
3. **输入框 +91 竖线分隔** -- `border-right: 1px solid #3A4142`，前端截图中此分隔线缺失
4. **输入框聚焦过渡** -- `transition: border-color 0.2s ease`
5. **赠送游戏卡片等宽** -- 两卡片 `flex: 1; min-width: 0` 等宽排列
6. **赠送游戏缩略图** -- 60x60px 固定尺寸，不要让图片撑开布局
7. **Send OTP 防抖** -- 点击后立即变灰色倒计时，防止重复请求
8. **表单提交 loading** -- 按钮变 spinner，所有输入禁用 (opacity: 0.6)
9. **错误提示位置** -- 在对应输入框正下方，`margin-top: 4px`
10. **底部安全间距** -- 最后一个元素 `padding-bottom: 32px`
