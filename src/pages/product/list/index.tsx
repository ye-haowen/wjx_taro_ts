import React, { Component, useState } from 'react'
import { ScrollView, Image } from '@tarojs/components'
import Api from '../../../assets/js/request'
import SearchNavBar from '../../../components/searchNavBar/index'
import { WxApi } from '../../../assets/js/wxApi'
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
    this.getProductList(true)
  }
  // 页面准备好更新scrollView的height
  onReady() {
    WxApi.getElInfo('.scrollViewBox').then(res => {
      this.setState({
        height: res[0] && res[0][0] && res[0][0].height || 460
      })
    })
  }
  /**
   * 获取产品列表数据
   * @param isReset 是否重置页数及数据
   */
  getProductList(isReset?: boolean) {
    if (isReset) {
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
    Api.getProductList({
      limit: 6,
      pages: this.state.pages + 1,
    }).then(res => {
      if (res.status !== false) {
        const manageData = res.data.items.map(itemM => { //此处处理下数据  如无需处理  去掉map
          return {
            ...itemM,
            category_info: JSON.parse(itemM.category_info)
          }
        })
        this.setState({
          isGetting: false,
          isLast: res.data.total / 20 >= this.state.pages,//  是否为最后一页
          pages: this.state.pages + 1,
          list: [...this.state.list, ...manageData]
        })
      }
    })
  }
  render() {
    return (
      <view className='pageBody pageListCtn' id='productList'>
        {/* 顶部搜索栏 */}
        <SearchNavBar onSearch={() => { }} />
        <view className='selectCtn'>筛选栏</view>
        {/* 下方scroll栏 */}
        <view className='scrollViewBox'>
          <ScrollView
            className='product_list_ctn'
            scrollY
            style={`height:${this.state.height}px`}
            onScrollToLower={() => { this.getProductList() }}
          >
            {this.state.list.map((item, index) => <ProductListItem item={item} key={index} />)}
            <view className='popmpt'>
              {this.state.isLast ? '已加载全部' : this.state.isGetting ? "获取数据中" : '下拉刷新'}
            </view>
          </ScrollView>
        </view>
      </view>
    )
  }
}
function ProductListItem({ item, ...props }) {
  const [isLike, setIsLike] = useState(false)
  return (
    <view
      className='product_list_item'
      onClick={() => {
        WxApi.navigateTo(`/pages/product/detail/index?productId=${item.id}`)
      }}
    >
      <Image mode='aspectFit' src={item.images[0] && item.images[0].thumb || require(`../../../assets/image/noPic.jpg`)} className='left_image' />
      <view className='right_info'>
        <view className='top_info'>
          <view className='title'>{item.name}</view>
          <view className='company_info'>
            <Image mode='aspectFit' src={require(`../../../assets/image/icon/like_1.png`)} className='company_image' />
            <view className='company_name'>桐庐凯瑞针纺有限公司</view>
          </view>
        </view>
        <view className='bottom_info'>
          <view className='like' onClick={() => {
            //收藏
            setIsLike(!isLike)
          }}
          >
            <Image mode='aspectFit' src={require(`../../../assets/image/icon/like_${isLike ? 2 : 1}.png`)} className='like_icon' />
            <view className={`like_num ${isLike && 'isLike'}`}>22238</view>
          </view>
          <view className='price'>{item.min_price || item.max_price ? `￥${item.min_price || '?'}~${item.max_price || '?'}` : `￥??`}</view>
        </view>
      </view>
    </view>
  )
}
