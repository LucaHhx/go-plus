# 任务清单

> 计划: 7-user-management/backend | 创建: 2026-03-05

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | users 表新增 password_version 字段 (GORM AutoMigrate) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 2 | JWTClaims 新增 pwd_ver 字段, GenerateToken 增加 pwdVer 参数, 同步更新所有调用点 | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 3 | AuthMiddleware 扩展 pwd_ver 校验逻辑 (查询 users.password_version 比对) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 4 | GET /auth/me 响应新增 has_password 布尔字段 | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 5 | 实现 PUT /api/v1/user/profile 端点 (更新昵称) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 6 | 实现 POST /api/v1/user/avatar 端点 (头像上传+裁剪+WebP转换+本地存储) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 7 | 实现 PUT /api/v1/user/password 端点 (修改密码+password_version递增+签发新Token) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 8 | 实现 POST /api/v1/user/google/bind 端点 (绑定Google账号) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 9 | 实现 POST /api/v1/user/google/unbind 端点 (解绑Google账号+唯一登录方式校验) | 已完成 | 2026-03-05 | 2026-03-05 |  |
| 10 | router.go 注册 /api/v1/user 路由组, 创建 UserMgmtHandler 并注入依赖 | 已完成 | 2026-03-05 | 2026-03-05 |  |