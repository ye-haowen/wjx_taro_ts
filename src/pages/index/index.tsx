import React, { Component } from 'react'
import { Image } from '@tarojs/components'
import SearchNavBar from '../../components/searchNavBar/index'
import './index.less'
import { Tips, WxApi } from '../../assets/js/wxApi'
import Api from '../../assets/js/request'

declare type isModuleInfo = Array<{
  name: string,
  icon: string,
  bgc: string,
  page?: string
}>
//  头部板块
function ModuleCom(props) {
  const moduleInfo: isModuleInfo = [
    {
      name: '产品列表',
      icon: require('../../assets/image/index/1.png'),
      bgc: '#FAA55A',
      page: '/pages/product/list/index?is_collect=0'
    },
    // {
    //   name: '库存管理',
    //   icon: require('../../assets/image/index/2.png'),
    //   bgc: '#2DBFA3'
    // },
    {
      name: '订单列表',
      icon: require('../../assets/image/index/3.png'),
      bgc: '#6D86E8',
      page: '/pages/order/list/index'
    }
    // {
    //   name: '推荐商品',
    //   icon: require('../../assets/image/index/4.png'),
    //   bgc: '#51AFF6'
    // }
  ]
  return (
    <view className='moduleCtn'>
      {moduleInfo.map((item, index) =>
        <view className='module_item'
          key={index}
          style={{
            'backgroundColor': item.bgc
          }}
          onClick={() => {
            item.page && WxApi.navigateTo(item.page) || Tips.toast({ title: '暂未开放,期待后续', mask: false })
          }}
        >
          {/* background-image不支持本地路径和静态资源，仅支持网络资源及base64编码 */}
          {/* <view className='left_icon' style={{
            'backgroundImage': item.icon
          }}
          ></view> */}
          <Image mode='aspectFit'
            className='left_icon'
            src={item.icon}
          />
          <view className='text'>{item.name}</view>
        </view>
      )}
    </view>
  )
}
// 瀑布流布局
class WaterfallFlowBox extends Component<any, any, any>{
  constructor(props) {
    super(props);
    this.state = {
      left: [],
      right: []
    }
  }
  componentDidMount() {
    this.getList()
  }
  // 获取商品列表
  async getList() {
    Api.recommendProduct().then(res => {
      if (res.status !== false) {
        this.disposeData(res.data)
      }
    })
  }

  async disposeData(data) {
    console.log(data)
    for (let item of data) {
      let info: { [key: string]: any } = await WxApi.getImageInfo(item.images[0] && item.images[0].thumb || require('../../assets/image/noPic.jpg'))
      const leftH: number = this.state.left.map(itemM => (itemM.H || 0)).reduce((total: number, current: number) => total + current, 0)
      const rightH: number = this.state.right.map(itemM => (itemM.H || 0)).reduce((total: number, current: number) => total + current, 0)
      console.log(info, leftH, rightH)
      if (leftH > rightH) {
        this.setState({
          right: [...this.state.right, { H: (info.height / info.width), ...item }]
        })
      } else {
        this.setState({
          left: [...this.state.left, { H: (info.height / info.width), ...item }]
        })
      }
      console.log('rightArr:', this.state.right)
      console.log('leftArr:', this.state.left)
    }
  }
  render() {
    return (
      <view className='waterfall_flow_box'>
        <view className='left_ctn'>
          {this.state.left.map((itemLeft, indexLeft) => <WaterfallFlowItem key={indexLeft} item={itemLeft} imageUrl={(itemLeft.images[0] && (itemLeft.images[0].thumb || itemLeft.image[0].image_url)) || require('../../assets/image/noPic.jpg')} />)}
        </view>
        <view className='right_ctn'>
          {this.state.right.map((itemRight, indexRight) => <WaterfallFlowItem key={indexRight} item={itemRight} imageUrl={(itemRight.images[0] && (itemRight.images[0].thumb || itemRight.image[0].image_url)) || require('../../assets/image/noPic.jpg')} />)}
        </view>
      </view>
    )
  }
}
function WaterfallFlowItem({ item, imageUrl, ...props }) {
  return (
    <view className='waterfall_flow_item' onClick={() => {
      console.log(item)
      WxApi.navigateTo(`/pages/product/detail/index?productId=${item.id}`)
    }}
    >
      <Image mode='widthFix'
        src={imageUrl}
        className='waterfall_flow_item__image'
      />
      <view className='waterfall_flow_item__title'>{item.name}</view>
      <view className='waterfall_flow_item__info'>
        <view className='price_info orange'>{`￥${item.min_price || '?'}~${item.max_price || '?'}元`}</view>
        <view className='iconFont store'>{item.store}</view>
      </view>
    </view>
  )
}
export default function Index() {
  return (
    <view className='pageBody' id='index'>
      {/* 头部搜索栏 */}
      <SearchNavBar />
      {/* 中间板块栏 */}
      <ModuleCom />
      {/* 下方模块标题 */}
      <view className='store_top_title'>推荐商品</view>
      {/* 瀑布流 */}
      <WaterfallFlowBox />
    </view>
  )
}
