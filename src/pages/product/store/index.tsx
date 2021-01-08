import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { Tips, WxApi } from '../../../assets/js/wxApi'
import { $getTime } from '../../../assets/js/common'
import GlobalData from '../../../assets/js/globalData'
import Api from '../../../assets/js/request'
import './index.less'

declare type isStoreInfo = {
  stock_id: number | string,
  stock_name: string,
  number_type_1: number,
  number_type_2: number,
  [key: string]: any
}
export default function Index() {
  const [skuInfo] = useState(GlobalData.get('sku_info'))
  const [storeLogInfo, setStoreLogInfo] = useState([])
  const [storeInfo, setStoreInfo] = useState([])
  useEffect(() => {
    Tips.loading('加载中...')
    Api.getStoreDetail({
      sku_code: getCurrentInstance().router.params.skuCode
    }).then(res => {
      if (res.status !== false) {
        let storeInfoData: Array<isStoreInfo> = []
        res.data.forEach(itemData => {
          let findItem = storeInfoData.find(itemF => itemF.stock_id === itemData.stock_id)
          if (!findItem) {
            storeInfoData.push({
              stock_id: itemData.stock_id,
              stock_name: itemData.stock_name,
              number_type_1: itemData.type === 1 && itemData.number || 0,
              number_type_2: itemData.type === 2 && itemData.number || 0
            })
          } else {
            findItem[`number_type_${itemData.type}`] = Number(findItem[`number_type_${itemData.type}`] || 0) + Number(itemData.number || 0)
          }
        })
        setStoreInfo(storeInfoData)
        setStoreLogInfo(res.data)
        Tips.loaded()
      }
    })
  }, [])
  return (
    <view className='pageBody pageDetailCtn' id='productStore'>
      {/* sku信息 */}
      <view className='detailCtn innerClass'>
        <Image className='left'
          src={skuInfo && skuInfo.image_url || require('../../../assets/image/noPic.jpg')}
        ></Image>
        <view className='right'>
          <view className='info_item strong'>
            sku编码：{skuInfo && skuInfo.sku_code}
            <view className='blue copy'
              onClick={() => {
                WxApi.setClipboardData(skuInfo && skuInfo.sku_code)
              }}
            >点击复制</view>
          </view>
          {skuInfo && skuInfo.sku_info_com && skuInfo.sku_info_com.map((itemS, indexS) => {
            if (itemS[0] === '图片' || itemS[0] === '单价' || itemS[0] === 'sku编码') return
            return (
              <view className='info_item'
                key={indexS}
              >
                {itemS[0]}：{itemS[1]}
              </view>
            )
          })}
          <view className='price_store_info'>
            <view className='price'>￥{skuInfo && skuInfo.price || '?'}</view>
            <view className='store'>
              <view className='label'>库存：</view>
              {skuInfo && skuInfo.store || 0}
            </view>
          </view>
        </view>
      </view>
      {/* 库存信息 */}
      <view className='detailCtn'>
        <view className='title'>库存信息</view>
        <view className='line'></view>
        <view className='storeTableCtn'>
          <view className='table_item title'>
            <view className='table_row_item flex2'>仓库/货架名称</view>
            <view className='table_row_item'>当前数量</view>
          </view>
          {storeInfo.map((itemS, indexS) => {
            return (
              <view className='table_item'
                key={indexS}
              >
                <view className='table_row_item flex2'>{itemS.stock_name}</view>
                <view className='table_row_item'>{(itemS.number_type_1 - itemS.number_type_2)}</view>
              </view>
            )
          })}
        </view>
      </view>
      {/* 库存日志 */}
      <view className='detailCtn'>
        <view className='title'>日志信息</view>
        <view className='line'></view>
        {storeLogInfo.map((itemLog, indexLog) => {
          return (
            <view className='store_log_item'
              key={indexLog}
            >
              {`${itemLog.stock_name}，${itemLog.type === 1 ? '入库' : '出库'}，${itemLog.number}件，${$getTime(itemLog.create_time)}，${itemLog.user_name}。`}
            </view>
          )
        })}
      </view>
    </view>
  )
}
