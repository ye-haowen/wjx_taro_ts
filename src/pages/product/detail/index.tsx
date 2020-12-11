import React, { Component } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import Api from '../../../assets/js/request'
import './index.less'

export default class Index extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {}
    }
  }

  componentWillMount() {
    Api.getProductDetail({
      id: getCurrentInstance().router.params.productId
    }).then(res => {
      if (res.status !== false) {
        this.setState({
          detailInfo: {
            ...res.data,
            sku_info: res.data.sku_info.map(itemM => {
              return {
                ...itemM,
                sku_info: JSON.parse(itemM.sku_info)
              }
            })
          }
        })
      }
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <view className='pageBody pageDetailCtn'>
        <view className='detailCtn'>
          <view className='title'>产品信息</view>
          <view className='line'></view>
          <view className='row_item'>
            <view className='label'>产品名称</view>
            <view className='text strong'>{this.state.detailInfo.name}</view>
          </view>
          <view className='row_item'>
            <view className='label'>产品编号</view>
            <view className='text'>{this.state.detailInfo.product_code}</view>
          </view>
          <view className='row_item'>
            <view className='label'>产品品类</view>
            <view className='text'>{this.state.detailInfo.category_name || ''}</view>
          </view>
          {/* <view className='row_item'>
            <view className='label'>产品花型</view>
            <view className='text'></view>
          </view>
          <view className='row_item'>
            <view className='label'>成分信息</view>
            <view className='text'></view>
          </view> */}
          <view className='row_item'>
            <view className='label'>供货单位</view>
            <view className='text'></view>
          </view>
          <view className='row_item'>
            <view className='label'>品牌</view>
            <view className='text'>{this.state.detailInfo.brand_id}</view>
          </view>
          <view className='line'></view>
          <view className='row_item col'>
            <view className='label'>产品描述</view>
            <view className='text'>{this.state.detailInfo.description || '暂无描述'}</view>
          </view>
        </view>
        <view className='middleTitleCtn'>
          <view className='title'>配色信息</view>
          <view className='stock_info'>总库存：<view className='stock_num'>240</view></view>
        </view>
        {/* view.detailCtn.module */}
      </view>
    )
  }
}
