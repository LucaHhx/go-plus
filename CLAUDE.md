# Go Plus 项目

## 新用户引导

当用户首次进入对话时，**主动询问用户的角色**，然后给出对应的命令指引。

使用 AskUserQuestion 询问：

> 你好！请问你在团队中的角色是？

选项：
- PM（产品经理）
- Tech Lead（技术负责人）
- UI 设计师
- 前端开发
- 后端开发
- QA 测试

根据用户选择的角色，展示以下对应内容：

---

### 如果是 PM

你的核心命令是 `/review-pm`，负责需求文档的创建和评审。

```bash
# 新建一个需求（自动创建目录 + 编写文档 + 更新项目文档）
/review-pm 新建需求：用户积分系统

# 评审已有需求
/review-pm 7

# 带指令评审（补充/修改文档内容）
/review-pm 7 补充验收标准
/review-pm 7 追加微信登录场景

# 不记得需求编号？直接选
/review-pm
```

完成后通知 Tech Lead 运行 `/review-tech`，通知 UI 设计师运行 `/review-ui`。

---

### 如果是 Tech Lead

你的核心命令是 `/review-tech`，负责技术方案和任务拆解。

```bash
# 首次创建技术方案（需要 PM 先完成文档）
/review-tech 7

# 需求变更时更新方案
/review-tech 7 追加登录日志功能
/review-tech 7 需要支持第三方OAuth登录
/review-tech 7 缓存策略改用Redis
```

完成后通知前端运行 `/dev-frontend`，后端运行 `/dev-backend`。

技术栈参考：`.claude/skills/create-docs/references/tech-stack.md`

---

### 如果是 UI 设计师

你的核心命令是 `/review-ui`，负责产出设计稿和设计系统。

```bash
# 首次产出设计（需要 PM 先完成 plan.md）
/review-ui 7

# 设计迭代
/review-ui 7 按钮改成圆角风格
/review-ui 7 配色太暗，整体提亮
/review-ui 7 增加空状态和加载骨架屏
```

产出物：`ui/merge.html`（效果图）、`ui/design.md`（设计系统）、`ui/Resources/`（图标资源）

---

### 如果是前端开发

你的核心命令是 `/dev-frontend`，负责实现前端页面和交互。

```bash
# 按任务列表实现（需要 Tech Lead 和 UI 先完成）
/dev-frontend 7

# 指定优先级或范围
/dev-frontend 7 先实现登录页
/dev-frontend 7 只做表单验证部分
```

注意：优先使用 `ui/Resources/` 中的本地资源，禁止外部 URL。

---

### 如果是后端开发

你的核心命令是 `/dev-backend`，负责实现 API 和业务逻辑。

```bash
# 按任务列表实现（需要 Tech Lead 先完成）
/dev-backend 7

# 指定范围
/dev-backend 7 只做用户CRUD接口
/dev-backend 7 先做数据库迁移
```

---

### 如果是 QA 测试

你的核心命令是 `/review-qa`，负责 API + E2E 验收测试。

```bash
# 执行完整测试（需要开发先完成任务）
/review-qa 7

# 指定测试重点
/review-qa 7 重点测试并发和边界场景
/review-qa 7 只测登录相关API
/review-qa 7 回归测试用户列表功能
```

---

## 统一调度命令

如果你需要一次性协调多个角色，可以使用统一调度命令：

```bash
/unify-doc-review 7    # PM + Tech Lead + UI 协作完善文档和设计
/unify-dev 7           # 完整开发流程（含设计、前后端、测试）
/unify-fix             # 智能 bug 诊断与修复
```

## 命令依赖链

```
/review-pm ──┬── /review-tech ──┬── /dev-backend ──┐
             │                  │                  │
             └── /review-ui ────┼── /dev-frontend ─┤
                                │                  │
                                └──────────────────┴── /review-qa
```

## 项目约定

- **语言**: 所有交互使用中文
- **Git 提交**: 每个命令完成后会询问是否提交，绝不自动提交
- **文档结构**: 三层架构 — L1(项目) → L2(需求) → L3(角色技术方案)
- **技术栈**: 后端 Go (Gin/GORM)，前端 React (TypeScript/Vite/Tailwind/Zustand)
