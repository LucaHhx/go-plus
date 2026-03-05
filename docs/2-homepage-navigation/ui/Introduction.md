# 首页布局与导航 -- 前端设计说明

> 更新日期: 2026-03-04
> 设计稿: docs/2-homepage-navigation/ui/merge.html (可直接浏览器打开预览)

## 设计概述

首页是整个平台的入口和框架。采用深色主题 (#232626)，移动优先设计 (430px)，1:1 克隆 1goplus.com 的视觉效果。所有页面共享固定顶部栏和底部 Tab 栏的全局框架。

**重要**: 所有色值、间距、字体均已从原站 CSS 实际提取验证，详见 design.md。

## 布局架构

### 全局框架 (AppShell)

**重要: 使用 Flex Column 容器布局，不要用 fixed 定位**

```
外层容器 (max-w-430px, mx-auto, h-screen, flex flex-col, overflow-hidden)
  |
  +-- 顶部栏 (shrink-0, 56px)
  |     背景: rgba(50, 55, 56, 0.85) + backdrop-filter: blur(10px)
  |
  +-- 可滚动内容区 (flex-1, overflow-y-auto)
  |     无需 padding-top/bottom
  |
  +-- 底部 Tab (shrink-0, 64px)
  |     背景: #323738
  |
  +-- 侧边菜单 (absolute, 相对于容器定位)
```

- 最大宽度 430px，居中显示
- 页面主背景色 #232626
- **为什么不用 fixed**: fixed 元素相对于视口定位，在宽屏下会脱离 430px 居中容器，导致 header/tab 贴在屏幕左侧
- 侧边菜单的 overlay 和 panel 使用 `position: absolute` (不是 fixed)，配合容器的 `position: relative` 和 `overflow: hidden` 工作

### 顶部栏 (Header)

- 高度: 56px (h-14)
- **背景不是纯色**: 使用 rgba(50, 55, 56, 0.85) + backdrop-filter: blur(10px) 半透明毛玻璃
- 布局: flex, items-center, px-4
- 左侧: Logo 图片 (h-8, 约 124x32px, 来自原站 CDN)
- 中间: flex-1 撑开
- 右侧 (未登录):
  1. Hot Event 图标 (40x44px, cursor-pointer)
  2. "Sign In" 文字按钮 (白色, 16px, font-weight: 800, 无背景)
  3. "Sign Up" 渐变按钮 (**linear-gradient(90deg, #24EE89, #9FE871)**, 黑色文字, 16px, font-weight: 800, h-10, px-4, rounded-lg)
- 右侧 (已登录): 余额显示 "INR xxx.xx" + 充值 "+" 按钮

### 底部 Tab 栏

- 高度: 64px, 固定在底部
- 背景: **#323738** (不是 #1A1D1D, 从原站实测)
- 5 个 Tab: Menu / Explore / **GET ₹1700** / Raffle / Quest
- 选中态: #24EE89 (图标 + 文字)
- 未选中: #6B7070
- Tab 文字: 10px, font-semibold
- **GET ₹1700 居中突出**: 使用原站图片 `tab200-etZXx2_Z.png`, transform: scale(1.35), 上移突出
  - 底座: bg rgb(1, 68, 28)
  - 文字 "GET ₹1700" 多色显示 (白/绿/金)
- 图标使用原站 SVG sprite (各有独特多色设计)

### 侧边菜单

- 由 Menu Tab 触发
- 从左侧滑入，宽度 280px
- 背景: #1A1D1D
- 遮罩: rgba(0,0,0,0.6), 点击关闭
- transform: translateX(-100%) -> translateX(0), 300ms ease-out
- 顶部: 绿色渐变促销 Banner
- 两组菜单项:
  - 游戏分类: Favourite! / Weekly Raffle (Hot) / Crash (Hot) / Live / Slots / Table Game / Fishing / Lotto
  - 分割线
  - 功能入口: Notifications / Hot Event / Gift Code / VIP Club / Affiliate / GET ₹1700 / Live Support
- 每项: 24px 图标 + 14px 白色文字 + 右箭头, px-4 py-3, hover:bg-hover

## 首页内容流

从上到下，精确匹配原站顺序:

> **一期实现策略**: 所有区块在第一期前端均需完整实现 UI 组件。标注 [mock] 的区域使用硬编码 mock 数据展示完整视觉效果，后端 API 在第二期接入。标注 [占位] 的区域在底部 Tab 栏，仅显示图标文字，点击提示即将上线。

1. **促销注册 Banner** -- 绿色渐变背景, "Sign Up & Get 100 Bonuses" + Join Now 按钮
2. **Jackpot of the Day** [mock] -- 两列卡片 (VIP Money Pot 倒计时 / Daily Jackpot 金额动画) + Last Champion 行 + My Turnover 行
3. **Trending Games** [mock] -- 横向滚动大卡片 (142x96px 缩略图 + 游戏名 + 供应商名)
4. **Recent Big Win** [mock] -- 横向跑马灯滚动小卡片 (游戏图标 + 游戏名 + 倍率)
5. **Table Game** -- 标题(图标+文字) + "All >" + 56px 图标横向网格
6. **Slots** -- 同上
7. **Live** -- 同上
8. **Fishing** -- 同上
9. **1GO Selection** -- Tab 切换 (1GO/Deposit/Cashier/Pay/Mega) + 56px 图标横向网格
10. **Crash** -- 同上
11. **Lotto** -- 同上
12. **支付方式 Banner** -- UPI / Paytm / PhonePe / GPay / IMPS / USDT 图标横向展示
13. **37% 首充返现 Banner** [mock] -- 绿色渐变 + "Deposit Now" 按钮
14. **Latest bet & Race** [mock] -- 3 Tab (Latest Bet / High Roller / High Multiplier) + 投注数据表格
15. **供应商网格** -- 4 列, 每格 #323738 bg, 8px 圆角, 部分带 NEW 绿色角标
16. **Community** -- 5 个社交媒体按钮 (各自品牌色背景, 白色图标+文字)
17. **页脚** -- Privacy Policy | Terms Of Service

## 游戏图标网格规范 (各分类区通用)

这是原站的核心展示模式, 区别于之前文档描述的大卡片:

- **容器**: flex, gap-3 (12px), overflow-x: auto, 隐藏滚动条
- **单个游戏项**: 56px 固定宽度, flex-shrink: 0
- **图片**: 56x56px, border-radius: 8px, object-fit: cover
- **游戏名**: 10px, #B0B3B3, text-center, 单行截断 (text-overflow: ellipsis), max-width: 56px
- **间距**: 游戏名与图片间距 4px

**注意**: 原站分类区 (Slots/Live/Crash 等) 使用的是 **56px 小图标网格**, 不是 140px 大卡片。大卡片仅用于 Trending Games 区域。

## 资源使用指南

### SVG 图标 (Resources/icons/)

所有 SVG 图标已从原站 sprite 精确复刻并导出为独立文件，存放在 `ui/Resources/icons/` 目录。

**前端实现方式 (推荐):**
1. 将 SVG 文件转为 React 组件 (推荐 SVGR 工具或手动转换)
2. 或使用 SVG sprite sheet 合并引用
3. 各图标保留了原站的多色设计 (绿+灰为主)，不要改为单色

**图标清单:**
- 底部 Tab: `menu-tab.svg`, `explore-tab.svg`, `raffle-tab.svg`, `quest-tab.svg`
- 游戏分类: `table-game.svg`, `slots.svg`, `live-casino.svg`, `fishing.svg`, `crash.svg`, `lotto.svg`
- 侧边菜单: `favourite.svg`, `weekly-raffle.svg`, `notifications.svg`, `hot-event.svg`, `gift-code.svg`, `vip-club.svg`, `affiliate.svg`, `live-support.svg`, `info-circle.svg`
- 社交媒体: `telegram.svg`, `facebook.svg`, `instagram.svg`, `whatsapp.svg`, `youtube.svg`
- 通用 UI: `chevron-right.svg`, `chevron-left.svg`, `close.svg`, `trophy.svg`, `heart.svg`

### Design Tokens

前端项目初始化时应集成以下设计系统文件:

- **`Resources/tokens.css`**: 完整 CSS 变量，可在全局样式中 `@import`
- **`Resources/tailwind.config.js`**: 直接合并到项目 `tailwind.config.js` 的 `theme.extend` 中

这两个文件定义了全局设计系统，所有页面共用。

### 品牌素材 (开发阶段可用原站 CDN)

开发阶段可直接引用原站 CDN URL，生产环境需迁移到自有 CDN:

```
// Logo (h-8, 约 124x32px)
https://1goplus.com/png/newlogo-a2586KU_.png

// Hot Event 头部图标 (40x44px)
https://1goplus.com/png/hotevent-GYxqVDim.png

// GET 1700 Tab 图片 (147x102px, transform: scale(1.35))
https://1goplus.com/png/tab200-etZXx2_Z.png

// 游戏大缩略图 (Trending Games, 142x96px)
https://1goplus.com/static/game/img/{provider}/{filename}.png

// 游戏小图标 (分类网格, 56x56px)
https://1goplus.com/static/game/icon/{provider}/{filename}.png
```

详细的资源清单和占位方案见 `Resources/assets-manifest.md`。

## 前端注意事项

1. **布局方案 (最重要)**: 使用 `flex flex-col h-screen overflow-hidden` 容器，不要用 `position: fixed`。header/nav 用 `shrink-0`，main 用 `flex-1 overflow-y-auto`。fixed 元素在宽屏下会脱离 430px 居中容器。
2. **顶部栏半透明**: 使用 `backdrop-filter: blur(10px)` + 半透明背景色, 不是纯色
3. **底部栏颜色**: 是 #323738 (rgb(50,55,56)), 不是 #1A1D1D
4. **Sign Up 按钮**: 是绿色渐变 `linear-gradient(90deg, #24EE89, #9FE871)`, 不是纯绿
5. **GET 1700**: 使用原站图片, transform: scale(1.35) 实现突出效果
6. **游戏图标**: 分类区用 56px 小图标, 不是大卡片
7. **横向滚动**: `-webkit-scrollbar: none; scrollbar-width: none` 隐藏滚动条
8. **安全区**: `padding-bottom: env(safe-area-inset-bottom)` 适配 iPhone
9. **图片懒加载**: 所有图片使用 `loading="lazy"`
10. **侧边菜单**: 使用 `position: absolute` (相对于 430px 容器)，不是 `fixed`。动画用 transform (不是 left/right)
11. **z-index 层级**: 顶部栏 1000 > 侧边菜单 1001/1002 > 底部栏 999
12. **图标引用**: SVG 图标从 `Resources/icons/` 引用，不要使用外部 CDN 图标库替代

## 需要人工提供的资源

生产环境需要自行托管以下资源 (开发阶段可引用原站 CDN)。详见 `Resources/assets-manifest.md`:

- [ ] GO PLUS Logo PNG/SVG
- [ ] Hot Event 动图/PNG
- [ ] GET 1700 Tab 装饰图片
- [ ] 游戏缩略图 (从游戏供应商 API 获取)
- [ ] 供应商 Logo (部分可用文字替代)
- [ ] 促销 Banner 装饰素材
- [ ] AvertaStd 字体文件 (WOFF2, 3个字重)
