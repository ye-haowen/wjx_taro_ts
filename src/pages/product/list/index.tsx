import React, { Component, useState } from 'react'
import { ScrollView, Picker } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import Api from '../../../assets/js/request'
import { listContext } from '../../../assets/js/context'
import SearchNavBar from '../../../components/searchNavBar/index'
import ImageList from '../../../components/imageList/index'
import { Tips, WxApi } from '../../../assets/js/wxApi'
import { $getTime } from '../../../assets/js/common'
import './index.less'

declare type isState = {
  pages: number,
  list: Array<{}>,
  isLast: boolean,
  isGetting: boolean,
  height: number,
  showPopup: boolean,
  showCom: any,
  searchWord: string,
  userArr: Array<{}>,
  userIndex: number,
  userSelectValue: {
    [key: string]: any
  },
  clientArr: Array<{}>,
  clientIndex: number,
  clientSelectValue: {
    [key: string]: any
  }
}
export default class Index extends Component<any, isState> {
  constructor(props) {
    super(props);
    this.state = {
      pages: 0,
      list: [],
      isLast: false,
      isGetting: false,
      height: 0,
      showPopup: false,
      showCom: '',
      searchWord: '',
      userArr: [],
      userIndex: 0,
      userSelectValue: {},
      clientArr: [],
      clientIndex: 0,
      clientSelectValue: {}
    }
  }
  //  页面挂载初始化
  componentDidMount() {
    Promise.all([
      Api.getClientList(),
      Api.getUserList()
    ]).then(res => {
      this.setState({
        clientArr: [{ id: null, name: '全部' }, ...res[0].data],
        userArr: [{ id: null, name: '全部' }, ...res[1].data]
      })
    })
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
      product_code: this.state.searchWord,
      client_id: this.state.clientSelectValue.id || '',
      user_id: this.state.userSelectValue.id || '',
      is_collect: getCurrentInstance().router.params.is_collect
    }).then(res => {
      if (res.status !== false) {
        const manageData = res.data.items.map(itemM => { //此处处理下数据  如无需处理  去掉map
          return {
            ...itemM,
            category_info: JSON.parse(itemM.category_info),
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
  changeShowPopup(newVal, com = '') {
    console.log(newVal, com)
    this.setState({
      showPopup: newVal,
      showCom: com
    })
  }
  render() {
    return (
      <listContext.Provider value={{
        state: this.state.showPopup,
        showCom: this.state.showCom,
        changeState: (newVal, com = '') => {
          this.changeShowPopup(newVal, com)
        }
      }}
      >
        <view className='pageBody pageListCtn' id='productList'>
          {/* 顶部搜索栏 */}
          <SearchNavBar value={this.state.searchWord} onSearch={(value) => {
            this.setState({
              searchWord: value
            })
            this.getProductList(true)
          }}
          />
          <view className='selectCtn'>
            <Picker value={this.state.userIndex}
              className='select_item'
              mode='selector'
              onChange={(e) => {
                this.setState({
                  userIndex: Number(e.detail.value) || 0,
                  userSelectValue: this.state.userArr[e.detail.value]
                })
                this.getProductList(true)
              }}
              range={this.state.userArr}
              rangeKey='name'
            >
              <view className='picker_item'>{(this.state.userSelectValue && this.state.userSelectValue.id && this.state.userSelectValue.name) || "创建人"}</view>
            </Picker>
            <Picker value={this.state.clientIndex}
              className='select_item'
              mode='selector'
              onChange={(e) => {
                this.setState({
                  clientIndex: Number(e.detail.value) || 0,
                  clientSelectValue: this.state.clientArr[e.detail.value]
                })
                this.getProductList(true)
              }}
              range={this.state.clientArr}
              rangeKey='name'
            >
              <view className='picker_item'>{(this.state.clientSelectValue && this.state.clientSelectValue.id && this.state.clientSelectValue.name) || "供货商"}</view>
            </Picker>
          </view>
          {/* 下方scroll栏 */}
          <view className='scrollViewBox'>
            <ScrollView
              className='scrollViewCtn product_list_ctn'
              scrollY
              style={this.state.height && `height:${this.state.height}px`}
              onScrollToLower={() => { this.getProductList() }}
            >
              {this.state.list.map((item, index) => <ProductListItem item={item} key={index} />)}
              <view className='popmpt'>
                {this.state.isLast ? '已加载全部' : this.state.isGetting ? "获取数据中" : '下拉刷新'}
              </view>
            </ScrollView>
          </view>
          {/* 遮罩层 */}
          <listContext.Consumer>
            {value => {
              return value.state && <view className='curtain' onClick={() => {
                value.changeState(false)
              }}
              >
                {this.state.showCom}
              </view>
            }}
          </listContext.Consumer>
        </view>
      </listContext.Provider>
    )
  }
}
function ProductListItem({ item, ...props }) {
  const [isLike, setIsLike] = useState(item.is_collect === 1)
  let totalStore: number = item.sku_info && item.sku_info.map(itemS => Number(itemS.store) || 0).reduce((total, current) => total + current, 0)
  return (
    <view
      className='product_list_item'
      onClick={() => {
        WxApi.navigateTo(`/pages/product/detail/index?productId=${item.id}`)
      }}
    >
      <listContext.Consumer>
        {value => {
          return (
            <ImageList mode='aspectFit' images={item.images} comClass='left_image' onShowBigModule={() => {
              value.changeState(true, (<ImageList mode='aspectFit' images={item.images} bigModule indicatorDots />))
            }}
            />
          )
        }}
      </listContext.Consumer>
      <view className='right_info'>
        <view className='top_info'>
          <view className='title'>{item.name}</view>
          <view className='product_info'>
            <view className='product_code'>{item.product_code}</view>
            <view className='create_time'>{$getTime(item.create_time, '/')}</view>
          </view>
        </view>
        <view className='bottom_info'>
          <view className='iconFont store'>{totalStore}件</view>
          <view className={`iconFont collect_${isLike ? 'solid' : 'hollow'}`}
            onClick={(e) => {
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
          >{item.collect_number + (isLike ? (item.is_collect ? 0 : 1) : (item.is_collect ? -1 : 0))}</view>
          <view className='price'>{item.min_price || item.max_price ? `￥${item.min_price || '?'}~${item.max_price || '?'}` : `￥??`}</view>
        </view>
      </view>
    </view>
  )
}
