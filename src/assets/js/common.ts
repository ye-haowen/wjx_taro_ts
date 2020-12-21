/**
 * @name getTime 转换时间格式(yyy-MM-dd)
 * @param date 需要转换时间格式的数据,未传递返回当前时间
 * @param connector 连接符(默认'-')
 */
function $getTime(date?: any, connector: string = '-'): string {
  if (date && !new Date(date)) {
    return 'error'
  }
  const nowDate: string = (date ? new Date(date) : new Date()).toLocaleDateString()
  return nowDate.replace(/\//g, connector)
}
/**
 * @name getDataType 获取数据的类型
 * @param data 判断类型的数据
 */
function $getDataType(data: any): string {
  if (data === null) {
    return 'Null'
  } else if (data === undefined) {
    return 'Undefined'
  }
  return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
}
/**
 * @name clone 克隆数据
 * @param data 克隆的数据
 */
function $clone(data: any): any {
  const type: string = $getDataType(data)
  let newData: any = null
  if (type === 'Array') {
    newData = []
    data.forEach((item: any, index: any) => {
      newData[index] = $clone(item)
    })
  } else if (type === 'Object') {
    newData = {}
    for (let index in data) {
      let item = data[index]
      newData[index] = $clone(item)
    }
  } else {
    newData = data ? JSON.parse(JSON.stringify(data)) : data
  }
  return data
}
/**
 * @name toFixed 处理计算精度问题
 * @param number 需要处理的数值
 * @param precision 精度 default:2
 */
function $toFixed(number: number | string, precision: number = 2): number {
  if (isNaN(Number(number))) {
    return NaN
  }
  if (precision === 0) {
    return Math.round(Number(number))
  } else if (precision) {
    return Math.round(Number(number) * Math.pow(10, precision)) / Math.pow(10, precision)
  } else {
    return Number(number)
  }
}
/**
 * @name unique 数组去重
 * @param arr 去重的数组
 * @param key object[]类型去重时的根据-key值
 */
function $unique(arr: any[], key?: string): any[] {
  if (key) {
    let newArr: any[] = []
    arr.forEach(itemF => {
      if (!newArr.find(itemFI => itemFI[key] === itemF[key])) {
        newArr.push(itemF)
      }
    })
    return newArr
  } else {
    return [...new Set(arr)]
  }
}
/**
 * 采用闭包管理一个状态该状态触发后1s内不允许点击两次
 */
function $submitLock({ msg = '请勿频繁点击', time = 1000 }: { msg: string, time: number }): void { //editting
  console.log(msg, time)
}
/**
 * 获取唯一id防止组件间混乱
 */
function hashArrManager(): () => string {
  let arr = []
  function getId(): string {
    let hash = (Math.random()).toString(32).slice(2, 8)
    console.log(hash)
    if (!arr.includes(hash)) {
      arr.push(hash)
      return hash
    }
    return getId()
  }
  return getId
}
/**
 * 数字规范
 */
function $formatNum(num: number): string {
  if (num === null || num === undefined) {
    return 'NaN'
  }
  var str = num.toString()
  var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
const $getOnlyHashId = hashArrManager()
export {
  $getTime,
  $getDataType,
  $clone,
  $toFixed,
  $unique,
  $submitLock,
  $getOnlyHashId,
  $formatNum
}