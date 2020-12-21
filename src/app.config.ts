export default {
  pages: [
    'pages/order/list/index',
    'pages/index/index',
    'pages/product/detail/index',
    'pages/product/list/index',
    'pages/order/detail/index',
    'pages/login/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#3D7FFF',
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      iconPath: './assets/image/tabbar/store_1.png',
      selectedIconPath: './assets/image/tabbar/store_2.png'
    }, {
      pagePath: "pages/order/list/index",
      text: "个人中心",
      iconPath: './assets/image/tabbar/user_1.png',
      selectedIconPath: './assets/image/tabbar/user_2.png'
    }]
  }
}
