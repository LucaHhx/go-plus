# 任务清单

> 计划: 7-user-management/frontend | 创建: 2026-03-05

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 新增 src/api/user.ts API 封装 (profile/avatar/password/google) | 已完成 | 2026-03-05 | 2026-03-05 | 新增 src/api/user.ts, client.ts 添加 put 方法 |
| 2 | types/index.ts 新增 ChangePasswordRequest, UserMeResponse 扩展 has_password 字段 | 已完成 | 2026-03-05 | 2026-03-05 | User 类型新增 has_password, 新增 ChangePasswordRequest |
| 3 | authStore 新增 updateToken 方法, User 类型扩展 has_password 字段 | 已完成 | 2026-03-05 | 2026-03-05 | authStore 新增 updateToken 方法 |
| 4 | 改造 SideDrawer: 已登录时顶部显示用户信息区域, 底部添加 Logout 按钮 | 已完成 | 2026-03-05 | 2026-03-05 | SideDrawer 已登录态显示用户信息+底部登出按钮 |
| 5 | 实现 ProfileHeader 组件 (返回箭头+标题, sticky顶部导航) | 已完成 | 2026-03-05 | 2026-03-05 | ProfileHeader 组件实现完成 |
| 6 | 实现 ProfilePage 页面 (UserInfoCard+NicknameEditor+AccountInfoSection+SecuritySettings入口+Logout) | 已完成 | 2026-03-05 | 2026-03-05 | ProfilePage 页面完成: 头像/昵称/账户信息/安全设置入口/登出 |
| 7 | 实现 AvatarUploader + AvatarCropModal 组件 (react-easy-crop裁剪+Canvas生成Blob+上传) | 已完成 | 2026-03-05 | 2026-03-05 | AvatarUploader+AvatarCropModal 裁剪上传完成 |
| 8 | 实现 SecurityPage 页面 (ChangePasswordForm+GoogleBindSection) | 已完成 | 2026-03-05 | 2026-03-05 | SecurityPage: ChangePasswordForm+GoogleBindSection 完成 |
| 9 | 实现登出确认弹窗 (LogoutButton组件, 确认对话框) | 已完成 | 2026-03-05 | 2026-03-05 | LogoutButton+ConfirmDialog+Toast 组件完成 |
| 10 | App.tsx 注册 /profile 和 /profile/security 路由 (AuthGuard requireAuth) | 已完成 | 2026-03-05 | 2026-03-05 | App.tsx 已注册 /profile 和 /profile/security 路由 |
| 11 | 安装 react-easy-crop 依赖 | 已完成 | 2026-03-05 | 2026-03-05 | 已安装 react-easy-crop |