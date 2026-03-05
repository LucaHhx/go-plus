# 计划日志

> 计划: user-management | 创建: 2026-03-05

<!--
类型: [决策] [变更] [修复] [新增] [测试] [备注] [完成]
格式: - [类型] 内容
按日期分组，最新在前
-->

## 2026-03-05

- [变更] 交叉评审对齐: 统一昵称校验规则为 2-20 字符(字母/数字/下划线), backend design.md 从 1-50 修正为 2-20, UI design.md 中已定义的 2-20 规则为准, QA 测试用例同步更新
- [完成] [ui] 完成任务 #1: 设计系统文档 (design.md) + 效果图 (merge.html) + 前端说明 (Introduction.md) + 资源交付 (Resources/) (交付: merge.html(10个Tab) + design.md + Introduction.md + 20个SVG图标 + tokens.css + tailwind.config.js + assets-manifest.md)
- [备注] Tech Lead 完成 L3 技术文档评审: backend/design.md 修正图片处理技术栈描述(补充 golang.org/x/image/webp), QA design.md 从空壳模板补充完整测试策略和测试用例设计, QA tasks.md 添加 7 条具体测试任务
- [变更] [ui] 开始任务 #1: 设计系统文档 (design.md) + 效果图 (merge.html) + 前端说明 (Introduction.md) + 资源交付 (Resources/)
- [备注] log.md 中已记录的技术方案决策(密码版本校验、头像存储、前端裁剪库、路由设计等)供开发团队参考，后续技术决策应记录在 L3 角色目录的 design.md 中
- [决策] GET /auth/me 扩展: 响应新增 has_password 布尔字段，前端据此决定修改密码表单是否显示 Current Password 输入框，以及 Google 解绑时的提示逻辑。
- [决策] Google 解绑安全约束: 如果 Google 是用户唯一登录方式 (无密码)，解绑前必须先设置密码，避免用户被锁定在账户外。后端返回错误码 1015 提示。
- [决策] 密码安全方案: 选择 password_version + JWT pwd_ver 校验。修改密码时 password_version +1，AuthMiddleware 比对 Token 中 pwd_ver 与数据库值，不匹配则返回 401 实现其他设备自动失效。不引入 Redis Token 黑名单。
- [决策] 头像上传方案: 选择服务端本地文件存储 + react-easy-crop 客户端裁剪。文件保存到 ./assets/uploads/avatars/{user_id}_{timestamp}.webp，复用已有 Static 服务。MVP 阶段零外部依赖，后续可迁移到 S3/OSS。
- [决策] 导航方案: 选择独立全屏页面 + 侧边菜单入口。与已有 wallet 页面模式一致，侧边菜单顶部显示用户信息（已登录时替换 Promo Banner），底部添加 Logout 按钮。路由 /profile 和 /profile/security。
- [备注] 不在MVP范围: 手机号更换、实名认证/KYC、账户注销/删除
- [决策] 与1-user-system边界: 注册/登录/登出API/会话管理归1-user-system, 本需求负责前端用户管理界面和资料编辑/密码修改/Google绑定等功能
- [决策] 需求范围确认: 包含登出前端入口、个人资料页面(查看/编辑昵称/头像)、安全设置(修改密码/绑定解绑Google账号)三大功能模块
- [新增] 创建计划