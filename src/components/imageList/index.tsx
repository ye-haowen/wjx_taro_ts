import React, { useState } from 'react'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.less'
// import Taro, { Component } from '@tarojs/taro'
declare type isImage = {
  thumb?: string,
  image?: string,
  [key: string]: any
}
declare type isProps = {
  current?: number,
  isActive?: boolean,
  images: isImage[] | string[],
  comClass?: string,
  indicatorDots?: boolean,
  bigModule?: boolean,
  mode?: ("scaleToFill" | "aspectFit" | "aspectFill" | "widthFix" | "heightFix" | "top" | "bottom" | "center" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right"),
  onChange?: (e: any) => void,
  onShowBigModule?: () => void
}
export default function Index({ current = 0, images = [], comClass, mode = 'aspectFit', indicatorDots = false, bigModule = false, onChange, onShowBigModule }: isProps) {
  const [nowCurrent, setNowCurrent] = useState(current) //当前index
  return (
    <view
      className={`image_list_swiper_ctn ${comClass}`}
    >
      {/* swiper滑块区域 */}
      <Swiper
        className='image_list_swiper'
        indicatorDots={indicatorDots}
        circular
        current={nowCurrent}
        onChange={(e) => {
          setNowCurrent(e.detail.current)
          onChange && onChange(e)
        }}
      >
        {images && images.map((itemM, indexM) => {
          return (
            <SwiperItem
              className='image_list_swiper_item'
              key={indexM}
            >
              <Image
                mode={mode}
                className='image_list_swiper_item_img'
                src={itemM.thumb || itemM.image || itemM}
                onClick={(e) => {
                  if (bigModule) return //大图模式别阻止冒泡
                  e.stopPropagation()
                  // 触发大图模式事件
                  onShowBigModule && onShowBigModule()
                }}
              />
            </SwiperItem>
          )
        })}
        {(!images || images.length === 0) && <SwiperItem>
          <Image
            mode={mode}
            className='image_list_swiper_item_img'
            src={require('../../assets/image/noPic.jpg')}
            onClick={(e) => {
              if (bigModule) return
              e.stopPropagation()
              // 触发大图模式事件
              onShowBigModule && onShowBigModule()
            }}
          />
        </SwiperItem>}
      </Swiper>
    </view>
  )
}