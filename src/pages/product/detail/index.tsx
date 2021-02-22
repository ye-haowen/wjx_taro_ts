import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { $toFixed } from '../../../assets/js/common'
import { Tips, WxApi } from '../../../assets/js/wxApi'
import GlobalData from '../../../assets/js/globalData'
import Api from '../../../assets/js/request'
import './index.less'

export default function Index() {
  const [detailInfo, setDetailInfo] = useState({
    name: '',
    id: '',
    product_code: '',
    category_name: '',
    brand_id: '',
    description: '',
    sku_info: []
  })
  const [isLike, setIsLike] = useState(false)
  useEffect(() => {
    Tips.loading('加载中...')
    const params = getCurrentInstance().router.params
    console.log(params)
    if (params.productId) {
      Api.getProductDetail({
        id: params.productId
      }).then(res => {
        if (res.status !== false) {
          setDetailInfo({
            ...res.data,
            sku_info: res.data.sku_info.map(itemM => {
              return {
                ...itemM,
                sku_info_com: JSON.parse(itemM.sku_info) && Object.entries(JSON.parse(itemM.sku_info))
              }
            })
          })
          setIsLike(res.data.is_collect ? true : false)
          Tips.loaded()
        }
      })
    } else if (params.skuId) {
      Api.getProductDetailForSku({
        sku_id: params.skuId
      }).then(res => {
        if (res.status === false) return
        setDetailInfo({
          ...res.data,
          sku_info: res.data.sku_info.map(itemM => {
            return {
              ...itemM,
              sku_info_com: JSON.parse(itemM.sku_info) && Object.entries(JSON.parse(itemM.sku_info))
            }
          })
        })
        setIsLike(res.data.is_collect ? true : false)
        Tips.loaded()
      })
    }
  }, [isLike])
  // 设置分享
  WxApi.showShareMenu()
  return (
    <view className='pageBody pageDetailCtn' id='productDetail'>
      <view className='detailCtn'>
        <view className='title'>产品信息</view>
        <view className='line'></view>
        <view className='row_item'>
          <view className='label'>产品名称</view>
          <view className='text strong'>{detailInfo.name}</view>
          <view className='collectBtn'>
            <view className={`iconFont collect_${isLike ? 'solid' : 'hollow'}`}
              onClick={(e) => {
                //收藏
                e.stopPropagation()
                Api.collectProduct({
                  id: detailInfo.id
                }).then(res => {
                  if (res.status !== false) {
                    Tips.toast({ title: `${!isLike && '已收藏' || '已取消收藏'}`, duration: 500 })
                    setIsLike(!isLike)
                  } else {
                    Tips.toast({ title: '收藏失败', duration: 500 })
                  }
                })
              }}
            >{isLike ? '取消' : '收藏'}</view>
          </view>
        </view>
        <view className='row_item'>
          <view className='label'>产品编号</view>
          <view className='text'>{detailInfo.product_code}</view>
        </view>
        <view className='row_item'>
          <view className='label'>产品品类</view>
          <view className='text'>{detailInfo.category_name || ''}</view>
        </view>
        <view className='row_item'>
          <view className='label'>供货单位</view>
          <view className='text'></view>
        </view>
        <view className='row_item'>
          <view className='label'>品牌</view>
          <view className='text'>{detailInfo.brand_id}</view>
        </view>
        <view className='line'></view>
        <view className='row_item col'>
          <view className='label'>产品描述</view>
          <view className='text'>{detailInfo.description || '暂无描述'}</view>
        </view>
      </view>
      <view className='middleTitleCtn'>
        <view className='title'>配色信息</view>
        <view className='store_info'>
          总库存：
          <view className='store_num'>
            {
              detailInfo.sku_info
              &&
              $toFixed(
                detailInfo.sku_info
                  .map(itemS => (+itemS.store || 0))
                  .reduce((total, current) => total + current, 0)
              )
            }
          </view>
        </view>
      </view>
      {detailInfo.sku_info && detailInfo.sku_info.map(itemM => {
        return (
          <view className='detailCtn innerClass'
            key={itemM.id}
            onClick={() => {
              GlobalData.set('sku_info', itemM)
              WxApi.navigateTo(`/pages/product/store/index?skuCode=${itemM.sku_code}`)
            }}
          >
            <Image className='left'
              src={itemM.image_url || require('../../../assets/image/noPic.jpg')}
            ></Image>
            <view className='right'>
              <view className='info_item strong'>
                sku编码：{itemM.sku_code}
                <view className='blue copy'
                  onClick={(e) => {
                    e.stopPropagation()
                    WxApi.setClipboardData(itemM.sku_code)
                  }}
                >点击复制</view>
              </view>
              {itemM.sku_info_com && itemM.sku_info_com.map((itemS, indexS) => {
                if (itemS[0] === '图片' || itemS[0] === '零售价' || itemS[0] === 'sku编码' || itemS[0] === '成本价') return
                return (
                  <view className='info_item'
                    key={indexS}
                  >
                    {itemS[0]}：{itemS[1]}
                  </view>
                )
              })}
              <view className='price_store_info'>
                <view className='price'>￥{itemM.price || '?'}</view>
                <view className='store'>
                  <view className='label'>库存：</view>
                  {itemM.store || 0}
                </view>
              </view>
            </view>
          </view>
        )
      })}
      {/* <view className='middleTitleCtn'>
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
      </view> */}
    </view>
  )
}
