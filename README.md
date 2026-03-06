# 团队操作手册

## 角色与职责

| 角色 | Agent | 负责什么 | 不做什么 |
|------|-------|---------|---------|
| PM | hz-pm | 需求规划、用户场景、验收标准、L1+L2 文档 | 技术选型、代码实现 |
| Tech Lead | hz-tech-lead | 架构设计、API 契约、任务拆解、代码评审 | 业务需求定义、UI 设计 |
| UI 设计师 | hz-ui | 视觉设计稿(HTML+Tailwind)、设计系统、视觉审查 | 前端代码实现、技术选型 |
| 前端开发 | hz-frontend | 页面组件、交互逻辑、状态管理 | 后端代码、测试执行 |
| 后端开发 | hz-backend | API 接口、数据库、业务逻辑 | 前端代码、测试执行 |
| QA 测试 | hz-qa | 测试计划、API 测试、E2E 浏览器测试 | 功能开发、bug 修复 |

## 命令速查

### 单角色命令（推荐日常使用）

| 命令 | 角色 | 用途 | 前置条件 |
|------|------|------|---------|
| `/review-pm` | PM | 评审/完善业务文档，或新建需求 | 无 |
| `/review-tech` | Tech Lead | 创建角色目录、design.md、技术任务 | plan.md + tasks.md 存在 |
| `/review-ui` | UI 设计师 | 产出 merge.html + 设计系统 | plan.md 存在 |
| `/dev-frontend` | 前端开发 | 实现前端代码 | frontend/design.md + tasks.md + ui/merge.html |
| `/dev-backend` | 后端开发 | 实现后端代码 | backend/design.md + tasks.md |
| `/review-qa` | QA 测试 | API + E2E 验收测试 | qa/design.md + 有已完成的开发任务 |

### 统一调度命令（自动多角色协作）

| 命令 | 参与角色 | 用途 |
|------|---------|------|
| `/unify-doc-review` | PM + Tech Lead + UI | 文档评审 + UI 设计产出 |
| `/unify-dev` | Tech Lead + UI + Frontend + Backend + QA | 完整开发流程（含代码审查和测试） |
| `/unify-fix` | 按需组建 | 智能 bug 诊断与修复 |

### 参数格式

所有命令支持 `/命令 <需求标识> [用户指令]` 格式，第一个 token 匹配需求，后续内容作为指令传递给 agent。

**需求匹配方式**:

| 输入方式 | 示例 | 说明 |
|---------|------|------|
| 需求全名 | `/review-pm 7-user-management` | 直接匹配 |
| 需求 ID | `/review-pm 7` | 模糊匹配 `docs/7-*/` |
| 需求短名 | `/review-pm user-management` | 模糊匹配 `docs/*-user-management/` |
| 无参数 | `/review-pm` | 列出所有需求供选择 |

**附带用户指令**:

| 场景 | 示例 |
|------|------|
| PM 新建需求 | `/review-pm 新建需求：用户积分系统` |
| PM 补充文档 | `/review-pm 7 补充验收标准` |
| 技术方案修改 | `/review-tech 7 追加登录日志功能` |
| 技术需求追加 | `/review-tech 7 需要支持第三方OAuth登录` |
| 设计修改 | `/review-ui 7 按钮改成圆角风格` |
| 设计建议 | `/review-ui 7 配色太暗，整体提亮` |
| 前端指定优先级 | `/dev-frontend 7 先实现登录页` |
| 后端限定范围 | `/dev-backend 7 只做用户CRUD接口` |
| QA 重点测试 | `/review-qa 7 重点测试并发和边界场景` |

### 依赖链

```
/review-pm ──┬── /review-tech ──┬── /dev-backend ──┐
             │                  │                  │
             └── /review-ui ────┼── /dev-frontend ─┤
                                │                  │
                                └──────────────────┴── /review-qa
```

## 各角色操作指南

### PM 人员

**你该跑什么**: `/review-pm <需求> [指令]`

```bash
# 基础用法
/review-pm 7                          # 评审需求 7 的文档
/review-pm 7-user-management          # 用全名
/review-pm                            # 列出所有需求选择

# 新建需求
/review-pm 新建需求：用户积分系统       # 创建需求目录 + 编写 L2 文档 + 更新 L1
/review-pm 增加需求：消息通知功能       # 同上，支持多种关键词

# 带指令评审
/review-pm 7 补充验收标准              # 重点补充验收标准
/review-pm 7 追加微信登录场景          # 在已有需求中追加用户场景
```

**你的产出**: plan.md（目标、场景、验收标准）、tasks.md（功能任务）、同步更新 L1 文档（project.md、tasks.md）

**完成后下一步**: 通知 Tech Lead 运行 `/review-tech`，通知 UI 设计师运行 `/review-ui`

### UI 设计师

**你该跑什么**: `/review-ui <需求> [设计指令]`

**前置要求**: plan.md 已存在且非空（PM 已完成）

```bash
# 基础用法
/review-ui 7                          # 首次产出设计稿

# 设计迭代
/review-ui 7 按钮改成圆角风格          # 修改按钮样式
/review-ui 7 配色太暗，整体提亮        # 调整配色方案
/review-ui 7 增加空状态和加载骨架屏    # 补充缺失的 UI 状态
```

**你的产出**:
- `ui/merge.html` — 响应式效果图（覆盖 375px/768px/1440px+ 断点）
- `ui/design.md` — 设计系统文档（配色、字体、间距、组件规范）
- `ui/Introduction.md` — 前端设计说明
- `ui/Resources/` — SVG 图标、CSS 变量、Tailwind 配置

### Tech Lead

**你该跑什么**: `/review-tech <需求> [技术指令]`

**前置要求**: plan.md + tasks.md 存在且非空

```bash
# 基础用法
/review-tech 7                        # 首次创建技术方案

# 需求变更
/review-tech 7 追加登录日志功能        # 追加新功能到技术方案
/review-tech 7 需要支持第三方OAuth登录 # 需求追加，更新 design.md + tasks.md
/review-tech 7 缓存策略改用Redis       # 技术方案调整
```

**你的产出**: 角色目录（backend/frontend/qa/ui）、各角色 design.md、技术任务

**技术栈参考**: `.claude/skills/create-docs/references/tech-stack.md`

### 前端开发

**你该跑什么**: `/dev-frontend <需求> [开发指令]`

**前置要求**: frontend/design.md + frontend/tasks.md（有待办任务）+ ui/merge.html

```bash
# 基础用法
/dev-frontend 7                       # 按任务列表顺序实现

# 带指令开发
/dev-frontend 7 先实现登录页           # 指定实现优先级
/dev-frontend 7 只做表单验证部分       # 限定本次实现范围
```

**资源引用规则**: 优先使用 `ui/Resources/` 中的本地资源（图标、CSS 变量、Tailwind 配置），禁止用外部 URL 替代

### 后端开发

**你该跑什么**: `/dev-backend <需求> [开发指令]`

**前置要求**: backend/design.md + backend/tasks.md（有待办任务）

```bash
# 基础用法
/dev-backend 7                        # 按任务列表顺序实现

# 带指令开发
/dev-backend 7 只做用户CRUD接口        # 限定实现范围
/dev-backend 7 先做数据库迁移          # 指定优先级
```

### QA 测试

**你该跑什么**: `/review-qa <需求> [测试指令]`

**前置要求**: qa/design.md + 有已完成的开发任务

```bash
# 基础用法
/review-qa 7                          # 执行完整测试流程

# 带指令测试
/review-qa 7 重点测试并发和边界场景    # 指定测试重点
/review-qa 7 只测登录相关API          # 限定测试范围
/review-qa 7 回归测试用户列表功能      # 回归验证
```

**测试流程**: API 接口测试 → 浏览器 E2E 测试（headed 模式）→ 测试报告写入 log.md

## Skill 使用说明

| Skill | 用途 | 使用角色 |
|-------|------|---------|
| create-docs | 文档结构管理、CLI 操作 | 所有角色 |
| brainstorming | 需求头脑风暴、创意探索 | PM, Tech Lead |
| ui-ux-pro-max | 设计系统生成、配色方案 | UI 设计师 |
| tailwindcss-advanced-components | Tailwind 高级组件模式 | UI 设计师, 前端开发 |
| agent-browser | 浏览器自动化（E2E 测试、视觉审查） | UI 设计师, QA |
| pm-mcp-guide | 后台服务进程管理 | UI 设计师, QA |
| create-web | React 项目脚手架和组件库 | 前端开发 |
| tauri-v2 | Tauri 跨平台桌面应用开发 | 前端开发 |
| wda | iOS 设备自动化测试 | QA |

## Git 提交规范

每个命令执行完成后会询问是否提交 git，**绝不自动提交**。

| 命令类型 | commit type | 示例 |
|---------|-------------|------|
| 文档类 (review-pm, review-tech, review-ui) | `docs` | `docs(7-user-management): review-pm 完善业务文档` |
| 开发类 (dev-frontend, dev-backend) | `feat` | `feat(7-user-management): dev-frontend 实现前端功能` |
| 测试类 (review-qa) | `test` | `test(7-user-management): review-qa 执行验收测试` |

## 文档结构

```
docs/
├── project.md              # L1: 项目概览
├── tasks.md                # L1: 需求列表
├── CHANGELOG.md            # L1: 变更日志
├── fixes/                  # 修复记录
│   └── <N>-<slug>.md
└── <N>-<需求名>/            # L2-L3: 需求目录
    ├── plan.md             # L2: 业务需求、用户场景、验收标准
    ├── tasks.md            # L2: 功能任务列表
    ├── log.md              # L2: 开发日志
    ├── backend/            # L3: 后端
    │   ├── design.md       #     技术方案
    │   └── tasks.md        #     技术任务
    ├── frontend/           # L3: 前端
    │   ├── design.md
    │   └── tasks.md
    ├── ui/                 # L3: UI 设计
    │   ├── design.md       #     设计系统
    │   ├── merge.html      #     响应式效果图
    │   ├── Introduction.md #     前端设计说明
    │   └── Resources/      #     设计资源（SVG、CSS 变量、Tailwind 配置）
    └── qa/                 # L3: QA 测试
        ├── design.md       #     测试策略
        └── tasks.md        #     测试任务
```

**文档管理 CLI**: `python3 .claude/skills/create-docs/scripts/docs.py <command>`

**技术栈规范**: `.claude/skills/create-docs/references/tech-stack.md`
