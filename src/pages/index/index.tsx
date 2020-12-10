import React, { Component, useState } from 'react'
import { Image } from '@tarojs/components'
import SearchNavBar from '../../components/searchNavBar/index'
import './index.less'

declare type isModuleInfo = Array<{
  name: string,
  icon: string,
  bgc: string,
  route?: string
}>
//  头部板块
function ModuleCom(props) {
  const moduleInfo: isModuleInfo = [
    {
      name: '产品管理',
      icon: require('../../assets/image/index/1.png'),
      bgc: '#FAA55A'
    },
    {
      name: '库存管理',
      icon: require('../../assets/image/index/2.png'),
      bgc: '#2DBFA3'
    },
    {
      name: '订单管理',
      icon: require('../../assets/image/index/3.png'),
      bgc: '#6D86E8'
    },
    {
      name: '推荐商品',
      icon: require('../../assets/image/index/4.png'),
      bgc: '#51AFF6'
    }
  ]
  return (
    <view className='moduleCtn'>
      {moduleInfo.map((item, index) =>
        <view key={index} className='module_item' style={{
          'backgroundColor': item.bgc
        }}
        >
          {/* background-image不支持本地路径和静态资源，仅支持网络资源及base64编码 */}
          {/* <view className='left_icon' style={{
            'backgroundImage': item.icon
          }}
          ></view> */}
          <Image mode='aspectFit' className='left_icon' src={item.icon} />
          <view className='text'>{item.name}</view>
        </view>
      )}
    </view>
  )
}
// 瀑布流布局
class WaterfallFlowBox extends Component<any, any, any>{
  constructor(props) {
    super(props);
    this.state = {
      left: [{}, {}, {}],
      right: [{}, {}]
    }
  }
  async componentDidMount() {
    this.getList()
    // let info = await WxApi.getImageInfo('https://zhihui.tlkrzf.com/1606270772000.jpg')
  }
  // 获取商品列表
  getList() {
    setTimeout(() => {
      console.log(111)
    }, 2000)
  }
  render() {
    return (
      <view className='waterfall_flow_box'>
        <view className='left_ctn'>
          {this.state.left.map((itemLeft, indexLeft) => <WaterfallFlowItem key={indexLeft} imageUrl={require('../../assets/image/testImage/11.jpg')} />)}
        </view>
        <view className='right_ctn'>
          {this.state.right.map((itemRight, indexRight) => <WaterfallFlowItem key={indexRight} imageUrl='https://zhihui.tlkrzf.com/1606270772000.jpg' />)}
        </view>
      </view>
    )
  }
}
function WaterfallFlowItem(props) {
  const [isLike, setIsLike] = useState(props.isLike || false)
  return (
    <view className='waterfall_flow_item' >
      <Image mode='widthFix' src={props.imageUrl} className='waterfall_flow_item__image' />
      <view className='waterfall_flow_item__title'>2020年最新款围巾文本过长换行处理2020年最新款围巾文本过长换行处理</view>
      <view className='waterfall_flow_item__info'>
        <view className='company_info'>
          <Image mode='scaleToFill' src='https://zhihui.tlkrzf.com/1606270772000.jpg' className='company_logo' />
          <view className='company_name'>桐庐凯瑞针纺有限公司桐庐凯瑞针纺有限公司</view>
        </view>
        <view className='like' onClick={() => {
          setIsLike(!isLike)
        }}
        >
          <Image mode='aspectFit' src={require(`../../assets/image/icon/like_${isLike ? 2 : 1}.png`)} className='like_icon' />
          <view className={`like_num ${isLike && 'isLike'}`}>22238</view>
        </view>
      </view>
    </view>
  )
}
export default function Index() {
  return (
    <view className='pageBody' id='index'>
      {/* 头部搜索栏 */}
      <SearchNavBar value='111' onSearch={(e) => {
        console.log(e)
      }}
      />
      {/* 中间板块栏 */}
      <ModuleCom />
      {/* 下方模块标题 */}
      <view className='store_top_title'>推荐商品</view>
      {/* 瀑布流 */}
      <WaterfallFlowBox />
    </view>
  )
}
