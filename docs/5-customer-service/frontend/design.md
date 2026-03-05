# 前端技术方案 -- 客服系统

> 需求: customer-service | 角色: frontend

## 期次分类概览

> **第一期 = 全功能实现。** 客服 UI 全部在第一期完成，在线聊天为前端 Mock。

| 组件 | 期次 | 数据来源 | 说明 |
|------|------|----------|------|
| LiveChatWidget | 一期 Mock | 前端 Mock 自动回复 | 在线客服对话窗口，后续接入第三方 SDK |
| LiveChatBubble | 一期全功能 | - | 右下角悬浮按钮 |
| ChatMessage | 一期全功能 | - | 消息气泡 |
| MockAutoReply | 一期 Mock | 前端硬编码回复 | Mock 自动回复逻辑 |
| SocialMediaLinks | 一期全功能 | 真实 API `/support/links` | 社交媒体链接 |

## 技术栈

同项目统一前端栈: React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Axios

## 页面与组件结构

### 组件结构

```
src/pages/
  support/
    SupportPage.tsx               -- 客服入口页面 (非必须, 可直接弹窗)
    components/
      LiveChatWidget.tsx          -- 在线客服对话窗口 (Mock)
      LiveChatBubble.tsx          -- 右下角悬浮客服按钮
      ChatMessage.tsx             -- 对话消息气泡
      MockAutoReply.tsx           -- Mock 自动回复逻辑

src/components/
  footer/
    SocialMediaLinks.tsx          -- 社交媒体链接组件 (页脚复用)
```

## 交互设计

### Live Support 入口

1. 侧边菜单 "Live Support" -> 打开 LiveChatWidget 对话窗口
2. 对话窗口: 底部弹出覆盖面板
   - 高度: 85vh
   - 背景: #232626
   - 顶部圆角: 16px (rounded-t-2xl)
   - 滑入动画: 300ms ease-out (从底部上滑)
   - 遮罩层: bg-black/60, 点击关闭
   - 客服头像: 32px 圆形, bg brand/20
   - 消息气泡 — 客服: bg #2A2D2D, 圆角 4px/12px/12px/12px (不对称)
   - 消息气泡 — 用户: bg #24EE89, 圆角 12px/4px/12px/12px, 黑色文字
   - 打字指示器: 3 个 8px 圆点 bounce 动画, 间隔 150ms
   - 输入栏: 全圆角输入框 + 40px 圆形发送按钮 (bg #24EE89)

### Mock 对话窗口

```
[Live Support]                [X 关闭]

  [客服头像] Hi! Welcome to GO PLUS.
             How can I help you today?

  [用户] I have a deposit issue.

  [客服头像] Thank you for reaching out.
             Our team will assist you shortly.
             In the meantime, you can also
             contact us via:
             - Telegram: @goplus_support
             - WhatsApp: +91 9999999999

  [输入消息...]              [发送]
```

### Mock 自动回复

预设回复规则:
- 发送任何消息 -> 延迟 1-2s -> 回复通用消息
- 关键词 "deposit" / "充值" -> 充值相关引导
- 关键词 "withdraw" / "提现" -> 提现相关引导
- 其他 -> "Our agent will respond shortly."

### 社交媒体链接 (页脚)

```
[Telegram 卡片]  [Facebook 卡片]
[WhatsApp 卡片]  [Instagram 卡片]
[YouTube 卡片 (单独一行, w-fit)]
```

- 2 列网格布局 (grid-cols-2 gap-3)
- 彩色品牌色卡片:
  - Telegram: bg #0088CC
  - Facebook: bg #1877F2
  - Instagram: bg 渐变 (#833AB4 → #FD1D1D → #F77737)
  - WhatsApp: bg #25D366
  - YouTube: bg #FF0000 (单独一行)
- 卡片样式: 圆角 12px, padding 12px 16px, 白色图标 + 平台名称
- 点击跳转对应外部平台 (window.open / Capacitor browser)

## API 对接

```typescript
// src/api/support.ts
export const supportApi = {
    getLinks: () => get('/support/links'),
    getLiveChat: () => get('/support/live-chat'),
};
```

## 关键决策

- 在线客服第一期为纯前端 Mock，不需要后端 WebSocket
- 对话记录仅保存在当前会话 (不持久化)
- 社交媒体链接在页脚和侧边菜单中同时展示
- 后续接入第三方客服时替换 LiveChatWidget 为 SDK 组件

## 依赖与约束

- LiveChatWidget 为全局可触发组件
- 社交媒体链接数据可从首页聚合 API 获取
- 外部链接跳转需考虑 Tauri/Capacitor 的浏览器打开方式
