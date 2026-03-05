# QA 测试方案 -- 用户系统

> 需求: user-system | 角色: qa

## 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| 单元测试 | Go testing + testify | Service 层业务逻辑 |
| API 测试 | Go httptest / Postman | 所有 /api/v1/auth/* 接口 |
| 前端组件测试 | Vitest + React Testing Library | 认证表单组件 |
| E2E 测试 | 后续引入 (Playwright) | 完整注册/登录流程 |

## 测试用例

### 注册

- 正常注册: 手机号+密码+正确OTP -> 成功, 返回 token + user + bonus
- 手机号已注册 -> 错误码 1002
- OTP 错误 -> 错误码 1003
- OTP 过期 -> 错误码 1003
- 密码不符合要求 (< 6 位 / 纯数字) -> 错误码 1001
- 手机号格式错误 (非+91) -> 错误码 1001
- 选择 gift_game: aviator / money-coming -> bonus 记录正确
- 注册后钱包创建: balance=0, bonus_balance=100

### 登录

- 手机号+密码正确 -> 成功
- 密码错误 -> 错误码 1004
- 用户不存在 -> 错误码 1004
- 用户被禁用 -> 错误码 1005
- OTP 登录正常 -> 成功
- Google 登录 (Mock) -> 成功

### JWT / 会话管理

- 有效 Token -> /auth/me 返回用户信息
- 过期 Token -> 401
- 无效 Token -> 401
- Token Payload 包含 user_id, role, market_code
- [E2E] 会话过期后前端自动跳转登录页 (模拟 401 响应)
- [E2E] 登出后 localStorage token 清除，访问受保护页面跳转登录页

### 视觉还原 (对照验收清单)

- 注册页布局、配色、字体与 UI 设计图纸 (merge.html) 一致
- 登录页布局、配色、字体与设计图纸一致
- "Join Now" / "Log In" 按钮样式与设计图纸一致
- Google 登录按钮样式与设计图纸一致
- 表单输入框、OTP 输入、错误提示样式与设计图纸一致
- 注册赠送游戏选择展示效果与设计图纸一致

> 视觉还原测试以人工走查为主，辅以截图对比。第一期不做自动化像素对比。

## 关键决策

- 第一期以 API 测试为主, 前端组件测试为辅
- OTP Mock 固定 123456, 测试中直接使用
- 每个 API 端点至少覆盖正常路径 + 2 个异常路径
