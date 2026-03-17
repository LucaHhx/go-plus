# 技术方案 — 9-mobile-responsive

> 需求: 9-mobile-responsive | 角色: tech

## 角色规划

| 角色 | 参与 | 说明 |
|------|------|------|
| tech | ✅ | 架构设计与任务协调 |
| backend | ❌ | 纯前端需求，不涉及后端改动 |
| frontend | ✅ | 布局框架改造 + 各页面适配 |
| qa | ❌ | 手动验收即可，不需要 API 测试 |
| ui | ❌ | 不需要新设计稿，仅修复现有布局问题 |

## 现状分析

### 当前布局架构

```
AppLayout (flex-col, h-screen, overflow-hidden)
├── TopBar (shrink-0, h-14, 无 fixed/sticky)
├── SideDrawer (absolute 定位, z-1002)
├── main (flex-1, overflow-y-auto)  ← 内容区独立滚动
└── BottomTabBar (shrink-0, h-64px, 无 fixed/sticky)
```

**结论: AppLayout 的布局方案已经是正确的。** `h-screen + flex-col + overflow-hidden` 使得外层容器占满整个视口，TopBar 和 BottomTabBar 通过 `shrink-0` 固定高度不参与滚动，`main` 通过 `flex-1 + overflow-y-auto` 实现独立滚动。这是标准的 "三段式固定导航 + 中间滚动" 方案。

### 路由分类

| 路由 | 布局方式 | 是否在 AppLayout 中 |
|------|---------|-------------------|
| `/` (首页) | AppLayout 包裹 | 是 |
| `/explore` (游戏大厅) | AppLayout 包裹 | 是 |
| `/register`, `/login` | 独立全屏 | 否 |
| `/register/gift` | 独立全屏 | 否 |
| `/wallet/deposit` | 独立全屏，自带 header | 否 |
| `/wallet/withdraw` | 独立全屏，自带 header | 否 |
| `/wallet/transactions` | 独立全屏，自带 header | 否 |
| `/profile` | 独立全屏，自带 header | 否 |
| `/profile/security` | 独立全屏，自带 header | 否 |
| `/games/:id/play` | 独立全屏 | 否 |

### 发现的问题

1. **AppLayout 布局本身是正确的** -- TopBar 和 BottomTabBar 已经通过 flexbox 固定，不参与 main 的滚动。这不是 PM 描述中的 "固定定位" 问题，而是可能在某些手机浏览器中出现的边界情况。

2. **独立全屏页面缺少统一滚动容器** -- Wallet/Profile 等页面使用 `min-h-screen` 但没有统一的滚动容器约束，可能导致:
   - 虚拟键盘弹出时布局抖动
   - 地址栏收缩/展开时 `100vh` 计算不准确

3. **缺少 `100dvh` 适配** -- `AppLayout` 使用 `h-screen` (即 `100vh`)，在移动端浏览器中 `100vh` 包含地址栏高度，导致内容被地址栏遮挡。应改为 `100dvh` (dynamic viewport height)。

4. **ExplorePage 自建了页面级 sticky header** -- 在 AppLayout 的 main 滚动容器内有一个 56px 的 `sticky top-0` header（包含返回按钮和 "ALL GAMES" 标题）。这是页面级导航，不与 TopBar 重叠，属于合理设计。需确认在移动端 sticky 行为正常。

5. **独立页面缺少安全区域适配** -- 对于 iPhone X+ 的底部安全区域 (safe-area-inset-bottom)，底部按钮可能被遮挡。

6. **触控区域不足** -- 部分按钮和可点击元素未达到 44x44px 最小触控区域要求。

7. **Auth/Game 页面同样使用 `min-h-screen`** -- RegisterPage、LoginPage、GiftSelectPage、GamePlayPage 均使用 `min-h-screen` (100vh)，存在与独立全屏页面相同的地址栏遮挡问题，需一并修复为 `min-h-dvh`。

8. **index.css 已部分使用 dvh** -- `html, body` 和 `#root` 已设置 `min-height: 100dvh`，但各页面组件仍使用 Tailwind 的 `min-h-screen` (100vh)。需要在页面组件层面统一迁移。

9. **ProfilePage/SecurityPage 外层结构不同** -- 这两个页面使用单层 `min-h-screen bg-bg max-w-[430px] mx-auto` 包裹（无外层背景 div），而 Wallet 页面使用双层包裹。FullScreenLayout 需要同时兼容这两种迁移场景。

## 架构决策

### 决策 1: 保持 AppLayout flexbox 方案，增强移动端兼容

**理由**: 当前 `h-screen + flex-col + overflow-hidden` 方案逻辑正确，不需要改为 fixed 定位。只需将 `h-screen` 改为 `h-dvh` (100dvh) 解决移动浏览器地址栏问题。

**改动**:
- `AppLayout`: `h-screen` → `h-dvh` (Tailwind v4 支持)
- 如果 Tailwind v4 不支持 `h-dvh`，则使用内联 style `height: 100dvh`

### 决策 2: 为独立全屏页面创建通用 FullScreenLayout 组件

**理由**: Wallet、Profile 等独立页面各自重复实现 `min-h-screen + max-w-[430px] + 居中` 模式，且没有处理 dvh 和安全区域。统一为一个 FullScreenLayout 组件，减少重复代码。

**组件设计**:
```tsx
// FullScreenLayout.tsx
interface Props {
  children: React.ReactNode;
  className?: string;
}
export default function FullScreenLayout({ children, className }: Props) {
  return (
    <div className="min-h-dvh flex justify-center" style={{ background: '#1A1D1D' }}>
      <div className={`w-full max-w-[430px] min-h-dvh bg-bg flex flex-col ${className ?? ''}`}>
        {children}
      </div>
    </div>
  );
}
```

### 决策 3: 添加安全区域适配

**理由**: iPhone X+ 设备底部有 Home Indicator 区域，需要通过 `env(safe-area-inset-bottom)` 确保底部操作按钮不被遮挡。

**改动**:
- `index.html`: 添加 `<meta name="viewport" content="..., viewport-fit=cover">`
- BottomTabBar: 添加 `pb-safe` (safe-area-inset-bottom padding)
- 独立页面底部操作按钮: 添加安全区域 padding

### 决策 4: 全局 CSS 增加 touch-action 和 overscroll-behavior

**理由**: 防止移动端的 "弹性滚动" 和 "下拉刷新" 干扰。

**改动** (index.css):
```css
html, body {
  overscroll-behavior: none;
}
main {
  -webkit-overflow-scrolling: touch;
}
```

## 模块划分

| 模块 | 改动文件 | 改动类型 |
|------|---------|---------|
| 全局布局 | `AppLayout.tsx` | `h-screen` → `h-dvh`，安全区域 |
| 全局样式 | `index.css` | dvh fallback, overscroll-behavior, safe-area |
| 全局入口 | `index.html` | viewport-fit=cover |
| 新组件 | `FullScreenLayout.tsx` | 新建 |
| TopBar | `TopBar.tsx` | 微调（无重大改动，已在 flexbox 中固定） |
| BottomTabBar | `BottomTabBar.tsx` | 添加 safe-area padding |
| SideDrawer | `SideDrawer.tsx` | 确认触控区域 >= 44px |
| 首页 | `HomePage.tsx` + 子组件 | 滚动体验优化 |
| 游戏大厅 | `ExplorePage.tsx` | 确认 sticky header 在移动端正常 |
| 钱包 | `DepositPage.tsx`, `WithdrawPage.tsx`, `TransactionsPage.tsx` | 使用 FullScreenLayout，虚拟键盘适配 |
| 个人中心 | `ProfilePage.tsx`, `SecurityPage.tsx` | 使用 FullScreenLayout |
| Auth 页面 | `LoginPage.tsx`, `RegisterPage.tsx`, `GiftSelectPage.tsx` | `min-h-screen` → `min-h-dvh` |
| 游戏页 | `GamePlayPage.tsx` | `min-h-screen` → `min-h-dvh` |
| 触控优化 | 各页面 | 按钮/可点击元素最小 44x44px |

## AutoCode 模块

不适用。本需求为纯前端布局优化，不涉及数据库建表。

## 跨角色依赖

无。本需求仅涉及 frontend 角色，不依赖 backend 或其他角色。

## 页面 UI 设计需求

| 页面 | UI 设计 | 说明 |
|------|---------|------|
| 所有页面 | 不需要 | 仅调整布局和适配，不改变视觉设计 |

> UI 角色标注为 ❌（不参与），本需求不修改视觉风格，仅优化布局和移动端体验。
