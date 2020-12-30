export default {
  login: {
    url: 'auth/login',
    method: 'POST'
  },
  logout: {
    url: 'auth/logout',
    method: 'POST'
  },
  authInfo: 'user/info',
  getProductList: 'product/lists',
  getProductDetail: 'product/detail',
  collectProduct: {
    url: 'product/collect',
    method: 'POST'
  },
  getOrderList: 'order/lists',
  getOrderDetail: 'order/detail',
  getStoreDetail: 'sku/store/logs',
  getMessageList: 'notify/lists',
  setMessageRead: {
    url: 'notify/read',
    method: 'POST'
  },
  indexSearch: 'index/search',
  recommendProduct: 'index/recommend',
  getClientList: 'edit/client/lists',
  getUserList: 'user/lists'
}