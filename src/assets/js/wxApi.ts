import Taro from '@tarojs/taro'
/**
 * 整合微信原生弹窗
 * 提示、加载、工具类
 */
declare type Icon = 'none' | 'success' | 'loading'
declare type ToastOption = {
  title: string,
  icon?: Icon,
  mask?: boolean,
  duration?: number,

}
export class Tips {
  static isLoading: boolean = false
  // 提示信息
  static toast({ title, icon = 'none', mask = true, duration = 1500 }: ToastOption) {
    Taro.showToast({
      title: title,
      icon: icon,
      mask: mask,
      duration: duration
    })
  }
  // 加载中提示弹窗
  static loading(title: string = '加载中...') {
    if (this.isLoading) return
    this.isLoading = true
    if (Taro.showLoading) {
      Taro.showLoading({
        title: title,
        mask: true
      })
    } else {
      Taro.showNavigationBarLoading()
    }
  }
  // 加载完成提示弹窗
  static loaded() {
    let duration: number = 0
    if (this.isLoading) {
      this.isLoading = false
      if (Taro.hideLoading) {
        Taro.hideLoading()
      } else {
        Taro.hideNavigationBarLoading()
      }
      duration = 500
    }
    return new Promise(resolve => setTimeout(resolve, duration))
  }
}
/**
 * wx_api封装
 */
export class WxApi {
  static manageFun = (res: object, status: boolean): { _status: boolean, [key: string]: any } => {
    return {
      ...res,
      _status: status
    }
  }
  static showModal({ title = '提示', content, showCancel = false, ...option }: { title?: string, content: string, showCancel?: boolean, [key: string]: any }) {
    return new Promise(resolve => {
      Taro.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        ...option,
        success: (res) => {
          resolve(this.manageFun(res, true))
        },
        fail: (res) => {
          resolve(this.manageFun(res, false))
        }
      })
    })
  }
  static getStorageSync(key: string): any {
    return Taro.getStorageSync(key)
  }
  static setStorageSync(key: string, data: any) {
    Taro.setStorageSync(key, data)
  }
  static scanCode({ onlyFromCamera = false, scanType }: { onlyFromCamera?: boolean, scanType?} = {}) {
    return new Promise(resolve => {
      Taro.scanCode({
        onlyFromCamera,
        scanType,
        success: (res) => {
          resolve(this.manageFun(res, true))
        },
        fail: (res) => {
          resolve(this.manageFun(res, false))
        }
      })
    })
  }
  static getElInfo(el: string) {
    return new Promise(resolve => {
      Taro.createSelectorQuery().selectAll(el).boundingClientRect().exec(res => {
        resolve(res)
      })
    })
  }
  static getImageInfo(src: string) {
    return new Promise(resolve => {
      Taro.getImageInfo({
        src: src,
        success: (res) => {
          resolve(this.manageFun(res, true))
        },
        fail: (res) => {
          resolve(this.manageFun(res, false))
        }
      })
    })
  }
  static reLaunch(url: string) {
    return new Promise(resolve => {
      Taro.reLaunch({
        url: url,
        success: (res) => {
          resolve(this.manageFun(res, true))
        },
        fail: (res) => {
          resolve(this.manageFun(res, false))
        }
      })
    })
  }
  static navigateTo(url: string) {
    return new Promise(resolve => {
      Taro.navigateTo({
        url: url,
        success: (res) => {
          resolve(this.manageFun(res, true))
        },
        fail: (res) => {
          resolve(this.manageFun(res, false))
        }
      })
    })
  }
  static setClipboardData(data: string) {
    Taro.setClipboardData({
      data: data
    })
  }
  static showShareMenu(options?: any) {
    Taro.showShareMenu(options)
  }
}