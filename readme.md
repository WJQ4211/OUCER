# 海大人 | 校友职场论坛微信小程序

> 为中国海洋大学校友打造的**专业、简约、高效**的校友论坛小程序。  
> 内推、城市据点、社交于一体。

---

## ? 核心功能

### 一、校友职场内推圈（主打标准化与高效）

- **结构化发布**：标准化表单 → 清晰的"内推卡片"
  - 【行业/公司】【岗位类型】【工作城市】【内推要求/截止日期】
  
- **以技术与互联网圈为突破口**：
  - 计算机和互联网岗位最依赖内推
  - 利用校友人脉，先拉取大厂工作者发布岗位
  
- **进度追踪机制**：解决"石沉大海"问题
  - 投递状态实时更新：已投递 → 已面试 → 已获Offer

### 二、按城市划分的"据点"（主打归属感与破冰）

- **自动归属与精细化标签**
  - 注册时选择城市 → 自动加入对应据点
  - 细分讨论区：找室友、周末组局、相亲交友等
  
- **线下活动集散地**
  - 轻量级发起活动功能
  - 报名 → 加入微信群 → 真实社交

---

## ? 项目状态（? 已完成）

? **设计系统**（6份文档，50,000+ 字）
- UI设计规范、色彩系统、组件库、页面原型

? **前端项目框架**（Taro 3.x，500+ 行代码）
- 完整的项目结构、工具链配置、样式系统

? **后端项目框架**（Express + TypeORM，800+ 行代码）
- 数据库实体设计、错误处理、日志系统、路由框架

? **开发文档**（3份完整指南）
- 本地开发指南、前端手册、后端手册

---

## ? 快速开始（5分钟）

? **[详细步骤见快速启动指南](./QUICK_START.md)**

简要版本：
```bash
# 1. 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 2. 配置环境
cp .env.example .env  # 填写数据库密码

# 3. 创建数据库
mysql -u root -p -e "CREATE DATABASE haidaren CHARACTER SET utf8mb4;"

# 4. 启动服务（两个终端）
npm run dev        # 后端
npm run dev:weapp  # 前端（frontend目录）

# 5. 打开微信开发者工具预览
```

---

## ? 完整文档

| 文档 | 内容 |
|------|------|
| [QUICK_START.md](./QUICK_START.md) | ? 5分钟快速启动 |
| [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md) | 完整的本地环境搭建 |
| [UI_DESIGN.md](./UI_DESIGN.md) | 视觉设计规范 |
| [NAVIGATION_FLOW.md](./NAVIGATION_FLOW.md) | 页面流程与交互 |
| [TECH_SOLUTION.md](./TECH_SOLUTION.md) | 技术方案与API设计 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 项目总结与实现清单 |
| [README_DOCS.md](./README_DOCS.md) | 文档导航索引 |
| [frontend/README.md](./frontend/README.md) | 前端开发手册 |
| [backend/README.md](./backend/README.md) | 后端开发手册 |

---

## ?? 项目结构

```
海大人校友论坛/
├── 【文档】设计与开发指南（9份）
├── 【前端】frontend/ - Taro 3.x + React + TypeScript
│   ├── src/pages/              # 页面组件
│   ├── src/components/         # 通用组件库
│   ├── src/services/           # API服务
│   ├── src/store/              # 状态管理
│   ├── src/styles/             # 全局样式
│   └── ...配置文件
└── 【后端】backend/ - Express + TypeORM + MySQL
    ├── src/controllers/        # API处理
    ├── src/services/           # 业务逻辑
    ├── src/models/             # 数据库实体（8个表）
    ├── src/routes/             # 路由定义
    └── ...配置文件
```

---

## ? 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | Taro 3.x（跨平台） |
| 前端语言 | TypeScript + React |
| 样式方案 | Sass/SCSS + CSS Modules |
| 状态管理 | Zustand |
| 后端框架 | Express + TypeORM |
| 后端语言 | TypeScript |
| 数据库 | MySQL（8个表） |
| 认证方案 | JWT Token |

---

## ? 开发进度

| 阶段 | 状态 | 内容 |
|------|------|------|
| **第1阶段** | ? 完成 | 设计系统、项目框架搭建 |
| **第2阶段** | ? 进行中 | 基础组件开发 |
| **第3阶段** | ? 待开始 | 核心功能开发（内推 + 据点） |
| **第4阶段** | ? 待开始 | 微信登录 + 联调 |
| **第5阶段** | ? 待开始 | 测试、优化、上线 |

---

## ? 核心特性

? **结构化内推机制** - 卡片化展示，进度追踪  
? **城市据点社交** - 自动归属，活动集散  
? **专业的产品设计** - 简约高效的用户体验  
? **完整的技术方案** - 前后端分离，类型安全  

---

## ? 关键链接

- ? [快速启动](./QUICK_START.md) - 5分钟上手
- ? [本地开发指南](./LOCAL_DEVELOPMENT_GUIDE.md) - 环境配置
- ? [前端手册](./frontend/README.md) - 前端开发
- ? [后端手册](./backend/README.md) - 后端开发
- ? [UI设计](./UI_DESIGN.md) - 设计规范

---

**项目启动**：2026-06-21  
**预计上线**：2026-08-04  

**让我们一起打造最好用的海大人校友论坛小程序！** ?