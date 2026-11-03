export default defineAppConfig({
  pages: [
    'pages/parks/index',
    'pages/nearby-map/index',
    'pages/about/index'
  ],
  subPackages: [
    // <photo-subpackages>
    {
      root: 'pages/d1',
      pages: ['index']
    },
    {
      root: 'pages/d2',
      pages: ['index']
    },
    {
      root: 'pages/d3',
      pages: ['index']
    },
    {
      root: 'pages/d4',
      pages: ['index']
    },
    {
      root: 'pages/d5',
      pages: ['index']
    },
    {
      root: 'pages/d6',
      pages: ['index']
    },
    {
      root: 'pages/d7',
      pages: ['index']
    },
    {
      root: 'pages/d8',
      pages: ['index']
    },
    {
      root: 'pages/d9',
      pages: ['index']
    }
    // </photo-subpackages>
  ],
  lazyCodeLoading: 'requiredComponents',
  permission: {
    'scope.userLocation': {
      desc: '用于在附近公园地图中显示您的当前位置'
    }
  },
  requiredPrivateInfos: ['getLocation'],
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
        pagePath: 'pages/nearby-map/index',
        text: '附近公园',
        iconPath: 'assets/tabbar/nearby-map.png',
        selectedIconPath: 'assets/tabbar/nearby-map-selected.png'
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
