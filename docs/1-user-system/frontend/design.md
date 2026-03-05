# 前端技术方案 -- 用户系统

> 需求: user-system | 角色: frontend

## 期次分类概览

> **第一期 = 全功能实现 (核心交易链路)。** 用户系统是平台基础，第一期全部完成。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| RegisterPage (手机号+密码+OTP+赠送选择) | 一期全功能 | 真实 API `/auth/register` | 完整注册流程 |
| LoginPage (密码/OTP 双模式) | 一期全功能 | 真实 API `/auth/login` `/auth/login-otp` | 完整登录流程 |
| GoogleLoginButton | 一期 Mock | Mock API `/auth/google` | 按钮存在，跳过真实 OAuth |
| InviteCodeInput | 一期仅 UI | 无后端 | 输入框展示，不提交 (推广系统后续) |
| Forgot Password 链接 | 一期仅 UI | 无后端 | 文字展示，点击无功能 (后续需求) |
| AuthHeader / AuthBanner / PhoneInput / OTPInput / PasswordInput | 一期全功能 | - | 基础 UI 组件 |
| GiftSelector / AgreementCheckbox | 一期全功能 | - | 注册表单组件 |
| UserBalanceChip / LoginButtons | 一期全功能 | 真实 API `/auth/me` | 顶栏状态切换 |

## 技术栈

| 组件 | 选型 | 说明 |
|------|------|------|
| 框架 | React 19 | UI 框架 |
| 语言 | TypeScript 5.9+ | 类型安全 |
| 构建 | Vite 7+ | 开发服务器与构建 |
| 样式 | Tailwind CSS 4+ | 原子化 CSS, `@theme` 指令定义 design tokens |
| 状态 | Zustand | 轻量状态管理 |
| HTTP | Axios | API 请求 |
| 路由 | React Router DOM 7+ | 客户端路由 |

## 页面与组件结构

### 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| RegisterPage | /register | 注册页 (手机号+密码+OTP+赠送游戏选择) |
| LoginPage | /login | 登录页 (手机号+密码, 可切换OTP模式) |

### 组件结构

```
src/pages/
  auth/
    RegisterPage.tsx          -- 注册页 (含赠送游戏选择，内嵌在表单中)
    LoginPage.tsx             -- 登录页 (密码/OTP 双 Tab 切换)
    components/
      AuthHeader.tsx          -- 顶部固定导航栏 (Logo + Sign In/Sign Up 按钮)
      AuthBanner.tsx          -- 品牌 Banner (Logo + 奖励文案 + 奖轮装饰)
      PhoneInput.tsx          -- 手机号输入 (+91 前缀)
      OTPInput.tsx            -- OTP 验证码输入 (单行+Send OTP按钮)
      PasswordInput.tsx       -- 密码输入 (含显隐切换)
      GoogleLoginButton.tsx   -- Google 登录按钮
      GiftSelector.tsx        -- 赠送游戏选择 (两张卡片)
      InviteCodeInput.tsx     -- 邀请码输入 (可选, 含下拉箭头图标)
      AgreementCheckbox.tsx   -- 协议勾选框
```

### 公共组件

```
src/components/
  TopBar/
    UserBalanceChip.tsx       -- 顶栏用户余额显示
    LoginButtons.tsx          -- 未登录时的 Join Now / Log In 按钮
```

## 精确布局规范 (像素级还原指南)

> **核心参考**: `docs/1-user-system/ui/merge.html` 是设计稿真实来源。
> 以下规范从 merge.html 中提取，前端开发必须 1:1 还原。

### Design Tokens (与 index.css @theme 一致)

```
颜色:
  bg:          #232626    -- 页面主背景
  bg-deep:     #1A1D1D    -- 深层背景 (html/body)
  bg-card:     #2A2D2D    -- 卡片背景
  bg-hover:    #323738    -- hover 状态
  bg-input:    #1E2121    -- 输入框背景
  brand:       #24EE89    -- 品牌主色
  brand-dark:  #1DBF6E    -- 品牌深色
  brand-end:   #9FE871    -- 渐变终点色
  txt:         #FFFFFF    -- 主文字
  txt-secondary: #B0B3B3  -- 次要文字
  txt-muted:   #6B7070    -- 弱化文字 / placeholder
  divider:     #3A4142    -- 分割线 / 边框
  error:       #FF4757    -- 错误提示

字体:
  font-family: AvertaStd, Inter, system-ui, sans-serif
  字重: 800(ExtraBold) / 600(Semibold) / 400(Regular)

圆角:       8px (全局统一)
最大宽度:   430px (移动优先, 居中)
```

### AuthHeader (顶部固定导航栏)

```
高度:    56px (h-14)
背景:    rgba(50, 55, 56, 0.85) + backdrop-filter: blur(10px)
定位:    sticky top-0 z-50
内边距:  0 16px

布局: [Logo] --- [Sign In 文字按钮] [Sign Up 渐变按钮]

Logo:
  - 使用 /assets/brand/logo.png (需人工提供)
  - fallback: 文字 "1GO" (#24EE89 extrabold) + ".PLUS" (#FFF extrabold)
  - 高度: 32px (h-8)

Sign In 按钮:
  - 文字: "Sign In", 白色, font-extrabold, text-base (16px)
  - 高度: 40px, padding: 0 16px
  - 背景: transparent, 无边框

Sign Up 按钮:
  - 文字: "Sign Up", 黑色 #000, font-extrabold, text-base
  - 高度: 40px, padding: 0 16px
  - 背景: linear-gradient(90deg, #24EE89, #9FE871)
  - 圆角: 8px
```

### AuthBanner (品牌 Banner)

```
背景: linear-gradient(180deg, #1a3a1e 0%, #0d2a12 40%, #232626 100%)
内边距: 16px top, 16px left/right
overflow: hidden

注册页 variant (signup):
  padding-bottom: 32px
  右侧装饰: w-36 h-28 (144x112px)

登录页 variant (signin):
  padding-bottom: 24px
  标题: "Welcome Back" (代替 "Sign Up & Get 100 Bonuses")
  右侧装饰: w-28 h-20 (112x80px)

左侧文案:
  - "Secure and Fast": text-xs, #B0B3B3
  - "Sign Up & Get": text-2xl (24px), #FFF, font-extrabold, leading-tight
  - "100 Bonuses": text-3xl (30px), #FFF, font-extrabold

右侧装饰:
  - 使用 /assets/decorations/auth-banner-bg.png (需人工提供)
  - opacity: 60%
  - fallback: merge.html 中的 SVG 占位图 (圆环+虚线)
  - 重要: 当图片不存在时 onError 隐藏, 不要显示破碎图标
```

### 表单输入框 (通用规范)

```
容器:
  高度:    48px (h-12)
  背景:    #1E2121 (bg-input)
  边框:    1px solid #3A4142 (divider)
  圆角:    8px
  内边距:  0 12px 0 12px (左) / 0 8px (右)
  间距:    margin-top: 12px (mt-3)

聚焦态:
  边框:    1px solid #24EE89 (brand)
  过渡:    transition: border-color 0.2s

错误态:
  边框:    1px solid #FF4757 (error)
  错误文字: text-xs, #FF4757, mt-1 px-1

输入文字:
  颜色:    #FFFFFF, 14px
  placeholder: #6B7070, 14px
```

### PhoneInput 组件

```
布局: [+91 前缀 | 输入框]

+91 前缀:
  - 颜色: #B0B3B3 (txt-secondary), 14px
  - 右侧: 8px margin + 8px padding + 1px solid #3A4142 分割线
  - white-space: nowrap

输入框:
  - type="tel", inputMode="numeric"
  - placeholder: "Phone Number"
  - 最大10位数字, 自动过滤非数字字符
```

### PasswordInput 组件

```
布局: [输入框 | 眼睛图标]

输入框:
  - type="password" / type="text" (切换)
  - placeholder: "Password ( 6-16 digits )"
  - maxLength: 16

眼睛图标:
  - 尺寸: 20x20px (w-5 h-5)
  - 颜色: #6B7070 (txt-muted), hover: #B0B3B3
  - 使用 SVG inline (eye / eye-off)
  - 来源: docs/1-user-system/ui/Resources/icons/eye.svg 和 eye-off.svg
```

### OTPInput 组件

```
布局: [输入框 | Send OTP 按钮]

输入框:
  - 单行输入框 (非分格), type="text", inputMode="numeric"
  - placeholder: "OTP"
  - maxLength: 6, 自动过滤非数字

Send OTP 按钮:
  - 文字: "Send OTP", 14px, font-semibold
  - 颜色: #24EE89 (brand)
  - 背景: transparent, 无边框
  - white-space: nowrap

  发送后倒计时:
  - 文字: "60s" -> "59s" -> ... -> "1s"
  - 颜色: #6B7070 (txt-muted)
  - cursor: not-allowed

  倒计时结束:
  - 恢复 "Send OTP" 品牌色

  禁用态 (手机号不足10位):
  - 颜色: #6B7070, cursor: not-allowed
```

### GiftSelector 组件

```
容器:
  margin-top: 16px (mt-4)
  标题: "Select your sign up gift", text-sm, #B0B3B3, margin-bottom: 8px

卡片布局: flex, gap: 8px (gap-2), 两张卡片等宽 (flex: 1)

单张卡片:
  背景:    #323738
  圆角:    8px
  内边距:  8px
  文本居中
  cursor: pointer

  选中态:  border: 2px solid #24EE89
  未选中:  border: 2px solid transparent

  游戏缩略图:
    - 尺寸: 48x48px (w-12 h-12), 居中, rounded-lg, overflow-hidden
    - 背景: #1A1D1D (bg-deep)
    - Aviator: /assets/games/aviator.jpg (需人工提供)
    - MoneyComing: /assets/games/money-coming.jpg (需人工提供)
    - onError 隐藏, 不显示破碎图标

  金额文字:
    - "x100", #24EE89, 14px, font-extrabold

  标签文字:
    - "Aviator FS" / "MoneyComing FS", #B0B3B3, 10px (text-2xs)

  操作按钮:
    - 选中: "Active", 背景 #24EE89, 文字 #000, 10px, font-bold, rounded, px-2 py-0.5
    - 未选中: "Apply", 背景 #323738, 文字 #6B7070
```

### InviteCodeInput 组件 (merge.html line 433-442)

```
位置: GiftSelector 下方, AgreementCheckbox 上方
margin-top: 12px (mt-3)

布局: 标准 form-input 容器 (48px 高, bg #1E2121, border #3A4142, radius 8px)
  [输入框 | 下拉箭头图标]

输入框:
  - type="text"
  - placeholder: "Enter Invite Code (Optional)"
  - 无验证要求 (可选字段)

下拉箭头图标:
  - chevron-down SVG, 16x16px, #6B7070
  - 来源: docs/1-user-system/ui/Resources/icons/chevron-down.svg

功能说明:
  - 一期仅展示 UI，输入值不提交给后端 (推广系统属于后续需求)
  - 展示是为了与 merge.html 设计稿 1:1 一致
```

### AgreementCheckbox 组件

```
布局: flex, items-start, gap: 8px

复选框:
  尺寸:   18x18px
  圆角:   4px

  选中态:
    - 背景: #24EE89
    - 勾号: #000, stroke-width: 3, 12x12px SVG
    - 无边框

  未选中态:
    - 背景: transparent
    - 边框: 1px solid #3A4142

文字:
  - #B0B3B3, text-xs, leading-relaxed
  - "User Agreement" 部分: #24EE89, cursor-pointer, underline
```

### 主操作按钮 (Sign Up / Sign In)

```
宽度:    100%
高度:    48px (h-12)
背景:    linear-gradient(90deg, #24EE89, #9FE871)
文字:    #000, 16px, font-extrabold (weight 800)
圆角:    8px
无边框
margin-top: 20px (mt-5)

禁用态 (submitting):
  opacity: 0.6, cursor: not-allowed

Loading 态:
  显示 spinner SVG + "Signing Up..." / "Signing In..."
```

### GoogleLoginButton 组件

```
宽度:    100%
高度:    48px
背景:    transparent
边框:    1px solid #3A4142
文字:    #FFF, 14px, font-semibold (weight 600)
圆角:    8px
margin-top: 12px (mt-3)

布局: flex, items-center, justify-center, gap: 8px
Google Logo: 20x20px SVG (内嵌四色 Google 图标)
文字: "Sign in with Google"

hover: background #323738 (bg-hover)
```

### 底部链接

```
margin-top: 16px (mt-4), padding-bottom: 32px (pb-8), text-center

注册页: "Already have an account?" (#B0B3B3, text-sm) + "Sign In" (#24EE89, font-semibold)
登录页: "Don't have an account?" (#B0B3B3, text-sm) + "Sign Up" (#24EE89, font-semibold)
```

### 登录页 Tab 切换

```
布局: flex, gap: 16px, margin-top: 12px, margin-bottom: 16px
底部: border-bottom 1px solid #3A4142

单个 Tab:
  padding-bottom: 8px
  font-semibold, text-sm

  激活态: #24EE89, border-bottom: 2px solid #24EE89
  非激活: #6B7070, border-bottom: 2px solid transparent

Tab 选项: "Password" | "OTP Login"
切换时清空密码/OTP 输入, 清空错误
```

### "Forgot Password?" 链接 (merge.html line 565-567, 仅密码登录模式)

```
位置: 密码输入框下方
margin-top: 8px, text-align: right
文字: "Forgot Password?", #24EE89, text-xs, cursor-pointer
功能: 一期仅展示 UI，点击无实际功能 (忘记密码流程属于后续需求)
```

### 错误提示

```
通用错误 (general):
  背景: rgba(255,71,87,0.1) -- error/10
  边框: 1px solid rgba(255,71,87,0.3) -- error/30
  圆角: 8px
  内边距: 12px 12px (px-3 py-2)
  文字: #FF4757, text-xs

字段错误:
  文字: #FF4757, text-xs, margin-top: 4px, padding: 0 4px
  输入框边框变为 #FF4757
```

## 路由设计

```typescript
const routes = [
    { path: '/register', element: <RegisterPage /> },
    { path: '/login', element: <LoginPage /> },
    // 已登录用户访问 auth 页面重定向到首页
    // OTP 登录作为 LoginPage 内 Tab 切换, 不需要独立路由
    // 赠送游戏选择内嵌在 RegisterPage 表单中, 不需要独立路由
];
```

## 状态管理

### authStore (Zustand)

```typescript
interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    fetchMe: () => Promise<void>;
}

interface User {
    id: number;
    phone: string;
    nickname: string;
    avatar_url: string;
    google_email: string;
    role: string;
    market_code: string;
    balance: number;
    bonus_balance: number;
    created_at: string;
}
```

- Token 持久化到 localStorage
- 应用启动时从 localStorage 恢复 Token，调用 /auth/me 验证
- Token 过期 (401 响应) 自动清除并跳转登录页
- logout 方法: 调用 POST /auth/logout -> 清除 localStorage token -> 重置 store 状态 -> 跳转登录页

## API 对接

### Axios 封装

```typescript
// src/api/client.ts
const apiClient = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
});

// 请求拦截: 自动添加 Authorization header
// 响应拦截: 统一错误处理, 401 自动登出
```

### API 函数

```typescript
// src/api/auth.ts
export const authApi = {
    sendOTP: (phone: string, purpose: string) => post('/auth/send-otp', { phone, purpose }),
    register: (data: RegisterRequest) => post('/auth/register', data),
    login: (phone: string, password: string) => post('/auth/login', { phone, password }),
    loginOTP: (phone: string, otp: string) => post('/auth/login-otp', { phone, otp }),
    googleLogin: (idToken: string) => post('/auth/google', { id_token: idToken }),
    getMe: () => get('/auth/me'),
    logout: () => post('/auth/logout', {}),
};
```

## 交互流程

### 注册流程

1. 用户输入手机号 (+91) + 密码
2. 点击 "Send OTP" -> 调用 send-otp API -> 开始 60s 倒计时
3. 输入 OTP 验证码 (Mock: 123456)
4. 选择赠送游戏 (Aviator / MoneyComing)，内嵌在注册表单中
5. 勾选用户协议
6. 点击 "Sign Up" -> 调用 register API (包含 gift_game 参数)
7. 成功 -> token 存入 authStore + localStorage -> 跳转首页

### 登录流程

1. 手机号+密码 -> 调用 login API -> 成功跳转首页
2. OTP 登录 -> 先 send-otp -> 输入 OTP -> 调用 login-otp API
3. Google 登录 -> 触发 Google OAuth -> 获取 id_token -> 调用 google API

## 静态资源清单与状态

> **关键问题**: 当前 `frontend/public/assets/` 下所有目录为空，所有资源文件缺失。
> 这是前端成品与设计差距大的主要原因之一。

### 必需资源 (前端代码已引用)

| # | 资源 | 引用路径 | 状态 | 来源 |
|---|------|----------|------|------|
| 1 | 品牌 Logo | `/assets/brand/logo.png` | **缺失** | 需 UI 设计师交付 |
| 2 | Banner 装饰图 | `/assets/decorations/auth-banner-bg.png` | **缺失** | 需 UI 设计师交付 |
| 3 | Aviator 缩略图 | `/assets/games/aviator.jpg` | **缺失** | 需 UI 设计师交付 |
| 4 | MoneyComing 缩略图 | `/assets/games/money-coming.jpg` | **缺失** | 需 UI 设计师交付 |
| 5 | AvertaStd-ExtraBold 字体 | `/assets/fonts/AvertaStd-ExtraBold.woff2` | **缺失** | 需授权字体文件 |
| 6 | AvertaStd-Semibold 字体 | `/assets/fonts/AvertaStd-Semibold.woff2` | **缺失** | 需授权字体文件 |
| 7 | AvertaStd-Regular 字体 | `/assets/fonts/AvertaStd-Regular.woff2` | **缺失** | 需授权字体文件 |

### 已内嵌资源 (无需额外文件)

| 资源 | 位置 | 说明 |
|------|------|------|
| Google Logo SVG | GoogleLoginButton.tsx 内嵌 | 四色 Google 图标, 20x20px |
| Eye / Eye-off SVG | PasswordInput.tsx 内嵌 | 密码显隐切换图标 |
| Check SVG | AgreementCheckbox.tsx 内嵌 | 勾选图标 |
| Loading Spinner SVG | RegisterPage/LoginPage 内嵌 | 提交 loading 动画 |

### UI 设计师已交付 SVG (可复制到前端)

| 资源 | 来源路径 | 用途 |
|------|----------|------|
| google.svg | `docs/1-user-system/ui/Resources/icons/google.svg` | Google 登录按钮 |
| eye.svg | `docs/1-user-system/ui/Resources/icons/eye.svg` | 密码显示 |
| eye-off.svg | `docs/1-user-system/ui/Resources/icons/eye-off.svg` | 密码隐藏 |
| check.svg | `docs/1-user-system/ui/Resources/icons/check.svg` | 复选框勾选 |
| close.svg | `docs/1-user-system/ui/Resources/icons/close.svg` | 关闭按钮 |
| lock.svg | `docs/1-user-system/ui/Resources/icons/lock.svg` | 密码输入提示 |
| phone.svg | `docs/1-user-system/ui/Resources/icons/phone.svg` | 手机号输入提示 |
| chevron-down.svg | `docs/1-user-system/ui/Resources/icons/chevron-down.svg` | 下拉箭头 |

## 关键决策

- 深色主题 UI: 背景 #232626, 输入框 #1E2121, 品牌渐变按钮 #24EE89 -> #9FE871
- 移动优先: 认证页面 max-w-[430px] 居中
- OTP 输入: 单行输入框 (非分格)，与 UI 设计方案一致
- 密码强度: 前端实时提示 (>=6位, 含字母和数字)
- Google 登录: 第一期 Mock, 按钮存在但跳过真实 OAuth 流程
- 图标内嵌: Google/Eye/Check 等小图标直接内嵌 SVG，不依赖外部文件
- 资源 fallback: 所有 `<img>` 标签设置 onError 隐藏，避免显示破碎图标

## 依赖与约束

- 认证状态影响全局: 顶栏显示、路由守卫、API 请求
- 注册成功联动钱包余额显示 (100 Bonuses)
- Vite dev 代理 /api -> http://localhost:8080
- **资源阻塞**: 品牌 Logo、Banner 装饰图、游戏缩略图、字体文件全部缺失，必须尽快提供以完成视觉还原
