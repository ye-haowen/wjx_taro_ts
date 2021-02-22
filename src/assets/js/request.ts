//  用于封装请求
import Taro from "@tarojs/taro"
import requestConfig from "./api"
import { Tips } from "./wxApi"
//  接口地址
//  线上环境 
// const MAINHOSt:string = ''
//  测试环境
// const MAINHOST: string = 'https://scarf_city_beta.zwyknit.com/'
let MAINHOST = ''
if (process.env.NODE_ENV === 'development') {
  MAINHOST = 'https://scarf-city-beta.zwyknit.com/api/'
} else if (process.env.NODE_ENV === 'production') {
  MAINHOST = 'https://scarf-city-beta.zwyknit.com/api/'
}
//  定义类型
declare type Methods = "GET" | "POST";
declare type Headers = { [key: string]: string };
declare type Datas = { method?: Methods;[key: string]: any; };
interface Options {
  url: string;
  host?: string;
  method?: Methods;
  data?: Datas;
  header?: Headers;
}

export class Request {
  // 导出的API对象
  static apiLists: { [key: string]: () => any; } = {}
  // token
  static token: string = ''
  // 设置接口超时
  static timeOut: number = 30000
  // 处理options
  static conbineOptions(opts, data: Datas, method: Methods): Options {
    typeof opts === 'string' && (opts = { url: opts })
    return {
      // 请求选项
      ...opts,
      data: data,
      method: opts.method || method || 'GET',
      url: `${opts.host || MAINHOST}${opts.url}`,
      timeout: this.timeOut,
      header: {
        Authorization: this.token
      }
    }
  }

  static updateToken(newToken?: string) {
    this.token = newToken || Taro.getStorageSync('zh_wjc_token') || ''
    return this.token
  }

  /** 
   * 基于 Taro.request 的 request 请求
   * 
   * */
  static async request(opts: Options) {
    // Taro.request 请求
    const res = await Taro.request(opts);
    // 请求成功
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 401) {
      Taro.reLaunch({ url: '/pages/login/index' })
    }
    // 请求错误
    const edata = { ...res.data, err: (res.data && res.data.msg) || '网络错误 ~' }
    Tips.toast({ title: edata.err })
  }


  /** 
   * 创建请求函数
  */
  static creatRequests(opts: Options | string): () => {} {
    return async (data = {}, method: Methods = "GET") => {
      const _opts = this.conbineOptions(opts, data, method)
      const res = await this.request(_opts)
      return res;
    }
  }

  /** 
   * 抛出API方法
  */

  static getApiList(config) {
    if (!Object.keys(config).length) {
      return {}
    }
    Object.keys(config).forEach((key) => {
      this.apiLists[key] = this.creatRequests(config[key])
    })
    return this.apiLists
  }


}
//  尝试从storage中更新token
Request.updateToken()
const Api = Request.getApiList(requestConfig)
export default Api as any