import React, { useEffect, useState } from 'react'
// import { getCurrentInstance } from '@tarojs/taro'
import { Image } from '@tarojs/components'
// import { $toFixed, $formatNum } from '../../../assets/js/common'
// import Api from '../../../assets/js/request'
// import { WxApi } from '../../../assets/js/wxApi'
import GlobalData from '../../../assets/js/globalData'
import './index.less'

export default function Index(props) {
  const [detailInfo, setDetailInfo] = useState(GlobalData.get('order_detail'))
  useEffect(() => {
    const detail = GlobalData.get('order_detail')
    setDetailInfo({
      ...(detail || {}),
      sku_info_com: detail.sku_info && Object.entries(detail.sku_info)
    })
  }, [])
  return (
    <view className='pageBody pageDetailCtn' id='productDetail'>
      <view className='detailCtn'>
        <view className='title'>订单信息</view>
        <view className='line'></view>
        <view className='row_item'>
          <view className='label'>订单号</view>
          <view className='text strong'>{detailInfo.order_code}</view>
        </view>
        <view className='row_item'>
          <view className='label'>收件人</view>
          <view className='text'>{detailInfo.addressee}</view>
        </view>
        <view className='row_item'>
          <view className='label'>收件电话</view>
          <view className='text'>{detailInfo.addressee_phone || ''}</view>
        </view>
        <view className='row_item'>
          <view className='label'>收件地址</view>
          <view className='text'>
            {`
            ${detailInfo.province && detailInfo.province + ',' || ''}
            ${detailInfo.city && detailInfo.city + ',' || ''}
            ${detailInfo.area && detailInfo.area + ',' || ''}
            ${detailInfo.address}
            `}
          </view>
        </view>
        {/* <view className='row_item'>
          <view className='label'>产品编号</view>
          <view className='text'>{detailInfo.sku_code}</view>
        </view>
        <view className='row_item'>
          <view className='label'>产品名称</view>
          <view className='text'>{detailInfo.product_name}</view>
        </view> */}
        {/* <view className='row_item'>
          <view className='label'>尺码配色</view>
          <view className='text'>{detailInfo.desc}</view>
        </view> */}
        {/* <view className='row_item'>
          <view className='label'>订单数量</view>
          <view className='text'>{detailInfo.source}</view>
        </view> */}
        <view className='row_item'>
          <view className='label'>下单日期</view>
          <view className='text'>{detailInfo.create_time}</view>
        </view>
        {/* <view className='row_item'>
          <view className='label'>下单主播</view>
          <view className='text'>{detailInfo.presenter}</view>
        </view>
        <view className='row_item'>
          <view className='label'>播主电话</view>
          <view className='text'>{this.state.detailInfo.brand_id}</view>
        </view> */}
        <view className='line'></view>
        <view className='row_item col'>
          <view className='label'>备注信息</view>
          <view className='text'>{detailInfo.desc || '暂无描述'}</view>
        </view>
      </view>
      <view className='middleTitleCtn'>
        <view className='title'>包含产品</view>
      </view>
      {/* {this.state.detailInfo.sku_info && this.state.detailInfo.sku_info.map(itemM => {
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
      })} */}
      <view className='detailCtn innerClass'>
        <Image className='left'
          src={detailInfo.sku_info && detailInfo.sku_info['图片'] || require('../../../assets/image/noPic.jpg')}
        ></Image>
        <view className='right'>
          <view className='info_item strong'>
            {detailInfo.product_name}
          </view>
          <view className='info_item'              >
            订单数量：{detailInfo.source}
          </view>
          {detailInfo.sku_info_com && detailInfo.sku_info_com.map((itemS, indexS) => {
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
            <view className='price'>￥{detailInfo.sku_info && detailInfo.sku_info['单价'] || '?'}</view>
            {/* <view className='stock'>
              <view className='label'>库存：</view>
              {itemM.store || 0}
            </view> */}
          </view>
        </view>
      </view>
    </view>
  )
}
