import React, { Component, useState } from 'react';
import { Input } from '@tarojs/components'
import { WxApi } from '../../assets/js/wxApi'
import Api from '../../assets/js/request'
import './index.less'

declare type isProps = {
  onSearch?: (value: string) => void,
  onScan?: (data, rId: number) => void,
  value?: string,
  className?: string,
  [key: string]: any
}
class Notice extends Component<any, any, any>{
  constructor(props) {
    super(props);
    this.state = {
      notice: [],
      nowIndex: 0
    }
  }
  componentDidMount() {
    Api.getMessageList().then(res => {
      if (res.status === false) return
      this.setState({
        notice: res.data.items
      })
      if (this.props.show) return
      const lastId = WxApi.getStorageSync('noticeId')
      if (Number(lastId) !== Number(this.state.notice[0] && this.state.notice[0].id)) {
        this.props.setShowNotice(true)
      }
    })
  }
  render() {
    return (
      this.props.show &&
      <view className='notice'>
        <view className='title'>最新公告</view>
        {this.state.notice.map((itemN, indexN) => {
          return (
            (indexN === this.state.nowIndex) &&
            <view className='content' key={itemN.id}
              /* eslint-disable-next-line */
              dangerouslySetInnerHTML={
                {
                  __html: itemN.content
                }
              }
            ></view>
          )
        })}
        <view className='opr'>
          <view className={`opr_item ${this.state.nowIndex === 0 && 'gray'}`}
            onClick={() => {
              if (this.state.nowIndex === 0) return
              this.setState({
                nowIndex: this.state.nowIndex - 1
              })
            }}
          >上一条</view>
          <view className='opr_item'
            onClick={() => {
              WxApi.setStorageSync('noticeId', this.state.notice[this.state.nowIndex] && this.state.notice[this.state.nowIndex].id)
              this.props.setShowNotice(false)
            }}
          >关闭</view>
          <view className={`opr_item ${this.state.nowIndex === (this.state.notice.length - 1) && 'gray'}`}
            onClick={() => {
              if (this.state.nowIndex === (this.state.notice.length - 1)) return
              this.setState({
                nowIndex: this.state.nowIndex + 1
              })
            }}
          >下一条</view>
        </view>
      </view>
    )
  }
}
function SearchNavBar({ onSearch, onScan, value, className, ...props }: isProps) {
  const [searchWord, setSearchWord] = useState(value)
  const [show, setShow] = useState(false)
  const [searchData, setSearchData] = useState({ product: [], order: [] })
  const [showNotice, setShowNotice] = useState(false)
  return (
    <view className={`search_nav_bar ${className}`}
      {...props}
    >
      <view className='left'>
        <view className='iconFont msg'
          onClick={() => {
            setShowNotice(!showNotice)
          }}
        ></view>
      </view>
      <view className='middle'>
        <view className='left left_icon' onClick={() => {
          WxApi.scanCode().then((res: { [key: string]: any }) => {
            const id = res.result.match(/[1-9]\d*$/)
            onScan ? onScan(res, id[0]) : WxApi.navigateTo(`/pages/product/detail/index?productId=${id[0]}`)
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
          if (!onSearch) {
            Api.indexSearch({
              keyword: searchWord
            }).then(res => {
              if (res.status === false) return
              setShow(true)
              setSearchData(res.data)
            })
            return
          }
          onSearch(searchWord)
        }}
        >搜索</view>
      </view>
      {/* <view className='right'>
        <view className='iconFont meau'></view>
      </view> */}
      {show &&
        <view className='search_data_view'>
          <view className='close_search_data_view iconFont close' onClick={() => {
            setShow(false)
          }}
          ></view>
          <view className='search_data_view_title'>相关产品</view>
          {searchData.product.map((itemP, indexP) => {
            return (
              <view
                className='search_data_view_item'
                key={indexP}
                onClick={() => {
                  WxApi.navigateTo(`/pages/product/detail/index?productId=${itemP.id}`)
                }}
              >
                {itemP.product_code}
              </view>
            )
          })}
          {
            searchData.product.length === 0
            &&
            <view className='search_data_view_item gray'>无相关产品</view>
          }
          <view className='search_data_view_title'>相关订单</view>
          {searchData.order.map((itemP, indexP) => {
            return (
              <view
                className='search_data_view_item'
                key={indexP}
                onClick={() => {
                  WxApi.navigateTo(`/pages/order/detail/index?orderId=${itemP.id}`)
                }}
              >
                {itemP.order_code}
              </view>
            )
          })}
          {
            searchData.order.length === 0
            &&
            <view className='search_data_view_item gray'>无相关订单</view>
          }
        </view>
      }
      {/* 公告弹窗 */}
      <Notice show={showNotice} setShowNotice={setShowNotice} />
    </view>
  )
}
export default SearchNavBar