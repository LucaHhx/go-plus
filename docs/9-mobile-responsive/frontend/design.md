# frontend 设计文档 — 手机端适配优化

> 需求: 9-mobile-responsive | 角色: frontend

## 技术选型

- **框架**: React 19 + Vite + Tailwind CSS v4 (现有技术栈，无新增依赖)
- **视口单位**: `dvh` (dynamic viewport height) 替代 `vh`，解决移动浏览器地址栏问题
- **安全区域**: CSS `env(safe-area-inset-*)` 处理 iPhone X+ 刘海/底部区域

## 架构设计

### 1. AppLayout 改造 (涉及 AppLayout 内的页面: 首页、游戏大厅)

**当前状态**: 已正确实现 flexbox 三段式布局，TopBar 和 BottomTabBar 不参与滚动。

**改动**:
```diff
- <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden relative" ...>
+ <div className="w-full max-w-[430px] flex flex-col overflow-hidden relative" style={{ background: '#232626', height: '100dvh' }}>
```

- `h-screen` (100vh) 改为 `height: 100dvh` -- 解决移动端地址栏遮挡
- BottomTabBar 添加 `padding-bottom: env(safe-area-inset-bottom)` -- 解决 iPhone X+ 底部安全区域

### 2. FullScreenLayout 新组件 (涉及独立全屏页面: Wallet、Profile 等)

创建 `frontend/src/components/layout/FullScreenLayout.tsx`:

```tsx
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

将以下页面改为使用 FullScreenLayout:
- `DepositPage.tsx` -- 替换自带的外层 div
- `WithdrawPage.tsx` -- 替换自带的外层 div
- `TransactionsPage.tsx` -- 替换自带的外层 div
- `ProfilePage.tsx` -- 替换自带的外层 div
- `SecurityPage.tsx` -- 替换自带的外层 div

### 3. 全局样式增强 (index.css)

**已有**: `html, body { min-height: 100dvh; }` 和 `#root { min-height: 100dvh; }` -- 全局 dvh 基础已就绪。

**需添加**:
```css
/* 防止移动端弹性滚动和下拉刷新干扰 */
html {
  overscroll-behavior: none;
}

/* 安全区域辅助类 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

### 4. viewport 元标签 (index.html)

**当前**: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`

**改为**: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`

添加 `viewport-fit=cover` 使页面扩展到安全区域外，配合 `env(safe-area-inset-*)` 使用。保留 `maximum-scale=1.0, user-scalable=no` 防止双击缩放。

### 5. dvh 兼容性

**现状**: index.css 中 `html, body` 和 `#root` 已使用 `min-height: 100dvh`，说明项目浏览器环境支持 dvh 单位。

**Tailwind CSS v4 支持情况**: Tailwind v4 内置 `h-dvh` (height: 100dvh) 和 `min-h-dvh` (min-height: 100dvh) 工具类。可直接使用。

**统一方案**: 优先使用 Tailwind 工具类 `h-dvh` / `min-h-dvh`，FullScreenLayout 中统一使用 Tailwind 类而非内联 style。AppLayout 中由于需要同时移除 `h-screen` 并替换，使用内联 style `height: 100dvh` 更清晰。

**Fallback 方案** (index.css):
```css
@supports not (height: 100dvh) {
  .h-dvh-fallback { height: 100vh; }
  .min-h-dvh-fallback { min-height: 100vh; }
}
```

## 各页面改动详情

### AppLayout.tsx
- `h-screen` → `height: 100dvh`
- 无需改为 fixed 定位，flexbox 方案已正确

### BottomTabBar.tsx
- 外层 nav 添加 `pb-safe` 类或 `padding-bottom: env(safe-area-inset-bottom)`
- 确保 height 改为 `min-height: 64px`（安全区域会增加实际高度）

### TopBar.tsx
- 无重大改动
- 确认 `h-14` (56px) 足够

### SideDrawer.tsx
- 确认菜单项触控区域 `py-3` (12px * 2 + 文字高度) 是否 >= 44px -- 当前 `px-4 py-3` + 图标 24px = 约 48px，满足要求
- **Overlay 分析**: 使用 `absolute inset-0 z-[1001]`，相对于 AppLayout 内层 430px 容器（`position: relative`）定位。由于父容器 `overflow-hidden`，overlay 范围被限制在 430px 容器内。这对于当前 max-w-430px 的移动端布局是正确的，点击 overlay 外部（430px 以外）不会触发关闭，但在移动端设备上屏幕宽度 <= 430px，所以不影响用户体验。无需改为 fixed。
- Panel 使用 `absolute top-0 bottom-0 left-0 w-[280px] overflow-y-auto`，在移动端正常工作

### ExplorePage.tsx
- 在 AppLayout main 滚动容器内有自建的 56px `sticky top-0` header，提供返回按钮和 "ALL GAMES" 标题
- 这是页面级导航 header，在 main 的 `overflow-y-auto` 容器内 sticky 定位，不与 TopBar 冲突
- 需确认: sticky 在移动端 Safari 中行为正常（已知 sticky + overflow 组合在部分旧版本有 bug）
- 无需修改布局结构

### DepositPage.tsx / WithdrawPage.tsx
- 替换外层 div 为 FullScreenLayout
- 底部提交按钮添加安全区域 padding
- 虚拟键盘适配: 使用 `visualViewport` API 或 CSS `env(keyboard-inset-height)` 确保提交按钮不被遮挡

### TransactionsPage.tsx
- 替换外层 div 为 FullScreenLayout
- 长列表滚动：确认列表区域有 `overflow-y-auto`

### ProfilePage.tsx / SecurityPage.tsx
- 当前使用单层包裹: `min-h-screen bg-bg max-w-[430px] mx-auto`（无外层背景 div，与 Wallet 页面结构不同）
- 改为 FullScreenLayout 包裹，移除手动的 max-w 和 mx-auto

### Auth 页面 (LoginPage / RegisterPage / GiftSelectPage)
- 均使用 `min-h-screen` (100vh)，存在移动端地址栏遮挡问题
- 改为 FullScreenLayout 包裹或直接替换 `min-h-screen` 为 `min-h-dvh`
- 这些页面是独立全屏页面，不在 AppLayout 内

### GamePlayPage
- 使用 `min-h-screen`，改为 `min-h-dvh`
- 作为全屏游戏页面，dvh 修复尤为重要（确保游戏 iframe 不被地址栏遮挡）

### 触控区域优化
- 全局检查所有可点击元素，确保 width >= 44px, height >= 44px
- 重点关注: TopBar 按钮、BottomTabBar 图标、SideDrawer 菜单项、表单按钮
- 已确认 SideDrawer 菜单项 >= 44px (py-3 + 24px icon = ~48px)

### 多分辨率验证
- 375px (iPhone SE) -- 最小宽度，重点检查内容溢出
- 390px (iPhone 14) -- 中间宽度
- 430px (iPhone 14 Pro Max) -- max-w 边界

## 关键决策

1. **不改变 AppLayout 的 flexbox 架构** -- 当前方案已正确实现固定导航 + 内容区滚动，只需修复 vh → dvh
2. **新建 FullScreenLayout 统一独立页面** -- 减少重复代码，统一 dvh 和安全区域处理
3. **安全区域使用 CSS env()** -- 不依赖 JS 计算，性能更好
4. **不引入新依赖** -- 纯 CSS/Tailwind 方案解决所有适配问题

## 页面 UI 设计需求

| 页面 | UI 设计 | 说明 |
|------|---------|------|
| 全部页面 | 不需要 | 使用现有设计，仅调整布局适配 |

> 全部页面使用现有样式，不需要 UI 设计。本需求纯粹是布局和适配优化。
