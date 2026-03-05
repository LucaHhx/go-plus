# 任务清单

> 计划: user-system/frontend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 搭建前端项目(React19+Vite+Tailwind+Zustand+Axios) | 已完成 | 2026-03-04 | 2026-03-04 | React19+Vite7+TailwindCSS4+Zustand+Axios+ReactRouter7 项目搭建完成，配置路径别名、API代理、设计系统色板 |
| 2 | 实现Axios封装(baseURL+拦截器+401自动登出) | 已完成 | 2026-03-04 | 2026-03-04 | Axios封装完成: baseURL=/api/v1, 请求拦截添加Bearer token, 响应拦截处理401自动清除token并跳转登录页 |
| 3 | 实现authStore(Zustand: token/user/login/logout) | 已完成 | 2026-03-04 | 2026-03-04 | authStore(Zustand)完成: token/user/isAuthenticated状态, login/logout/fetchMe/initialize方法, localStorage持久化 |
| 4 | 实现RegisterPage(手机号+密码+OTP注册) | 已完成 | 2026-03-04 | 2026-03-04 | RegisterPage完成: 手机号+密码+OTP注册, 赠送游戏选择, 邀请码, 协议勾选, Google登录, 表单验证, loading状态, 错误提示 |
| 5 | 实现LoginPage(手机号+密码登录) | 已完成 | 2026-03-04 | 2026-03-04 | LoginPage完成: 密码登录+OTP登录双Tab切换, 表单验证, Google登录, loading/错误状态处理; P1修复: +91手机号前缀/gift_game枚举值/移除invite_code/密码校验; P2修复: fetchMe code校验/GiftSelectPage AuthGuard/sendOTP错误处理 |
| 6 | 实现LoginOTPPage(OTP快捷登录) | 已完成 | 2026-03-04 | 2026-03-04 | LoginOTPPage: OTP登录已集成在LoginPage中作为Tab切换模式，与设计稿一致 |
| 7 | 实现GiftSelectPage(注册赠送游戏选择) | 已完成 | 2026-03-04 | 2026-03-04 | GiftSelectPage完成: 注册后赠送游戏选择页, Aviator/MoneyComing两张卡片选择, 确认/跳过按钮 |
| 8 | 实现GoogleLoginButton(Mock模式) | 已完成 | 2026-03-04 | 2026-03-04 | GoogleLoginButton完成: Google品牌图标+文案, Mock模式调用authApi.googleLogin, loading状态处理 |
| 9 | 实现PhoneInput/OTPInput/PasswordInput组件 | 已完成 | 2026-03-04 | 2026-03-04 | PhoneInput(+91前缀/10位校验)/OTPInput(6位+SendOTP倒计时60s)/PasswordInput(显隐切换)组件完成 |
| 10 | 实现顶栏LoginButtons和UserBalanceChip组件 | 已完成 | 2026-03-04 | 2026-03-04 | LoginButtons(JoinNow+LogIn)和UserBalanceChip(余额显示+充值按钮)组件完成, 根据isAuthenticated状态切换显示 |
| 11 | 实现路由守卫(已登录跳转/未登录拦截) | 已完成 | 2026-03-04 | 2026-03-04 | AuthGuard组件完成: requireAuth=true未登录跳转/login, requireAuth=false已登录跳转/, 初始化loading状态显示spinner |
| 12 | 修复 BUG-001/002: 登录后立即调用 fetchMe 获取完整用户数据(含balance/bonus_balance) | 已完成 | 2026-03-04 | 2026-03-04 | 修复login方法: 设置balance/bonus_balance默认值0避免NaN, 登录后立即调用fetchMe获取完整用户数据 |