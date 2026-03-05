# QA 测试方案 -- 钱包与支付

> 需求: wallet-payment | 角色: qa

## 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| 单元测试 | Go testing | 余额计算、事务一致性 |
| API 测试 | Go httptest | 所有 /api/v1/wallet/* 接口 |
| 前端组件测试 | Vitest | 金额输入、支付方式选择 |

## 测试用例

### 充值

- 正常充值 -> 余额增加, transaction 记录正确
- 金额低于最低限额 -> 拒绝
- 金额超过最高限额 -> 拒绝
- balance_before / balance_after 审计链正确
- 并发充值 -> 余额一致 (事务保护)

### 提现

- 正常提现 -> 余额减少, frozen 增加, status=pending
- 金额超过可用余额 -> 拒绝
- 金额低于最低提现 -> 拒绝
- 管理员审核通过 -> status=completed, frozen 清零
- 管理员审核拒绝 -> status=rejected, 余额恢复

### 交易记录

- 按类型筛选 -> 正确过滤
- 分页 -> 正确
- 时间倒序 -> 最新在前

### 边界条件

- Bonus 余额不可提现
- 冻结金额不可重复提现

## 关键决策

- 钱包相关测试重点关注余额一致性和事务安全
- 每个测试用例验证 balance_before / balance_after
