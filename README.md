# GO PLUS

> **声明：本项目仅用于测试 [HZ-Agents](https://github.com/LucaHhx/hz-agents) 多智能体开发框架的能力，不用于任何商业运营或实际部署。**

在线娱乐平台测试项目 —— 由 HZ-Agents 6 个专业 AI Agent 协作完成全流程开发。

## 项目概览

| 字段 | 内容 |
|------|------|
| 项目名称 | GO PLUS |
| 开发框架 | [HZ-Agents](https://github.com/LucaHhx/hz-agents) 多智能体编排 |
| 测试目的 | 验证 HZ-Agents 在中大型复杂项目中的全流程编排能力 |
| 当前阶段 | 第一期 — 全部页面 + 全部组件 + mock 数据 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.25, Gin, GORM, SQLite, JWT v5, Viper, Zap |
| 前端 | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Zustand, Axios |
| 管理后台 | React 19, TypeScript, Vite |
| 部署 | Docker Compose, Nginx |

## 项目结构

```
go-plus/
├── server/                 # Go 后端
│   ├── cmd/server/         # 入口
│   ├── internal/
│   │   ├── handler/        # HTTP 处理器
│   │   ├── service/        # 业务逻辑
│   │   ├── model/          # 数据模型
│   │   ├── middleware/     # JWT 认证、CORS
│   │   ├── config/         # 配置管理
│   │   ├── provider/       # OAuth、SMS、支付
│   │   └── response/       # 统一响应
│   └── config.yaml
├── frontend/               # React 前端
│   └── src/
│       ├── pages/          # 页面组件
│       ├── components/     # UI 组件
│       ├── stores/         # Zustand 状态管理
│       ├── api/            # Axios API 客户端
│       └── types/          # TypeScript 类型
├── admin/                  # 管理后台
│   └── src/
├── docs/                   # 三层文档体系
│   ├── project.md          # L1: 项目概览
│   ├── tasks.md            # L1: 需求列表
│   ├── CHANGELOG.md        # L1: 变更日志
│   └── <N>-<需求名>/       # L2-L3: 需求目录
│       ├── plan.md         # L2: 业务需求
│       ├── tasks.md        # L2: 任务列表
│       ├── log.md          # L2: 开发日志
│       ├── backend/        # L3: 后端技术文档
│       ├── frontend/       # L3: 前端技术文档
│       ├── ui/             # L3: UI 设计文档 + HTML 设计稿
│       └── qa/             # L3: QA 测试文档
├── .claude/                # HZ-Agents 配置
│   ├── agents/             # → hz-agents/agents (symlink)
│   ├── commands/           # → hz-agents/commands (symlink)
│   └── skills/             # → hz-agents/skills (symlink)
├── docker-compose.yml
├── nginx.conf
└── deploy.sh
```

## 需求规划

### 第一期 — 全部页面 + mock 数据

| # | 需求 | 说明 |
|---|------|------|
| 1 | 用户系统 | 注册/登录/OTP/Google 登录 |
| 2 | 首页导航 | 顶栏/底部 Tab/侧边菜单/首页内容流 |
| 3 | 游戏大厅 | 分类/筛选/搜索/收藏/游戏启动 |
| 4 | 钱包支付 | 充值/提现/余额/交易记录 |
| 5 | 客服系统 | 在线客服/社交媒体链接 |
| 6 | 管理后台 | 用户/游戏/交易/Banner 管理 |

### 第二期 — 真实业务接口

替换 mock 为真实后端接口，上线促销/VIP/奖池/实时投注。

### 第三期 — 裂变生态

上线推广/抽奖/任务/幸运转盘等社交裂变功能。

## 使用 HZ-Agents 开发

本项目使用 [HZ-Agents](https://github.com/LucaHhx/hz-agents) 多智能体框架进行开发。以下是完整的使用流程。

### 前置条件

- [Claude Code](https://claude.com/claude-code) CLI 已安装
- HZ-Agents 仓库已克隆到本地

### 1. 安装 HZ-Agents

在项目根目录创建 `.claude/` 并链接 HZ-Agents 资源：

```bash
mkdir -p .claude
cd .claude

# 方式一：符号链接（推荐，始终保持最新）
ln -s /path/to/hz-agents/agents ./agents
ln -s /path/to/hz-agents/commands ./commands
ln -s /path/to/hz-agents/skills ./skills

# 方式二：直接复制
cp -r /path/to/hz-agents/agents ./agents
cp -r /path/to/hz-agents/commands ./commands
cp -r /path/to/hz-agents/skills ./skills
```

启用 Agent Teams 实验性功能（`.claude/settings.local.json`）：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 2. 初始化项目文档（/doc-review）

启动 PM + Tech Lead + UI 设计师团队，从零开始创建项目文档：

```bash
/doc-review
```

**发生了什么：**
1. PM Agent 通过头脑风暴与你确认产品定位、目标用户、核心功能
2. PM Agent 创建 L1 文档（`docs/project.md`、`docs/tasks.md`）
3. PM Agent 为每个需求创建 L2 文档（`plan.md`、`tasks.md`）
4. Tech Lead Agent 创建 L3 技术文档（backend/frontend 的 `design.md`、`tasks.md`）
5. UI Agent 根据设计参考创建 UI 设计稿（`merge.html`）和设计规范（`design.md`）

**本项目的实际过程：**
- 经历 6 轮文档迭代优化（术语统一、策略重构、内容流对齐等）
- 产出 6 个需求的完整三层文档
- 每个需求包含 backend/frontend/ui/qa 四个角色的 L3 目录

### 3. 评审指定需求文档（/doc-review \<需求名\>）

对已有需求进行针对性文档评审和完善：

```bash
/doc-review 1-user-system
```

三个 Agent 并行评审业务文档和技术文档，UI 设计师同步产出设计稿，发现问题直接修复。

### 4. 启动团队开发（/dev-team）

Tech Lead 协调 5 人团队按设计文档实现需求：

```bash
# 开发指定需求
/dev-team 1-user-system

# 自动扫描待开发需求
/dev-team
```

**完整流程：**

```
Tech Lead 文档检查 ── 不通过 → 暂停，提示先完善文档
        ↓ 通过
Frontend + Backend 并行开发
        ↓
Tech Lead 代码审查 + UI 视觉审查（并行）── 不通过 → 回到开发修复（上限 3 轮）
        ↓ 通过
QA 测试（API 测试 + 浏览器 E2E 测试）
        ↓
汇总开发报告
```

**关键机制：**
- 文档检查是硬门槛 — 不通过直接停止
- 代码审查分两阶段 — 规格合规检查 + 代码质量检查
- 审查不通过会创建修复任务，循环直到通过
- QA 测试两阶段 — 先 API 接口测试，再浏览器 E2E 测试

### 5. 修复 Bug（/fix）

根据问题复杂度自动选择修复方式：

```bash
/fix 登录页手机号校验不生效
/fix 游戏大厅搜索结果与分类不一致
/fix 钱包余额显示前端与后端不一致
```

| 复杂度 | 判断条件 | 修复方式 |
|--------|----------|----------|
| 简单 | 改动 ≤3 文件、单端问题 | 主 Agent 直接修复 |
| 复杂 | 改动 >3 文件、需多端协调 | Tech Lead + 开发者团队 |

所有修复自动生成 `docs/fixes/<N>-<slug>.md` 修复记录。

### 6. QA 验收测试（/qa-test）

QA 主导的测试闭环：

```bash
/qa-test 1-user-system
```

```
QA 执行验收测试（API + 浏览器 E2E）
        ↓
    全部通过? ── YES → 输出验收报告
        ↓ NO
Bug 报告 → PM 审查 + Tech Lead 分析 → 创建修复任务
        ↓
Frontend / Backend 修复 → QA 回归测试（上限 3 轮）
```

## 完整开发工作流示例

以"用户系统"需求为例，展示从零到交付的完整流程：

```bash
# 第一步：初始化项目文档（如果尚未初始化）
/doc-review

# 第二步：评审用户系统的文档和设计稿
/doc-review 1-user-system

# 第三步：启动团队开发
/dev-team 1-user-system

# 第四步：QA 验收测试
/qa-test 1-user-system

# 第五步：修复测试中发现的 Bug
/fix 注册接口返回 500 错误

# 第六步：开发下一个需求
/dev-team 2-homepage-navigation
```

## 6 个 Agent 角色

| Agent | 职责 | 文档范围 |
|-------|------|----------|
| **PM** | 需求规划、用户场景、验收标准 | L1 + L2（project.md, plan.md） |
| **Tech Lead** | 架构设计、API 契约、代码评审 | L3 技术设计、任务分派 |
| **Frontend** | 页面组件、交互、状态管理 | L3 frontend/ 目录 |
| **Backend** | API 接口、数据库、业务逻辑 | L3 backend/ 目录 |
| **UI** | 视觉设计稿（HTML + Tailwind）、设计系统 | L3 ui/ 目录 |
| **QA** | 测试计划、API 测试、E2E 测试 | L3 qa/ 目录 |

## 本地开发

### 后端

```bash
cd server
go run cmd/server/main.go
# 默认监听 :8080
```

### 前端

```bash
cd frontend
npm install
npm run dev
# 默认监听 :5173
```

### 管理后台

```bash
cd admin
npm install
npm run dev
```

### Docker 部署

```bash
docker compose up -d --build
# 前端:     http://localhost:9000
# 管理后台: http://localhost:9000/admin/
# API:      http://localhost:9000/api/v1/
```

## 许可证

本项目仅用于 HZ-Agents 框架测试，不用于商业运营。
