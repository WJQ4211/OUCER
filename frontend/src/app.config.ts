export default {
  pages: [
    'pages/index/index',
    'pages/recruitment/index',
    'pages/location/index',
    'pages/message/index',
    'pages/profile/index',
    // Discussion sub-pages
    'pages/recruitment/detail',
    'pages/recruitment/publish',
    // Location sub-pages
    'pages/location/detail',
    'pages/location/activity-detail',
    'pages/location/publish-activity',
    // Profile sub-pages
    'pages/profile/my-recruitment',
    'pages/profile/my-activity',
    'pages/profile/edit-profile',
    // Auth
    'pages/profile/verify',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0066CC',
    navigationBarTitleText: '海大人校友论坛',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    custom: true,
    color: '#999999',
    selectedColor: '#0066CC',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/recruitment/index', text: '校友论坛' },
      { pagePath: 'pages/location/index', text: '校友据点' },
      { pagePath: 'pages/message/index', text: '消息' },
      { pagePath: 'pages/profile/index', text: '我的' },
    ],
  },
}
