# 资源交付清单 -- 首页布局与导航

> 需求: homepage-navigation | 角色: ui | 更新: 2026-03-04

## AI 可生成资源 (已交付)

| # | 资源 | 文件路径 | 类型 | 状态 | 说明 |
|---|------|----------|------|------|------|
| 1 | Menu Tab 图标 | `icons/menu-tab.svg` | SVG | 已交付 | 底部 Tab 菜单图标 (四方块, 右上绿色)，原站 sprite 精确复刻 |
| 2 | Explore Tab 图标 | `icons/explore-tab.svg` | SVG | 已交付 | 底部 Tab 搜索图标 (放大镜+星)，原站 sprite 精确复刻 |
| 3 | Raffle Tab 图标 | `icons/raffle-tab.svg` | SVG | 已交付 | 底部 Tab Raffle 图标 (票券)，原站 sprite 精确复刻 |
| 4 | Quest Tab 图标 | `icons/quest-tab.svg` | SVG | 已交付 | 底部 Tab Quest 图标 (礼物盒)，原站 sprite 精确复刻 |
| 5 | Favourite 图标 | `icons/favourite.svg` | SVG | 已交付 | 侧边菜单收藏 (手形爱心)，绿色 |
| 6 | Weekly Raffle 图标 | `icons/weekly-raffle.svg` | SVG | 已交付 | 侧边菜单 Weekly Raffle (票券)，双色 |
| 7 | Crash 图标 | `icons/crash.svg` | SVG | 已交付 | 侧边菜单/分类区 Crash (飞机+火焰) |
| 8 | Live Casino 图标 | `icons/live-casino.svg` | SVG | 已交付 | 侧边菜单/分类区 Live (摄像机+圆点) |
| 9 | Slots 图标 | `icons/slots.svg` | SVG | 已交付 | 侧边菜单/分类区 Slots (老虎机) |
| 10 | Table Game 图标 | `icons/table-game.svg` | SVG | 已交付 | 侧边菜单/分类区 Table Game (扑克牌) |
| 11 | Fishing 图标 | `icons/fishing.svg` | SVG | 已交付 | 侧边菜单/分类区 Fishing (鱼竿+鱼) |
| 12 | Lotto 图标 | `icons/lotto.svg` | SVG | 已交付 | 侧边菜单/分类区 Lotto (彩球) |
| 13 | Notifications 图标 | `icons/notifications.svg` | SVG | 已交付 | 侧边菜单通知铃铛 |
| 14 | Hot Event 图标 | `icons/hot-event.svg` | SVG | 已交付 | 侧边菜单 Hot Event (火焰+星星) |
| 15 | Gift Code 图标 | `icons/gift-code.svg` | SVG | 已交付 | 侧边菜单 Gift Code (礼物盒) |
| 16 | VIP Club 图标 | `icons/vip-club.svg` | SVG | 已交付 | 侧边菜单 VIP Club (皇冠) |
| 17 | Affiliate 图标 | `icons/affiliate.svg` | SVG | 已交付 | 侧边菜单 Affiliate (网络节点) |
| 18 | Live Support 图标 | `icons/live-support.svg` | SVG | 已交付 | 侧边菜单客服 (耳机) |
| 19 | Info Circle 图标 | `icons/info-circle.svg` | SVG | 已交付 | GET 1700 信息图标 |
| 20 | Telegram 图标 | `icons/telegram.svg` | SVG | 已交付 | 社交媒体 Telegram (纸飞机) |
| 21 | Facebook 图标 | `icons/facebook.svg` | SVG | 已交付 | 社交媒体 Facebook |
| 22 | Instagram 图标 | `icons/instagram.svg` | SVG | 已交付 | 社交媒体 Instagram (相机) |
| 23 | WhatsApp 图标 | `icons/whatsapp.svg` | SVG | 已交付 | 社交媒体 WhatsApp |
| 24 | YouTube 图标 | `icons/youtube.svg` | SVG | 已交付 | 社交媒体 YouTube |
| 25 | Chevron Right | `icons/chevron-right.svg` | SVG | 已交付 | 通用右箭头，stroke=currentColor |
| 26 | Chevron Left | `icons/chevron-left.svg` | SVG | 已交付 | 通用左箭头，stroke=currentColor |
| 27 | Close 图标 | `icons/close.svg` | SVG | 已交付 | 通用关闭按钮 X，stroke=currentColor |
| 28 | Trophy 图标 | `icons/trophy.svg` | SVG | 已交付 | Jackpot 奖杯，金色 |
| 29 | Heart 图标 | `icons/heart.svg` | SVG | 已交付 | 收藏爱心，绿色 |
| 30 | CSS Design Tokens | `tokens.css` | CSS | 已交付 | 完整 CSS 变量 (颜色/字体/间距/圆角/布局/组件/动画) |
| 31 | Tailwind 扩展配置 | `tailwind.config.js` | JS | 已交付 | theme.extend 配置，前端直接合并使用 |

## 需人工提供资源 (记录 + 占位)

| # | 资源 | 格式 | 来源 | 状态 | 占位方案 | 尺寸要求 |
|---|------|------|------|------|----------|----------|
| 1 | GO PLUS Logo | PNG/SVG | 原站 `newlogo-a2586KU_.png` | 待提供 | merge.html 使用原站 CDN URL (开发用) | height: 32px (约 124x32) |
| 2 | Hot Event 头部图标 | PNG | 原站 `hotevent-GYxqVDim.png` | 待提供 | merge.html 使用原站 CDN URL | 40x44px |
| 3 | GET 1700 Tab 图片 | PNG | 原站 `tab200-etZXx2_Z.png` | 待提供 | merge.html 含 onerror 彩虹圆圈+文字 fallback | 147x102px |
| 4 | 注册 Banner 装饰图 | PNG | 原站 `login-fWVrBuNX.png` | 待提供 | merge.html 含 onerror 隐藏 fallback | 128x96px |
| 5 | Jackpot 奖杯装饰 | PNG | 原站 `trophy-B3u8sNrg-Bogwg3F_.png` | 待提供 | 半透明装饰，缺失不影响布局 | 高度适配卡片 |
| 6 | 用户头像 | PNG | 原站 `8-BgAWkeDv.png` | 待提供 | 纯色圆形占位 | 32x32px |
| 7 | 游戏大缩略图 | PNG/JPG | 原站 CDN / 游戏供应商 API | 待提供 | merge.html 使用原站 CDN URL (开发用) | 142x96px |
| 8 | 游戏小图标 | PNG/JPG | 原站 CDN / 游戏供应商 API | 待提供 | merge.html 使用原站 CDN URL (开发用) | 56x56px |
| 9 | AvertaStd 字体文件 | WOFF2 | 授权来源 | 待提供 | Inter 系统字体降级 | Regular/SemiBold/ExtraBold 三个字重 |
| 10 | 供应商 Logo | PNG/SVG | 各供应商品牌资源 | 待提供 | merge.html 使用文字替代 (原站也以文字为主) | 适配 44px 高度 |

## 关于 merge.html 中外部 URL 的说明

merge.html 作为设计稿预览文件，仅在以下场景使用外部 URL：

1. **Tailwind CDN** (`https://cdn.tailwindcss.com`) -- 设计稿预览工具，不是本地资源
2. **游戏缩略图** (原站 CDN) -- 动态内容，由后端 API 提供，不属于本地静态资源
3. **品牌素材** (Logo、Hot Event、GET 1700 图片等) -- 已记录在"需人工提供资源"中，生产环境需自行托管

所有 **SVG 图标** 均已内嵌在 merge.html 中并同时导出为独立 SVG 文件到 `icons/` 目录。

## 自检清单

- [x] 底部 Tab 栏图标 SVG 已全部交付 (4个: menu-tab, explore-tab, raffle-tab, quest-tab)
- [x] 侧边菜单图标 SVG 已全部交付 (14个: favourite 到 live-support + info-circle)
- [x] 社交媒体图标 SVG 已全部交付 (5个: telegram, facebook, instagram, whatsapp, youtube)
- [x] 通用 UI 图标 SVG 已全部交付 (5个: chevron-right, chevron-left, close, trophy, heart)
- [x] SVG 图标均为原站 sprite 精确复刻，多色设计保持一致
- [x] tokens.css 包含完整 CSS 变量 (颜色/字体/间距/圆角/布局/组件/动画)
- [x] tailwind.config.js 包含 theme.extend 配置
- [x] 需人工提供的资源已逐项记录 (描述、来源、占位方案、尺寸要求)
- [x] merge.html 中 SVG 图标已内嵌 (不依赖外部 URL)
- [x] 资源文件命名 kebab-case，放入对应子目录

## 备注

- 首页是全局设计系统的定义者，tokens.css 和 tailwind.config.js 应作为所有需求的基础配置
- 底部 Tab 栏和侧边菜单图标均来自原站 SVG sprite 精确复刻，保留了原始的多色设计 (绿+灰为主)
- 社交媒体图标使用标准 SVG path，填充色为 white，通过容器背景色区分平台
- 游戏缩略图是动态内容，不属于设计资源范畴，由后端 API + CDN 提供
