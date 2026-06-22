# 海大人微信小程序 - 后端服务

## 项目概览

这是「海大人」微信小程序的后端 API 服务，使用 **Node.js + Express + TypeScript + TypeORM** 开发。

### 核心特性
- ? RESTful API 架构
- ? TypeScript 类型安全
- ? 完整的错误处理与日志
- ? JWT 身份认证
- ? MySQL 数据库集成
- ? Redis 缓存支持
- ? 微信登录集成

---

## 快速开始

### 1. 环境要求

```bash
Node.js >= 16.0
npm >= 8.0 或 yarn >= 1.22
MySQL >= 5.7 或 8.0
Redis >= 6.0（可选）
```

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 环境配置

复制 `.env.example` 为 `.env`，并填写相应配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=haidaren

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT配置
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# 微信配置
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 4. 数据库初始化

```bash
# 创建数据库（使用 MySQL 客户端）
mysql -u root -p
> CREATE DATABASE haidaren CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# 运行迁移（待实现）
npm run migrate

# 填充示例数据（待实现）
npm run seed
```

### 5. 开发模式

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

### 6. 代码检查

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint:fix

# 类型检查
npm run type-check
```

### 7. 生产构建

```bash
npm run build
npm start
```

---

## 项目结构

```
backend/
├── src/
│   ├── controllers/              # 请求处理控制器
│   │   ├── recruitment.ts        # 内推相关接口
│   │   ├── location.ts           # 城市据点接口
│   │   ├── user.ts               # 用户接口
│   │   ├── activity.ts           # 活动接口
│   │   └── auth.ts               # 认证接口
│   │
│   ├── services/                 # 业务逻辑层
│   │   ├── recruitment.ts
│   │   ├── location.ts
│   │   ├── user.ts
│   │   ├── activity.ts
│   │   ├── auth.ts
│   │   └── wechat.ts             # 微信服务
│   │
│   ├── models/                   # 数据库实体（TypeORM）
│   │   └── index.ts
│   │
│   ├── routes/                   # 路由定义
│   │   ├── recruitment.ts
│   │   ├── location.ts
│   │   ├── user.ts
│   │   ├── activity.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   │
│   ├── middlewares/              # 中间件
│   │   ├── errorHandler.ts       # 错误处理
│   │   ├── auth.ts               # 认证
│   │   └── validation.ts         # 数据验证
│   │
│   ├── utils/                    # 工具函数
│   │   ├── logger.ts             # 日志
│   │   ├── jwt.ts                # JWT 处理
│   │   ├── response.ts           # 响应格式化
│   │   ├── validation.ts         # 表单验证
│   │   ├── date.ts               # 日期处理
│   │   └── file.ts               # 文件处理
│   │
│   ├── config/                   # 配置文件
│   │   ├── index.ts              # 主配置
│   │   ├── database.ts           # 数据库配置
│   │   └── redis.ts              # Redis 配置
│   │
│   ├── types/                    # TypeScript 类型定义
│   │   └── index.ts
│   │
│   ├── scripts/                  # 脚本文件
│   │   ├── migrate.ts            # 数据库迁移
│   │   └── seed.ts               # 数据库填充
│   │
│   └── index.ts                  # 应用入口
│
├── dist/                         # 编译输出（git忽略）
├── logs/                         # 日志文件
├── .env.example                  # 环境变量示例
├── .env                          # 环境变量（git忽略）
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

---

## API 文档

### 基础信息

- **Base URL**: `http://localhost:3000/api`
- **响应格式**: JSON
- **认证方式**: JWT Token（HTTP Header: `Authorization: Bearer <token>`）

### 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {
    // 响应数据
  },
  "timestamp": "2026-06-21T12:00:00Z"
}
```

#### 错误响应

```json
{
  "code": "VALIDATION_ERROR",
  "message": "数据验证失败",
  "details": {
    "field": "邮箱格式不正确"
  },
  "timestamp": "2026-06-21T12:00:00Z"
}
```

### 核心 API 端点

#### 认证相关

```
POST   /api/users/login           # 微信登录
GET    /api/users/profile         # 获取个人信息
PUT    /api/users/profile         # 更新个人信息
POST   /api/users/logout          # 登出
```

#### 内推相关

```
GET    /api/recruitment           # 获取内推列表（分页、筛选）
POST   /api/recruitment           # 发布内推
GET    /api/recruitment/:id       # 获取内推详情
PUT    /api/recruitment/:id       # 编辑内推
DELETE /api/recruitment/:id       # 下线内推
POST   /api/recruitment/:id/apply # 投递内推
PUT    /api/recruitment/:id/apply-status  # 更新投递状态
GET    /api/recruitment/:id/comments      # 获取评论
POST   /api/recruitment/:id/comments      # 发表评论
POST   /api/recruitment/:id/like          # 点赞
```

#### 城市据点相关

```
GET    /api/locations             # 获取据点列表
GET    /api/locations/:id         # 获取据点详情
POST   /api/locations/:id/join    # 加入据点

GET    /api/activities            # 获取活动列表
POST   /api/activities            # 发起活动
GET    /api/activities/:id        # 获取活动详情
PUT    /api/activities/:id        # 编辑活动
DELETE /api/activities/:id        # 取消活动
POST   /api/activities/:id/join   # 报名活动
DELETE /api/activities/:id/join   # 取消报名
```

#### 消息相关

```
GET    /api/notifications         # 获取通知列表
PUT    /api/notifications/:id/read  # 标记已读
DELETE /api/notifications/:id     # 删除通知
```

---

## 数据库设计

### 核心实体

1. **users** - 用户表
   - id (UUID)
   - openId (微信 openId)
   - nickname (昵称)
   - city (所在城市)
   - createdAt, updatedAt

2. **recruitments** - 内推表
   - id (UUID)
   - company, position, industry, city
   - minSalary, maxSalary, degree
   - deadline, description
   - referrerId (推荐人)
   - views, applications, likes
   - createdAt, updatedAt

3. **applications** - 投递记录表
   - id (UUID)
   - recruitmentId, userId
   - status (pending/applied/interviewed/offered)
   - appliedAt, updatedAt

4. **locations** - 城市据点表
   - id (UUID)
   - city (城市名)
   - name (据点名)
   - memberCount
   - createdAt, updatedAt

5. **activities** - 活动表
   - id (UUID)
   - locationId, title, description, category
   - startTime, endTime, location
   - capacity, participantCount
   - organizerId, groupQrcode
   - createdAt, updatedAt

6. **activity_participants** - 活动参与者表
   - id (UUID)
   - activityId, userId
   - status (joined/cancelled)
   - joinedAt, cancelledAt

7. **comments** - 评论表
   - id (UUID)
   - targetType, targetId (内推/活动)
   - authorId, content
   - likes, parentId (回复)
   - createdAt, updatedAt

8. **notifications** - 通知表
   - id (UUID)
   - userId, actorId
   - type (like/comment/application/activity/system)
   - content, targetType, targetId
   - read, readAt
   - createdAt

---

## 认证流程

### 微信登录

```
1. 前端调用 wx.login() 获取 code
2. 前端发送 code 到后端: POST /api/users/login
3. 后端用 code 向微信服务器换取 openId
4. 后端创建或更新用户，返回 JWT Token
5. 前端保存 Token，后续请求都带上 Authorization Header
```

### JWT Token 使用

```typescript
// 请求头格式
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Token 内容
{
  "sub": "user-id",
  "openId": "wechat-open-id",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 开发指南

### 添加新的 API 端点

#### 1. 创建 Controller

```typescript
// src/controllers/example.ts
import { Request, Response } from 'express'
import { asyncHandler } from '@/middlewares/errorHandler'

export const getExample = asyncHandler(async (req: Request, res: Response) => {
  // 业务逻辑
  res.json({
    code: 200,
    message: '成功',
    data: {},
  })
})
```

#### 2. 创建 Service

```typescript
// src/services/example.ts
export class ExampleService {
  async getExample() {
    // 数据库操作或其他业务逻辑
  }
}
```

#### 3. 添加 Route

```typescript
// src/routes/example.ts
import { Router } from 'express'
import { getExample } from '@/controllers/example'

const router = Router()
router.get('/', getExample)
export default router
```

#### 4. 注册路由

```typescript
// src/routes/index.ts
import exampleRouter from './example'
app.use('/api/example', exampleRouter)
```

### 错误处理

所有错误都应该继承自 `ApiError`：

```typescript
import { ApiError } from '@/middlewares/errorHandler'

throw new (class extends ApiError {
  constructor() {
    super('用户不存在')
    this.statusCode = 404
    this.code = 'USER_NOT_FOUND'
  }
})()
```

### 数据验证

使用 Joi 进行数据验证：

```typescript
import Joi from 'joi'

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(30).required(),
})

const { error, value } = schema.validate(data)
if (error) {
  throw new ValidationError(error.message)
}
```

---

## 常见问题

### Q1: 如何连接 MySQL？

在 `config/database.ts` 中配置 TypeORM：

```typescript
import { DataSource } from 'typeorm'
import { UserEntity } from '@/models'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [UserEntity, /* ... */],
  synchronize: config.isDevelopment,
})
```

### Q2: 如何在微信服务器上部署？

微信小程序支持「云托管」，你可以：
1. 将代码上传到微信云托管
2. 或使用 Docker 容器化部署到腾讯云、阿里云等

参考微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/

### Q3: 如何处理并发请求？

使用 Redis 实现分布式锁：

```typescript
import redis from 'redis'

const lock = await redisClient.set(
  `lock:${key}`,
  '1',
  { EX: 10, NX: true }
)
```

---

## 性能优化

1. **数据库索引**：在 city, industry, deadline 等字段添加索引
2. **缓存策略**：使用 Redis 缓存热数据（内推列表、据点信息等）
3. **分页**：所有列表接口都实现分页，默认每页 20 条
4. **懒加载**：避免 N+1 查询，使用 JOIN 或 populate
5. **异步处理**：对耗时操作使用队列（如发送通知）

---

## 相关资源

- [Express 官方文档](https://expressjs.com/)
- [TypeORM 官方文档](https://typeorm.io/)
- [TypeScript 手册](https://www.typescriptlang.org/handbook/)
- [微信小程序服务端文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/)

---

## 下一步

- [ ] 完整的 API 实现
- [ ] 数据库迁移脚本
- [ ] 单元测试覆盖
- [ ] 性能测试与优化
- [ ] 微信登录集成
- [ ] 云端部署配置

---

**最后更新**: 2026-06-21  
**维护者**: Your Name
