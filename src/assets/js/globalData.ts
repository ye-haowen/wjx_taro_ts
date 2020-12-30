let globalData = {

}
export default {
  get: (key: string, defalut?: any) => {
    return globalData[key] || defalut || null
  },
  set: (key: string, data: any) => {
    return globalData[key] = data
  }
}