import React, { Component } from 'react'
import { WxApi } from '../../assets/js/wxApi';
import Api from '../../assets/js/request';
import './index.less'

declare type isState = {
  userInfo: any
}
export default class Index extends Component<any, isState, any> {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        name: ''
      }
    }
  }

  componentDidMount() {
    const userInfo = WxApi.getStorageSync('zh_wjc_user_info')
    console.log(userInfo)
    this.setState({
      userInfo: userInfo
    })
  }

  render() {
    return (
      <view className='pageBody' id='user'>
        <view className='top_info'>
          <view className='left'>{this.state.userInfo.name[0]}</view>
          <view className='right'>
            <view className='name'>{this.state.userInfo.name}</view>
            <view className='user_type'>{this.state.userInfo.type === 1 ? '平台账号' : this.state.userInfo.type === 2 ? '运营商账号' : '主播账号'}</view>
          </view>
        </view>
        <view className='module_info'>
          <view className='module_item iconFont collect orange' onClick={() => {
            WxApi.navigateTo('/pages/product/list/index?is_collect=1')
          }}
          >我的收藏</view>
          <view className='module_item iconFont history orange'>浏览历史</view>
        </view>
        <view className='other_item firstItem'>
          <view className='label wx'>微信</view>
          <view className='text'>暂无</view>
        </view>
        <view className='other_item'>
          <view className='label phone'>手机号</view>
          <view className='text'>{this.state.userInfo.phone}</view>
        </view>
        <view className='logout' onClick={() => {
          Api.logout().then(res => {
            if (res.status === false) return
            WxApi.reLaunch('/pages/login/index')
          })
        }}
        >退出登陆</view>
      </view>
    )
  }
}
