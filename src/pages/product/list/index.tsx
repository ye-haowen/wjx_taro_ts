import React, { Component } from 'react'
import { ScrollView } from '@tarojs/components'
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
      height: 0
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
        height: res[0] && res[0][0] && res[0][0].height || 0
      })
    })
  }
  //  获取产品列表数据
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
        this.setState({
          isGetting: false,
          isLast: res.data.total / 20 >= this.state.pages,//  是否为最后一页
          pages: this.state.pages + 1,
          list: [...this.state.list, ...res.data.items]
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
            {this.state.isLast ? '已加载全部' : this.state.isGetting ? "获取数据中" : '下拉刷新'}
          </ScrollView>
        </view>
      </view>
    )
  }
}
function ProductListItem(props) {
  return (
    <view className='product_list_item'></view>
  )
}
