# 海大人微信小程序 - 设计资源 & 开发技术方案

## 一、完整设计资源清单

### 1. 颜色变量定义

```css
/* 主品牌色 */
--primary: #0066CC;           /* 海洋蓝 */
--primary-light: #E8F3FF;     /* 浅蓝背景 */
--primary-dark: #0052A3;      /* 深蓝（悬停） */
--primary-disabled: #CCCCCC;  /* 禁用灰 */

/* 功能色 */
--accent: #FF6B35;            /* 活力橙（发布按钮） */
--success: #2ECC71;           /* 成功绿 */
--warning: #F39C12;           /* 警告黄 */
--error: #E74C3C;             /* 错误红 */

/* 文字色 */
--text-dark: #333333;         /* 主文本 */
--text-medium: #666666;       /* 辅助文本 */
--text-light: #999999;        /* 浅灰文本 */
--text-white: #FFFFFF;        /* 白色文本 */

/* 背景色 */
--bg-main: #FFFFFF;           /* 主背景 */
--bg-secondary: #F5F5F5;      /* 次要背景 */
--bg-tertiary: #FAFAFA;       /* 浅灰背景 */

/* 边框色 */
--border-light: #E0E0E0;      /* 浅边框 */
--border-medium: #CCCCCC;     /* 中等边框 */

/* 行业分类色 */
--industry-tech: #0066CC;     /* 技术/互联网 - 蓝 */
--industry-finance: #FFB800;  /* 金融 - 橙黄 */
--industry-ecom: #FF6B35;     /* 消费/电商 - 橙 */
--industry-estate: #95DE64;   /* 房产 - 绿 */
--industry-other: #9C9CFF;    /* 其他 - 紫 */
```

### 2. 排版系统

```css
/* 标题 */
--heading-xl: 20px / 28px / bold;   /* 主标题 */
--heading-lg: 18px / 26px / bold;   /* 次标题 */
--heading-md: 16px / 24px / bold;   /* 卡片标题 */

/* 正文 */
--body-lg: 16px / 24px / 400;       /* 大正文 */
--body-md: 14px / 22px / 400;       /* 标准正文 */
--body-sm: 12px / 18px / 400;       /* 小正文 */

/* 标签 */
--label-md: 14px / 20px / 500;      /* 标准标签 */
--label-sm: 12px / 18px / 500;      /* 小标签 */

字体族: 'Segoe UI', 'Helvetica Neue', 微软雅黑, system-ui, sans-serif
```

### 3. 间距标准（8px 基础）

```
--space-xs: 4px
--space-s: 8px
--space-m: 12px
--space-l: 16px
--space-xl: 24px
--space-xxl: 32px
--space-xxxl: 48px

页面边距：--space-l (16px) 左右
卡片边距：--space-l (16px) 左右，--space-m (12px) 上下
卡片间距：--space-m (12px)
```

### 4. 圆角系统

```
--radius-none: 0px
--radius-sm: 4px          /* 按钮、输入框 */
--radius-md: 8px          /* 小组件 */
--radius-lg: 12px         /* 卡片、弹框 */
--radius-pill: 24px       /* 胶囊形标签 */
--radius-circle: 50%      /* 圆形头像 */
```

### 5. 阴影系统

```
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08)
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12)
--shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.15)

卡片默认：--shadow-md
卡片悬停：--shadow-lg
弹框：--shadow-xl
```

---

## 二、UI 组件库清单

### 基础组件

| 组件 | 使用场景 | 状态 |
|------|---------|------|
| **按钮** | 确认、取消、提交 | Primary / Secondary / Danger / Disabled |
| **输入框** | 表单填写 | Default / Focus / Error / Disabled |
| **选择框** | 单选、多选、下拉菜单 | Unchecked / Checked / Disabled |
| **标签** | 行业、地点、分类 | 多种颜色、可移除 |
| **芯片/胶囊** | 类别过滤、状态指示 | 可选中、可删除 |
| **卡片** | 内推/活动展示 | Default / Hover / Selected |
| **列表项** | 消息、通知、记录 | Default / Unread / Selected |

### 复杂组件

| 组件 | 使用场景 |
|------|---------|
| **弹框** | 确认操作、状态更新、分享菜单 |
| **Toast** | 成功/错误/提示反馈 |
| **骨架屏** | 列表加载中 |
| **分页** | 列表加载更多 |
| **搜索框** | 搜索内推、搜索社团 |
| **日期选择器** | 选择活动时间、截止日期 |
| **时间选择器** | 选择活动时间 |
| **地点选择器** | 选择活动地点、工作城市 |
| **头像** | 用户头像、推荐人头像 |
| **徽章** | 未读消息数、在线状态 |

---

## 三、图标系统

### 系统图标 (Icon Set)

```
导航相关：
? home        - 首页
? briefcase   - 内推圈
??  map        - 城市据点
? chat        - 社区消息
? user        - 个人中心

内推相关：
? mobile      - 岗位类型
? salary      - 薪资
??  clock      - 截止时间
? users       - 人数/投递者
? pin         - 地点/城市
? company     - 公司名
? person      - 推荐人
? share       - 分享

状态相关：
? checkmark    - 已选、已完成
? checkbox     - 未选
?? heart       - 赞
? comment     - 评论
? share       - 分享
? bell        - 通知
?? settings    - 设置
? lock        - 隐私
?? delete      - 删除
?? edit        - 编辑
```

**使用工具**：
- iconfont.cn (推荐)
- Ant Design Icons
- Material Icons (Google)

---

## 四、微信小程序技术栈建议

### 4.1 开发框架选择

```
【推荐方案】
框架：Taro 3.x + TypeScript
样式：Tailwind CSS / UNO CSS (原子化)
状态管理：Redux Toolkit / Zustand
数据请求：TanStack Query (React Query)
UI 组件库：Taro UI / NutUI

【备选方案】
框架：uniapp
样式：Sass/Scss
UI 组件库：uniapp 官方组件库 / Vant Weapp
```

### 4.2 项目结构建议

```
sea-university-app/
├── src/
│   ├── pages/
│   │   ├── index/                    # 首页
│   │   │   ├── index.tsx
│   │   │   ├── index.module.scss
│   │   │   └── components/
│   │   ├── recruitment/              # 内推圈
│   │   │   ├── list/
│   │   │   ├── detail/
│   │   │   └── publish/
│   │   ├── location/                 # 城市据点
│   │   │   ├── list/
│   │   │   ├── detail/
│   │   │   ├── activity-detail/
│   │   │   └── publish-activity/
│   │   ├── message/                  # 社区消息
│   │   └── profile/                  # 个人中心
│   │       ├── index/
│   │       ├── my-recruitment/
│   │       ├── my-activity/
│   │       └── edit-profile/
│   │
│   ├── components/                   # 共享组件
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   ├── TabBar/
│   │   │   ├── Button/
│   │   │   └── Card/
│   │   ├── business/
│   │   │   ├── RecruitmentCard/
│   │   │   ├── ActivityCard/
│   │   │   └── UserAvatar/
│   │   └── forms/
│   │       ├── RecruitmentForm/
│   │       ├── ActivityForm/
│   │       └── ProfileForm/
│   │
│   ├── services/                     # API 服务层
│   │   ├── api/
│   │   │   ├── recruitment.ts
│   │   │   ├── location.ts
│   │   │   ├── user.ts
│   │   │   └── message.ts
│   │   └── http.ts                   # Axios 配置
│   │
│   ├── store/                        # 全局状态
│   │   ├── user.ts
│   │   ├── recruitment.ts
│   │   ├── location.ts
│   │   └── index.ts
│   │
│   ├── hooks/                        # 自定义 Hooks
│   │   ├── useUser.ts
│   │   ├── useRecruitment.ts
│   │   └── useLocation.ts
│   │
│   ├── utils/                        # 工具函数
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   └── storage.ts
│   │
│   ├── styles/                       # 全局样式
│   │   ├── variables.scss
│   │   ├── global.scss
│   │   └── theme.scss
│   │
│   ├── types/                        # TypeScript 类型定义
│   │   ├── recruitment.ts
│   │   ├── location.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   ├── app.tsx                       # 全局应用配置
│   └── app.scss
│
├── config/
│   ├── dev.js
│   ├── prod.js
│   └── index.js
│
├── project.config.json               # 微信小程序配置
├── taro.config.js                    # Taro 配置
├── tsconfig.json
├── package.json
└── README.md
```

### 4.3 核心 npm 依赖

```json
{
  "dependencies": {
    "@tarojs/runtime": "^3.x",
    "@tarojs/components": "^3.x",
    "@tarojs/taro": "^3.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "redux": "^4.x",
    "react-redux": "^8.x",
    "@reduxjs/toolkit": "^1.x",
    "axios": "^1.x",
    "date-fns": "^2.x",
    "classnames": "^2.x"
  },
  "devDependencies": {
    "@tarojs/cli": "^3.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "sass": "^1.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

---

## 五、API 数据结构设计

### 5.1 内推相关

```typescript
// 内推对象
interface Recruitment {
  id: string;
  company: string;
  position: string;
  industry: 'tech' | 'finance' | 'ecom' | 'estate' | 'other';
  city: string;
  workYears: 'fresh' | '1-3' | '3-5' | '5+';
  minSalary: number;        // 万元
  maxSalary: number;        // 万元
  degree: 'bachelor' | 'master' | 'phd' | 'unlimited';
  deadline: string;         // ISO 8601
  description: string;
  referrer: User;
  views: number;
  applications: number;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// 投递状态
interface ApplicationStatus {
  recruitmentId: string;
  userId: string;
  status: 'pending' | 'applied' | 'interviewed' | 'offered' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}
```

### 5.2 城市据点相关

```typescript
// 据点对象
interface Location {
  id: string;
  city: string;
  name: string;           // "北京据点"
  description: string;
  memberCount: number;
  members: User[];
  categories: LocationCategory[];
  createdAt: string;
}

// 据点分类（讨论区）
interface LocationCategory {
  id: string;
  locationId: string;
  name: string;           // "运动局"、"相亲交友"
  icon: string;
  discussions: Discussion[];
}

// 活动对象
interface Activity {
  id: string;
  locationId: string;
  title: string;
  description: string;
  category: string;       // "运动"、"聚餐" 等
  startTime: string;      // ISO 8601
  endTime: string;        // ISO 8601
  location: string;
  capacity: number;
  participants: User[];
  organizer: User;
  groupQrcode: string;    // 微信群二维码 URL
  createdAt: string;
}

// 报名记录
interface ActivityParticipant {
  activityId: string;
  userId: string;
  joinedAt: string;
  status: 'joined' | 'cancelled';
}
```

### 5.3 消息相关

```typescript
// 通知对象
interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'application' | 'activity' | 'system';
  actor: User;
  content: string;
  target: {
    type: 'recruitment' | 'activity' | 'discussion';
    id: string;
  };
  read: boolean;
  createdAt: string;
}

// 评论对象
interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}
```

### 5.4 用户相关

```typescript
// 用户对象
interface User {
  id: string;
  openId: string;         // 微信 openId
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
  wechat?: string;
  city: string;           // 所在城市
  department?: string;    // 院系
  graduationYear?: number;// 毕业年份
  bio?: string;
  joinedLocations: string[];  // 已加入的据点 IDs
  createdAt: string;
}
```

---

## 六、后端 API 端点设计

### 6.1 内推管理

```
GET    /api/recruitment              # 获取内推列表
POST   /api/recruitment              # 发布新内推
GET    /api/recruitment/:id          # 获取内推详情
PUT    /api/recruitment/:id          # 编辑内推
DELETE /api/recruitment/:id          # 下线内推
GET    /api/recruitment/:id/comments # 获取评论
POST   /api/recruitment/:id/comments # 发表评论
POST   /api/recruitment/:id/like     # 点赞
POST   /api/recruitment/:id/apply    # 投递
GET    /api/recruitment/:id/apply-status # 获取投递状态
PUT    /api/recruitment/:id/apply-status # 更新投递状态
```

### 6.2 城市据点

```
GET    /api/locations                # 获取据点列表
GET    /api/locations/:id            # 获取据点详情
GET    /api/locations/:id/members    # 获取成员列表
POST   /api/locations/:id/join       # 加入据点

GET    /api/locations/:id/categories # 获取分类
GET    /api/locations/:id/categories/:cid/discussions
POST   /api/locations/:id/categories/:cid/discussions
```

### 6.3 活动管理

```
GET    /api/activities               # 获取活动列表
POST   /api/activities               # 发起新活动
GET    /api/activities/:id           # 获取活动详情
PUT    /api/activities/:id           # 编辑活动
DELETE /api/activities/:id           # 取消活动
POST   /api/activities/:id/join      # 报名活动
DELETE /api/activities/:id/join      # 取消报名
GET    /api/activities/:id/participants # 获取参与者列表
```

### 6.4 用户管理

```
POST   /api/users/login              # 微信登录
GET    /api/users/profile            # 获取个人信息
PUT    /api/users/profile            # 更新个人信息
GET    /api/users/:id                # 获取其他用户信息
GET    /api/users/recruitment        # 我发布的内推
GET    /api/users/applications       # 我的投递记录
GET    /api/users/activities         # 我的报名活动
```

### 6.5 消息/通知

```
GET    /api/notifications            # 获取通知列表
PUT    /api/notifications/:id/read   # 标记为已读
DELETE /api/notifications/:id        # 删除通知
```

---

## 七、前端页面列表

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 热榜、推荐、最新 |
| 内推列表 | `/recruitment` | 搜索、筛选、卡片 |
| 内推详情 | `/recruitment/:id` | 详情、评论、投递 |
| 发布内推 | `/recruitment/publish` | 表单、验证、提交 |
| 城市据点 | `/location` | 据点列表、分类 |
| 据点详情 | `/location/:id` | 社群、活动 |
| 活动详情 | `/activity/:id` | 详情、报名、讨论 |
| 发起活动 | `/activity/publish` | 表单、验证、提交 |
| 社区消息 | `/message` | 通知、评论、回复 |
| 个人中心 | `/profile` | 信息、我的发布 |
| 编辑资料 | `/profile/edit` | 表单、上传头像 |

---

## 八、性能与优化建议

### 8.1 前端优化

- 列表使用虚拟滚动 (Virtual Scrolling) 处理大数据
- 图片懒加载 + WebP 格式支持
- 组件代码分割 (Code Splitting)
- 预加载常用页面
- 缓存策略：LRU cache

### 8.2 后端优化

- 数据库索引：city, industry, deadline, createdAt
- API 响应缓存 (Redis)
- 分页限制：每页 15-20 条
- CDN 加速（头像、二维码图片）

---

## 九、开发时间评估

| 模块 | 难度 | 时间 |
|------|------|------|
| 页面框架搭建 | ? | 2-3 天 |
| 内推圈功能 | ?? | 5-7 天 |
| 城市据点功能 | ??? | 7-10 天 |
| 消息/通知系统 | ?? | 3-4 天 |
| 个人中心 | ? | 2-3 天 |
| 后端 API 开发 | ??? | 10-14 天 |
| 微信登录集成 | ?? | 3-4 天 |
| 测试 & Bug 修复 | ? | 5-7 天 |
| **总计** | | **40-50 天** |

---

## 十、安全与隐私

- 所有 API 需身份认证 (JWT Token)
- 敏感数据加密传输 (HTTPS)
- 用户隐私设置：可选公开/仅内推圈/私密
- 内容审核：发布前检查敏感词
- 频率限制：防止刷屏/爬虫

---

**文档完成日期**：2026-06-21  
**下一阶段**：等待设计确认 → 技术架构 → 开发迭代
