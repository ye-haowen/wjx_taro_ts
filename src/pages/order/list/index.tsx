import React, { Component } from 'react'
import { ScrollView, Image } from '@tarojs/components'
import Api from '../../../assets/js/request'
import SearchNavBar from '../../../components/searchNavBar/index'
import { WxApi } from '../../../assets/js/wxApi'
import GlobalData from '../../../assets/js/globalData'
import './index.less'

declare type isState = {
  pages: number,
  list: Array<{}>,
  isLast: boolean,
  isGetting: boolean,
  height: number
}
export default class Index extends Component<any, isState> {
  constructor(props) {
    super(props);
    this.state = {
      pages: 0,
      list: [],
      isLast: false,
      isGetting: false,
      height: 460
    }
  }
  //  页面挂载初始化
  componentDidMount() {
    this.getOrderList(true)
  }
  // 页面准备好更新scrollView的height
  onReady() {
    this.setScrollViewHeight()
  }
  /**
   * 有时获取不到高度 所以用setTimeout去循环设置
   */
  setScrollViewHeight() {
    setTimeout(() => {
      WxApi.getElInfo('.scrollViewBox').then(res => {
        if (!(res[0] && res[0][0] && res[0][0].height)) {
          this.setScrollViewHeight()
          return
        }
        this.setState({
          height: res[0] && res[0][0] && res[0][0].height
        })
      })
    }, 1000)
  }
  /**
   * 获取产品列表数据
   * @param isReset 是否重置页数及数据
   */
  getOrderList(isReset?: boolean, limit: number = 10) {
    if (isReset) {
      console.log(isReset)
      this.setState({
        pages: 0,
        list: [],
        isLast: false
      })
    }
    if (this.state.isLast) return
    this.setState({
      isGetting: true
    })
    Api.getOrderList({
      limit: limit,
      page: this.state.pages + 1,
    }).then(res => {
      if (res.status !== false) {
        const manageData = res.data.items.map(itemM => { //此处处理下数据  如无需处理  去掉map
          return {
            ...itemM,
            sku_info: itemM.sku_info && JSON.parse(itemM.sku_info)
          }
        })
        this.setState({
          isGetting: false,
          isLast: (res.data.total / limit) < (this.state.pages + 1),//  是否为最后一页
          pages: this.state.pages + 1,
          list: [...this.state.list, ...manageData]
        })
      }
    })
  }
  render() {
    return (
      <view className='pageBody pageListCtn' id='orderList'>
        {/* 顶部搜索栏 */}
        <SearchNavBar onSearch={() => {
          this.getOrderList(true)
        }} className='searchCtn'
        />
        <view className='selectCtn'>筛选栏</view>
        {/* 下方scroll栏 */}
        <view className='scrollViewBox'>
          <ScrollView
            className='scrollViewCtn order_list_ctn'
            scrollY
            style={`height:${this.state.height}px`}
            onScrollToLower={() => { this.getOrderList() }}
          >
            {this.state.list.map((item, index) => <OrderListItem item={item} key={index} />)}
            <view className='popmpt'>
              {this.state.isLast ? '已加载全部' : this.state.isGetting ? "获取数据中" : '下拉刷新'}
            </view>
          </ScrollView>
        </view>
      </view>
    )
  }
}
function OrderListItem({ item, ...props }) {
  const isItemStatus = Math.random() > 0.5
  return (
    <view
      className='order_list_item'
      onClick={() => {
        GlobalData.set('order_detail', item)
        WxApi.navigateTo(`/pages/order/detail/index?orderId=${item.id}`)
      }}
    >
      <Image mode='aspectFit' src={item.sku_info && item.sku_info['图片'] || require(`../../../assets/image/noPic.jpg`)} className='left_image' />
      <view className='right_info'>
        <view className='top_info'>
          <view className='top_item strong'>订单编号：{item.order_code}</view>
          <view className='top_item'>产品名称：{item.product_name}</view>
          <view className='top_item'>备注信息：{item.desc}</view>
        </view>
        <view className='bottom_info'>
          <view className='order_time'>{item.create_time}</view>
          <view className={`status ${isItemStatus ? 'orange' : 'green'}`}>{isItemStatus ? '未发货' : '已发货'}</view>
        </view>
      </view>
    </view>
  )
}
