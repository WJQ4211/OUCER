const path = require('path')

const config = {
  projectName: 'haidaren-miniapp',
  date: '2026-6-21',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  copy: { patterns: [], options: {} },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  cache: { enable: false },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@pages': path.resolve(__dirname, '..', 'src/pages'),
    '@services': path.resolve(__dirname, '..', 'src/services'),
    '@store': path.resolve(__dirname, '..', 'src/store'),
    '@hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
    '@types': path.resolve(__dirname, '..', 'src/types'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
  },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      url: { enable: true, config: { limit: 1024 } },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module_',
          generateScopedName: '[name]__[local]--[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: { enable: true, config: {} },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module_',
          generateScopedName: '[name]__[local]--[hash:base64:5]',
        },
      },
    },
  },
  webpackChain(chain: any) {
    chain.plugins.delete('progressPlugin')
  },
}

module.exports = config
