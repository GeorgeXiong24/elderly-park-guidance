export default defineAppConfig({
  pages: [
    'pages/parks/index',
    'pages/about/index',
    'pages/park-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f5f7f4',
    navigationBarTitleText: '深圳长者公园指南',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#9a9a9a',
    selectedColor: '#2e8b57',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/parks/index',
        text: '全部公园',
        iconPath: 'assets/tabbar/parks.png',
        selectedIconPath: 'assets/tabbar/parks-selected.png'
      },
      {
        pagePath: 'pages/about/index',
        text: '关于我们',
        iconPath: 'assets/tabbar/about.png',
        selectedIconPath: 'assets/tabbar/about-selected.png'
      }
    ]
  }
})
