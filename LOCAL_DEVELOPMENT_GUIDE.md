# 海大人小程序 - 本地开发完整指南

> 从零开始搭建「海大人」校友论坛微信小程序的完整本地开发环境

---

## 目录

1. [系统要求](#系统要求)
2. [环境搭建](#环境搭建)
3. [项目初始化](#项目初始化)
4. [前端开发流程](#前端开发流程)
5. [后端开发流程](#后端开发流程)
6. [本地联调](#本地联调)
7. [常见问题](#常见问题)
8. [云端部署](#云端部署)

---

## 系统要求

### 本地电脑配置

- **操作系统**：Windows / macOS / Linux
- **内存**：8GB 以上
- **磁盘空间**：10GB 以上

### 必装软件

| 软件 | 版本 | 用途 |
|------|------|------|
| **Node.js** | >= 16.0 | JavaScript 运行时 |
| **npm** | >= 8.0 | 包管理器 |
| **Git** | 最新版 | 版本控制 |
| **MySQL** | 5.7 或 8.0 | 数据库 |
| **Redis** | 6.0+ | 缓存（可选） |
| **VS Code** | 最新版 | 代码编辑器 |
| **微信开发者工具** | 最新版 | 小程序预览 |

---

## 环境搭建

### Step 1: 安装 Node.js

#### Windows
1. 访问 https://nodejs.org/ 下载 LTS 版本
2. 双击安装，按默认选项安装
3. 验证安装：
```bash
node --version   # 应显示 v16.x.x 或更高
npm --version    # 应显示 8.x.x 或更高
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install node

# 验证
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm

# 验证
node --version
npm --version
```

### Step 2: 安装 MySQL

#### Windows
1. 下载 MySQL 8.0 Community Server：https://dev.mysql.com/downloads/mysql/
2. 运行安装程序
3. 配置 MySQL Server 作为 Windows 服务
4. 验证：
```bash
mysql --version
```

#### macOS
```bash
brew install mysql

# 启动 MySQL
brew services start mysql

# 验证
mysql --version
```

#### Linux (Ubuntu)
```bash
sudo apt install mysql-server

# 启动 MySQL
sudo systemctl start mysql

# 验证
mysql --version
```

### Step 3: 安装微信开发者工具

1. 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 下载对应操作系统版本
3. 安装完成后，用微信账号登录

### Step 4: 安装 VS Code 扩展

打开 VS Code，安装以下扩展：

- **TypeScript Vue Plugin (Volar)** - Vue/TypeScript 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Tarojs-Support** - Taro 支持（可选）
- **Thunder Client** - HTTP 请求工具

---

## 项目初始化

### Step 1: 克隆或下载项目

```bash
# 假设项目位置在 f:\Project\产品\海大人

cd f:\Project\产品\海大人
```

### Step 2: 初始化前端项目

```bash
cd frontend

# 安装依赖
npm install

# 等待安装完成（首次可能需要 3-5 分钟）
```

### Step 3: 初始化后端项目

```bash
cd ../backend

# 复制环境配置
cp .env.example .env

# 编辑 .env 文件，填写数据库信息
# 使用 VS Code 打开并修改：
code .env
```

编辑 `.env` 中的数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password  # 改成你的 MySQL 密码
DB_NAME=haidaren
```

```bash
# 安装依赖
npm install
```

### Step 4: 创建数据库

```bash
# 使用 MySQL 命令行
mysql -u root -p

# 输入密码后，执行：
> CREATE DATABASE haidaren CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;
```

---

## 前端开发流程

### 启动前端开发服务

```bash
cd frontend

# 启动 Taro 编译（监听文件变化）
npm run dev:weapp
```

输出应该类似于：
```
? Build /projects/haidaren/frontend/dist completed in 5.234s.
```

### 在微信开发者工具中预览

1. 打开微信开发者工具
2. 点击「新建项目」
3. 项目路径选择：`f:\Project\产品\海大人\frontend\dist`
4. App ID：可以使用测试 ID（点击「后期绑定」）
5. 点击「确定」打开项目

### 编写页面组件

1. 在 `frontend/src/pages/` 中创建新页面
2. 编写 React 组件
3. 保存后自动编译
4. 在微信开发者工具中刷新查看更新

#### 示例：创建一个简单页面

```typescript
// frontend/src/pages/recruitment/index.tsx
import { FC } from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const RecruitmentPage: FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>职场内推圈</Text>
      {/* 页面内容 */}
    </View>
  )
}

export default RecruitmentPage
```

```scss
// frontend/src/pages/recruitment/index.module.scss
@import '@/styles/variables.scss';

.container {
  padding: $space-l;
}

.title {
  font-size: $heading-lg;
  font-weight: bold;
  color: $text-dark;
}
```

---

## 后端开发流程

### 启动后端开发服务

```bash
cd backend

# 启动开发服务（自动重启）
npm run dev
```

输出应该类似于：
```
? 服务器启动成功！监听端口 3000，环境: development
? API 地址: http://localhost:3000
? 前端地址: http://localhost:10086
? 健康检查: http://localhost:3000/health
```

### 测试 API

#### 使用 Thunder Client（VS Code 扩展）

1. 在 VS Code 侧边栏点击 Thunder Client 图标
2. 创建新请求
3. 选择 GET，输入 URL：`http://localhost:3000/health`
4. 点击「Send」
5. 应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-06-21T12:00:00.000Z",
  "uptime": 12.345
}
```

#### 使用 curl（命令行）

```bash
# 测试健康检查
curl http://localhost:3000/health

# 测试版本信息
curl http://localhost:3000/api/version
```

### 编写 API 端点

#### 1. 创建 Controller

```typescript
// backend/src/controllers/recruitment.ts
import { Request, Response } from 'express'
import { asyncHandler } from '@/middlewares/errorHandler'
import { RecruitmentService } from '@/services/recruitment'

const service = new RecruitmentService()

export const getRecruitmentList = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, pageSize = 20 } = req.query
    const data = await service.getList(Number(page), Number(pageSize))
    
    res.json({
      code: 200,
      message: '获取成功',
      data,
    })
  }
)
```

#### 2. 创建 Service

```typescript
// backend/src/services/recruitment.ts
import { RecruitmentEntity } from '@/models'
import { AppDataSource } from '@/config/database'

export class RecruitmentService {
  private repo = AppDataSource.getRepository(RecruitmentEntity)

  async getList(page: number, pageSize: number) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return {
      data,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    }
  }
}
```

#### 3. 创建 Route

```typescript
// backend/src/routes/recruitment.ts
import { Router } from 'express'
import { getRecruitmentList } from '@/controllers/recruitment'

const router = Router()

router.get('/', getRecruitmentList)

export default router
```

#### 4. 注册路由

```typescript
// backend/src/index.ts
import recruitmentRouter from '@/routes/recruitment'

app.use('/api/recruitment', recruitmentRouter)
```

---

## 本地联调

### 配置前端 API 地址

编辑 `frontend/taro.config.js`：

```javascript
defineConstants: {
  __API_BASE_URL__: JSON.stringify(
    process.env.TARO_ENV === 'weapp'
      ? 'http://localhost:3000'  // 本地开发指向本机后端
      : 'https://api.haidaren.com' // 生产环境
  ),
}
```

### 前端调用后端 API

```typescript
// frontend/src/services/request.ts
import axios from 'axios'

const API_BASE_URL = __API_BASE_URL__ || 'http://localhost:3000'

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export default request
```

```typescript
// frontend/src/services/api/recruitment.ts
import request from '../request'

export const getRecruitmentList = (page: number, pageSize: number = 20) => {
  return request.get('/api/recruitment', {
    params: { page, pageSize },
  })
}
```

### 测试联调

1. 启动后端：`npm run dev`（backend 目录）
2. 启动前端：`npm run dev:weapp`（frontend 目录）
3. 在微信开发者工具中调用 API
4. 查看是否正常返回数据

---

## 常见问题

### Q1: npm install 很慢

**解决方案**：使用国内镜像

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或者临时使用
npm install --registry https://registry.npmmirror.com
```

### Q2: MySQL 连接失败

**检查清单**：
1. MySQL 服务是否启动？
   ```bash
   # Windows
   net start MySQL80

   # macOS
   brew services start mysql

   # Linux
   sudo systemctl start mysql
   ```

2. 密码是否正确？
   ```bash
   mysql -u root -p
   # 输入设置的密码
   ```

3. 数据库是否创建？
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Q3: 微信开发者工具提示请求被拦截

**原因**：HTTP 请求被 HTTPS 限制

**解决方案**：在微信开发者工具中：
1. 点击「设置」
2. 选择「项目设置」
3. 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」
4. 重新加载

### Q4: 本地前后端如何通信？

**在微信开发者工具中访问 localhost**：

需要在 `taro.config.js` 中配置：

```javascript
// 微信小程序可以访问本机 IP（同一网络）
__API_BASE_URL__: JSON.stringify('http://your-local-ip:3000')
```

或者使用内网穿透工具（如 ngrok）：

```bash
# 安装 ngrok
npm install -g ngrok

# 启动隧道
ngrok http 3000

# 会生成公网地址，配置到前端
```

### Q5: 代码修改后没有自动重启

**前端**：Taro 自动编译，微信开发者工具中按 Ctrl+R 刷新

**后端**：使用 `tsx watch`，应该自动重启
```bash
npm run dev  # 使用 tsx watch 自动监听
```

如果还是不行，可以手动重启：
```bash
npm run dev
# Ctrl+C 停止
# npm run dev 重新启动
```

---

## 云端部署

### 微信小程序云托管

微信提供了免费的「云托管」服务，可以直接部署后端代码。

#### 步骤

1. **申请云托管**
   - 登录微信公众平台 https://mp.weixin.qq.com
   - 选择你的小程序
   - 进入「开发 → 云托管」
   - 点击「开通云托管」

2. **部署后端**
   ```bash
   # 使用微信云托管 CLI
   npm install -g @cloudbase/cli
   
   cloudbase login  # 登录
   cloudbase service:deploy  # 部署
   ```

3. **配置前端 API 地址**
   ```javascript
   // frontend/taro.config.js
   __API_BASE_URL__: JSON.stringify('https://your-service-url.com')
   ```

### 使用第三方云平台

#### 腾讯云

```bash
# 使用 Serverless Framework 部署
npm install -g serverless

serverless deploy
```

#### 阿里云

1. 创建 Docker 镜像
2. 上传到阿里云容器服务
3. 创建应用并部署

---

## 项目工作流总结

```
┌─ 本地开发
│  ├─ 启动后端服务：npm run dev (backend目录)
│  ├─ 启动前端编译：npm run dev:weapp (frontend目录)
│  ├─ 打开微信开发者工具预览
│  └─ 修改代码 → 自动编译/重启 → 微信工具刷新
│
├─ 代码检查
│  ├─ 前端：npm run lint:fix (frontend)
│  ├─ 后端：npm run lint:fix (backend)
│  └─ 类型检查：npm run type-check
│
├─ 本地测试
│  ├─ 使用微信开发者工具测试小程序
│  ├─ 使用 Thunder Client 测试 API
│  └─ 在微信工具的 Console 中查看日志
│
└─ 提交上线
   ├─ npm run build (构建生产版本)
   ├─ 微信开发者工具中上传代码
   ├─ 微信公众平台提交审核
   └─ 审核通过后发布上线
```

---

## 下一步

1. **本周**：搭建完整的前后端框架，实现核心页面
2. **下周**：开发 P0 功能（内推圈 + 城市据点）
3. **第三周**：集成微信登录，完成本地联调
4. **第四周**：测试、优化、提交审核

---

**最后更新**：2026-06-21  
**问题反馈**：如遇到问题，先查看本文档，再联系技术支持

