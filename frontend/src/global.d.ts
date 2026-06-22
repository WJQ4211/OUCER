/**
 * 全局类型声明
 */

// CSS Modules
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const content: string
  export default content
}

// 全局常量
declare const __API_BASE_URL__: string
