import React, { Component } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { $toFixed, $formatNum } from '../../../assets/js/common'
import Api from '../../../assets/js/request'
import './index.less'
import { WxApi } from '../../../assets/js/wxApi'

export default class Index extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {}
    }
  }

  componentDidMount() {
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
                sku_info_com: JSON.parse(itemM.sku_info) && Object.entries(JSON.parse(itemM.sku_info))
              }
            })
          }
        })
        console.log(this.state.detailInfo)
      }
    })
  }

  render() {
    return (
      <view className='pageBody pageDetailCtn' id='productDetail'>
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
          <view className='stock_info'>
            总库存：
            <view className='stock_num'>
              {
                this.state.detailInfo.sku_info
                &&
                $toFixed(
                  this.state.detailInfo.sku_info
                    .map(itemS => (+itemS.store || 0))
                    .reduce((total, current) => total + current, 0)
                )
              }
            </view>
          </view>
        </view>
        {this.state.detailInfo.sku_info && this.state.detailInfo.sku_info.map(itemM => {
          return (
            <view className='detailCtn innerClass' key={itemM.id}>
              <Image className='left'
                src={itemM.image_url || require('../../../assets/image/noPic.jpg')}
              ></Image>
              <view className='right'>
                <view className='info_item strong'>
                  sku编码：{itemM.sku_code}
                  <view className='blue copy'
                    onClick={() => {
                      WxApi.setClipboardData(itemM.sku_code)
                    }}
                  >点击复制</view>
                </view>
                {itemM.sku_info_com && itemM.sku_info_com.map((itemS, indexS) => {
                  if (itemS[0] === '图片' || itemS[0] === '单价') return
                  return (
                    <view className='info_item'
                      key={indexS}
                    >
                      {itemS[0]}：{itemS[1]}
                    </view>
                  )
                })}
                <view className='price_stock_info'>
                  <view className='price'>￥{itemM.price || '?'}</view>
                  <view className='stock'>
                    <view className='label'>库存：</view>
                    {itemM.store || 0}
                  </view>
                </view>
              </view>
            </view>
          )
        })}
        <view className='middleTitleCtn'>
          <view className='title'>产品数据</view>
        </view>
        <view className='detailCtn dataCtn'>
          <view className='dataTitle'>数据看板</view>
          <view className='dataDetail'>
            {[1, 2, 3, 4, 5].map((itemM, indexM) => {
              return (
                <view className='data_item'
                  key={indexM}
                >
                  <view className='data_info'>{$formatNum(123456)}</view>
                  <view className='data_name'>总下单</view>
                </view>
              )
            })}
            <view className='data_item addCtn'></view>
          </view>
        </view>
      </view>
    )
  }
}
