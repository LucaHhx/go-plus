# 用户管理 -- 前端设计说明

> 需求: 7-user-management | 角色: ui | 更新: 2026-03-05

## 设计概述

用户管理模块包含个人资料页 (ProfilePage)、安全设置页 (SecurityPage)、侧边菜单用户信息区域改造，以及多个弹窗组件（登出确认、头像裁剪、解绑确认）。

设计稿: `merge.html` 包含 10 个预览 Tab，覆盖正常态、编辑态、错误态、加载态、弹窗状态和 Toast 通知状态。

## 页面清单

| 页面/组件 | 路由 | merge.html Tab | 说明 |
|-----------|------|----------------|------|
| 个人资料页 | `/profile` | Profile | 头像、昵称、账户信息、安全设置入口、登出 |
| 个人资料页 (编辑) | `/profile` | Profile (Edit) | 昵称编辑态、已上传头像态 |
| 安全设置页 | `/profile/security` | Security | 修改密码、Google 绑定/解绑 |
| 安全设置 (错误态) | `/profile/security` | Security (Error) | 表单验证失败 |
| 安全设置 (加载态) | `/profile/security` | Security (Loading) | 提交中 loading |
| 侧边菜单 (已登录) | - | Drawer (Logged) | 用户信息区域 + 菜单项 + 登出 |
| 登出确认弹窗 | - | Logout Dialog | 弹窗确认登出 |
| 头像裁剪弹窗 | - | Avatar Crop | 正方形裁剪 + 缩放 |
| 解绑确认弹窗 | - | Unbind Dialog | 弹窗确认解绑 Google |
| Toast 通知 | - | Toasts | 成功/错误通知样本 |

## 全局布局结构

ProfilePage 和 SecurityPage 使用独立全屏布局，**不渲染全局 AppLayout (无底部 Tab 栏)**:

```
+------------------------------------------+
|  PageHeader (56px, bg-deep, sticky)      |
|  [← 返回]  标题                          |
+------------------------------------------+
|  Content (scrollable)                    |
|                                          |
|  [Section Cards]                         |
|  [Action Buttons]                        |
|                                          |
|  padding-bottom: 32px                    |
+------------------------------------------+
```

**关键尺寸:**

| 区域 | 属性 | 值 | Tailwind |
|------|------|----|----------|
| 容器 | max-width | 430px | `max-w-[430px]` |
| 容器 | background | #232626 | `bg-[#232626]` |
| 容器 | min-height | 100vh | `min-h-screen` |
| 容器 | 水平居中 | auto | `mx-auto` |
| 内容区 | 水平内边距 | 16px | `px-4` |

## PageHeader (56px)

```css
height: 56px;
background: #1A1D1D;
position: sticky;
top: 0;
z-index: 50;
padding: 0 16px;
display: flex;
align-items: center;
border-bottom: 1px solid rgba(58, 65, 66, 0.5);
```

| 元素 | 样式 |
|------|------|
| 返回按钮 | 40x40px 热区, margin-left -8px, arrow-left 图标 24x24 #fff |
| 标题 | 16px, #fff, font-semibold, margin-left 4px |

## 头像区域

```
头像大小: 80x80px
圆角: 50% (full circle)
边框: 3px solid #24EE89
默认: #323738 背景 + user 图标 40x40 #6B7070
编辑按钮: 绝对定位右下角, 28x28px 圆形
  背景: #24EE89
  边框: 2px solid #232626 (与页面背景融合)
  图标: camera 14x14 stroke #000
```

点击头像或编辑按钮触发文件选择器 (accept="image/jpeg,image/png,image/webp")。

## Section Card

所有信息区块使用统一的 Section Card 容器:

```css
background: #2A2D2D;
border-radius: 12px;
padding: 16px;
margin: 0 16px 12px;  /* 卡片之间 12px 间距 */
```

区块标题统一:
```css
font-size: 14px;
font-weight: 600;
color: #B0B3B3;
text-transform: uppercase;
letter-spacing: 0.5px;
margin-bottom: 4px;
```

## 输入框

复用 1-user-system 的输入框规范:
- 高度 48px, 背景 #1E2121, 边框 #3A4142, 圆角 8px
- 聚焦边框 #24EE89
- 错误边框 #FF4757 + 错误文字 (12px, margin-top 4px)
- 密码框右侧 eye/eye-off 图标按钮

**新增: 输入框标签**
```css
label {
  font-size: 12px;
  color: #B0B3B3;
  display: block;
  margin-bottom: 6px;
}
```

## 关键交互说明

### 1. 昵称编辑

**正常态 -> 编辑态:**
- 点击 "Edit" 文字按钮
- 昵称文字切换为输入框 (预填当前昵称)
- 输入框自动获焦
- 下方显示 Cancel / Save 按钮行
- 验证规则提示: "2-20 characters, letters, numbers and underscores only"

**编辑态 -> 正常态:**
- 点击 Cancel: 恢复原始昵称，切回文字显示
- 点击 Save: 调用 API，成功后更新昵称，切回文字显示
- 无动画过渡，直接切换

### 2. 头像上传流程

1. 点击头像区域 -> 打开系统文件选择器
2. 选择图片 -> 打开 Avatar Crop Modal
3. 裁剪区: 正方形比例, 圆形预览框, 支持缩放和拖拽
4. 确认裁剪 -> Canvas 生成裁剪 Blob -> 上传 API
5. 成功 -> Toast "Avatar updated" -> 头像立即更新
6. 失败 -> Toast 错误信息

### 3. 修改密码

1. 填写表单 (Current + New + Confirm)
2. 前端实时校验 (onBlur + onChange):
   - 新密码 >= 6 位, 含字母和数字
   - 两次输入一致
3. 提交 -> Loading 态 -> 成功:
   - Toast "Password updated successfully"
   - 表单清空
   - 内联提示: "Other devices have been logged out"
4. 失败 -> 输入框错误态 + 错误文字

**Google-only 用户特殊处理:**
- 如果 `has_password === false`, 隐藏 "Current Password" 输入框
- 仅显示 New Password + Confirm Password

### 4. 登出

1. 点击 "Logout" 按钮 (ProfilePage 底部或 SideDrawer 底部)
2. 弹出确认弹窗
3. Cancel -> 关闭弹窗
4. Confirm -> 调用 logout API -> 清除状态 -> 跳转首页

### 5. Google 绑定/解绑

**绑定:**
1. 点击 "Bind" 按钮 -> Loading 态
2. 触发 Google OAuth -> 获取 id_token
3. 调用 bind API -> 成功: Toast + 切换为已绑定态

**解绑:**
1. 点击 "Unbind" -> 弹出确认弹窗
2. Cancel -> 关闭
3. Confirm -> 调用 unbind API
4. 成功: Toast + 切换为未绑定态
5. 如果返回错误码 1015 (唯一登录方式): Toast 错误 "Please set a password before unbinding Google"

### 6. SideDrawer 条件渲染

**已登录状态:**
- 顶部: 用户信息区域 (头像 48px + 昵称 + 遮罩手机号 + "Profile" 链接)
- 底部 (菜单项最后): Logout 按钮 (红色文字 + 图标)

**未登录状态:**
- 顶部: 保持原有 Promo Banner 不变
- 底部: 无 Logout 按钮

## 资源使用指南

### SVG 图标

所有图标位于 `ui/Resources/icons/` 目录:

| 图标 | 文件 | 用途 | 尺寸 |
|------|------|------|------|
| 返回 | `arrow-left.svg` | PageHeader 返回按钮 | 24x24 |
| 右箭头 | `chevron-right.svg` | 导航行右侧箭头 | 20x20 |
| 编辑 | `edit.svg` | 昵称编辑按钮 | 16x16 |
| 相机 | `camera.svg` | 头像编辑按钮 | 14x14 |
| 用户 | `user.svg` | 默认头像占位 | 40x40 (大) / 24x24 (小) |
| 盾牌 | `shield.svg` | 安全设置图标 | 20x20 |
| 锁 | `lock.svg` | 修改密码图标 | 20x20 |
| 登出 | `log-out.svg` | 登出按钮图标 | 18x18 |
| 手机 | `phone.svg` | 预留 | 24x24 |
| 日历 | `calendar.svg` | 预留 | 24x24 |
| 星星 | `star.svg` | VIP 等级图标 | 16x16 |
| Google | `google.svg` | Google 账号区块图标 | 20x20 |
| 眼睛 | `eye.svg` | 密码显示 | 20x20 |
| 眼睛关 | `eye-off.svg` | 密码隐藏 | 20x20 |
| 勾选 | `check.svg` | 预留 | 24x24 |
| 关闭 | `close.svg` | 弹窗关闭按钮 | 24x24 |
| 链接 | `link.svg` | 绑定按钮图标 | 16x16 |
| 断开链接 | `unlink.svg` | 解绑按钮图标 | 16x16 |
| 警告 | `alert-triangle.svg` | 解绑弹窗警告图标 / 错误 Toast | 24x24 / 18x18 |
| 成功圆 | `check-circle.svg` | 成功 Toast 图标 | 18x18 |

**引用方式:** 建议内联 SVG 以支持 `currentColor` 主题色自适应，或使用组件库的 Icon 组件。

### CSS 变量

`ui/Resources/tokens.css` 包含完整的 CSS 自定义属性。前端可在全局样式中引入:

```css
@import './design-tokens/tokens.css';

.section-card {
  background: var(--section-card-bg);
  border-radius: var(--section-card-radius);
  padding: var(--section-card-padding);
}
```

### Tailwind 配置

`ui/Resources/tailwind.config.js` 包含设计系统的 Tailwind 扩展配置。前端项目合并到 `tailwind.config.js` 的 `theme.extend`:

```js
const uiConfig = require('./path-to/ui/Resources/tailwind.config.js');
module.exports = {
  theme: {
    extend: {
      ...uiConfig.theme.extend,
    }
  }
}
```

## 需人工提供的资源

以下资源在设计稿中使用占位方案，前端需在资源到位后替换:

| 资源 | 设计稿中的占位 | 前端替换方式 |
|------|----------------|-------------|
| 品牌 Logo | 文字 "1GO.PLUS" | 替换为 `<img>` |
| AvertaStd 字体 | Inter 降级 | `@font-face` 引入 WOFF2 文件 |

资源清单详见 `ui/Resources/assets-manifest.md`。

## 注意事项

1. **全屏布局，无 Tab 栏** -- ProfilePage 和 SecurityPage 不渲染全局 AppLayout
2. **水平内边距 16px** -- 所有 Section Card 的外边距 `mx-4`
3. **头像边框不能丢** -- 80px 头像必须有 3px #24EE89 边框
4. **头像编辑按钮定位** -- 绝对定位右下角，border 与页面背景色一致形成视觉分隔
5. **昵称编辑 inline 切换** -- 不是新页面，原地替换
6. **密码框 eye 图标** -- 三个密码框都要有显示/隐藏切换
7. **手机号遮罩格式** -- `+91****7890`，中间 4 位星号
8. **登出/解绑必须二次确认** -- 弹窗确认，不能直接执行
9. **Toast 位置** -- fixed top 72px (header 下方)，3 秒自动消失
10. **Google-only 用户** -- 修改密码时隐藏 "Current Password"，解绑时提示设置密码
