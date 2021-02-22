import React, { useEffect, useState } from 'react'
import { Image } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import { WxApi } from '../../../assets/js/wxApi'
import Api from '../../../assets/js/request'
import GlobalData from '../../../assets/js/globalData'
import './index.less'

export default function Index() {
  const [detailInfo, setDetailInfo] = useState(GlobalData.get('order_detail', {}))
  useEffect(() => {
    if (Number(getCurrentInstance().router.params.orderId)) {
      console.log(1)
      Api.getOrderDetail({
        id: getCurrentInstance().router.params.orderId
      }).then(res => {
        if (res.status === false) return
        setDetailInfo(res.data)
      })
    } else {
      const detail = GlobalData.get('order_detail')
      setDetailInfo({
        ...(detail || {}),
        sku_info_com: detail.sku_info && Object.entries(detail.sku_info)
      })
    }
  }, [])
  // 设置分享
  WxApi.showShareMenu()
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
        <view className='row_item'>
          <view className='label'>下单日期</view>
          <view className='text'>{detailInfo.create_time}</view>
        </view>
        <view className='line'></view>
        <view className='row_item col'>
          <view className='label'>备注信息</view>
          <view className='text'>{detailInfo.desc || '暂无描述'}</view>
        </view>
      </view>
      <view className='middleTitleCtn'>
        <view className='title'>包含产品</view>
      </view>
      <view className='detailCtn innerClass'>
        <Image className='left'
          src={detailInfo.sku_info && detailInfo.sku_info['图片'] || require('../../../assets/image/noPic.jpg')}
        ></Image>
        <view className='right'>
          <view className='info_item strong'>
            {detailInfo.product_name}
          </view>
          <view className='info_item'>
            订单数量：{detailInfo.number}
          </view>
          {detailInfo.sku_info_com && detailInfo.sku_info_com.map((itemS, indexS) => {
            if (itemS[0] === '图片' || itemS[0] === '单价' || itemS[0] === '零售价' || itemS[0] === '成本价') return
            return (
              <view className='info_item'
                key={indexS}
              >
                {itemS[0]}：{itemS[1]}
              </view>
            )
          })}
          <view className='price_store_info'>
            <view className='price'>￥{detailInfo.sku_info && detailInfo.sku_info['零售价'] || '?'}</view>
          </view>
        </view>
      </view>
    </view>
  )
}
