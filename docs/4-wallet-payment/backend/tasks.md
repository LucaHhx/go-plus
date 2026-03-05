# 任务清单

> 计划: wallet-payment/backend | 创建: 2026-03-04

| # | 任务 | 状态 | 开始日期 | 完成日期 | 备注 |
|---|------|------|----------|----------|------|
| 1 | 设计并迁移wallets/transactions/payment_methods表 | 已完成 | 2026-03-04 | 2026-03-04 | 更新Wallet模型添加frozen_amount/currency字段，新增Transaction和PaymentMethod模型，注册到AutoMigrate |
| 2 | 实现PaymentGateway接口和Mock实现(充值直接成功) | 已完成 | 2026-03-04 | 2026-03-04 | 创建PaymentGateway接口和MockPaymentGateway实现(充值直接成功,提现pending) |
| 3 | 实现GET /api/v1/wallet端点(余额查询) | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /api/v1/wallet端点，包含WalletService.GetBalance和WalletHandler |
| 4 | 实现GET /api/v1/wallet/payment-methods端点 | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /api/v1/wallet/payment-methods端点，从payment_methods表查询active方式 |
| 5 | 实现POST /api/v1/wallet/deposit端点(含事务保护) | 已完成 | 2026-03-04 | 2026-03-04 | 实现POST /api/v1/wallet/deposit端点，含GORM事务保护、余额审计链、Mock网关直接成功 |
| 6 | 实现POST /api/v1/wallet/withdraw端点(冻结+pending) | 已完成 | 2026-03-04 | 2026-03-04 | 实现POST /api/v1/wallet/withdraw端点，冻结金额+pending状态，等待管理员审核 |
| 7 | 实现GET /api/v1/wallet/transactions端点(筛选+分页) | 已完成 | 2026-03-04 | 2026-03-04 | 实现GET /api/v1/wallet/transactions端点，支持type筛选和page/page_size分页，以及/:id详情查询 |
| 8 | 支付方式Seed数据(UPI/Paytm/GPay/AmazonPay) | 已完成 | 2026-03-04 | 2026-03-04 | 添加UPI/Paytm/GPay/AmazonPay四种支付方式seed数据 |