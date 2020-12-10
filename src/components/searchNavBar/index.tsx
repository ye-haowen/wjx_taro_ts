import React, { useState } from 'react';
import { Input } from '@tarojs/components'
import { WxApi } from '../../assets/js/wxApi'
import './index.less'

declare type isProps = {
  onSearch: (value: string) => void,
  onScan?: (data) => void,
  value?: string,
  [key: string]: any
}
function SearchNavBar({ onSearch, onScan, value, ...props }: isProps) {
  const [searchWord, setSearchWord] = useState('111')
  return (
    <view className='search_nav_bar'>
      <view className='left'>
        <view className='iconFont msg'></view>
      </view>
      <view className='middle'>
        <view className='left left_icon' onClick={() => {
          WxApi.scanCode().then(res => {
            onScan && onScan(res)
          })
        }}
        >
          <view className='iconFont scan'></view>
        </view>
        <Input className='search_input' type='text' value={searchWord} onInput={(e) => {
          setSearchWord(e.detail.value)
        }}
        />
        <view className='right_search_btn' onClick={() => {
          onSearch(searchWord)
        }}
        >搜索</view>
      </view>
      <view className='right'>
        <view className='iconFont meau'></view>
      </view>
    </view>
  )
}
export default SearchNavBar