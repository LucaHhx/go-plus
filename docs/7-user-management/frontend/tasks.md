# 任务清单

> 计划: 7-user-management/frontend | 创建: 2026-03-05

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 新增 src/api/user.ts API 封装 (profile/avatar/password/google) | 待办 |  |  |  |
| 2 | types/index.ts 新增 ChangePasswordRequest, UserMeResponse 扩展 has_password 字段 | 待办 |  |  |  |
| 3 | authStore 新增 updateToken 方法, User 类型扩展 has_password 字段 | 待办 |  |  |  |
| 4 | 改造 SideDrawer: 已登录时顶部显示用户信息区域, 底部添加 Logout 按钮 | 待办 |  |  |  |
| 5 | 实现 ProfileHeader 组件 (返回箭头+标题, sticky顶部导航) | 待办 |  |  |  |
| 6 | 实现 ProfilePage 页面 (UserInfoCard+NicknameEditor+AccountInfoSection+SecuritySettings入口+Logout) | 待办 |  |  |  |
| 7 | 实现 AvatarUploader + AvatarCropModal 组件 (react-easy-crop裁剪+Canvas生成Blob+上传) | 待办 |  |  |  |
| 8 | 实现 SecurityPage 页面 (ChangePasswordForm+GoogleBindSection) | 待办 |  |  |  |
| 9 | 实现登出确认弹窗 (LogoutButton组件, 确认对话框) | 待办 |  |  |  |
| 10 | App.tsx 注册 /profile 和 /profile/security 路由 (AuthGuard requireAuth) | 待办 |  |  |  |
| 11 | 安装 react-easy-crop 依赖 | 待办 |  |  |  |