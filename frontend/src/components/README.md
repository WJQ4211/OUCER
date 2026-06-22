/**
 * 前端组件库说明文档
 * 
 * 本文件记录了前端基础组件库的使用方法和最佳实践
 */

# 海大人前端组件库

## ? 已实现的组件 (8个)

### 基础组件

#### 1. Button（按钮）
```tsx
import { Button } from '@/components'

<Button type="primary" size="md" onClick={handleClick}>
  点击我
</Button>

// 支持的属性
// - type: 'primary' | 'secondary' | 'tertiary' | 'danger'
// - size: 'sm' | 'md' | 'lg'
// - shape: 'default' | 'round' | 'circle'
// - disabled: boolean
// - loading: boolean
// - block: boolean （全宽按钮）
```

#### 2. Card（卡片）
```tsx
import { Card } from '@/components'

<Card shadow clickable onClick={handleCardClick}>
  <Text>卡片内容</Text>
</Card>

// 支持的属性
// - shadow: boolean （显示阴影）
// - divider: boolean （显示分隔线）
// - clickable: boolean （可点击态）
```

#### 3. Input（输入框）
```tsx
import { Input } from '@/components'

<Input
  label="用户名"
  placeholder="请输入用户名"
  value={username}
  onChange={setUsername}
  error={errorMsg}
  required
/>

// 支持的属性
// - type: 'text' | 'password' | 'email' | 'tel' | 'number'
// - label: string （标签）
// - error: string （错误提示）
// - required: boolean （必填标识）
// - prefix: string （前置图标）
// - suffix: string （后置图标）
// - maxLength: number
```

#### 4. Tag（标签）
```tsx
import { Tag } from '@/components'

<Tag type="primary" size="md" closable onClose={handleRemove}>
  标签文本
</Tag>

// 支持的属性
// - type: 'primary' | 'success' | 'warning' | 'error' | 'default'
// - size: 'sm' | 'md' | 'lg'
// - closable: boolean （可关闭）
```

#### 5. Avatar（头像）
```tsx
import { Avatar } from '@/components'

// 图片头像
<Avatar src="https://example.com/avatar.jpg" size="md" />

// 文字头像（自动生成背景色）
<Avatar name="张三" size="md" bordered />

// 支持的属性
// - size: 'sm' | 'md' | 'lg' | 'xl'
// - name: string （用于生成首字母和背景色）
// - bordered: boolean （显示边框）
```

#### 6. Badge（徽章）
```tsx
import { Badge } from '@/components'

// 数字徽章
<Badge content={3} type="error">
  <Text>消息</Text>
</Badge>

// 圆点徽章
<Badge dot type="error">
  <Avatar />
</Badge>

// 支持的属性
// - content: number | ReactNode
// - type: 'primary' | 'success' | 'warning' | 'error' | 'info'
// - dot: boolean （显示圆点）
// - max: number （最大显示数字，默认99）
```

### 反馈组件

#### 7. Modal（弹框）
```tsx
import { Modal } from '@/components'

<Modal
  visible={isVisible}
  title="确认删除"
  content="确定要删除这条记录吗？"
  okText="确定"
  cancelText="取消"
  confirmLoading={loading}
  onOk={handleConfirm}
  onCancel={handleCancel}
/>

// 支持的属性
// - visible: boolean （是否显示）
// - title: string
// - showCancel: boolean
// - confirmLoading: boolean
```

#### 8. Loading（加载指示器）
```tsx
import { Loading } from '@/components'

// Spinner 加载
<Loading visible type="spinner" text="加载中..." />

// Dots 加载
<Loading visible type="dots" text="处理中..." />

// 全屏加载
<Loading visible fullscreen type="spinner" />

// 支持的属性
// - type: 'spinner' | 'dots' | 'bar'
// - size: 'sm' | 'md' | 'lg'
// - fullscreen: boolean
```

---

## ? 设计系统集成

所有组件都遵循统一的设计系统 (`frontend/src/styles/variables.scss`)：

### 色彩系统
- **主色**：#0066CC（海洋蓝）
- **成功**：#2ECC71（绿色）
- **警告**：#F39C12（橙色）
- **错误**：#E74C3C（红色）

### 排版系统
- **标题**：heading-xl/lg/md (20/18/16px)
- **正文**：body-lg/md/sm (16/14/12px)

### 间距系统 (基础 8px)
- xs: 4px, s: 8px, m: 12px, l: 16px, xl: 24px

### 圆角系统
- sm: 4px, md: 8px, lg: 12px, pill: 24px, circle: 50%

### 阴影系统
- xs/sm/md/lg/xl (五个等级)

---

## ? 文件结构

```
frontend/src/components/
├── Button/
│   ├── Button.tsx               # 组件实现
│   ├── Button.module.scss       # 样式
│   └── index.ts                 # 导出
├── Card/
├── Input/
├── Tag/
├── Avatar/
├── Badge/
├── Modal/
├── Loading/
└── index.ts                     # 统一导出
```

---

## ? 最佳实践

### 1. 导入组件
```tsx
// 推荐：从统一入口导入
import { Button, Card, Input, Modal } from '@/components'

// 不推荐：从子目录导入
import Button from '@/components/Button'
```

### 2. 类型安全
所有组件都有完整的 TypeScript 类型定义：

```tsx
import { Button, type ButtonProps } from '@/components'

// 为自定义组件添加类型
interface MyComponentProps extends ButtonProps {
  customProp?: string
}
```

### 3. CSS Modules 集成
每个组件使用 CSS Modules 确保样式隔离：

```tsx
// Button.module.scss 中的类
.button { /* 按钮样式 */ }
.button-primary { /* 主色样式 */ }
.button-lg { /* 大按钮样式 */ }
```

### 4. 响应式设计
所有组件都支持微信小程序的 375px-414px 屏幕范围：

```tsx
// 自动适配，无需额外配置
<Button size="md">
  在所有屏幕尺寸上都清晰可读
</Button>
```

---

## ? 使用示例

### 完整表单示例
```tsx
import { FC, useState } from 'react'
import { Button, Card, Input, Tag, Loading } from '@/components'

const LoginForm: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 调用登录 API
      await loginAPI(username, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Input
        label="用户名"
        value={username}
        onChange={setUsername}
        error={error}
      />
      <Input
        label="密码"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <Button
        type="primary"
        block
        loading={loading}
        onClick={handleSubmit}
      >
        登录
      </Button>
    </Card>
  )
}
```

---

## ? 组件统计

| 组件 | 类型 | 文件数 | 行数 |
|------|------|--------|------|
| Button | 基础 | 3 | ~150 |
| Card | 基础 | 3 | ~80 |
| Input | 基础 | 3 | ~130 |
| Tag | 基础 | 3 | ~90 |
| Avatar | 基础 | 3 | ~100 |
| Badge | 基础 | 3 | ~80 |
| Modal | 反馈 | 3 | ~110 |
| Loading | 反馈 | 3 | ~120 |
| **总计** | - | **24** | **~860** |

---

## ? 下一步

组件库完成后，这些组件将被用于：

1. **Task 4**: 页面框架 - TabBar 导航容器
2. **Task 5-6**: 功能页面 - 内推圈、城市据点列表
3. **整个应用** - 所有表单、列表、对话框

---

## ? 注意事项

1. **样式隔离**：所有组件样式使用 CSS Modules，不会污染全局
2. **类型安全**：所有组件都有完整的 TypeScript 定义
3. **可访问性**：按钮、输入框等交互元素符合 WCAG 标准
4. **响应式**：在微信小程序 375px-414px 屏幕上测试并适配

---

**组件库创建日期**: 2026-06-21  
**下一步**: Task 4 - 前端页面框架搭建 (TabBar 导航)
