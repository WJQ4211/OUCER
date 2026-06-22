# 海大人微信小程序 - 前端项目

## 项目概览

这是「海大人」微信小程序的前端项目，使用 **Taro 3.x + React + TypeScript** 开发。

### 核心特性
- ? 跨平台支持（微信小程序、H5、React Native）
- ? TypeScript 类型安全
- ? 模块化组件架构
- ? 原子化 CSS 设计系统
- ? 完整的 ESLint + Prettier 工具链

---

## 快速开始

### 1. 环境要求

```bash
Node.js >= 16.0
npm >= 8.0 或 yarn >= 1.22
```

### 2. 安装依赖

```bash
cd frontend
npm install
# 或使用 yarn
yarn install
```

### 3. 开发模式

#### 编译微信小程序（监听模式）
```bash
npm run dev:weapp
```
然后用微信开发者工具打开 `dist` 文件夹。

#### 编译 H5（本地网页版）
```bash
npm run dev:h5
```
打开 http://localhost:10086

### 4. 代码检查与格式化

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复代码格式
npm run lint:fix

# 类型检查
npm run type-check
```

### 5. 构建生产版本

```bash
# 微信小程序
npm run build:weapp:release

# H5
npm run build:h5
```

---

## 项目结构

```
frontend/
├── src/                          # 源代码目录
│   ├── pages/                    # 页面组件
│   │   ├── index/               # 首页
│   │   ├── recruitment/         # 内推圈页面
│   │   ├── location/            # 城市据点页面
│   │   ├── message/             # 社区消息页面
│   │   └── profile/             # 个人中心页面
│   │
│   ├── components/              # 通用组件
│   │   ├── common/              # 基础组件（Button, Input, Card等）
│   │   ├── business/            # 业务组件（RecruitmentCard等）
│   │   └── layout/              # 布局组件（Header, TabBar等）
│   │
│   ├── services/                # API 服务层
│   │   ├── api/                 # API 端点定义
│   │   ├── request.ts           # HTTP 请求封装
│   │   └── hooks.ts             # API 数据获取 Hooks
│   │
│   ├── store/                   # 全局状态管理（Zustand）
│   │   ├── user.ts              # 用户信息
│   │   ├── recruitment.ts       # 内推数据
│   │   ├── location.ts          # 据点数据
│   │   └── index.ts             # 状态合并
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useUser.ts           # 用户相关
│   │   ├── useRecruitment.ts    # 内推相关
│   │   └── useLocation.ts       # 据点相关
│   │
│   ├── utils/                   # 工具函数
│   │   ├── date.ts              # 日期处理
│   │   ├── format.ts            # 格式化函数
│   │   ├── validate.ts          # 表单验证
│   │   └── storage.ts           # 本地存储
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── index.ts             # 通用类型
│   │   ├── recruitment.ts       # 内推相关
│   │   ├── location.ts          # 据点相关
│   │   └── user.ts              # 用户相关
│   │
│   ├── styles/                  # 全局样式
│   │   ├── variables.scss       # 设计系统变量
│   │   ├── global.scss          # 全局样式
│   │   └── theme.scss           # 主题定制
│   │
│   ├── app.tsx                  # 应用入口
│   └── app.scss                 # 应用样式
│
├── config/                      # Taro 配置
│   ├── dev.js                   # 开发配置
│   ├── prod.js                  # 生产配置
│   └── index.js                 # 主配置
│
├── dist/                        # 编译输出目录（git忽略）
├── taro.config.js               # Taro 主配置
├── tsconfig.json                # TypeScript 配置
├── package.json                 # 项目依赖
├── .eslintrc.json               # ESLint 配置
├── .prettierrc                  # Prettier 配置
└── README.md                    # 本文件
```

---

## 技术栈说明

### 核心框架
- **Taro**: 跨平台开发框架
- **React**: UI 库
- **TypeScript**: 类型系统

### 状态管理
- **Zustand**: 轻量级状态管理（替代 Redux）

### 数据请求
- **Axios**: HTTP 客户端
- **React Query**: 数据缓存和同步

### 样式
- **Sass/SCSS**: 预处理器
- **CSS Modules**: 模块化样式

### 代码质量
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查

---

## 核心模块说明

### 1. Pages（页面）

每个页面都遵循以下结构：
```
pages/
└── pageName/
    ├── index.tsx           # 页面组件
    ├── index.module.scss   # 页面样式
    └── components/         # 页面专属组件
```

**已实现的页面：**
- [ ] `pages/index/` - 首页
- [ ] `pages/recruitment/` - 内推圈
- [ ] `pages/location/` - 城市据点
- [ ] `pages/message/` - 社区消息
- [ ] `pages/profile/` - 个人中心

### 2. Components（组件）

**基础组件** (`components/common/`)：
- Button - 按钮
- Input - 输入框
- Card - 卡片
- Tag - 标签
- Avatar - 头像

**业务组件** (`components/business/`)：
- RecruitmentCard - 内推卡片
- ActivityCard - 活动卡片
- UserInfo - 用户信息卡片

**布局组件** (`components/layout/`)：
- Header - 页面头部
- TabBar - 底部导航
- Skeleton - 骨架屏

### 3. Services（API 服务）

所有 API 调用都在 `services/` 目录中集中管理：

```typescript
// services/api/recruitment.ts
import request from '../request'

export const getRecruitmentList = async (page: number, pageSize: number) => {
  return request.get('/api/recruitment', { params: { page, pageSize } })
}

export const publishRecruitment = async (data: RecruitmentForm) => {
  return request.post('/api/recruitment', data)
}
```

### 4. Store（状态管理）

使用 Zustand 进行全局状态管理：

```typescript
// store/user.ts
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### 5. Hooks（自定义钩子）

在 Hooks 中结合状态管理和 API 调用：

```typescript
// hooks/useUser.ts
import { useUserStore } from '@/store/user'
import { getCurrentUser } from '@/services/api/user'
import { useEffect } from 'react'

export const useUser = () => {
  const { user, setUser } = useUserStore()

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return user
}
```

---

## 开发规范

### 文件命名

- **页面组件**: `index.tsx`
- **通用组件**: `ComponentName.tsx`
- **样式文件**: `*.module.scss` 或 `*.scss`
- **类型定义**: `*.ts`

### 命名规范

- 组件名：PascalCase (e.g., `RecruitmentCard`)
- 函数/变量：camelCase (e.g., `getRecruitmentList`)
- 常量：SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)

### 导入规范

```typescript
// ? 优先使用路径别名
import { Button } from '@/components/common'
import { useRecruitment } from '@/hooks'
import { COLORS } from '@/styles/variables'

// ? 避免相对路径
import Button from '../../../components/common/Button'
```

### 代码注释

```typescript
/**
 * 获取内推列表
 * @param page - 页码（从1开始）
 * @param pageSize - 每页条数
 * @returns 内推列表数据
 */
export const getRecruitmentList = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Recruitment>> => {
  return request.get('/api/recruitment', { params: { page, pageSize } })
}
```

---

## 常见问题

### Q1: 如何在小程序中使用 SVG 图标？

使用 iconfont 或 Ant Design Icons，配置 Webpack 加载器：

```typescript
// taro.config.js 中配置
webpackChain(chain) {
  chain.module
    .rule('svg')
    .test(/\.svg$/)
    .use('file-loader')
    .loader('file-loader')
}
```

### Q2: 如何处理微信登录？

在 `services/api/auth.ts` 中：

```typescript
import Taro from '@tarojs/taro'

export const wxLogin = async () => {
  const { code } = await Taro.login()
  const { data } = await request.post('/api/users/login', { code })
  // 保存 token 和用户信息
  return data
}
```

### Q3: 如何实现页面间通信？

使用 Zustand store：

```typescript
// 在 store 中定义数据
const useRecruitmentStore = create((set) => ({
  selectedRecruitment: null,
  setSelectedRecruitment: (recruitment) =>
    set({ selectedRecruitment: recruitment }),
}))

// 在页面中使用
const recruitment = useRecruitmentStore((state) =>
  state.selectedRecruitment
)
```

### Q4: 如何处理错误？

```typescript
try {
  const data = await getRecruitmentList(1, 10)
  setList(data)
} catch (error) {
  console.error('获取内推列表失败:', error)
  Taro.showToast({
    title: '加载失败，请重试',
    icon: 'error',
  })
}
```

---

## 本地开发工作流

### 开发微信小程序

1. **启动编译服务**
   ```bash
   npm run dev:weapp
   ```

2. **打开微信开发者工具**
   - 选择 `dist` 文件夹
   - 预览效果

3. **修改代码后自动编译**
   - Taro 监听文件变化自动重新编译
   - 在微信开发者工具中点击「刷新」看到更新

### 调试技巧

**在微信开发者工具中：**
- 打开 DevTools（F12）
- 查看 Console 输出
- 使用 Sources 断点调试

**在代码中：**
```typescript
console.log('调试信息', variable)
Taro.showToast({
  title: '测试提示',
  duration: 2000,
})
```

---

## 性能优化建议

1. **代码分割**: 使用 Taro 路由的代码分割
2. **图片优化**: 使用 WebP 格式，启用懒加载
3. **状态管理**: 避免不必要的重新渲染
4. **缓存策略**: 合理使用 localStorage 和 sessionStorage
5. **网络请求**: 实现请求防抖和节流

---

## 相关资源

- [Taro 官方文档](https://taro.jd.com/)
- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/handbook/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/)

---

## 下一步

- [ ] 实现基础组件库
- [ ] 搭建页面框架
- [ ] 集成后端 API
- [ ] 微信登录配置
- [ ] 本地测试和优化

---

**最后更新**: 2026-06-21  
**维护者**: Your Name
