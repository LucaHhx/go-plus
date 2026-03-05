# 赌场游戏大厅

> 提供多供应商、多分类的游戏浏览、筛选、搜索和启动功能，是平台核心产品体验

## 目标

1. 用户可以按分类浏览游戏 (Slots, Live, Crash, Table Game, Fishing, Lotto)
2. 用户可以按供应商筛选游戏 (18+ 家供应商)
3. 用户可以搜索游戏
4. 用户可以收藏游戏并在 "My Fav" 中查看
5. 用户可以查看最近玩过的游戏 (Recent)
6. 用户可以启动游戏进入游戏界面
7. 系统展示 New 标签标记新上线游戏

## 范围

**包含:**

- 游戏分类体系: All Games / New / Recent / My Fav / Slots / Live / Crash / Table Game / Fishing / Lotto
- 游戏供应商筛选: JILI, Spribe, JDB, Evolution, INOUT, Hacksaw, PG, Playtech, TurboGames, MG, Habanero, SA Gaming, NetEnt, Nolimit City, Red Tiger, BigTimeGaming, TAP-A-ROO, Ezugi, EENI
- 游戏搜索功能
- 游戏收藏 (My Fav)
- 最近游玩记录 (Recent)
- 游戏缩略图展示 (网格布局)
- 游戏启动 (跳转到第三方游戏)
- 游戏供应商 Logo 展示区

**不包含 (不属于本需求范围):**

- 游戏内嵌开发 (游戏由第三方供应商提供)
- 体育博彩 (GO BET)
- 奖池展示 (归属 2-homepage-navigation)
- Trending Games / 大赢家展示 (归属 2-homepage-navigation)

## 核心用户场景

- 场景 A: 用户进入 Explore 页面，看到游戏大厅布局（标题栏 > 搜索框 > 分类胶囊Tab > 筛选下拉 > 游戏网格），点击分类 Tab 胶囊按钮筛选对应游戏
- 场景 B: 用户想找特定游戏，在页面顶部搜索框中输入游戏名称，搜索结果实时展示匹配的游戏；输入内容后右侧出现清除按钮可一键清空
- 场景 C: 用户想看某个供应商的全部游戏，通过供应商下拉筛选器选择 "JILI"，页面展示该供应商所有游戏
- 场景 D: 用户同时使用分类 Tab 和供应商筛选器组合筛选，例如选择 "Slots" 分类 + "JILI" 供应商，只显示 JILI 的老虎机游戏
- 场景 E: 用户看到喜欢的游戏，点击收藏按钮，游戏出现在 "My Fav" 分类中
- 场景 F: 未登录用户点击收藏按钮，系统弹出登录提示，引导用户登录后再收藏
- 场景 G: 用户点击游戏缩略图（卡片样式与设计图纸一致），进入游戏加载页面，加载完成后开始游戏
- 场景 H: 用户退出游戏后，该游戏自动出现在 "Recent" 分类中
- 场景 I: 新用户首次访问 "My Fav"，看到空状态提示 "No favourite games yet"；首次访问 "Recent"，看到空状态提示 "No recently played games"
- 场景 J: 用户搜索一个不存在的游戏名称，看到空状态提示 "No games found"

## 时间线

| 里程碑 | 目标日期 | 状态 |
|--------|----------|------|
| 需求确认 | 2026-03-04 | 已完成 |
| 开发完成 | - | 待办 |
| 测试通过 | - | 待办 |

## 背景

游戏大厅是平台的核心产品页面，用户在此浏览和选择游戏。根据 UI 设计图纸 (merge.html)，游戏以缩略图网格形式展示，顶部有分类 Tab + 类型/供应商组合筛选 + 搜索。首页也包含各分类游戏的横向滚动展示区，但完整的游戏浏览在 Explore 页面。游戏本身由第三方供应商提供，平台负责展示、分类和启动跳转。

## 验收清单

### 功能验收

- [ ] 游戏按 6 个主分类 (Slots/Live/Crash/Table Game/Fishing/Lotto) 正确展示
- [ ] 特殊分类 (All Games/New/Recent/My Fav) 正确工作
- [ ] 供应商筛选器包含全部 18+ 家供应商，筛选结果正确
- [ ] 分类 + 供应商可组合筛选，结果为两个条件的交集
- [ ] 搜索框支持按游戏名称搜索，输入时实时展示结果（防抖 300ms）
- [ ] 用户可以收藏/取消收藏游戏，My Fav 列表同步更新
- [ ] 未登录用户点击收藏按钮时弹出登录提示
- [ ] 最近玩过的游戏按时间倒序展示在 Recent 中
- [ ] 点击游戏可以成功启动并进入游戏界面
- [ ] 新游戏有 "New" 标签标记
- [ ] 页面底部展示所有游戏供应商 Logo，点击跳转到该供应商筛选结果
- [ ] My Fav 无收藏、Recent 无记录、搜索无结果时展示对应空状态提示
- [ ] 游戏网格支持无限滚动加载，加载中显示骨架屏

### 视觉还原验收 (前端 1:1 还原 merge.html 设计稿)

**页面布局:**

- [ ] Explore 页面在全局 AppShell 框架内（有底部 Tab 栏），非全屏沉浸式
- [ ] 标题栏 (page-header): 高度 56px，背景 #232626，sticky 置顶
- [ ] 标题栏: 左侧返回箭头 (白色) + 居中 "ALL GAMES" (白色, 16px, font-weight 800) + 右侧搜索图标 (#24EE89 品牌色)
- [ ] 布局从上到下: 标题栏 > 搜索框 > 分类 Tab 栏 > 筛选下拉行 > 游戏网格 > 加载更多指示器 > 供应商 Logo 网格
- [ ] 游戏网格 3 列等宽 (grid-cols-3)，水平间距 8px (gap-x-2)，垂直间距 12px (gap-y-3)
- [ ] 内容区水平内边距 16px (px-4)，底部预留 Tab 栏空间 (pb-20)

**搜索框 (默认可见，位于标题栏下方):**

- [ ] 搜索框始终可见，位于标题栏下方 (mt-3)
- [ ] 高度 44px，圆角 8px
- [ ] 背景色 #1E2020，边框 1px solid #3A4142，聚焦边框 #24EE89
- [ ] 左侧搜索图标 (#6B7070)，placeholder "Search games" (#6B7070)，输入文字 14px 白色
- [ ] 搜索有内容时右侧显示清除按钮 (X 图标)，点击清空搜索

**分类 Tab 栏 (filter-chip 胶囊样式):**

- [ ] 横向可滚动 (overflow-x-auto hide-scrollbar)，不换行，共 10 个 Tab
- [ ] Tab 为胶囊/药丸形按钮 (filter-chip): padding 6px 12px, 圆角 8px, 字号 12px, font-weight 600
- [ ] 选中态 (active): 背景 #3A4142, 文字白色 (#fff)
- [ ] 未选中态: 背景透明, 文字 #B0B3B3
- [ ] 前 4 个 Tab (All Games/New/Recent/My Fav) 左侧有 14px SVG 小图标 (网格/星形/时钟/心形)
- [ ] 后 6 个 Tab (Slots/Live/Crash/Table Game/Fishing/Lotto) 纯文字无图标

**筛选下拉行:**

- [ ] 两个筛选器并排 (flex gap-2)，等宽 (flex: 1)
- [ ] 左: "Type:" + 值文字，右: "Providers:" + 值文字
- [ ] 筛选器样式 (filter-select): padding 8px 12px, 边框 1px solid #3A4142, 圆角 8px, 背景透明
- [ ] 标签文字 12px #B0B3B3, 值文字 12px 白色 font-weight 600, 右侧 chevron-down 箭头 #6B7070

**游戏卡片:**

- [ ] 缩略图 1:1 正方形 (aspect-ratio: 1) 自适应列宽，圆角 8px
- [ ] 游戏名: 12px 白色，单行截断 (nowrap + ellipsis)，顶部间距 4px
- [ ] 供应商名: 10px #6B7070
- [ ] New 角标: 绝对定位 top:6px left:6px, z-index:10, 背景 #24EE89, 文字 #1A1D1D, 字号 8px font-weight 700, padding 2px 6px, 圆角 4px
- [ ] 收藏按钮: 绝对定位 top:6px right:6px, z-index:10, 圆形 28x28px, 背景 rgba(0,0,0,0.4), 未收藏白色描边心形, 已收藏 #FF4757 实心心形
- [ ] 悬浮/按压: scale(1.05) 200ms transition 动画

**加载更多指示器:**

- [ ] 游戏网格底部 (mt-6) 居中显示
- [ ] spinner 旋转图标 + "Loading more games..." 文字, 颜色 #6B7070, 字号 14px

**供应商 Logo 区 (页面底部):**

- [ ] 标题 "Game Providers": 13px, font-weight 700, 大写, #B0B3B3, letter-spacing 0.5px
- [ ] 4 列网格 (grid-cols-4 gap-2)
- [ ] 各供应商为圆角矩形按钮: 背景 #2A2D2D, 圆角 8px, padding 10px 8px, 最小高度 44px
- [ ] 供应商名: 10px, font-weight 600, #B0B3B3, 居中
- [ ] hover 背景变为 #323738, 200ms transition
- [ ] 点击跳转到该供应商筛选结果
- [ ] 共 19 个供应商: JILI/Spribe/JDB/Evolution/INOUT/Hacksaw/PG/Playtech/TurboGames/MG/Habanero/SA Gaming/NetEnt/Nolimit City/Red Tiger/Big Time Gaming/TAP-A-ROO/Ezugi/EENI

**空状态:**

- [ ] 居中布局 (flex column center), padding 48px 16px, 间距 12px
- [ ] 图标: 64x64px (#6B7070)
- [ ] 标题: 16px, font-weight 600, #B0B3B3
- [ ] 副标题: 13px, #6B7070, 居中
- [ ] My Fav 无收藏: 心形图标 + "No favourite games yet" + "Browse games to add favourites"
- [ ] Recent 无记录: 时钟图标 + "No recently played games" + "Start playing to see your history here"
- [ ] 搜索无结果: 搜索图标 + "No games found" + "Try a different search term"

**骨架屏加载态:**

- [ ] 与正常页面结构一致 (标题栏 + 搜索框 + Tab + 筛选行 + 网格)
- [ ] 游戏卡片位置显示骨架块: 背景 #2A2D2D, 圆角 8px
- [ ] 骨架块有 shimmer 动画: linear-gradient 横向扫光, 1.5s 循环
- [ ] 每个骨架卡片包含: 1:1 缩略图占位 + 12px 高名称条 + 10px 高供应商条 (宽度随机 40%-90%)

**底部 Tab 栏:**

- [ ] 固定底部 (fixed bottom:0), 高度 64px, 背景 #323738, z-index 999
- [ ] 5 个 Tab 等分: Menu / Explore / GET 1700 / Raffle / Quest
- [ ] 当前页 Explore 为激活态: #24EE89 品牌色
- [ ] 其余 Tab 为非激活态: #6B7070
- [ ] 中心 GET 1700 Tab: 56x56px 圆形渐变按钮 (linear-gradient 135deg #24EE89 to #9FE871), 上移 16px 突出
- [ ] Tab 文字 10px, font-weight 600

**图片资源:**

- [ ] 游戏缩略图使用设计图纸中的图片资源（非灰色占位块）
- [ ] 供应商 Logo 使用设计图纸中的图片资源
- [ ] 游戏缩略图懒加载，加载前显示骨架屏占位

**整体风格:**

- [ ] 深色主题: 页面背景 #232626, 外层背景 #1A1D1D
- [ ] 字体使用 AvertaStd（降级 Inter），字号/字重与 merge.html 规范一致
