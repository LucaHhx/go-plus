# 首页布局与导航

> 提供平台整体布局框架、首页内容展示和全局导航系统，是用户的第一印象和所有功能的入口

## 目标

1. 用户打开应用看到完整的首页内容流 (Banner > 游戏分类 > 供应商等)
2. 用户可以通过底部 Tab 栏在主要页面间切换
3. 用户可以通过侧边菜单访问所有功能模块
4. 用户可以通过顶部栏快速访问注册/登录、余额、通知
5. 首页各游戏分类区支持横向滚动浏览和 "All >" 跳转

## 范围

**包含:**

- 固定顶部栏: Logo + Sign In/Sign Up 按钮(未登录) 或 余额+充值按钮(已登录)
- 固定底部 Tab 栏: Menu / Explore / GET 1700 / Raffle / Quest (Menu + Explore 可用，GET 1700/Raffle/Quest 显示占位页)
- 侧边抽屉菜单: 游戏分类入口 + 功能模块入口
- 首页内容流 (从上到下，与 merge.html 完全一致，全部第一期交付):
  - 欢迎奖金 Banner (轮播)
  - 奖池区 Jackpot of the Day (VIP Money Pot + Daily Jackpot + Last Champion + My Turnover) -- 后端 mock
  - Trending Games 热门游戏区 (大卡片 142x96px 横向滚动) -- 后端 mock
  - 大赢家区 Recent Big Win (marquee 无限滚动卡片) -- 后端 mock
  - 游戏分类横向滚动区: Table Game / Slots / Live / Fishing
  - 1GO Selection 区 (含 Sub-Tab 切换: 1GO/Deposit/Cashier/Pay/Mega + 游戏图标横向滚动) -- 后端 mock
  - 游戏分类横向滚动区 (续): Crash / Lotto
  - 每个分类区有 "All >" 链接跳转到完整列表
  - 支付方式展示 (UPI/Paytm/PhonePe/GPay/IMPS/USDT)
  - 37% 首存返现 Banner (渐变绿底 + "Deposit Now" 按钮) -- 后端 mock
  - 实时投注动态区 Latest Bet & Race (Latest Bet / High Roller / High Multiplier 三 Tab + 表格) -- 后端 mock
  - 供应商网格 (4 列网格，含 NEW 角标)
  - 社区链接 (Telegram/facebook/Instagram/WhatsApp/YouTube) + 页脚 (Privacy Policy/Terms Of Service)
- 深色主题 (#232626 背景, #24EE89 强调色)
- 移动优先响应式布局 (~430px)

**后端 mock 组件 (前端 1:1 还原设计稿，后端提供 mock 数据):**

- 奖池区 Jackpot of the Day -- 后端提供 mock 奖池金额/倒计时/冠军数据
- Trending Games 热门游戏区 -- 后端提供 mock 游戏列表 (可复用已有 seed 数据)
- 大赢家区 Recent Big Win -- 后端提供 mock 中奖记录
- 1GO Selection 区 -- 后端提供 mock 游戏列表 (含 Sub-Tab 分类数据)
- 37% 首存返现 Banner -- 后端提供 mock 活动配置 (前端静态展示，点击无实际功能)
- 实时投注动态区 Latest Bet / High Roller / High Multiplier -- 后端提供 mock 投注记录

**占位页 (Tab 图标可见，点击显示 "Coming Soon"):**

- GET 1700 Tab -- 点击弹出占位提示
- Raffle Tab -- 点击弹出占位提示
- Quest Tab -- 点击弹出占位提示

**不包含:**

- 无 (首页设计稿上所有可见区域均在第一期交付)

## 核心用户场景

- 场景 A: 新用户首次打开应用，看到与 UI 设计图纸 (merge.html) 完全一致的深色主题首页，顶部有 "Sign In" 和 "Sign Up" 按钮，下方是欢迎奖金 Banner 轮播，继续向下滚动看到各分类游戏横向滚动区，整体布局和视觉风格与设计图纸无差异
- 场景 B: 已登录用户在首页向下滚动，看到 Slots 区域几个感兴趣的游戏，点击 "All >" 进入 Slots 完整列表
- 场景 C: 用户点击底部 Tab "Explore"，进入完整游戏大厅页面
- 场景 D: 用户点击底部 Tab "Menu" 或左上角菜单图标，侧边菜单从左侧滑出（动效与设计图纸一致），看到全部功能入口，菜单项的图标和排列与设计图纸完全一致
- 场景 E: 用户在侧边菜单中点击 "Live"，直接跳转到 Live 分类的游戏列表
- 场景 F: 用户使用手机竖屏浏览首页，页面适配效果与设计图纸的移动端布局完全一致

## 时间线

| 里程碑 | 目标日期 | 状态 |
|--------|----------|------|
| 需求确认 | 2026-03-04 | 已完成 |
| 开发完成 | - | 待办 |
| 测试通过 | - | 待办 |

## 背景

首页和导航是用户接触平台的第一印象，也是所有功能的入口。根据 UI 设计图纸，采用移动优先设计，深色背景 + 亮绿强调色，固定顶栏和底栏，中间内容区可滚动。首页是一个长滚动信息流，展示各种游戏分类和运营内容。底部 5 个 Tab 是主要导航，侧边菜单提供完整功能目录。

## 验收清单

### 功能验收

- [ ] 首页加载后展示完整的深色主题布局 (背景 #232626, 强调色 #24EE89)
- [ ] 顶部栏固定显示: 未登录时显示 Sign In + Sign Up 按钮，已登录时显示余额 + 充值按钮
- [ ] 底部 Tab 栏固定显示 5 个 Tab，Menu 和 Explore 可点击跳转，其余 3 个 Tab 显示占位（点击不跳转或提示即将上线）
- [ ] 欢迎奖金 Banner 支持轮播展示，自动轮播 + 手动滑动
- [ ] 首页展示各游戏分类区 (Table Game/Slots/Live/Fishing/Crash/Lotto)，每区支持横向拖动滚动
- [ ] 每个分类区有 "All >" 按钮，点击跳转到对应分类完整列表
- [ ] 点击底部 Tab "Menu" 或顶部菜单图标，侧边菜单从左侧滑出
- [ ] 侧边菜单包含游戏分类入口 (Favourite/Weekly Raffle/Crash/Live/Slots/Table Game/Fishing/Lotto) 和功能入口 (Notifications/Hot Event/Gift Code/VIP Club/Affiliate/GET 1700/Live Support)
- [ ] 侧边菜单点击游戏分类项可跳转到对应分类列表
- [ ] 页面底部展示供应商网格、社区链接 (Telegram/facebook/Instagram/WhatsApp/YouTube) 和页脚 (Privacy Policy/Terms Of Service)
- [ ] 整体布局为移动优先 (~430px 最大宽度)，竖屏优先
- [ ] 滚动时顶部栏和底部 Tab 栏始终固定可见

### 后端 mock 组件验收 (前端视觉与 merge.html 1:1，数据为 mock)

- [ ] 奖池区 (Jackpot of the Day): 左侧 VIP Money Pot 卡片(灰底 #323738) + 右侧 Daily Jackpot 卡片(绿色渐变底); 倒计时动效(countdownPulse); 金额脉冲动效(jackpotPulse); Last Champion 行(头像+名字+金额); My Turnover 行(数值+GO BET 按钮); 数据为 mock
- [ ] Trending Games: 大卡片横向滚动(trending-card 142x96px, 圆角 8px); 游戏名 12px 白色 + 供应商名 10px #6B7070; hover scale(1.05); 数据为 mock (可复用已有 seed 游戏)
- [ ] Recent Big Win: marquee 无限滚动(marqueeScroll 20s linear infinite); bigwin-card(140px 宽, 背景 #323738, 圆角 8px); 游戏缩略图 48x48px + 游戏名 + 倍数(绿色); 卡片内容重复拼接实现无缝循环; 数据为 mock
- [ ] 37% 首存返现 Banner: 渐变绿底(linear-gradient 90deg #24EE89 -> #0d6b32); 黑色粗体文案 "37% First Deposit Cash Back"; 右侧 "Deposit Now" 黑底绿字按钮; 圆角 12px; 点击无实际功能
- [ ] 实时投注动态区 (Latest Bet & Race): 三个 Tab(Latest Bet/High Roller/High Multiplier), 选中态 #323738 背景白字, 未选中 #6B7070; 表格 3 列(Game/Player/Profit); bet-row grid 布局; 正收益绿色(#24EE89), 零收益灰色(#6B7070); 数据为 mock
- [ ] 1GO Selection 区: 标题含 1GO 图标 + "1GO Selection" + "All >" 链接; Sub-Tab 切换 (1GO/Deposit/Cashier/Pay/Mega); 游戏图标横向滚动; 数据为 mock
- [ ] 首页内容流顺序与 merge.html 完全一致: 促销Banner > Jackpot > Trending Games > Recent Big Win > Table Game > Slots > Live > Fishing > 1GO Selection > Crash > Lotto > 支付方式 > 37%返现Banner > Latest Bet & Race > 供应商网格 > 社区 > 页脚

### 视觉还原验收 (与 UI 设计图纸 1:1 一致)

**整体布局:**

- [ ] 页面最大宽度 430px，水平内边距 16px (px-4)
- [ ] 深色主题背景色 #232626，不支持浅色模式
- [ ] 字体使用 AvertaStd（降级 Inter > system-ui），区块标题 16px/extrabold，正文 14px，辅助 12px，Tab 文字 10px
- [ ] 首页内容流顺序 (从上到下，与 merge.html 完全一致): 促销Banner > 奖池区(mock) > Trending Games(mock) > Recent Big Win(mock) > Table Game > Slots > Live > Fishing > 1GO Selection(mock) > Crash > Lotto > 支付方式 > 37%首存返现Banner(mock) > 实时投注动态(mock) > 供应商网格 > 社区链接 > 页脚

**顶部栏:**

- [ ] 高度 56px，固定在页面顶部，z-index 最高层
- [ ] 背景色 rgba(50,55,56,0.85) 半透明 + backdrop-filter: blur(10px) 毛玻璃效果
- [ ] 左侧: Logo 图片 (高度约 32px)
- [ ] 中间偏右: Hot Event 图标 (40x44px)
- [ ] 右侧 (未登录): "Sign In" 白色文字无背景 + "Sign Up" 渐变背景按钮 (linear-gradient(90deg, #24EE89, #9FE871))，字号 16px，字重 800，高度 40px
- [ ] 右侧 (已登录): 余额显示 + 充值按钮

**底部 Tab 栏:**

- [ ] 高度 64px，固定在页面底部，背景色 #323738
- [ ] 5 个 Tab: Menu / Explore / GET 1700 / Raffle / Quest
- [ ] 选中态: 图标 + 文字颜色 #24EE89；未选中: #6B7070
- [ ] Tab 文字 10px，font-semibold
- [ ] 图标使用设计稿 SVG 图标（各有独特设计，非通用图标）
- [ ] GET 1700 Tab 居中突出，使用设计稿图片 (147x102px)，scale(1.35) 上移突出底部栏，下方绿色底座

**Banner 轮播:**

- [ ] 圆角 12px (rounded-xl)
- [ ] 绿色渐变背景，包含 "Sign Up & Get 100 Bonuses" 文案 + "Join Now" 按钮 + 右侧装饰图
- [ ] Banner 图片使用设计稿资源或同等质量素材（非空白占位）
- [ ] 轮播指示器样式与设计图纸一致

**游戏分类横向滚动区:**

- [ ] 每个分类区: 左侧分类标题 (16px, extrabold) + 右侧 "All >" 链接 (#B0B3B3)
- [ ] 游戏图标: 56x56px，圆角 8px，横向排列，间距 12px (gap-3)
- [ ] 游戏名: 10px, #B0B3B3, 居中, 单行截断
- [ ] 横向可拖动滚动，隐藏滚动条
- [ ] 6 个分类区 (Table Game/Slots/Live/Fishing/Crash/Lotto) 依次排列

**侧边抽屉菜单:**

- [ ] 宽度 280px，从左侧滑出，动画 300ms ease-out
- [ ] 背景色 #1A1D1D，遮罩 rgba(0,0,0,0.6)
- [ ] 顶部: 绿色渐变促销 Banner "Sign up & Get 100 Bonuses"
- [ ] 游戏分类组 8 项: Favourite!/Weekly Raffle(Hot 标签)/Crash(Hot 标签)/Live/Slots/Table Game/Fishing/Lotto
- [ ] 分割线后功能入口组 7 项: Notifications/Hot Event/Gift Code/VIP Club/Affiliate/GET 1700/Live Support
- [ ] 每项: 图标 24px + 文字 14px/semibold/white + 右箭头，内边距 px-4 py-3
- [ ] 各菜单项图标使用设计稿 SVG 图标（非通用图标库）

**供应商网格:**

- [ ] 4 列网格布局，间距 8px (gap-2)
- [ ] 单项: 背景 #323738，圆角 8px，高度 44px，居中显示供应商名/Logo
- [ ] 新供应商带 "NEW" 角标: 左上角绿色 (#24EE89) 背景 + 黑色文字

**社区与页脚:**

- [ ] 社交媒体按钮使用各自品牌色背景: Telegram (#229ED9) / facebook (#1877F2) / Instagram (渐变) / WhatsApp (#25D366) / YouTube (#FF0000)
- [ ] 按钮样式: inline-flex, px-5 py-2.5, 圆角 8px, 白色图标+文字
- [ ] 页脚: "Privacy Policy | Terms Of Service" 居中显示

**图片与资源:**

- [ ] Logo 使用设计稿图片资源（非纯文字替代）
- [ ] Hot Event 图标使用设计稿图片
- [ ] GET 1700 Tab 使用设计稿图片
- [ ] 底部 Tab 栏图标、侧边菜单图标使用设计稿 SVG 图标
- [ ] Banner 装饰图使用设计稿资源
- [ ] 游戏缩略图正确显示（非灰色占位块）
