# 客服系统

> 提供在线客服和社交媒体客服渠道，确保用户遇到问题时能及时获得帮助

## 目标

1. 用户可以通过在线客服实时与客服人员沟通
2. 用户可以通过社交媒体渠道联系客服 (Telegram, WhatsApp, Facebook, Instagram)
3. 客服入口在应用各处易于找到

## 范围

**包含:**

- 在线客服 (Live Support) 入口和对话窗口
- 社交媒体客服链接 (Telegram, WhatsApp, Facebook, Instagram, YouTube)
- 侧边菜单中的 "Live Support" 入口
- 页脚中的社区/联系方式区

**不包含 (不属于本需求范围):**

- 自建客服系统/工单系统
- 真实第三方客服 SDK 接入 (第一期使用 mock 对话窗口，后端提供 mock 消息)
- AI 自动回复/机器人客服
- 帮助中心/FAQ 页面

## 核心用户场景

- 场景 A: 用户充值未到账，点击 "Live Support" 入口，页面底部滑出聊天面板 (85vh 高度, 圆角顶部)，与客服实时文字对话
- 场景 B: 客服正在输入回复时，用户看到三个跳动圆点的输入指示器
- 场景 C: 用户对话完毕，点击面板右上角关闭按钮 (X) 或点击半透明遮罩关闭面板
- 场景 D: 用户更习惯使用社交媒体，在 Community 区域看到 2x2 网格的社交链接 (Telegram/Facebook/Instagram/WhatsApp) + 单独一行 YouTube，点击跳转对应平台
- 场景 E: 用户在游戏中遇到问题，通过 WhatsApp 联系客服

## 时间线

| 里程碑 | 目标日期 | 状态 |
|--------|----------|------|
| 需求确认 | 2026-03-04 | 已完成 |
| 开发完成 | - | 待办 |
| 测试通过 | - | 待办 |

## 背景

客服是运营平台的基础保障，特别是涉及资金交易的平台。根据 UI 设计图纸 (merge.html)，客服通过侧边菜单 "Live Support" 入口接入第三方在线客服，同时在 Community 区提供 Telegram、Facebook、Instagram、WhatsApp、YouTube 等社交媒体联系方式。客服功能本身较轻量，核心是接入和入口设计。

## 验收清单

### 功能验收

- [ ] 点击 "Live Support" 入口，底部滑出聊天面板覆盖层
- [ ] 在线客服支持实时文字对话 (第一期为 mock 对话)
- [ ] 用户可以在输入框中输入消息并发送
- [ ] 客服输入时显示打字指示器 (三个跳动圆点)
- [ ] 点击关闭按钮 (X) 或遮罩层可关闭聊天面板
- [ ] Community 区域展示 5 个社交媒体链接 (Telegram, Facebook, Instagram, WhatsApp, YouTube)
- [ ] 社交媒体链接点击后正确跳转到对应平台
- [ ] 客服入口在应用各主要页面均可访问 (通过侧边菜单)

### 视觉还原验收 (前端 1:1 还原 merge.html 设计稿)

**聊天面板覆盖层:**

- [ ] 覆盖层: fixed 全屏, z-index 70, 最大宽度 430px 居中
- [ ] 遮罩层: 黑色 60% 透明度 (bg-black/60), 点击可关闭
- [ ] 聊天面板: 绝对定位底部, 高度 85vh, 背景 #232626, 顶部圆角 16px (rounded-t-2xl)
- [ ] 打开/关闭: 垂直滑入/滑出动画, transition 300ms ease-out

**聊天头部:**

- [ ] 高度 48px (h-12), 底部分割线 #3A3D3D
- [ ] 左侧: "Live Support" 白色 sm bold
- [ ] 右侧: 关闭按钮 (X 图标, 32x32px, #6B7070)

**聊天消息区:**

- [ ] 可滚动区域, 高度 = 85vh - 48px(头部) - 56px(输入栏)
- [ ] 时间戳: 居中, 10px, #6B7070 (如 "Today 14:30")
- [ ] 客服消息 (左侧): 左侧 32x32px 圆形头像 (背景 brand/20, 聊天图标 #24EE89) + 消息气泡
- [ ] 客服气泡: 背景 #2A2D2D, 圆角 4px/12px/12px/12px (左上小圆角), 最大宽度 75%, padding 8px 12px
- [ ] 用户消息 (右侧): 右对齐, 无头像
- [ ] 用户气泡: 背景 #24EE89, 圆角 12px/4px/12px/12px (右上小圆角), 文字深色, 最大宽度 75%
- [ ] 打字指示器: 客服头像 + 气泡内 3 个 8x8px 圆点 (#6B7070), bounce 动画, 间隔 150ms

**聊天输入栏:**

- [ ] 顶部分割线 #3A3D3D, padding 8px 16px
- [ ] 输入框: 全圆角 (rounded-full), 高度 40px, 背景 #2A2D2D, placeholder "Type a message..." 白色 sm
- [ ] 发送按钮: 40x40px 圆形, 背景 #24EE89, 纸飞机图标深色, hover 变 #1DBF6E

**Community 社交链接区:**

- [ ] 标题: "Community" 白色 base bold
- [ ] 2 列网格 (grid-cols-2 gap-3), 每项为彩色圆角卡片
- [ ] 卡片结构: 品牌色背景 + 左侧 20x20px SVG 图标 (白色) + 平台名称 (白色 sm bold)
- [ ] Telegram: 背景 #0088CC; Facebook: 背景 #1877F2; Instagram: 渐变 #833AB4 > #FD1D1D > #F77737; WhatsApp: 背景 #25D366
- [ ] YouTube: 单独一行, 背景 #FF0000, 宽度 auto (w-fit)
- [ ] 所有卡片: 圆角 lg, padding 12px 16px, hover opacity 90%

**整体风格:**

- [ ] 深色主题: 页面背景 #232626
- [ ] 字体使用 AvertaStd（降级 Inter），字号/字重与 merge.html 规范一致
