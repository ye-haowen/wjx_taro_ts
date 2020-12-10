import React, { Component } from 'react'
import { Image, Input } from '@tarojs/components'
import Api, { Request } from '../../assets/js/request'
import { WxApi } from '../../assets/js/wxApi'
import './index.less'

interface isState {
  user_account: string,
  user_password: string
}
export default class Index extends Component<any, isState> {
  constructor(prop) {
    super(prop)
    this.state = {
      user_account: '',
      user_password: ''
    }
  }
  componentDidMount() {
    const account = WxApi.getStorageSync('zh_wjc_user_account') || ''
    const password = WxApi.getStorageSync('zh_wjc_user_password') || ''
    this.setState({
      user_account: account,
      user_password: password
    })
  }
  //  登陆
  login(): void {
    if (!this.state.user_account) {
      WxApi.showModal({
        content: '请输入登陆账号'
      })
      return
    }
    if (!this.state.user_password) {
      WxApi.showModal({
        content: '请输入登陆密码'
      })
      return
    }
    // 登陆
    Api.login({
      user_name: this.state.user_account,
      password: this.state.user_password
    }).then(res => {
      if (res.data.status !== false) {
        WxApi.setStorageSync('zh_wjc_token', `${res.data.token_type} ${res.data.access_token}`)
        //  更新token
        Request.updateToken(`${res.data.token_type} ${res.data.access_token}`)
        //  记住密码账号
        WxApi.setStorageSync('zh_wjc_user_account', this.state.user_account)
        WxApi.setStorageSync('zh_wjc_user_password', this.state.user_password)
        //  获取用户信息
        Api.authInfo().then(resAuth => {
          WxApi.setStorageSync('zh_wjc_user_info', resAuth.data)
          WxApi.reLaunch('/pages/index/index')
        })
      }
    })
  }
  render() {
    return (
      <view className='pageBody' id='login'>
        <view className='out_box'>
          <view className='logo_ctn'>
            <Image mode='aspectFit' className='logo' src='https://zhihui.tlkrzf.com/1586337764000.png' />
            <view className='name'>
              <text>织为云</text>
              <text>协同织造云平台</text>
            </view>
          </view>
          <view className='input_ctn'>
            <view className='iconFont user_account'></view>
            <Input className='input' placeholder='请输入账号' value={this.state.user_account} onInput={(e) => {
              this.setState({ user_account: e.detail.value })
            }}
            />
          </view>
          <view className='input_ctn haveMarginTop'>
            <view className='iconFont user_password'></view>
            <Input className='input' password placeholder='请输入密码' value={this.state.user_password} onInput={(e) => {
              this.setState({ user_password: e.detail.value })
            }}
            />
          </view>
          <view className='login_btn' onClick={() => {
            this.login()
          }}
          >登陆</view>
          <view className='change_password_btn' onClick={() => {
            WxApi.showModal({
              content: '该功能暂未开放,请关注后续'
            })
          }}
          >修改密码</view>
          <view className='other_info'>本软件由织慧科技提供解决方案</view>
        </view>
      </view>
    )
  }
}
