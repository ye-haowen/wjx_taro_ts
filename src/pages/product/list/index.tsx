import React, { Component, useState } from 'react'
import { ScrollView, Image } from '@tarojs/components'
import Api from '../../../assets/js/request'
import SearchNavBar from '../../../components/searchNavBar/index'
import { Tips, WxApi } from '../../../assets/js/wxApi'
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
  getProductList(isReset?: boolean, limit: number = 10) {
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
    Api.getProductList({
      limit: limit,
      page: this.state.pages + 1,
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
          isLast: (res.data.total / limit) < (this.state.pages + 1),//  是否为最后一页
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
        <SearchNavBar onSearch={() => {
          this.getProductList(true)
        }}
        />
        <view className='selectCtn'>筛选栏</view>
        {/* 下方scroll栏 */}
        <view className='scrollViewBox'>
          <ScrollView
            className='scrollViewCtn product_list_ctn'
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
  const [isLike, setIsLike] = useState(item.is_collect === 1)
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
          <view className='like' onClick={(e) => {
            //收藏
            e.stopPropagation()
            Api.collectProduct({
              id: item.id
            }).then(res => {
              if (res.status !== false) {
                Tips.toast({ title: `${!isLike && '已收藏' || '已取消收藏'}`, duration: 500 })
                setIsLike(!isLike)
              } else {
                Tips.toast({ title: '收藏失败', duration: 500 })
              }
            })
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
