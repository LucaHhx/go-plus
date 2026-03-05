# 前端技术方案 -- 用户管理

> 需求: 7-user-management | 角色: frontend

## 与 1-user-system 的复用关系

本需求在 1-user-system 已有前端基础设施上扩展，复用 authStore、API client、design tokens 等，不修改已有组件的行为。

| 复用项 | 来源 | 说明 |
|--------|------|------|
| authStore | 1-user-system | 复用 logout/updateUser/fetchMe 方法 |
| apiClient (Axios) | 1-user-system | 复用拦截器、统一错误处理 |
| Design Tokens | 1-user-system | 复用全套颜色/字体/间距变量 |
| AuthGuard | 1-user-system | 复用路由守卫组件 |
| SideDrawer | 1-user-system | 扩展: 添加用户信息区域和登出按钮 |

## 技术栈

沿用项目标准栈，新增一个裁剪库:

| 组件 | 选型 | 说明 |
|------|------|------|
| 框架 | React 19 | UI 框架 |
| 语言 | TypeScript 5.9+ | 类型安全 |
| 构建 | Vite 7+ | 开发服务器与构建 |
| 样式 | Tailwind CSS 4+ | 原子化 CSS |
| 状态 | Zustand | 轻量状态管理 |
| HTTP | Axios | API 请求 |
| 路由 | React Router DOM 7+ | 客户端路由 |
| 裁剪 | react-easy-crop | 头像客户端裁剪 (~10KB) |

## 页面与路由设计

### 新增路由

```typescript
// App.tsx 中新增路由
<Route
    path="/profile"
    element={
        <AuthGuard requireAuth={true}>
            <ProfilePage />
        </AuthGuard>
    }
/>
<Route
    path="/profile/security"
    element={
        <AuthGuard requireAuth={true}>
            <SecurityPage />
        </AuthGuard>
    }
/>
```

### 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| ProfilePage | /profile | 个人资料页（查看/编辑昵称、头像、账户信息） |
| SecurityPage | /profile/security | 安全设置页（修改密码、Google 绑定/解绑） |

两个页面均为全屏页面（与 wallet 页面一致），不使用 AppLayout，自带 PageHeader 返回导航。

## 组件结构

```
src/pages/
  profile/
    ProfilePage.tsx               -- 个人资料主页面
    SecurityPage.tsx              -- 安全设置页面
    components/
      ProfileHeader.tsx           -- 页面顶部导航栏 (返回箭头 + 标题)
      UserInfoCard.tsx            -- 用户信息展示卡片 (头像+昵称+手机号)
      AccountInfoSection.tsx      -- 账户信息区块 (手机号/注册时间/VIP等级)
      NicknameEditor.tsx          -- 昵称编辑组件 (inline 编辑模式)
      AvatarUploader.tsx          -- 头像上传组件 (含裁剪弹窗)
      AvatarCropModal.tsx         -- 头像裁剪弹窗 (react-easy-crop)
      ChangePasswordForm.tsx      -- 修改密码表单
      GoogleBindSection.tsx       -- Google 账号绑定/解绑区块
      LogoutButton.tsx            -- 登出按钮组件
```

### 公共组件修改

```
src/components/layout/
  SideDrawer.tsx                  -- 修改: 顶部添加用户信息区域, 底部添加登出
```

## 详细页面设计

### SideDrawer 改造

**已登录状态:** 侧边菜单顶部由 Promo Banner 切换为用户信息区域:

```
┌──────────────────────────┐
│ [头像(48px)]  昵称       │
│              手机号(遮罩) │
│              > 个人资料   │
├──────────────────────────┤
│ Games Group ...          │
│ ─────────────            │
│ Features Group ...       │
│ ─────────────            │
│ [Logout 按钮]            │
└──────────────────────────┘
```

**未登录状态:** 保持原有 Promo Banner 不变。

- 用户信息区域: 点击整行跳转 `/profile`
- 手机号遮罩: `+91****7890` 格式，隐藏中间 4 位
- 登出按钮: 红色文字，点击弹出确认对话框

### ProfilePage 布局

```
┌──────────────────────────────┐
│ ← Profile                    │  -- ProfileHeader
├──────────────────────────────┤
│                              │
│     [头像(80px) + 编辑图标]   │  -- AvatarUploader
│     点击上传/更换头像         │
│                              │
├──────────────────────────────┤
│ Nickname                     │
│ ┌──────────────────────────┐ │
│ │ Player001          [编辑]│ │  -- NicknameEditor
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Account Info                 │
│ Phone       +91****7890      │  -- AccountInfoSection
│ Registered  2026-03-04       │
│ VIP Level   VIP 0            │
├──────────────────────────────┤
│                              │
│ [Security Settings >]        │  -- 跳转 /profile/security
│                              │
├──────────────────────────────┤
│                              │
│ [Logout]                     │  -- LogoutButton
│                              │
└──────────────────────────────┘
```

### SecurityPage 布局

```
┌──────────────────────────────┐
│ ← Security Settings          │  -- ProfileHeader
├──────────────────────────────┤
│ Change Password              │
│ ┌──────────────────────────┐ │
│ │ Current Password         │ │  -- ChangePasswordForm
│ │ New Password             │ │
│ │ Confirm Password         │ │
│ │ [Update Password]        │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Google Account               │
│ ┌──────────────────────────┐ │
│ │ Status: Not bound        │ │  -- GoogleBindSection
│ │ [Bind Google Account]    │ │
│ └──────────────────────────┘ │
│ 或                           │
│ ┌──────────────────────────┐ │
│ │ Bound: user@gmail.com    │ │
│ │ [Unbind Google Account]  │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

## 状态管理

### authStore 扩展

不新增 store，复用已有 `authStore` 中的方法:

```typescript
// 已有方法 (无需修改):
// - logout()     -- 登出
// - updateUser() -- 局部更新用户信息
// - fetchMe()    -- 重新获取完整用户数据

// 使用方式:
// 修改昵称成功后: updateUser({ nickname: 'NewName' })
// 上传头像成功后: updateUser({ avatar_url: '/assets/uploads/avatars/...' })
// 修改密码成功后: login(newToken, currentUser) -- 替换 Token
// 绑定 Google 后: updateUser({ google_email: 'user@gmail.com' })
// 解绑 Google 后: updateUser({ google_email: '' })
```

### authStore 需要扩展的改动

```typescript
// authStore 需要新增 updateToken 方法:
interface AuthState {
    // ... 已有字段 ...
    updateToken: (token: string) => void;  // 新增: 修改密码后更新 Token
}

// 实现:
updateToken: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token });
},
```

## API 对接

### 新增 API 函数

```typescript
// src/api/user.ts
export const userApi = {
    // 更新个人资料
    updateProfile: (data: { nickname: string }) =>
        put<UserMeResponse>('/user/profile', data),

    // 上传头像 (multipart/form-data)
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return post<{ avatar_url: string }>('/user/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // 修改密码
    changePassword: (data: ChangePasswordRequest) =>
        put<{ token: string }>('/user/password', data),

    // 绑定 Google 账号
    bindGoogle: (idToken: string) =>
        post<{ google_email: string }>('/user/google/bind', { id_token: idToken }),

    // 解绑 Google 账号
    unbindGoogle: () =>
        post<null>('/user/google/unbind', {}),
};
```

### 新增类型定义

```typescript
// src/types/index.ts 新增
export interface ChangePasswordRequest {
    current_password?: string;  // Google-only 用户可选
    new_password: string;
    confirm_password: string;
}

export interface UserMeResponse {
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

## 交互流程

### 登出流程

1. 用户点击侧边菜单底部 "Logout" 按钮或 ProfilePage 底部 "Logout" 按钮
2. 弹出确认对话框: "Are you sure you want to logout?"
3. 用户确认后:
   - 调用 `authApi.logout()` (可选，后端仅返回成功)
   - 调用 `authStore.logout()` 清除 localStorage Token + 重置 store
   - 关闭侧边菜单
   - 导航到 `/` (首页)

### 头像上传流程

1. 用户点击头像区域
2. 打开系统文件选择器 (accept="image/jpeg,image/png,image/webp")
3. 选择图片后打开 AvatarCropModal:
   - 使用 react-easy-crop 显示裁剪框 (正方形, aspect=1)
   - 支持缩放和拖拽
   - 确认/取消按钮
4. 用户确认裁剪后:
   - 使用 Canvas API 生成裁剪后的 Blob
   - 调用 `userApi.uploadAvatar(croppedFile)` 上传
   - 成功后 `authStore.updateUser({ avatar_url: response.avatar_url })`
   - 关闭弹窗，头像立即更新

### 昵称编辑流程

1. 用户点击昵称右侧编辑图标
2. 昵称文字切换为输入框 (inline edit)
3. 用户修改后点击确认或按 Enter
4. 调用 `userApi.updateProfile({ nickname })`
5. 成功后 `authStore.updateUser({ nickname })`
6. 切换回文字展示模式

### 修改密码流程

1. 用户在 SecurityPage 填写表单:
   - 有密码用户: Current Password + New Password + Confirm Password
   - Google-only 用户 (password_hash 为空): 隐藏 Current Password 输入框，仅显示 New + Confirm
2. 前端校验: 新密码 >= 6 位、含字母和数字、两次输入一致
3. 调用 `userApi.changePassword(data)`
4. 成功后:
   - `authStore.updateToken(response.token)` -- 更新为新 Token
   - 显示成功提示 "Password updated. Other devices have been logged out."
   - 清空表单

**判断 Google-only 用户:** 通过 `authStore.user` 判断:
- `user.google_email !== '' && 后端标记无密码` -- 但当前 UserMeResponse 没有 has_password 字段
- 方案: GET /auth/me 响应中新增 `has_password: boolean` 字段，前端据此决定是否显示 Current Password 输入框

### Google 绑定/解绑流程

1. 绑定:
   - 用户点击 "Bind Google Account"
   - 触发 Google OAuth 流程获取 id_token (Mock: 使用固定 token)
   - 调用 `userApi.bindGoogle(idToken)`
   - 成功后 `authStore.updateUser({ google_email })`
   - 显示已绑定状态

2. 解绑:
   - 用户点击 "Unbind Google Account"
   - 弹出确认对话框
   - 调用 `userApi.unbindGoogle()`
   - 如果返回 1015 (唯一登录方式): 显示错误提示 "请先设置密码再解绑"
   - 成功后 `authStore.updateUser({ google_email: '' })`

## 视觉规范

所有页面复用 1-user-system 中已有的 design tokens:

```
背景色:     #232626 (bg) / #1A1D1D (bg-deep)
卡片背景:   #2A2D2D (bg-card)
输入框背景: #1E2121 (bg-input)
品牌色:     #24EE89 (brand)
文字:       #FFFFFF (txt) / #B0B3B3 (txt-secondary) / #6B7070 (txt-muted)
错误色:     #FF4757 (error)
分割线:     #3A4142 (divider)
圆角:       8px
最大宽度:   430px (移动优先, 居中)
```

### ProfileHeader 组件

```
高度:    56px (h-14)
背景:    #1A1D1D (bg-deep)
定位:    sticky top-0 z-50

布局: [← 返回箭头] [标题文字]
返回箭头: 24x24, #FFFFFF, 点击 navigate(-1)
标题文字: 16px, #FFFFFF, font-semibold
```

### 表单输入框

复用 1-user-system 的输入框规范:
- 高度 48px, 背景 #1E2121, 边框 #3A4142, 圆角 8px
- 聚焦边框 #24EE89
- 错误边框 #FF4757 + 错误文字

### 登出确认弹窗

```
背景遮罩: rgba(0,0,0,0.6)
弹窗: bg #2A2D2D, rounded-lg, p-6, max-w-[320px], 居中
标题: "Logout", 18px, #FFF, font-semibold
描述: "Are you sure you want to logout?", 14px, #B0B3B3
按钮行: flex, gap-3
  取消: bg transparent, border #3A4142, text #FFF
  确认: bg #FF4757, text #FFF, font-semibold
```

## 关键决策

1. **独立全屏页面 + 侧边菜单入口:** 与 wallet 页面模式一致。侧边菜单顶部显示用户信息（已登录时替换 Promo Banner），底部添加 Logout 按钮。

2. **react-easy-crop 客户端裁剪:** 轻量 (~10KB)，移动端触摸友好，正方形裁剪框。裁剪后生成 Blob 上传给后端。

3. **authStore 复用:** 不新增 store，复用已有的 logout/updateUser/fetchMe。新增 updateToken 方法用于密码修改后替换 Token。

4. **ProfilePage 和 SecurityPage 分离:** 资料展示/编辑和安全设置分两个页面，避免单页面过长，符合移动端设计习惯。

5. **GET /auth/me 扩展 has_password 字段:** 前端需要知道用户是否已设密码，用于决定修改密码表单是否显示 "Current Password" 输入框，以及 Google 解绑的提示逻辑。

## 依赖与约束

- 新增 npm 依赖: react-easy-crop
- SideDrawer 改造需要根据 authStore.isAuthenticated 条件渲染
- 头像裁剪使用 Canvas API，所有现代浏览器均支持
- Vite dev 代理 /api -> http://localhost:8080 (已有)
- 后端 GET /auth/me 需要新增 has_password 字段，前端依赖此字段
